import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserCheck, MapPin, Calendar, AlertTriangle, Eye } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import DataTable from '../UI/DataTable';

interface Service {
  ID_SERVICE: string;
  NOM_SERVICE: string;
  DESCRIPTION: string;
  salles: Salle[];
}

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

interface Allergies {
  ID_ALLERGIE: string;
  NOM_ALLERGIE: string;
}

interface Pathologie {
  ID_PATHOLOGIE: string;
  NOM_PATHOLOGIE: string;
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
  allergies: Allergies[];
  pathologies: Pathologie[];
}

interface CreatePatientData {
  NOM: string;
  PRENOM: string;
  DATE_NAISSANCE: string;
  GENRE: string;
  TELEPHONE?: string;
  EMAIL?: string;
  ID_LIT?: string;
  DATE_ADMISSION: string;
}

interface UpdatePatientData {
  NOM?: string;
  PRENOM?: string;
  DATE_NAISSANCE?: string;
  GENRE?: string;
  TELEPHONE?: string;
  EMAIL?: string;
  ID_LIT?: string;
  DATE_ADMISSION?: string;
}

const PatientManagement: React.FC = () => {
  const { addNotification } = useNotifications();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  // Données originales pour comparer les modifications
  const [originalFormData, setOriginalFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    genre: 'M',
    telephone: '',
    email: '',
    service: '',
    salle: '',
    lit: '',
    date_admission: '',
  });

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    genre: 'M',
    telephone: '',
    email: '',
    service: '',
    salle: '',
    lit: '',
    date_admission: '',
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
  const getModifiedFields = (): UpdatePatientData => {
    const modifiedFields: UpdatePatientData = {};
    
    if (formData.nom !== originalFormData.nom) {
      modifiedFields.NOM = formData.nom;
    }
    if (formData.prenom !== originalFormData.prenom) {
      modifiedFields.PRENOM = formData.prenom;
    }
    if (formData.date_naissance !== originalFormData.date_naissance) {
      modifiedFields.DATE_NAISSANCE = formData.date_naissance;
    }
    if (formData.genre !== originalFormData.genre) {
      modifiedFields.GENRE = formData.genre;
    }
    if (formData.telephone !== originalFormData.telephone) {
      modifiedFields.TELEPHONE = formData.telephone;
    }
    if (formData.email !== originalFormData.email) {
      modifiedFields.EMAIL = formData.email;
    }
    if (formData.lit !== originalFormData.lit) {
      modifiedFields.ID_LIT = formData.lit;
    }
    if (formData.date_admission !== originalFormData.date_admission) {
      modifiedFields.DATE_ADMISSION = formData.date_admission;
    }
    
    return modifiedFields;
  };
  
  // Fetch Services :
  const fetchServices = async () => {
    try {
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
    }
  };

  // Helper to get salles for selected service
  const getSallesForService = (serviceId: string) => {
    const service = services.find(s => s.ID_SERVICE.toString() === serviceId);
    return service ? service.salles : [];
  };

  // Helper to get lits for selected salle
  const getLitsForSalle = (salleId: string) => {
    for (const service of services) {
      const salle = service.salles.find(s => s.ID_SALLE.toString() === salleId);
      if (salle) return salle.lits;
    }
    return [];
  };

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/patients`, {
        headers: apiHeaders,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des patients');
      }

      const data = await response.json();
      setPatients(data.data || data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de récupérer les patients.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create patient via API
  const createPatient = async (patientData: CreatePatientData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du patient');
      }

      await fetchPatients();
      
      addNotification({
        type: 'success',
        title: 'Patient créé',
        message: 'Le nouveau patient a été créé avec succès.',
      });

      return true;
    } catch (error) {
      console.error('Error creating patient:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de créer le patient.',
      });
      return false;
    }
  };

  // Update patient via API
  const updatePatient = async (patientId: string, patientData: UpdatePatientData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: 'PUT',
        headers: apiHeaders,
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du patient');
      }

      await fetchPatients();

      addNotification({
        type: 'success',
        title: 'Patient modifié',
        message: 'Les modifications ont été enregistrées avec succès.',
      });

      return true;
    } catch (error) {
      console.error('Error updating patient:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de modifier le patient.',
      });
      return false;
    }
  };

  // Delete patient via API
  const deletePatient = async (patientId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: 'DELETE',
        headers: apiHeaders,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du patient');
      }

      await fetchPatients();
      
      addNotification({
        type: 'success',
        title: 'Patient supprimé',
        message: 'Le patient a été supprimé avec succès.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de supprimer le patient.',
      });
      return false;
    }
  };

  // Load patients on component mount
  useEffect(() => {
    fetchServices();
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.personne.NOM.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.personne.PRENOM.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.lit?.salle?.service?.NOM_SERVICE || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    setEditingPatient(null);
    resetFormData();
    setShowModal(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    
    const formDataValues = {
      nom: patient.personne.NOM,
      prenom: patient.personne.PRENOM,
      date_naissance: patient.personne.DATE_NAISSANCE || '',
      genre: patient.personne.GENRE || 'M',
      telephone: patient.personne.TELEPHONE || '',
      email: patient.personne.EMAIL || '',
      service: patient.lit.salle.service.NOM_SERVICE || '',
      salle: patient.lit.salle.NOM_SALLE || '',
      lit: patient.lit.NUM_LIT || '',
      date_admission: patient.DATE_ADMISSION || '',
    };
    
    setOriginalFormData({ ...formDataValues });
    setFormData({ ...formDataValues });
    setShowModal(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      deletePatient(patient.ID_PATIENT);
    }
  };

  const viewPatient = (patient: Patient) => {
    setViewingPatient(patient);
    setShowViewingModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;

    if (editingPatient) {
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
        setEditingPatient(null);
        resetFormData();
        return;
      }
      
      success = await updatePatient(editingPatient.ID_PATIENT, modifiedFields);
    } else {
      // Mode création - utiliser tous les champs requis
      const patientData: CreatePatientData = {
        NOM: formData.nom,
        PRENOM: formData.prenom,
        DATE_NAISSANCE: formData.date_naissance,
        GENRE: formData.genre,
        TELEPHONE: formData.telephone,
        EMAIL: formData.email,
        ID_LIT: formData.lit,
        DATE_ADMISSION: formData.date_admission,
      };
      success = await createPatient(patientData);
    }

    if (success) {
      setShowModal(false);
      setEditingPatient(null);
      resetFormData();
    }
  };

  const resetFormData = () => {
    const resetData = {
      nom: '',
      prenom: '',
      date_naissance: '',
      genre: 'M',
      telephone: '',
      email: '',
      service: '',
      salle: '',
      lit: '',
      date_admission: new Date().toISOString().split('T')[0],
    };
    
    setFormData(resetData);
    setOriginalFormData(resetData);
  };

  const columns = [
    {
      key: 'nom',
      label: 'Patient',
      sortable: true,
      render: (patient: Patient) => (
        <div>
          <div className="font-medium text-gray-900 text-left">
            {patient.personne.NOM.toUpperCase()} {patient.personne.PRENOM.replace(/\b\w/g, c => c.toUpperCase())}
          </div>
          <div className="text-sm text-gray-500 text-left">
            {patient.personne.GENRE === 'M' ? 'Homme' : 'Femme'}
          </div>
        </div>
      )
    },
    {
      key: 'dateNaissance',
      label: 'Âge',
      sortable: true,
      render: (patient: Patient) => {
        if (!patient.personne.DATE_NAISSANCE) return <span>-</span>;
        const age = new Date().getFullYear() - new Date(patient.personne.DATE_NAISSANCE).getFullYear();
        return <span>{age} ans</span>;
      }
    },
    {
      key: 'localisation',
      label: 'Localisation (Service - Salle - Lit)',
      render: (patient: Patient) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {patient.lit?.salle?.service?.NOM_SERVICE || 'N/A'} -&gt;&nbsp;
            {patient.lit?.salle?.NOM_SALLE || 'N/A'} -&gt; 
            Lit {patient.lit?.NUM_LIT || 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'dateAdmission',
      label: 'Admission',
      sortable: true,
      render: (patient: Patient) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {patient.DATE_ADMISSION ? new Date(patient.DATE_ADMISSION).toLocaleDateString('fr-FR') : 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'restrictions',
      label: 'Restrictions',
      render: (patient: Patient) => (
        <div className="space-y-1">
          {patient.pathologies && patient.pathologies.length > 0 && (
            <div className="flex items-center space-x-1">
              <UserCheck className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600">
                {patient.pathologies.map(p => p.NOM_PATHOLOGIE).join(', ')}
              </span>
            </div>
          )}
          {patient.allergies && patient.allergies.length > 0 && (
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">
                {patient.allergies.map(a => a.NOM_ALLERGIE).join(', ')}
              </span>
            </div>
          )}
          {(!patient.pathologies || patient.pathologies.length === 0) && 
          (!patient.allergies || patient.allergies.length === 0) && (
            <span className="text-xs text-gray-400">Aucune restriction</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (patient: Patient) => (
        <div className="flex space-x-2">
          <button
            onClick={() => viewPatient(patient)}
            className="text-green-600 hover:text-green-800"
            title="Voir"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditPatient(patient)}
            className="text-blue-600 hover:text-blue-800"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeletePatient(patient)}
            className="text-red-600 hover:text-red-800"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

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
          keyField="ID_PATIENT"
        />
      </div>

      {/* Modal de création/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingPatient ? 'Modifier le Patient' : 'Nouveau Patient'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={formData.date_naissance}
                    onChange={(e) => setFormData({...formData, date_naissance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <select
                    value={formData.service}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        service: e.target.value,
                        salle: '', // reset salle
                        lit: '',   // reset lit
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" className={formData.service ? 'hidden' : ''}>{formData.service ? formData.service : '-- Choisir un service --'}</option>
                    {services.map((service) => (
                      <option key={service.ID_SERVICE} value={service.ID_SERVICE}>
                        {service.NOM_SERVICE}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                  <select
                    value={formData.salle}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        salle: e.target.value,
                        lit: '', // reset lit
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.service}
                  >
                    <option value="" className={formData.salle ? 'hidden' : ''}>{formData.salle ? formData.salle : '-- Choisir une salle --'}</option>
                    {getSallesForService(formData.service).map((salle: Salle) => (
                      <option key={salle.ID_SALLE} value={salle.ID_SALLE}>
                        {salle.NOM_SALLE}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lit</label>
                  <select
                    value={formData.lit}
                    onChange={(e) => setFormData({...formData, lit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.salle}
                  >
                    <option value="" className={formData.lit ? 'hidden' : ''}>{formData.lit ? formData.lit : '-- Choisir un lit --'}</option>
                    {getLitsForSalle(formData.salle).map((lit: Lit) => (
                      <option key={lit.ID_LIT} value={lit.ID_LIT}>
                        {lit.NUM_LIT}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'admission *</label>
                  <input
                    type="date"
                    value={formData.date_admission}
                    onChange={(e) => setFormData({...formData, date_admission: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
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

      {/* Modal de visualisation */}
      {showViewingModal && viewingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {viewingPatient.personne.NOM.toUpperCase()} {viewingPatient.personne.PRENOM.replace(/\b\w/g, c => c.toUpperCase())}
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={viewingPatient.personne.NOM.toUpperCase()}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={viewingPatient.personne.PRENOM.replace(/\b\w/g, c => c.toUpperCase())}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="text"
                    value={viewingPatient.personne.DATE_NAISSANCE ? new Date(viewingPatient.personne.DATE_NAISSANCE).toLocaleDateString('fr-FR') : 'Non renseigné'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <input
                    type="text"
                    value={viewingPatient.personne.GENRE === 'M' ? 'Homme' : 'Femme'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={viewingPatient.personne.TELEPHONE || 'Non renseigné'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    value={viewingPatient.personne.EMAIL || 'Non renseigné'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <input
                    type="text"
                    value={viewingPatient.lit?.salle?.service?.NOM_SERVICE || 'N/A'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                  <input
                    type="text"
                    value={viewingPatient.lit?.salle?.NOM_SALLE || 'N/A'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lit</label>
                  <input
                    type="text"
                    value={viewingPatient.lit?.NUM_LIT || 'N/A'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'admission</label>
                  <input
                    type="text"
                    value={viewingPatient.DATE_ADMISSION ? new Date(viewingPatient.DATE_ADMISSION).toLocaleDateString('fr-FR') : 'Non renseigné'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              {/* Pathologies et Allergies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pathologies</label>
                  <textarea
                    value={viewingPatient.pathologies && viewingPatient.pathologies.length > 0 
                      ? viewingPatient.pathologies.map(p => p.NOM_PATHOLOGIE).join(', ')
                      : 'Aucune pathologie'}
                    readOnly
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  <textarea
                    value={viewingPatient.allergies && viewingPatient.allergies.length > 0 
                      ? viewingPatient.allergies.map(a => a.NOM_ALLERGIE).join(', ')
                      : 'Aucune allergie'}
                    readOnly
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

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

export default PatientManagement;