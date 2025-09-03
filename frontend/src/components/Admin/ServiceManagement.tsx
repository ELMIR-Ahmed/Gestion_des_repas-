import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Building, Eye } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import DataTable from '../UI/DataTable';

interface Salle {
  ID_SALLE: string;
  ID_SERVICE: string;
  NOM_SALLE: string;
  service: Service;
  lits: Lit[];
}

interface Lit {
  ID_LIT: string;
  ID_SALLE: string;
  NUM_LIT: string;
  salle: Salle;
}

interface Service {
  ID_SERVICE: string;
  NOM_SERVICE: string;
  DESCRIPTION: string;
  salles?: Salle[];
}

interface CreateServiceData {
  NOM_SERVICE: string;
  DESCRIPTION: string;
}

interface UpdateServiceData {
  NOM_SERVICE?: string;
  DESCRIPTION?: string;
}

const ServiceManagement: React.FC = () => {
  const { addNotification } = useNotifications();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // Données originales pour comparer les modifications
  const [originalFormData, setOriginalFormData] = useState({
    nom_service: '',
    description: '',
  });

  const [formData, setFormData] = useState({
    nom_service: '',
    description: '',
  });

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

  // Fonction pour comparer les données et ne retourner que les champs modifiés
  const getModifiedFields = (): UpdateServiceData => {
    const modifiedFields: UpdateServiceData = {};
    
    if (formData.nom_service !== originalFormData.nom_service) {
      modifiedFields.NOM_SERVICE = formData.nom_service;
    }
    if (formData.description !== originalFormData.description) {
      modifiedFields.DESCRIPTION = formData.description;
    }
    
    return modifiedFields;
  };

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/services`, {
        headers: apiHeaders,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des services');
      }

      const data = await response.json();
      setServices(data.data || data);
    } catch (error) {
      console.error('Error fetching services:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de récupérer les services.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create service via API
  const createService = async (serviceData: CreateServiceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du service');
      }

      await fetchServices();
      
      addNotification({
        type: 'success',
        title: 'Service créé',
        message: 'Le nouveau service a été créé avec succès.',
      });

      return true;
    } catch (error) {
      console.error('Error creating service:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de créer le service.',
      });
      return false;
    }
  };

  // Update service via API
  const updateService = async (serviceId: string, serviceData: UpdateServiceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: 'PUT',
        headers: apiHeaders,
        body: JSON.stringify(serviceData),
      });

      console.log('Champs modifiés envoyés:', serviceData);

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du service');
      }

      await fetchServices();

      addNotification({
        type: 'success',
        title: 'Service modifié',
        message: 'Les modifications ont été enregistrées avec succès.',
      });

      return true;
    } catch (error) {
      console.error('Error updating service:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de modifier le service.',
      });
      return false;
    }
  };

  // Delete service via API
  const deleteService = async (serviceId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: 'DELETE',
        headers: apiHeaders,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du service');
      }

      await fetchServices();
      
      addNotification({
        type: 'success',
        title: 'Service supprimé',
        message: 'Le service a été supprimé avec succès.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de supprimer le service.',
      });
      return false;
    }
  };

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.NOM_SERVICE.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.DESCRIPTION.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = () => {
    setEditingService(null);
    resetFormData();
    setShowModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    
    const formDataValues = {
      nom_service: service.NOM_SERVICE,
      description: service.DESCRIPTION,
    };
    
    setOriginalFormData({ ...formDataValues });
    setFormData({ ...formDataValues });
    setShowModal(true);
  };

  const handleDeleteService = (service: Service) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      deleteService(service.ID_SERVICE);
    }
  };

  const viewService = (service: Service) => {
    setViewingService(service);
    setShowViewingModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;

    if (editingService) {
      // Mode modification - ne récupérer que les champs modifiés
      const modifiedFields = getModifiedFields();
      
      // Vérifier s'il y a des modifications
      if (Object.keys(modifiedFields).length === 0) {
        addNotification({
          type: 'info',
          title: 'Aucune modification',
          message: 'Aucun champ n\'a été modifié.',
        });
        setShowModal(false);
        setEditingService(null);
        resetFormData();
        return;
      }
      
      success = await updateService(editingService.ID_SERVICE, modifiedFields);
    } else {
      // Mode création - utiliser tous les champs requis
      const serviceData: CreateServiceData = {
        NOM_SERVICE: formData.nom_service,
        DESCRIPTION: formData.description,
      };
      success = await createService(serviceData);
    }

    if (success) {
      setShowModal(false);
      setEditingService(null);
      resetFormData();
    }
  };

  const resetFormData = () => {
    const resetData = {
      nom_service: '',
      description: '',
    };
    
    setFormData(resetData);
    setOriginalFormData(resetData);
  };

  const columns = [
    {
      key: 'service',
      label: 'Service',
      sortable: true,
      render: (service: Service) => (
        <div className="flex items-center space-x-3" style={{marginLeft: '120px'}}>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{service.NOM_SERVICE}</div>
            <div className="text-sm text-gray-500 max-w-xs truncate">{service.DESCRIPTION}</div>
          </div>
        </div>
      )
    },
    {
      key: 'salles',
      label: 'Salles',
      render: (service: Service) => (
        <div className="text-center">
          <span className="text-sm font-medium text-gray-900">
            {service.salles ? service.salles.length : 0}
          </span>
          <div className="text-xs text-gray-500">salles</div>
        </div>
      )
    },
    {
      key: 'lits',
      label: 'Lits',
      render: (service: Service) => {
        const totalLits = service.salles ? 
          service.salles.reduce((total, salle) => total + (salle.lits ? salle.lits.length : 0), 0) : 0;
        
        return (
          <div className="text-center">
            <span className="text-sm font-medium text-gray-900">{totalLits}</span>
            <div className="text-xs text-gray-500">lits</div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (service: Service) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => viewService(service)}
            className="text-green-600 hover:text-green-800"
            title="Voir"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditService(service)}
            className="text-blue-600 hover:text-blue-800"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteService(service)}
            className="text-red-600 hover:text-red-800"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: services.length,
    totalSalles: services.reduce((sum, s) => sum + (s.salles ? s.salles.length : 0), 0),
    totalLits: services.reduce((sum, s) => sum + (s.salles ? 
      s.salles.reduce((sallSum, salle) => sallSum + (salle.lits ? salle.lits.length : 0), 0) : 0), 0),
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Services</h1>
        <button
          onClick={handleAddService}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau Service</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Services</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Building className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Salles</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalSalles}</p>
            </div>
            <Building className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lits</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalLits}</p>
            </div>
            <Building className="h-8 w-8 text-purple-400" />
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
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>

            <div className="text-sm text-gray-500">
              {filteredServices.length} service(s) trouvé(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredServices}
          columns={columns}
          keyField="ID_SERVICE"
        />
      </div>

      {/* Modal de création/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? 'Modifier le Service' : 'Nouveau Service'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service *</label>
                <input
                  type="text"
                  value={formData.nom_service}
                  onChange={(e) => setFormData({...formData, nom_service: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingService ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {showViewingModal && viewingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Détails du Service: {viewingService.NOM_SERVICE}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service</label>
                <input
                  type="text"
                  value={viewingService.NOM_SERVICE}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={viewingService.DESCRIPTION}
                  readOnly
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              {/* Statistiques du service */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Statistiques</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600">Nombre de salles</div>
                    <div className="text-xl font-bold text-blue-900">
                      {viewingService.salles ? viewingService.salles.length : 0}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm text-purple-600">Nombre de lits</div>
                    <div className="text-xl font-bold text-purple-900">
                      {viewingService.salles ? 
                        viewingService.salles.reduce((total, salle) => total + (salle.lits ? salle.lits.length : 0), 0) : 0
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Liste des salles si disponible */}
              {viewingService.salles && viewingService.salles.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Salles du service</h3>
                  <div className="space-y-2">
                    {viewingService.salles.map((salle) => (
                      <div key={salle.ID_SALLE} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{salle.NOM_SALLE}</span>
                        <span className="text-sm text-gray-500">
                          {salle.lits ? salle.lits.length : 0} lits
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowViewingModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
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

export default ServiceManagement;