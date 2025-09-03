import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface pour les données de la personne (table séparée)
interface Personne {
  ID_PERSONNE: string;
  NOM: string;
  PRENOM: string;
  // autres champs de la table personne si nécessaire
}

// Interface User correspondant à la structure de la BDD (avec personne obligatoire)
interface User {
  ID_UTILISATEUR: string;
  ID_PERSONNE: string;
  LOGIN: string;
  PASSWORD?: string; // Optionnel côté frontend pour sécurité
  ROLE: 'admin' | 'dieteticien' | 'cuisinier' | 'distributeur';
  personne: Personne; // Obligatoire car on fait toujours la jointure
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { LOGIN: string; PASSWORD: string }) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configuration de l'API
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const checkAuthStatus = () => {
      setLoading(true);
      
      // Récupération des données stockées
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Vérification basique que l'objet utilisateur a les propriétés requises
          if (parsedUser.ID_UTILISATEUR && parsedUser.LOGIN && parsedUser.ROLE) {
            setUser(parsedUser);
          } else {
            // Données corrompues, nettoyer
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Erreur lors du parsing des données utilisateur:', error);
          // JSON invalide, nettoyer
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: { LOGIN: string; PASSWORD: string }): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Appel API réel pour la connexion
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Adaptation au format de votre API
        // Votre API retourne: { status, message, data: { user, token } }
        if (data.status === 'Request was succesful !' && data.data && data.data.user && data.data.token) {
          setUser(data.data.user);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          localStorage.setItem('token', data.data.token);
          setLoading(false);
          return true;
        } else {
          console.error('Réponse API invalide:', data);
          setLoading(false);
          return false;
        }
      } else {
        // Gérer les différents codes d'erreur
        const errorData = await response.json();
        console.error('Erreur de connexion:', response.status, errorData);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Erreur réseau ou serveur:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Nettoyage local uniquement (pas d'appel serveur)
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper pour accéder facilement aux données de la personne
export const useUserInfo = () => {
  const { user } = useAuth();
  
  return {
    fullName: user ? `${user.personne.PRENOM} ${user.personne.NOM}` : '',
    firstName: user?.personne.PRENOM || '',
    lastName: user?.personne.NOM || '',
    role: user?.ROLE || null,
    userId: user?.ID_UTILISATEUR || null,
    personId: user?.ID_PERSONNE || null,
  };
};