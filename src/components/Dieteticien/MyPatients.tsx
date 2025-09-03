import React, { useState } from 'react';
import { Search, UserCheck, MapPin, Calendar, AlertTriangle, Heart, Eye, Edit } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface PatientDiet {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  genre: 'M' | 'F';
  service: string;
  salle: string;
  lit: string;
  dateAdmission: string;
  pathologies: string[];
  allergies: string[];
  regimeActuel: string;
  menuType: 'Standard' | 'Spécifique';
  derniereEvaluation: string;
  prochainRendezVous?: string;
  notes?: string;
  statut: 'Suivi actif' | 'Évaluation requise' | 'Menu à valider' | 'Stable';
}

const MyPatients: React.FC = () => {
  const [patients, setPatients] = useState<PatientDiet[]>([
    {
      id: '1',
      nom: 'Dupont',
      prenom: 'Marie',
      age: 65,
      genre: 'F',
      service: 'Cardiologie',
      salle: '204',
      lit: 'A',
      dateAdmission: '2025-01-20',
      pathologies: ['Diabète type 2', 'Hypertension'],
      allergies: ['Fruits de mer'],
      regimeActuel: 'Diabétique sans sel',
      menuType: 'Spécifique',
      derniereEvaluation: '2025-01-25',
      prochainRendezVous: '2025-01-30',
      notes: 'Patiente coopérative, bon suivi du régime',
      statut: 'Suivi actif'
    },
    {
      id: '2',
      nom: 'Martin',
      prenom: 'Jean',
      age: 58,
      genre: 'M',
      service: 'Neurologie',
      salle: '105',
      lit: 'B',
      dateAdmission: '2025-01-18',
      pathologies: ['AVC récent'],
      allergies: ['Gluten', 'Lactose'],
      regimeActuel: 'Sans gluten, sans lactose',
      menuType: 'Spécifique',
      derniereEvaluation: '2025-01-22',
      notes: 'Difficultés de déglutition, texture modifiée',
      statut: 'Évaluation requise'
    },
    {
      id: '3',
      nom: 'Leclerc',
      prenom: 'Sophie',
      age: 42,
      genre: 'F',
      service: 'Chirurgie',
      salle: '301',
      lit: 'A',
      dateAdmission: '2025-01-22',
      pathologies: ['Post-opératoire'],
      allergies: [],
      regimeActuel: 'Post-opératoire',
      menuType: 'Standard',
      derniereEvaluation: '2025-01-23',
      prochainRendezVous: '2025-01-28',
      notes: 'Récupération normale, appétit correct',
      statut: 'Menu à valider'
    },
    {
      id: '4',
      nom: 'Moreau',
      prenom: 'Pierre',
      age: 71,
      genre: 'M',
      service: 'Cardiologie',
      salle: '206',
      lit: 'B',
      dateAdmission: '2025-01-15',
      pathologies: ['Insuffisance cardiaque'],
      allergies: ['Arachides'],
      regimeActuel: 'Hyposodé strict',
      menuType: 'Spécifique',
      derniereEvaluation: '2025-01-24',
      notes: 'Patient stable, bon respect du régime',
      statut: 'Stable'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientDiet | null>(null);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || patient.statut === statusFilter;
    const matchesService = !serviceFilter || patient.service === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const handleViewDetails = (patient: PatientDiet) => {
    setSelectedPatient(patient);
    setShowDetailModal(true);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Suivi actif': return 'bg-green-100 text-green-800';
      case 'Évaluation requise': return 'bg-red-100 text-red-800';
      case 'Menu à valider': return 'bg-yellow-100 text-yellow-800';
      case 'Stable': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMenuTypeColor = (type: string) => {
    switch (type) {
      case 'Spécifique': return 'bg-purple-100 text-purple-800';
      case 'Standard': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const services = ['Cardiologie', 'Neurologie', 'Chirurgie', 'Pédiatrie'];
  const statuses = ['Suivi actif', 'Évaluation requise', 'Menu à valider', 'Stable'];

  const columns = [
    {
      key: 'patient',
      label: 'Patient',
      render: (patient: PatientDiet) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <UserCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {patient.prenom} {patient.nom}
            </div>
            <div className="text-sm text-gray-500">
              {patient.age} ans • {patient.genre === 'M' ? 'Homme' : 'Femme'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'localisation',
      label: 'Localisation',
      render: (patient: PatientDiet) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium">{patient.service}</div>
            <div className="text-xs text-gray-500">
              Salle {patient.salle} - Lit {patient.lit}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'regime',
      label: 'Régime Actuel',
      render: (patient: PatientDiet) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{patient.regimeActuel}</div>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getMenuTypeColor(patient.menuType)}`}>
            {patient.menuType}
          </span>
        </div>
      )
    },
    {
      key: 'restrictions',
      label: 'Restrictions',
      render: (patient: PatientDiet) => (
        <div className="space-y-1">
          {patient.pathologies.length > 0 && (
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600">
                {patient.pathologies.slice(0, 1).join(', ')}
                {patient.pathologies.length > 1 && ` +${patient.pathologies.length - 1}`}
              </span>
            </div>
          )}
          {patient.allergies.length > 0 && (
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">
                {patient.allergies.slice(0, 1).join(', ')}
                {patient.allergies.length > 1 && ` +${patient.allergies.length - 1}`}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'evaluation',
      label: 'Dernière Évaluation',
      render: (patient: PatientDiet) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {new Date(patient.derniereEvaluation).toLocaleDateString('fr-FR')}
          </span>
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (patient: PatientDiet) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.statut)}`}>
          {patient.statut}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (patient: PatientDiet) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(patient)}
            className="text-blue-600 hover:text-blue-800"
            title="Voir détails"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            className="text-green-600 hover:text-green-800"
            title="Modifier régime"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: patients.length,
    suivi: patients.filter(p => p.statut === 'Suivi actif').length,
    evaluation: patients.filter(p => p.statut === 'Évaluation requise').length,
    validation: patients.filter(p => p.statut === 'Menu à valider').length,
    specifique: patients.filter(p => p.menuType === 'Spécifique').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mes Patients</h1>
        <div className="text-sm text-gray-500">
          {patients.length} patients assignés
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <UserCheck className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suivi Actif</p>
              <p className="text-2xl font-bold text-green-600">{stats.suivi}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">À Évaluer</p>
              <p className="text-2xl font-bold text-red-600">{stats.evaluation}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">À Valider</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.validation}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Menu Spécifique</p>
              <p className="text-2xl font-bold text-purple-600">{stats.specifique}</p>
            </div>
            <Heart className="h-8 w-8 text-purple-400" />
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
                placeholder="Rechercher un patient..."
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

      {/* Detail Modal */}
      {showDetailModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                Détails - {selectedPatient.prenom} {selectedPatient.nom}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-medium text-gray-900">Informations Générales</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Âge:</span>
                    <span className="text-sm text-gray-900">{selectedPatient.age} ans</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Genre:</span>
                    <span className="text-sm text-gray-900">{selectedPatient.genre === 'M' ? 'Homme' : 'Femme'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Service:</span>
                    <span className="text-sm text-gray-900">{selectedPatient.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Localisation:</span>
                    <span className="text-sm text-gray-900">Salle {selectedPatient.salle} - Lit {selectedPatient.lit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Date d'admission:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(selectedPatient.dateAdmission).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Régime et restrictions */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-medium text-gray-900">Régime et Restrictions</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Régime actuel:</span>
                    <div className="mt-1">
                      <span className="text-sm text-gray-900">{selectedPatient.regimeActuel}</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getMenuTypeColor(selectedPatient.menuType)}`}>
                        {selectedPatient.menuType}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Pathologies:</span>
                    <div className="mt-1 space-y-1">
                      {selectedPatient.pathologies.map((patho, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Heart className="h-3 w-3 text-blue-500" />
                          <span className="text-sm text-gray-900">{patho}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">Allergies:</span>
                    <div className="mt-1 space-y-1">
                      {selectedPatient.allergies.length > 0 ? (
                        selectedPatient.allergies.map((allergie, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            <span className="text-sm text-gray-900">{allergie}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Aucune allergie connue</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suivi */}
              <div className="space-y-4 lg:col-span-2">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-medium text-gray-900">Suivi Diététique</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Dernière évaluation:</span>
                    <div className="mt-1 text-sm text-gray-900">
                      {new Date(selectedPatient.derniereEvaluation).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  {selectedPatient.prochainRendezVous && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Prochain rendez-vous:</span>
                      <div className="mt-1 text-sm text-gray-900">
                        {new Date(selectedPatient.prochainRendezVous).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-500">Statut:</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPatient.statut)}`}>
                        {selectedPatient.statut}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedPatient.notes && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Notes:</span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{selectedPatient.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Modifier le Régime
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPatients;

