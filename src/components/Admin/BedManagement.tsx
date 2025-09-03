import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Bed, CheckCircle, XCircle, User, Loader, AlertCircle } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface Salle {
  ID_SALLE: string;
  ID_SERVICE: string;
  NOM_SALLE: string;
  lits: Lit[];
  service: Service;
}

interface Service {
  ID_SERVICE: string;
  NOM_SERVICE: string;
  DESCRIPTION: string;
  salles: Salle[];
}

interface Lit {
  ID_LIT: string;
  ID_SALLE: string;
  NUM_LIT: string;
  salle: Salle;
  patient: Patient;
}

interface Personne {
  ID_PERSONNE: string;
  NOM: string;
  PRENOM: string;
  DATE_NAISSANCE: string;
  GENRE: string;
  TELEPHONE: string;
  EMAIL: string;
}

interface Patient {
  ID_PATIENT: string;
  ID_PERSONNE: string;
  ID_LIT: string;
  DATE_ADMISSION: string;
  personne: Personne;
  lit: Lit;
}

const BedManagement: React.FC = () => {
  const [beds, setBeds] = useState<Lit[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingBed, setEditingBed] = useState<Lit | null>(null);
  const [formData, setFormData] = useState({ NOM_SALLE: '', NUM_LIT: '' });
  const [submitting, setSubmitting] = useState(false);

  // API Configuration
  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  const getAuthToken = () => {
    return localStorage.getItem('auth_token');
  };

  const apiHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  };

  // API Service
  const apiService = {
    async fetchBeds() {
      const response = await fetch(`${API_BASE_URL}/lits`, {
        headers: apiHeaders,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },

    async fetchSalles() {
      const response = await fetch(`${API_BASE_URL}/salles`, {
        headers: apiHeaders,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },

    async createBed(data: { ID_SALLE: number; NUM_LIT: number }) {
      const response = await fetch(`${API_BASE_URL}/lits`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },

    async updateBed(id: string, data: { ID_SALLE: number; NUM_LIT: number }) {
      const response = await fetch(`${API_BASE_URL}/lits/${id}`, {
        method: 'PUT',
        headers: apiHeaders,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },

    async deleteBed(id: string) {
      const response = await fetch(`${API_BASE_URL}/lits/${id}`, {
        method: 'DELETE',
        headers: apiHeaders,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Charger les lits et les salles en parallèle
      const [bedsResponse, sallesResponse] = await Promise.all([
        apiService.fetchBeds(),
        apiService.fetchSalles()
      ]);

      setBeds(bedsResponse.data || bedsResponse);
      setSalles(sallesResponse.data || sallesResponse);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Impossible de récupérer les données.');
    } finally {
      setLoading(false);
    }
  };

  const loadBeds = async () => {
    try {
      setError('');
      const response = await apiService.fetchBeds();
      setBeds(response.data || response);
    } catch (error) {
      console.error('Error fetching beds:', error);
      setError('Impossible de récupérer les lits.');
    }
  };

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = !searchTerm || 
                          bed.NUM_LIT.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (bed.salle?.NOM_SALLE?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = !statusFilter || 
                          (statusFilter === 'Libre' && !bed.patient) ||
                          (statusFilter === 'Occupé' && bed.patient);

    return matchesSearch && matchesStatus;
  });

  const handleAddBed = () => {
    setEditingBed(null);
    setFormData({ NOM_SALLE: '', NUM_LIT: '' });
    setShowModal(true);
  };

  const handleEditBed = (bed: Lit) => {
    setEditingBed(bed);
    setFormData({ 
      NOM_SALLE: bed.salle?.NOM_SALLE || '', 
      NUM_LIT: bed.NUM_LIT 
    });
    setShowModal(true);
  };

  const handleDeleteBed = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lit ?')) return;
    
    try {
      setError('');
      await apiService.deleteBed(id);
      setBeds(beds.filter(b => b.ID_LIT !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du lit');
      console.error('Error deleting bed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Trouver l'ID de la salle à partir du nom
      const selectedSalle = salles.find(salle => salle.NOM_SALLE === formData.NOM_SALLE);
      
      if (!selectedSalle) {
        throw new Error('Salle non trouvée');
      }

      const requestData = {
        ID_SALLE: parseInt(selectedSalle.ID_SALLE),
        NUM_LIT: parseInt(formData.NUM_LIT)
      };

      if (editingBed) {
        await apiService.updateBed(editingBed.ID_LIT, requestData);
      } else {
        await apiService.createBed(requestData);
      }
      
      await loadBeds(); // Refresh the list
      setShowModal(false);
      setFormData({ NOM_SALLE: '', NUM_LIT: '' });
    } catch {
      console.error('Error saving bed:');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Libre': return 'bg-green-100 text-green-800';
      case 'Occupé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'Libre': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Occupé': return <User className="h-4 w-4 text-red-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const statuses = ['Libre', 'Occupé'];

  const columns = [
    {
      key: 'identification',
      label: 'Identification',
      render: (bed: Lit) => (
        <div className="flex items-center space-x-2 justify-center">
          <Bed className="h-5 w-5 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">Lit {bed.NUM_LIT}</div>
            {bed.salle && (
              <div className="text-sm text-gray-500">Salle {bed.salle.NOM_SALLE}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (bed: Lit) => {
        const status = bed.patient ? 'Occupé' : 'Libre';
        return (
          <div className="flex items-center space-x-2 justify-center">
            {getStatusIcon(status)}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (bed: Lit) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => handleEditBed(bed)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
            title="Modifier le lit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteBed(bed.ID_LIT)}
            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
            title="Supprimer le lit"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: beds.length,
    libre: beds.filter(b => !b.patient).length,
    occupe: beds.filter(b => b.patient).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{marginTop: '100px'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Lits</h1>
        <button
          onClick={handleAddBed}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau Lit</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Bed className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Libres</p>
              <p className="text-2xl font-bold text-green-600">{stats.libre}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupés</p>
              <p className="text-2xl font-bold text-red-600">{stats.occupe}</p>
            </div>
            <User className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher un lit ou une salle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <div className="text-sm text-gray-500">
              {filteredBeds.length} lit(s) trouvé(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredBeds}
          columns={columns}
          keyField="ID_LIT"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {editingBed ? 'Modifier le Lit' : 'Nouveau Lit'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salle <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.NOM_SALLE}
                    onChange={(e) => setFormData({...formData, NOM_SALLE: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner une salle</option>
                    {salles.map(salle => (
                      <option key={salle.ID_SALLE} value={salle.NOM_SALLE}>
                        {salle.NOM_SALLE}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de lit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.NUM_LIT}
                    onChange={(e) => setFormData({...formData, NUM_LIT: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 1, 2, 3..."
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.NOM_SALLE || !formData.NUM_LIT}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
                >
                  {submitting && <Loader className="h-4 w-4 animate-spin" />}
                  <span>{editingBed ? 'Modifier' : 'Créer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;