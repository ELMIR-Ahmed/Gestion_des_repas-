import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
// import DataTable from '../UI/DataTable';

interface User {
  id: string;
  nom: string;
  prenom: string;
  login: string;
  role: 'admin' | 'dieteticien' | 'cuisinier' | 'distributeur';
  statut: 'Actif' | 'Inactif';
  dateCreation: string;
}

const UserManagement: React.FC = () => {
  const { addNotification } = useNotifications();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Mock data - replace with actual API data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      nom: 'Martin',
      prenom: 'Jean',
      login: 'admin',
      role: 'admin',
      statut: 'Actif',
      dateCreation: '2024-01-15',
    },
    {
      id: '2',
      nom: 'Dubois',
      prenom: 'Marie',
      login: 'diet',
      role: 'dieteticien',
      statut: 'Actif',
      dateCreation: '2024-02-10',
    },
    {
      id: '3',
      nom: 'Durand',
      prenom: 'Pierre',
      login: 'cook',
      role: 'cuisinier',
      statut: 'Actif',
      dateCreation: '2024-02-20',
    },
    {
      id: '4',
      nom: 'Bernard',
      prenom: 'Sophie',
      login: 'dist',
      role: 'distributeur',
      statut: 'Inactif',
      dateCreation: '2024-03-01',
    },
  ]);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    login: '',
    role: 'cuisinier' as User['role'],
    password: '',
  });

  const columns = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'prenom', label: 'Prénom', sortable: true },
    { key: 'login', label: 'Login', sortable: true },
    {
      key: 'role',
      label: 'Rôle',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'admin' ? 'bg-red-100 text-red-800' :
          value === 'dieteticien' ? 'bg-green-100 text-green-800' :
          value === 'cuisinier' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    { key: 'dateCreation', label: 'Date de création', sortable: true },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update user
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, statut: user.statut }
          : user
      ));
      addNotification({
        type: 'success',
        title: 'Utilisateur modifié',
        message: 'Les modifications ont été enregistrées avec succès.',
      });
    } else {
      // Add new user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        statut: 'Actif',
        dateCreation: new Date().toISOString().split('T')[0],
      };
      setUsers(prev => [...prev, newUser]);
      addNotification({
        type: 'success',
        title: 'Utilisateur créé',
        message: 'Le nouvel utilisateur a été créé avec succès.',
      });
    }

    setShowModal(false);
    setEditingUser(null);
    setFormData({
      nom: '',
      prenom: '',
      login: '',
      role: 'cuisinier',
      password: '',
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      login: user.login,
      role: user.role,
      password: '',
    });
    setShowModal(true);
  };

  const handleDelete = (user: User) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      addNotification({
        type: 'success',
        title: 'Utilisateur supprimé',
        message: 'L\'utilisateur a été supprimé avec succès.',
      });
    }
  };

  const toggleStatus = (user: User) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { ...u, statut: u.statut === 'Actif' ? 'Inactif' : 'Actif' as User['statut'] }
        : u
    ));
    addNotification({
      type: 'info',
      title: 'Statut modifié',
      message: `L'utilisateur a été ${user.statut === 'Actif' ? 'désactivé' : 'activé'}.`,
    });
  };

  const actions = (user: User) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleEdit(user)}
        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
        title="Modifier"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={() => toggleStatus(user)}
        className={`p-1 transition-colors ${
          user.statut === 'Actif' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
        }`}
        title={user.statut === 'Actif' ? 'Désactiver' : 'Activer'}
      >
        <Eye className="h-4 w-4" />
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              nom: '',
              prenom: '',
              login: '',
              role: 'cuisinier',
              password: '',
            });
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                  {column.render
                    ? column.render(user[column.key as keyof User])
                    : user[column.key as keyof User]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {actions(user)}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                Aucune donnée disponible
              </td>
            </tr>
          )}
        </tbody>
        </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
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
                  Rôle *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="dieteticien">Diététicien</option>
                  <option value="cuisinier">Cuisinier</option>
                  <option value="distributeur">Distributeur</option>
                </select>
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
    </div>
  );
};

export default UserManagement;