import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Bed, MapPin, User, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface BedData {
  id: string;
  numLit: string;
  salle: string;
  service: string;
  statut: 'Libre' | 'Occupé' | 'Maintenance' | 'Nettoyage';
  patient?: {
    nom: string;
    prenom: string;
    dateAdmission: string;
  };
  dateLiberation?: string;
  equipements: string[];
  notes?: string;
}

const BedManagement: React.FC = () => {
  const [beds, setBeds] = useState<BedData[]>([
    {
      id: '1',
      numLit: 'A',
      salle: '204',
      service: 'Cardiologie',
      statut: 'Occupé',
      patient: {
        nom: 'Dupont',
        prenom: 'Marie',
        dateAdmission: '2025-01-20'
      },
      equipements: ['Moniteur cardiaque', 'Perfusion'],
      notes: 'Patient stable'
    },
    {
      id: '2',
      numLit: 'B',
      salle: '204',
      service: 'Cardiologie',
      statut: 'Libre',
      dateLiberation: '2025-01-25',
      equipements: ['Moniteur cardiaque'],
      notes: 'Prêt pour admission'
    },
    {
      id: '3',
      numLit: 'A',
      salle: '105',
      service: 'Neurologie',
      statut: 'Occupé',
      patient: {
        nom: 'Martin',
        prenom: 'Jean',
        dateAdmission: '2025-01-18'
      },
      equipements: ['Moniteur neurologique', 'Perfusion', 'Oxygène'],
      notes: 'Surveillance continue'
    },
    {
      id: '4',
      numLit: 'C',
      salle: '105',
      service: 'Neurologie',
      statut: 'Maintenance',
      equipements: ['Moniteur neurologique'],
      notes: 'Réparation du système de surveillance'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingBed, setEditingBed] = useState<BedData | null>(null);
  const [formData, setFormData] = useState<Partial<BedData>>({});

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.numLit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.salle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || bed.statut === statusFilter;
    const matchesService = !serviceFilter || bed.service === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const handleAddBed = () => {
    setEditingBed(null);
    setFormData({
      numLit: '',
      salle: '',
      service: '',
      statut: 'Libre',
      equipements: [],
      notes: ''
    });
    setShowModal(true);
  };

  const handleEditBed = (bed: BedData) => {
    setEditingBed(bed);
    setFormData(bed);
    setShowModal(true);
  };

  const handleDeleteBed = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce lit ?')) {
      setBeds(beds.filter(b => b.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBed) {
      setBeds(beds.map(b => 
        b.id === editingBed.id ? { ...formData as BedData, id: editingBed.id } : b
      ));
    } else {
      const newBed: BedData = {
        ...formData as BedData,
        id: Date.now().toString()
      };
      setBeds([...beds, newBed]);
    }
    
    setShowModal(false);
    setFormData({});
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Libre': return 'bg-green-100 text-green-800';
      case 'Occupé': return 'bg-red-100 text-red-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Nettoyage': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'Libre': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Occupé': return <User className="h-4 w-4 text-red-500" />;
      case 'Maintenance': return <XCircle className="h-4 w-4 text-yellow-500" />;
      case 'Nettoyage': return <XCircle className="h-4 w-4 text-blue-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const services = ['Cardiologie', 'Neurologie', 'Chirurgie', 'Pédiatrie', 'Urgences'];
  const statuses = ['Libre', 'Occupé', 'Maintenance', 'Nettoyage'];

  const columns = [
    {
      key: 'identification',
      label: 'Identification',
      render: (bed: BedData) => (
        <div className="flex items-center space-x-2">
          <Bed className="h-5 w-5 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">Lit {bed.numLit}</div>
            <div className="text-sm text-gray-500">Salle {bed.salle}</div>
          </div>
        </div>
      )
    },
    {
      key: 'service',
      label: 'Service',
      render: (bed: BedData) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{bed.service}</span>
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (bed: BedData) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(bed.statut)}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bed.statut)}`}>
            {bed.statut}
          </span>
        </div>
      )
    },
    {
      key: 'patient',
      label: 'Patient',
      render: (bed: BedData) => (
        <div>
          {bed.patient ? (
            <div>
              <div className="font-medium text-gray-900">
                {bed.patient.prenom} {bed.patient.nom}
              </div>
              <div className="text-sm text-gray-500">
                Admis le {new Date(bed.patient.dateAdmission).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ) : (
            <span className="text-gray-400">Aucun patient</span>
          )}
        </div>
      )
    },
    {
      key: 'equipements',
      label: 'Équipements',
      render: (bed: BedData) => (
        <div className="space-y-1">
          {bed.equipements.map((eq, index) => (
            <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {eq}
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (bed: BedData) => (
        <span className="text-sm text-gray-600">{bed.notes || '-'}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (bed: BedData) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditBed(bed)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteBed(bed.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: beds.length,
    libre: beds.filter(b => b.statut === 'Libre').length,
    occupe: beds.filter(b => b.statut === 'Occupé').length,
    maintenance: beds.filter(b => b.statut === 'Maintenance').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Lits</h1>
        <button
          onClick={handleAddBed}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau Lit</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Bed className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Libres</p>
              <p className="text-2xl font-bold text-green-600">{stats.libre}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupés</p>
              <p className="text-2xl font-bold text-red-600">{stats.occupe}</p>
            </div>
            <User className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
            </div>
            <XCircle className="h-8 w-8 text-yellow-400" />
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
                placeholder="Rechercher un lit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
            
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les services</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>

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
              {filteredBeds.length} lit(s) trouvé(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredBeds}
          columns={columns}
          keyField="id"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingBed ? 'Modifier le Lit' : 'Nouveau Lit'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de lit</label>
                  <input
                    type="text"
                    value={formData.numLit || ''}
                    onChange={(e) => setFormData({...formData, numLit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                  <input
                    type="text"
                    value={formData.salle || ''}
                    onChange={(e) => setFormData({...formData, salle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <select
                    value={formData.service || ''}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un service</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.statut || 'Libre'}
                    onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipements</label>
                <input
                  type="text"
                  value={formData.equipements?.join(', ') || ''}
                  onChange={(e) => setFormData({...formData, equipements: e.target.value.split(', ').filter(eq => eq.trim())})}
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
                  {editingBed ? 'Modifier' : 'Créer'}
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

