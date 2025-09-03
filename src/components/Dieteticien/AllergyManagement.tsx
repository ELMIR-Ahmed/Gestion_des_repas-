import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, Users, Shield, Eye } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface Allergy {
  id: string;
  nomAllergie: string;
  categorie: 'Alimentaire' | 'Médicamenteuse' | 'Environnementale' | 'Autre';
  severite: 'Légère' | 'Modérée' | 'Sévère' | 'Critique';
  symptomes: string[];
  ingredientsInterdits: string[];
  platsInterdits: string[];
  substituts: string[];
  patientsAfectes: number;
  precautions: string;
  notes?: string;
  dateCreation: string;
  statut: 'Actif' | 'Inactif';
}

const AllergyManagement: React.FC = () => {
  const [allergies, setAllergies] = useState<Allergy[]>([
    {
      id: '1',
      nomAllergie: 'Gluten',
      categorie: 'Alimentaire',
      severite: 'Modérée',
      symptomes: ['Douleurs abdominales', 'Diarrhée', 'Ballonnements', 'Fatigue'],
      ingredientsInterdits: ['Blé', 'Orge', 'Seigle', 'Avoine non certifiée'],
      platsInterdits: ['Pain classique', 'Pâtes de blé', 'Biscuits traditionnels'],
      substituts: ['Quinoa', 'Riz', 'Sarrasin', 'Farine de riz'],
      patientsAfectes: 8,
      precautions: 'Vérifier tous les ingrédients, attention aux contaminations croisées',
      notes: 'Maladie cœliaque confirmée, régime strict nécessaire',
      dateCreation: '2025-01-10',
      statut: 'Actif'
    },
    {
      id: '2',
      nomAllergie: 'Fruits de mer',
      categorie: 'Alimentaire',
      severite: 'Sévère',
      symptomes: ['Urticaire', 'Gonflement', 'Difficultés respiratoires', 'Choc anaphylactique'],
      ingredientsInterdits: ['Crevettes', 'Crabes', 'Homard', 'Moules', 'Huîtres', 'Coquilles Saint-Jacques'],
      platsInterdits: ['Paella', 'Bouillabaisse', 'Plateau de fruits de mer'],
      substituts: ['Poisson blanc', 'Volaille', 'Tofu mariné'],
      patientsAfectes: 3,
      precautions: 'Éviter toute contamination croisée, avoir de l\'épinéphrine disponible',
      notes: 'Allergie sévère, risque de choc anaphylactique',
      dateCreation: '2025-01-08',
      statut: 'Actif'
    },
    {
      id: '3',
      nomAllergie: 'Lactose',
      categorie: 'Alimentaire',
      severite: 'Légère',
      symptomes: ['Ballonnements', 'Diarrhée', 'Crampes abdominales', 'Gaz'],
      ingredientsInterdits: ['Lait de vache', 'Fromage', 'Beurre', 'Crème fraîche', 'Yaourt'],
      platsInterdits: ['Gratin dauphinois', 'Quiche lorraine', 'Crème brûlée'],
      substituts: ['Lait d\'amande', 'Lait de soja', 'Fromage végétal', 'Yaourt de coco'],
      patientsAfectes: 12,
      precautions: 'Vérifier la présence de lactose dans les produits transformés',
      notes: 'Intolérance au lactose, pas d\'allergie vraie',
      dateCreation: '2025-01-05',
      statut: 'Actif'
    },
    {
      id: '4',
      nomAllergie: 'Arachides',
      categorie: 'Alimentaire',
      severite: 'Critique',
      symptomes: ['Choc anaphylactique', 'Œdème de Quincke', 'Arrêt respiratoire'],
      ingredientsInterdits: ['Cacahuètes', 'Huile d\'arachide', 'Beurre de cacahuète'],
      platsInterdits: ['Satay', 'Pad thaï', 'Cookies aux cacahuètes'],
      substituts: ['Graines de tournesol', 'Amandes', 'Noix de cajou'],
      patientsAfectes: 2,
      precautions: 'URGENCE MÉDICALE - Épinéphrine immédiate, éviter toute trace',
      notes: 'Allergie extrêmement sévère, protocole d\'urgence activé',
      dateCreation: '2025-01-12',
      statut: 'Actif'
    },
    {
      id: '5',
      nomAllergie: 'Œufs',
      categorie: 'Alimentaire',
      severite: 'Modérée',
      symptomes: ['Éruption cutanée', 'Nausées', 'Vomissements', 'Douleurs abdominales'],
      ingredientsInterdits: ['Œufs entiers', 'Blanc d\'œuf', 'Jaune d\'œuf', 'Poudre d\'œuf'],
      platsInterdits: ['Omelette', 'Mayonnaise', 'Gâteaux traditionnels', 'Quiche'],
      substituts: ['Compote de pommes', 'Graines de lin', 'Aquafaba', 'Substitut d\'œuf commercial'],
      patientsAfectes: 5,
      precautions: 'Vérifier tous les produits de boulangerie et pâtisserie',
      notes: 'Allergie courante chez les enfants, peut disparaître avec l\'âge',
      dateCreation: '2025-01-15',
      statut: 'Actif'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null);
  const [formData, setFormData] = useState<Partial<Allergy>>({});

  const filteredAllergies = allergies.filter(allergy => {
    const matchesSearch = allergy.nomAllergie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allergy.categorie.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || allergy.categorie === categoryFilter;
    const matchesSeverity = !severityFilter || allergy.severite === severityFilter;
    const matchesStatus = !statusFilter || allergy.statut === statusFilter;
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  const handleAddAllergy = () => {
    setEditingAllergy(null);
    setFormData({
      nomAllergie: '',
      categorie: 'Alimentaire',
      severite: 'Légère',
      symptomes: [],
      ingredientsInterdits: [],
      platsInterdits: [],
      substituts: [],
      patientsAfectes: 0,
      precautions: '',
      notes: '',
      dateCreation: new Date().toISOString().split('T')[0],
      statut: 'Actif'
    });
    setShowModal(true);
  };

  const handleEditAllergy = (allergy: Allergy) => {
    setEditingAllergy(allergy);
    setFormData(allergy);
    setShowModal(true);
  };

  const handleViewDetails = (allergy: Allergy) => {
    setSelectedAllergy(allergy);
    setShowDetailModal(true);
  };

  const handleDeleteAllergy = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette allergie ?')) {
      setAllergies(allergies.filter(a => a.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAllergy) {
      setAllergies(allergies.map(a => 
        a.id === editingAllergy.id ? { ...formData as Allergy, id: editingAllergy.id } : a
      ));
    } else {
      const newAllergy: Allergy = {
        ...formData as Allergy,
        id: Date.now().toString()
      };
      setAllergies([...allergies, newAllergy]);
    }
    
    setShowModal(false);
    setFormData({});
  };

  const getSeverityColor = (severite: string) => {
    switch (severite) {
      case 'Légère': return 'bg-green-100 text-green-800';
      case 'Modérée': return 'bg-yellow-100 text-yellow-800';
      case 'Sévère': return 'bg-orange-100 text-orange-800';
      case 'Critique': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (categorie: string) => {
    switch (categorie) {
      case 'Alimentaire': return 'bg-blue-100 text-blue-800';
      case 'Médicamenteuse': return 'bg-purple-100 text-purple-800';
      case 'Environnementale': return 'bg-green-100 text-green-800';
      case 'Autre': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Inactif': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severite: string) => {
    switch (severite) {
      case 'Légère': return <Shield className="h-4 w-4 text-green-500" />;
      case 'Modérée': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Sévère': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'Critique': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const categories = ['Alimentaire', 'Médicamenteuse', 'Environnementale', 'Autre'];
  const severities = ['Légère', 'Modérée', 'Sévère', 'Critique'];
  const statuses = ['Actif', 'Inactif'];

  const columns = [
    {
      key: 'allergie',
      label: 'Allergie',
      render: (allergy: Allergy) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{allergy.nomAllergie}</div>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getCategoryColor(allergy.categorie)}`}>
              {allergy.categorie}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'severite',
      label: 'Sévérité',
      render: (allergy: Allergy) => (
        <div className="flex items-center space-x-2">
          {getSeverityIcon(allergy.severite)}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(allergy.severite)}`}>
            {allergy.severite}
          </span>
        </div>
      )
    },
    {
      key: 'patients',
      label: 'Patients Affectés',
      render: (allergy: Allergy) => (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900">{allergy.patientsAfectes}</span>
        </div>
      )
    },
    {
      key: 'symptomes',
      label: 'Symptômes Principaux',
      render: (allergy: Allergy) => (
        <div className="space-y-1">
          {allergy.symptomes.slice(0, 2).map((symptome, index) => (
            <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {symptome}
            </div>
          ))}
          {allergy.symptomes.length > 2 && (
            <div className="text-xs text-gray-500">
              +{allergy.symptomes.length - 2} autres
            </div>
          )}
        </div>
      )
    },
    {
      key: 'interdictions',
      label: 'Ingrédients Interdits',
      render: (allergy: Allergy) => (
        <div className="space-y-1">
          {allergy.ingredientsInterdits.slice(0, 2).map((ingredient, index) => (
            <div key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              {ingredient}
            </div>
          ))}
          {allergy.ingredientsInterdits.length > 2 && (
            <div className="text-xs text-gray-500">
              +{allergy.ingredientsInterdits.length - 2} autres
            </div>
          )}
        </div>
      )
    },
    {
      key: 'substituts',
      label: 'Substituts',
      render: (allergy: Allergy) => (
        <div className="space-y-1">
          {allergy.substituts.slice(0, 2).map((substitut, index) => (
            <div key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {substitut}
            </div>
          ))}
          {allergy.substituts.length > 2 && (
            <div className="text-xs text-gray-500">
              +{allergy.substituts.length - 2} autres
            </div>
          )}
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (allergy: Allergy) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(allergy.statut)}`}>
          {allergy.statut}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (allergy: Allergy) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(allergy)}
            className="text-blue-600 hover:text-blue-800"
            title="Voir détails"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditAllergy(allergy)}
            className="text-green-600 hover:text-green-800"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteAllergy(allergy.id)}
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
    total: allergies.length,
    actives: allergies.filter(a => a.statut === 'Actif').length,
    critiques: allergies.filter(a => a.severite === 'Critique').length,
    totalPatients: allergies.reduce((sum, a) => sum + a.patientsAfectes, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Allergies</h1>
        <button
          onClick={handleAddAllergy}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle Allergie</span>
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
            <AlertTriangle className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actives</p>
              <p className="text-2xl font-bold text-green-600">{stats.actives}</p>
            </div>
            <Shield className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critiques</p>
              <p className="text-2xl font-bold text-red-600">{stats.critiques}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Patients Affectés</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalPatients}</p>
            </div>
            <Users className="h-8 w-8 text-purple-400" />
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
                placeholder="Rechercher une allergie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes sévérités</option>
              {severities.map(severity => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous statuts</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <div className="text-sm text-gray-500">
              {filteredAllergies.length} allergie(s) trouvée(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredAllergies}
          columns={columns}
          keyField="id"
        />
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingAllergy ? 'Modifier l\'Allergie' : 'Nouvelle Allergie'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations générales */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informations générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'allergie</label>
                    <input
                      type="text"
                      value={formData.nomAllergie || ''}
                      onChange={(e) => setFormData({...formData, nomAllergie: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      value={formData.categorie || 'Alimentaire'}
                      onChange={(e) => setFormData({...formData, categorie: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sévérité</label>
                    <select
                      value={formData.severite || 'Légère'}
                      onChange={(e) => setFormData({...formData, severite: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {severities.map(severity => (
                        <option key={severity} value={severity}>{severity}</option>
                      ))}
                    </select>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patients affectés</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.patientsAfectes || 0}
                      onChange={(e) => setFormData({...formData, patientsAfectes: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Symptômes et restrictions */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Symptômes et restrictions</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symptômes</label>
                    <input
                      type="text"
                      value={formData.symptomes?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, symptomes: e.target.value.split(', ').filter(s => s.trim())})}
                      placeholder="Séparer par des virgules"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingrédients interdits</label>
                    <input
                      type="text"
                      value={formData.ingredientsInterdits?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, ingredientsInterdits: e.target.value.split(', ').filter(i => i.trim())})}
                      placeholder="Séparer par des virgules"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plats interdits</label>
                    <input
                      type="text"
                      value={formData.platsInterdits?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, platsInterdits: e.target.value.split(', ').filter(p => p.trim())})}
                      placeholder="Séparer par des virgules"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Substituts recommandés</label>
                    <input
                      type="text"
                      value={formData.substituts?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, substituts: e.target.value.split(', ').filter(s => s.trim())})}
                      placeholder="Séparer par des virgules"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Précautions et notes */}
              <div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Précautions</label>
                    <textarea
                      value={formData.precautions || ''}
                      onChange={(e) => setFormData({...formData, precautions: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
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
                  {editingAllergy ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAllergy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                Détails - {selectedAllergy.nomAllergie}
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
                    <span className="text-sm font-medium text-gray-500">Catégorie:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedAllergy.categorie)}`}>
                      {selectedAllergy.categorie}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Sévérité:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(selectedAllergy.severite)}`}>
                      {selectedAllergy.severite}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Patients affectés:</span>
                    <span className="text-sm text-gray-900">{selectedAllergy.patientsAfectes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Statut:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedAllergy.statut)}`}>
                      {selectedAllergy.statut}
                    </span>
                  </div>
                </div>
              </div>

              {/* Symptômes */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-medium text-gray-900">Symptômes</h3>
                </div>
                
                <div className="space-y-2">
                  {selectedAllergy.symptomes.map((symptome, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-sm text-gray-900">{symptome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restrictions */}
              <div className="space-y-4 lg:col-span-2">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-medium text-gray-900">Restrictions et Substituts</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Ingrédients interdits:</h4>
                    <div className="space-y-1">
                      {selectedAllergy.ingredientsInterdits.map((ingredient, index) => (
                        <div key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {ingredient}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Substituts recommandés:</h4>
                    <div className="space-y-1">
                      {selectedAllergy.substituts.map((substitut, index) => (
                        <div key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {substitut}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Plats interdits:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedAllergy.platsInterdits.map((plat, index) => (
                      <div key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {plat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Précautions */}
              <div className="space-y-4 lg:col-span-2">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-medium text-gray-900">Précautions</h3>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-900">{selectedAllergy.precautions}</p>
                </div>

                {selectedAllergy.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Notes:</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{selectedAllergy.notes}</p>
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
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  handleEditAllergy(selectedAllergy);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllergyManagement;

