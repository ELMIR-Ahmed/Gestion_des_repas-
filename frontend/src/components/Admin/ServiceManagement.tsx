import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building, Users, Bed, UserCheck, Phone, Mail } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface Service {
  id: string;
  nomService: string;
  description: string;
  responsable: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
  };
  nombreSalles: number;
  capaciteTotale: number;
  patientsActuels: number;
  specialites: string[];
  statut: 'Actif' | 'Maintenance' | 'Fermé';
  notes?: string;
}

const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      nomService: 'Cardiologie',
      description: 'Service spécialisé dans les maladies cardiovasculaires',
      responsable: {
        nom: 'Dubois',
        prenom: 'Marie',
        telephone: '01.23.45.67.89',
        email: 'marie.dubois@hopital.fr'
      },
      nombreSalles: 8,
      capaciteTotale: 24,
      patientsActuels: 18,
      specialites: ['Cardiologie interventionnelle', 'Électrophysiologie', 'Insuffisance cardiaque'],
      statut: 'Actif',
      notes: 'Service avec équipement de pointe'
    },
    {
      id: '2',
      nomService: 'Neurologie',
      description: 'Service de neurologie et neurochirurgie',
      responsable: {
        nom: 'Martin',
        prenom: 'Pierre',
        telephone: '01.23.45.67.90',
        email: 'pierre.martin@hopital.fr'
      },
      nombreSalles: 6,
      capaciteTotale: 18,
      patientsActuels: 15,
      specialites: ['AVC', 'Épilepsie', 'Sclérose en plaques', 'Parkinson'],
      statut: 'Actif',
      notes: 'Unité neuro-vasculaire certifiée'
    },
    {
      id: '3',
      nomService: 'Chirurgie',
      description: 'Service de chirurgie générale et spécialisée',
      responsable: {
        nom: 'Leclerc',
        prenom: 'Sophie',
        telephone: '01.23.45.67.91',
        email: 'sophie.leclerc@hopital.fr'
      },
      nombreSalles: 10,
      capaciteTotale: 30,
      patientsActuels: 22,
      specialites: ['Chirurgie digestive', 'Chirurgie orthopédique', 'Chirurgie plastique'],
      statut: 'Actif',
      notes: 'Bloc opératoire moderne'
    },
    {
      id: '4',
      nomService: 'Pédiatrie',
      description: 'Service dédié aux enfants et adolescents',
      responsable: {
        nom: 'Moreau',
        prenom: 'Jean',
        telephone: '01.23.45.67.92',
        email: 'jean.moreau@hopital.fr'
      },
      nombreSalles: 5,
      capaciteTotale: 20,
      patientsActuels: 12,
      specialites: ['Pédiatrie générale', 'Néonatologie', 'Pédopsychiatrie'],
      statut: 'Actif',
      notes: 'Environnement adapté aux enfants'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});

  const filteredServices = services.filter(service => {
    const matchesSearch = service.nomService.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.responsable.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || service.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddService = () => {
    setEditingService(null);
    setFormData({
      nomService: '',
      description: '',
      responsable: {
        nom: '',
        prenom: '',
        telephone: '',
        email: ''
      },
      nombreSalles: 0,
      capaciteTotale: 0,
      patientsActuels: 0,
      specialites: [],
      statut: 'Actif',
      notes: ''
    });
    setShowModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setShowModal(true);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      setServices(services.map(s => 
        s.id === editingService.id ? { ...formData as Service, id: editingService.id } : s
      ));
    } else {
      const newService: Service = {
        ...formData as Service,
        id: Date.now().toString()
      };
      setServices([...services, newService]);
    }
    
    setShowModal(false);
    setFormData({});
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Fermé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (current: number, total: number) => {
    const rate = current / total;
    if (rate < 0.5) return 'text-green-600';
    if (rate < 0.8) return 'text-yellow-600';
    if (rate < 0.95) return 'text-orange-600';
    return 'text-red-600';
  };

  const statuses = ['Actif', 'Maintenance', 'Fermé'];

  const columns = [
    {
      key: 'service',
      label: 'Service',
      render: (service: Service) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{service.nomService}</div>
            <div className="text-sm text-gray-500 max-w-xs truncate">{service.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'responsable',
      label: 'Responsable',
      render: (service: Service) => (
        <div>
          <div className="font-medium text-gray-900">
            {service.responsable.prenom} {service.responsable.nom}
          </div>
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <Phone className="h-3 w-3" />
            <span>{service.responsable.telephone}</span>
          </div>
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <Mail className="h-3 w-3" />
            <span className="truncate max-w-xs">{service.responsable.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'capacite',
      label: 'Capacité',
      render: (service: Service) => (
        <div className="text-center">
          <div className="flex items-center space-x-2 mb-1">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{service.nombreSalles} salles</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bed className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{service.capaciteTotale} lits</span>
          </div>
        </div>
      )
    },
    {
      key: 'occupation',
      label: 'Occupation',
      render: (service: Service) => (
        <div className="text-center">
          <div className={`font-medium ${getOccupancyColor(service.patientsActuels, service.capaciteTotale)}`}>
            {service.patientsActuels}/{service.capaciteTotale}
          </div>
          <div className="text-xs text-gray-500">
            {Math.round((service.patientsActuels / service.capaciteTotale) * 100)}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full ${
                service.patientsActuels / service.capaciteTotale < 0.8 ? 'bg-green-500' : 
                service.patientsActuels / service.capaciteTotale < 0.95 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(service.patientsActuels / service.capaciteTotale) * 100}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      key: 'specialites',
      label: 'Spécialités',
      render: (service: Service) => (
        <div className="space-y-1">
          {service.specialites.slice(0, 2).map((spec, index) => (
            <div key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {spec}
            </div>
          ))}
          {service.specialites.length > 2 && (
            <div className="text-xs text-gray-500">
              +{service.specialites.length - 2} autres
            </div>
          )}
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (service: Service) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.statut)}`}>
          {service.statut}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (service: Service) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditService(service)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteService(service.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: services.length,
    actifs: services.filter(s => s.statut === 'Actif').length,
    totalSalles: services.reduce((sum, s) => sum + s.nombreSalles, 0),
    totalCapacite: services.reduce((sum, s) => sum + s.capaciteTotale, 0),
    totalPatients: services.reduce((sum, s) => sum + s.patientsActuels, 0)
  };

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <p className="text-sm text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
            </div>
            <Building className="h-8 w-8 text-green-400" />
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
              <p className="text-2xl font-bold text-purple-600">{stats.totalCapacite}</p>
            </div>
            <Bed className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Patients</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalPatients}</p>
            </div>
            <UserCheck className="h-8 w-8 text-orange-400" />
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <div className="text-sm text-gray-500">
              {filteredServices.length} service(s) trouvé(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredServices}
          columns={columns}
          keyField="id"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? 'Modifier le Service' : 'Nouveau Service'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations générales */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informations générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service</label>
                    <input
                      type="text"
                      value={formData.nomService || ''}
                      onChange={(e) => setFormData({...formData, nomService: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      value={formData.statut || 'Actif'}
                      onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Responsable */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Responsable du service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={formData.responsable?.nom || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        responsable: {...formData.responsable, nom: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      value={formData.responsable?.prenom || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        responsable: {...formData.responsable, prenom: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.responsable?.telephone || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        responsable: {...formData.responsable, telephone: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.responsable?.email || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        responsable: {...formData.responsable, email: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Capacité */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Capacité</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de salles</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.nombreSalles || 0}
                      onChange={(e) => setFormData({...formData, nombreSalles: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacité totale (lits)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.capaciteTotale || 0}
                      onChange={(e) => setFormData({...formData, capaciteTotale: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patients actuels</label>
                    <input
                      type="number"
                      min="0"
                      max={formData.capaciteTotale || 0}
                      value={formData.patientsActuels || 0}
                      onChange={(e) => setFormData({...formData, patientsActuels: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Spécialités et notes */}
              <div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécialités</label>
                    <input
                      type="text"
                      value={formData.specialites?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, specialites: e.target.value.split(', ').filter(spec => spec.trim())})}
                      placeholder="Séparer par des virgules"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
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
    </div>
  );
};

export default ServiceManagement;

