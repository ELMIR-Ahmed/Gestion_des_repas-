import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import DataTable from '../UI/DataTable';

interface Personne {
  ID_PERSONNE: string;
  NOM: string;
  PRENOM: string;
  DATE_NAISSANCE: string;
  GENRE: string;
  TELEPHONE: string;
  EMAIL: string;
}

interface Dieteticien {
  ID_DIETETICIEN : string;
  ID_UTILISATEUR : string;
  NUM_LICENCE : string;
}

interface Cuisinier {
  ID_CUISINIER : string;
  ID_UTILISATEUR : string;
  TYPE_CUISINE : string;
}

interface Distributeur {
  ID_DISTRIBUTEUR : string;
  ID_UTILISATEUR : string;
  NUM_BADGE : string;
}

interface User {
  ID_UTILISATEUR: string;
  ID_PERSONNE: string;
  LOGIN: string;
  ROLE: string;
  NUM_LICENCE?: string;
  personne: Personne;
  dieteticien? : Dieteticien;
  cuisinier? : Cuisinier;
  distributeur? : Distributeur;
}

interface CreateUserData {
  NOM: string;
  PRENOM: string;
  LOGIN: string;
  PASSWORD: string;
  ROLE: string;
  NUM_LICENCE?: string;
  TYPE_CUISINE?: string;
  NUM_BADGE?: string;
}

// Interface pour les données de mise à jour (champs optionnels)
interface UpdateUserData {
  NOM?: string;
  PRENOM?: string;
  LOGIN?: string;
  PASSWORD?: string;
  ROLE?: string;
  NUM_LICENCE?: string;
  TYPE_CUISINE?: string;
  NUM_BADGE?: string;
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useNotifications();
  const [showModal, setShowModal] = useState(false);
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [viewingUser, setViewingUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  
  // Données originales pour comparer les modifications
  const [originalFormData, setOriginalFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    genre: '',
    telephone: '',
    email: '',
    login: '',
    role: 'cuisinier' as string,
    password: '',
    num_licence: '',
    type_cuisine: '',
    num_badge: '',
    });

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    genre: '',
    telephone: '',
    email: '',
    login: '',
    role: 'cuisinier' as string,
    password: '',
    num_licence: '',
    type_cuisine: '',
    num_badge: '',
  });

  // API Configuration
  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getAuthToken = () => {
    // Récupérer le token d'authentification depuis le localStorage ou context
    return localStorage.getItem('auth_token');
  };

  const apiHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  };

  // Fonction pour comparer les données et ne retourner que les champs modifiés
  const getModifiedFields = (): UpdateUserData => {
    const modifiedFields: UpdateUserData = {};
    
    if (formData.nom !== originalFormData.nom) {
      modifiedFields.NOM = formData.nom;
    }
    if (formData.prenom !== originalFormData.prenom) {
      modifiedFields.PRENOM = formData.prenom;
    }
    if (formData.login !== originalFormData.login) {
      modifiedFields.LOGIN = formData.login;
    }
    if (formData.role !== originalFormData.role) {
      modifiedFields.ROLE = formData.role;
    }
    if (formData.password && formData.password !== '') {
      modifiedFields.PASSWORD = formData.password;
    }
    if (formData.num_licence !== originalFormData.num_licence) {
      modifiedFields.NUM_LICENCE = formData.num_licence || undefined;
    }
    if (formData.type_cuisine !== originalFormData.type_cuisine) {
      modifiedFields.TYPE_CUISINE = formData.type_cuisine || undefined;
    }
    if (formData.num_badge !== originalFormData.num_badge) {
      modifiedFields.NUM_BADGE = formData.num_badge || undefined;
    }
    
    return modifiedFields;
  };

  const filteredUsers = users.filter(user =>
    user.personne.NOM.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.personne.PRENOM.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.ROLE.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/utilisateurs`, {
        headers: apiHeaders,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      // console.log(response.json())

      const data = await response.json();
      const userString = localStorage.getItem('user');
      const userConnected = userString ? JSON.parse(userString) : null;
      const dataa = data.data.filter((user: User) => user.ID_UTILISATEUR !== userConnected.ID_UTILISATEUR);
      setUsers(dataa);
    } catch (error) {
      console.error('Error fetching users:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de récupérer les utilisateurs.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create user via API
  const createUser = async (userData: CreateUserData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/utilisateurs`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(userData),
      });


      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      const newUser = await response.json();
      setUsers(prev => [...prev, newUser]);

      await fetchUsers();
      
      addNotification({
        type: 'success',
        title: 'Utilisateur créé',
        message: 'Le nouvel utilisateur a été créé avec succès.',
      });

      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de créer l\'utilisateur.',
      });
      return false;
    }
  };

  // Update user via API - modifié pour n'envoyer que les champs modifiés
  const updateUser = async (userId: string, userData: UpdateUserData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/utilisateurs/${userId}`, {
        method: 'PUT',
        headers: apiHeaders,
        body: JSON.stringify(userData),
      });

      console.log('User updated:', userData);

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de l\'utilisateur');
      }

      const updatedUser = await response.json();
      setUsers(prev => prev.map(user => 
        user.ID_UTILISATEUR.toString() === userId.toString() ? updatedUser : user
      ));

      addNotification({
        type: 'success',
        title: 'Utilisateur modifié',
        message: 'Les modifications ont été enregistrées avec succès.',
      });

      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de modifier l\'utilisateur.',
      });
      return false;
    }
  };

  // Delete user via API
  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/utilisateurs/${userId}`, {
        method: 'DELETE',
        headers: apiHeaders,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'utilisateur');
      }

      setUsers(prev => prev.filter(user => user.ID_UTILISATEUR !== userId));
      
      addNotification({
        type: 'success',
        title: 'Utilisateur supprimé',
        message: 'L\'utilisateur a été supprimé avec succès.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de supprimer l\'utilisateur.',
      });
      return false;
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { 
      key: 'nom', 
      label: 'Nom', 
      sortable: true,
      render: (user: User) => <span className="font-medium text-gray-900">{user.personne.NOM.toUpperCase()}</span>
    },
    { 
      key: 'prenom', 
      label: 'Prénom', 
      sortable: true,
      render: (user: User) => <span className="font-medium text-gray-900">{user.personne.PRENOM.replace(/^./, function(char) {return char.toUpperCase()})}</span>
    },
    { 
      key: 'date_naissance', 
      label: 'Date de Naissance', 
      sortable: true,
      render: (user: User) => <span className="text-sm text-gray-900">{user.personne.DATE_NAISSANCE || '--------------'}</span>
    },
    { 
      key: 'genre', 
      label: 'Genre', 
      sortable: true,
      render: (user: User) => <span className="text-sm text-gray-900">{user.personne.GENRE || '--------------'}</span>
    },
    { 
      key: 'telephone', 
      label: 'Téléphone', 
      sortable: true,
      render: (user: User) => <span className="text-sm text-gray-900">{user.personne.TELEPHONE || '--------------'}</span>
    },
    { 
      key: 'email', 
      label: 'Email', 
      sortable: true,
      render: (user: User) => <span className="text-sm text-gray-900">{user.personne.EMAIL || '--------------'}</span>
    },
    { 
      key: 'login', 
      label: 'Login', 
      sortable: true,
      render: (user: User) => <span className="text-sm text-gray-900">{user.LOGIN}</span>
    },
    {
      key: 'role',
      label: 'Rôle',
      sortable: true,
      render: (user: User) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          user.ROLE === 'admin' ? 'bg-red-100 text-red-800' :
          user.ROLE === 'dieteticien' ? 'bg-green-100 text-green-800' :
          user.ROLE === 'cuisinier' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {user.ROLE}
        </span>
      ),
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;

    if (editingUser) {
      // Mode modification - ne récupérer que les champs modifiés
      const modifiedFields = getModifiedFields();

      console.log(modifiedFields);
      
      // Vérifier s'il y a des modifications
      if (Object.keys(modifiedFields).length === 0) {
        addNotification({
          type: 'info',
          title: 'Aucune modification',
          message: 'Aucun champ n\'a été modifié.',
        });
        setShowModal(false);
        setEditingUser(null);
        resetFormData();
        return;
      }
      
      success = await updateUser(editingUser.ID_UTILISATEUR, modifiedFields);
    } else {
      // Mode création - utiliser tous les champs requis
      const userData: CreateUserData = {
        NOM: formData.nom,
        PRENOM: formData.prenom,
        LOGIN: formData.login,
        PASSWORD: formData.password,
        ROLE: formData.role,
        NUM_LICENCE: formData.num_licence || undefined,
        TYPE_CUISINE: formData.type_cuisine || undefined,
        NUM_BADGE: formData.num_badge || undefined,
      };
      success = await createUser(userData);
    }

    if (success) {
      setShowModal(false);
      setEditingUser(null);
      resetFormData();
    }
  };

  const resetFormData = () => {
    const resetData = {
      nom: '',
      prenom: '',
      date_naissance: '',
      genre: '',
      telephone: '',
      email: '',
      login: '',
      role: 'cuisinier',
      password: '',
      num_licence: '',
      type_cuisine: '',
      num_badge: '',
    };
    
    setFormData(resetData);
    setOriginalFormData(resetData);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    
    const formDataValues = {
      nom: user.personne.NOM,
      prenom: user.personne.PRENOM,
      date_naissance: user.personne.DATE_NAISSANCE || '',
      genre: user.personne.GENRE || '',
      telephone: user.personne.TELEPHONE || '',
      email: user.personne.EMAIL || '',
      login: user.LOGIN,
      role: user.ROLE,
      password: '',
      num_licence: user.dieteticien ? user.dieteticien.NUM_LICENCE : '',
      type_cuisine: user.cuisinier ? user.cuisinier.TYPE_CUISINE : '',
      num_badge: user.distributeur ? user.distributeur.NUM_BADGE : '',
    };
    
    // Sauvegarder les données originales pour comparaison
    setOriginalFormData({ ...formDataValues });
    setFormData({ ...formDataValues });
    setShowModal(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      await deleteUser(user.ID_UTILISATEUR);
    }
  };

  const viewUser = (user: User) => {
    setViewingUser(user);
    setShowViewingModal(true);
    console.log(user);
  };

  const actions = (user: User) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => viewUser(user)}
        className="p-1 text-green-600 hover:text-blue-800 transition-colors"
        title="Voir"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleEdit(user)}
        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
        title="Modifier"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleDelete(user)}
        className="p-1 text-red-600 hover:text-red-800 transition-colors"
        title="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{marginTop: '100px'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            resetFormData();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} utilisateur(s) trouvé(s)
            </div>
          </div>
        </div>


        <DataTable
          columns={[
            ...columns,
            {
              key: 'actions',
              label: 'Actions',
              sortable: false,
              render: (user: User) => actions(user),
            },
          ]}
          data={filteredUsers}
          keyField="ID_UTILISATEUR"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="dieteticien">Diététicien</option>
                  <option value="cuisinier">Cuisinier</option>
                  <option value="distributeur">Distributeur</option>
                </select>
              </div>

              {formData.role === 'dieteticien' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de licence
                  </label>
                  <input
                    type="text"
                    value={formData.num_licence}
                    onChange={(e) => setFormData(prev => ({ ...prev, num_licence: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {formData.role === 'cuisinier' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de cuisine
                  </label>
                  <select
                    required
                    value={formData.type_cuisine}
                    onChange={(e) => setFormData(prev => ({ ...prev, type_cuisine: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="speciale">Spéciale</option>
                  </select>
                </div>
              )}

              {formData.role === 'distributeur' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de badge
                  </label>
                  <input
                    type="text"
                    value={formData.num_badge}
                    onChange={(e) => setFormData(prev => ({ ...prev, num_badge: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Login *
                </label>
                <input
                  type="text"
                  required
                  value={formData.login}
                  onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {editingUser ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {showViewingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {viewingUser?.personne.NOM} {viewingUser?.personne.PRENOM}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={viewingUser?.personne.NOM}
                    readOnly
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={viewingUser?.personne.PRENOM}
                    readOnly
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Login
                </label>
                <input
                  type="text"
                  value={viewingUser?.LOGIN}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <input
                  type="text"
                  value={viewingUser?.ROLE}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  readOnly
                />
              </div>

              {viewingUser?.ROLE === 'dieteticien' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de licence
                  </label>
                  <input
                    type="text"
                    value={viewingUser?.dieteticien?.NUM_LICENCE || ''}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                    readOnly
                  />
                </div>
              )}

              {viewingUser?.ROLE === 'cuisinier' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de cuisine
                  </label>
                  <input
                    type="text"
                    value={viewingUser?.cuisinier?.TYPE_CUISINE || ''}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                    readOnly
                  />
                </div>
              )}

              {viewingUser?.ROLE === 'distributeur' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de badge
                  </label>
                  <input
                    type="text"
                    value={viewingUser?.distributeur?.NUM_BADGE || ''}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                    readOnly
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowViewingModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;