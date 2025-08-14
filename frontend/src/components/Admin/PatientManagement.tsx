import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, UserCheck, MapPin, Calendar, Phone, Mail, AlertTriangle } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email: string;
  genre: 'M' | 'F';
  dateAdmission: string;
  service: string;
  salle: string;
  lit: string;
  dieteticien?: string;
  pathologies: string[];
  allergies: string[];
  statut: 'Actif' | 'Sortie' | 'Transfert';
}

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      nom: 'Dupont',
      prenom: 'Marie',
      dateNaissance: '1985-03-15',
      telephone: '0123456789',
      email: 'marie.dupont@email.com',
      genre: 'F',
      dateAdmission: '2025-01-20',
      service: 'Cardiologie',
      salle: '204',
      lit: 'A',
      dieteticien: 'Dr. Martin',
      pathologies: ['Diabète', 'Hypertension'],
      allergies: ['Fruits de mer'],
      statut: 'Actif'
    },
    {
      id: '2',
      nom: 'Martin',
      prenom: 'Jean',
      dateNaissance: '1972-08-22',
      telephone: '0987654321',
      email: 'jean.martin@email.com',
      genre: 'M',
      dateAdmission: '2025-01-18',
      service: 'Neurologie',
      salle: '105',
      lit: 'B',
      dieteticien: 'Dr. Dubois',
      pathologies: ['AVC'],
      allergies: ['Gluten', 'Lactose'],
      statut: 'Actif'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Partial<Patient>>({});

  const filteredPatients = patients.filter(patient =>
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    setEditingPatient(null);
    setFormData({
      nom: '',
      prenom: '',
      dateNaissance: '',
      telephone: '',
      email: '',
      genre: 'M',
      dateAdmission: new Date().toISOString().split('T')[0],
      service: '',
      salle: '',
      lit: '',
      pathologies: [],
      allergies: [],
      statut: 'Actif'
    });
    setShowModal(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData(patient);
    setShowModal(true);
  };

  const handleDeletePatient = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      setPatients(patients.map(p => 
        p.id === editingPatient.id ? { ...formData as Patient, id: editingPatient.id } : p
      ));
    } else {
      const newPatient: Patient = {
        ...formData as Patient,
        id: Date.now().toString()
      };
      setPatients([...patients, newPatient]);
    }
    
    setShowModal(false);
    setFormData({});
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Sortie': return 'bg-gray-100 text-gray-800';
      case 'Transfert': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'nom',
      label: 'Nom',
      render: (patient: Patient) => (
        <div>
          <div className="font-medium text-gray-900">{patient.nom} {patient.prenom}</div>
          <div className="text-sm text-gray-500">{patient.genre === 'M' ? 'Homme' : 'Femme'}</div>
        </div>
      )
    },
    {
      key: 'dateNaissance',
      label: 'Âge',
      render: (patient: Patient) => {
        const age = new Date().getFullYear() - new Date(patient.dateNaissance).getFullYear();
        return <span>{age} ans</span>;
      }
    },
    {
      key: 'localisation',
      label: 'Localisation',
      render: (patient: Patient) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{patient.service} - {patient.salle}{patient.lit}</span>
        </div>
      )
    },
    {
      key: 'dateAdmission',
      label: 'Admission',
      render: (patient: Patient) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{new Date(patient.dateAdmission).toLocaleDateString('fr-FR')}</span>
        </div>
      )
    },
    {
      key: 'dieteticien',
      label: 'Diététicien',
      render: (patient: Patient) => (
        <span className="text-sm">{patient.dieteticien || 'Non assigné'}</span>
      )
    },
    {
      key: 'restrictions',
      label: 'Restrictions',
      render: (patient: Patient) => (
        <div className="space-y-1">
          {patient.pathologies.length > 0 && (
            <div className="flex items-center space-x-1">
              <UserCheck className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600">{patient.pathologies.join(', ')}</span>
            </div>
          )}
          {patient.allergies.length > 0 && (
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">{patient.allergies.join(', ')}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (patient: Patient) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.statut)}`}>
          {patient.statut}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (patient: Patient) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditPatient(patient)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeletePatient(patient.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Patients</h1>
        <button
          onClick={handleAddPatient}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau Patient</span>
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
              {filteredPatients.length} patient(s) trouvé(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredPatients}
          columns={columns}
          keyField="id"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingPatient ? 'Modifier le Patient' : 'Nouveau Patient'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom || ''}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={formData.dateNaissance || ''}
                    onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <select
                    value={formData.genre || 'M'}
                    onChange={(e) => setFormData({...formData, genre: e.target.value as 'M' | 'F'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Neurologie">Neurologie</option>
                    <option value="Chirurgie">Chirurgie</option>
                    <option value="Pédiatrie">Pédiatrie</option>
                    <option value="Urgences">Urgences</option>
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lit</label>
                  <input
                    type="text"
                    value={formData.lit || ''}
                    onChange={(e) => setFormData({...formData, lit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'admission</label>
                  <input
                    type="date"
                    value={formData.dateAdmission || ''}
                    onChange={(e) => setFormData({...formData, dateAdmission: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.statut || 'Actif'}
                    onChange={(e) => setFormData({...formData, statut: e.target.value as 'Actif' | 'Sortie' | 'Transfert'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Sortie">Sortie</option>
                    <option value="Transfert">Transfert</option>
                  </select>
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
                  {editingPatient ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;

