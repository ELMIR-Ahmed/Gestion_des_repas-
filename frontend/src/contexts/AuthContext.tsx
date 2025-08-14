import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  nom: string;
  prenom: string;
  login: string;
  role: 'admin' | 'dieteticien' | 'cuisinier' | 'distributeur';
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { login: string; password: string }) => Promise<boolean>;
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

  // Base de données mockée des utilisateurs
  const mockUsers: User[] = [
    { id: '1', nom: 'Martin', prenom: 'Jean', login: 'admin', role: 'admin' },
    { id: '2', nom: 'Dubois', prenom: 'Marie', login: 'diet', role: 'dieteticien' },
    { id: '3', nom: 'Durand', prenom: 'Pierre', login: 'cook', role: 'cuisinier' },
    { id: '4', nom: 'Bernard', prenom: 'Sophie', login: 'dist', role: 'distributeur' },
  ];

  useEffect(() => {
    // Vérification de l'utilisateur stocké
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Vérification que l'utilisateur existe toujours dans la base mockée
        const userExists = mockUsers.some(u => u.id === parsedUser.id);
        if (userExists) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { login: string; password: string }): Promise<boolean> => {
    setLoading(true);
    // Simulation de délai de requête
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Recherche de l'utilisateur
      const foundUser = mockUsers.find(u => u.login === credentials.login);
      
      // Vérification simple du mot de passe (pour démo seulement)
      if (foundUser && credentials.password === 'password') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};