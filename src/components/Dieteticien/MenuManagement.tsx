import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, UtensilsCrossed, Users, AlertTriangle, Copy, Eye } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface MenuItem {
  id: string;
  plat: string;
  categorie: 'Entrée' | 'Plat principal' | 'Dessert' | 'Collation';
  calories: number;
  allergenes: string[];
}

interface Menu {
  id: string;
  nomMenu: string;
  typeMenu: 'Standard' | 'Spécifique';
  service?: string; // Pour les menus standards
  patientId?: string; // Pour les menus spécifiques
  patientNom?: string; // Pour les menus spécifiques
  dateDebut: string;
  dateFin: string;
  repas: {
    petitDejeuner: MenuItem[];
    dejeuner: MenuItem[];
    collation: MenuItem[];
    diner: MenuItem[];
  };
  restrictionsAppliquees: string[];
  allergiesConsiderees: string[];
  valeurNutritionnelle: {
    caloriesTotal: number;
    proteines: number;
    glucides: number;
    lipides: number;
  };
  statut: 'Brouillon' | 'Validé' | 'Actif' | 'Archivé';
  notes?: string;
  creePar: string;
  dateCreation: string;
}

const MenuManagement: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([
    {
      id: '1',
      nomMenu: 'Menu Standard Cardiologie',
      typeMenu: 'Standard',
      service: 'Cardiologie',
      dateDebut: '2025-01-27',
      dateFin: '2025-02-02',
      repas: {
        petitDejeuner: [
          { id: '1', plat: 'Porridge aux fruits', categorie: 'Plat principal', calories: 250, allergenes: ['Avoine'] },
          { id: '2', plat: 'Thé vert', categorie: 'Collation', calories: 5, allergenes: [] }
        ],
        dejeuner: [
          { id: '3', plat: 'Salade de quinoa', categorie: 'Entrée', calories: 180, allergenes: [] },
          { id: '4', plat: 'Saumon grillé aux légumes', categorie: 'Plat principal', calories: 320, allergenes: ['Poisson'] },
          { id: '5', plat: 'Compote de pommes', categorie: 'Dessert', calories: 85, allergenes: [] }
        ],
        collation: [
          { id: '6', plat: 'Yaourt nature', categorie: 'Collation', calories: 60, allergenes: ['Lait'] }
        ],
        diner: [
          { id: '7', plat: 'Soupe de légumes', categorie: 'Entrée', calories: 95, allergenes: [] },
          { id: '8', plat: 'Blanc de poulet aux herbes', categorie: 'Plat principal', calories: 280, allergenes: [] },
          { id: '9', plat: 'Salade de fruits', categorie: 'Dessert', calories: 120, allergenes: [] }
        ]
      },
      restrictionsAppliquees: ['Hyposodé', 'Pauvre en graisses saturées'],
      allergiesConsiderees: [],
      valeurNutritionnelle: {
        caloriesTotal: 1395,
        proteines: 85,
        glucides: 165,
        lipides: 45
      },
      statut: 'Actif',
      notes: 'Menu adapté aux pathologies cardiovasculaires',
      creePar: 'Dr. Marie Dubois',
      dateCreation: '2025-01-20'
    },
    {
      id: '2',
      nomMenu: 'Menu Spécifique - Marie Dupont',
      typeMenu: 'Spécifique',
      patientId: '1',
      patientNom: 'Marie Dupont',
      dateDebut: '2025-01-25',
      dateFin: '2025-01-31',
      repas: {
        petitDejeuner: [
          { id: '10', plat: 'Pain sans gluten grillé', categorie: 'Plat principal', calories: 180, allergenes: [] },
          { id: '11', plat: 'Confiture sans sucre', categorie: 'Collation', calories: 25, allergenes: [] },
          { id: '12', plat: 'Café décaféiné', categorie: 'Collation', calories: 5, allergenes: [] }
        ],
        dejeuner: [
          { id: '13', plat: 'Avocat vinaigrette', categorie: 'Entrée', calories: 160, allergenes: [] },
          { id: '14', plat: 'Escalope de dinde grillée', categorie: 'Plat principal', calories: 250, allergenes: [] },
          { id: '15', plat: 'Riz basmati', categorie: 'Plat principal', calories: 130, allergenes: [] },
          { id: '16', plat: 'Mousse au chocolat sans sucre', categorie: 'Dessert', calories: 95, allergenes: ['Lait', 'Œufs'] }
        ],
        collation: [
          { id: '17', plat: 'Amandes non salées', categorie: 'Collation', calories: 80, allergenes: ['Fruits à coque'] }
        ],
        diner: [
          { id: '18', plat: 'Gaspacho de légumes', categorie: 'Entrée', calories: 65, allergenes: [] },
          { id: '19', plat: 'Cabillaud au four', categorie: 'Plat principal', calories: 200, allergenes: ['Poisson'] },
          { id: '20', plat: 'Purée de brocolis', categorie: 'Plat principal', calories: 85, allergenes: [] },
          { id: '21', plat: 'Fromage blanc 0%', categorie: 'Dessert', calories: 45, allergenes: ['Lait'] }
        ]
      },
      restrictionsAppliquees: ['Diabétique', 'Sans fruits de mer'],
      allergiesConsiderees: ['Fruits de mer'],
      valeurNutritionnelle: {
        caloriesTotal: 1320,
        proteines: 78,
        glucides: 145,
        lipides: 42
      },
      statut: 'Validé',
      notes: 'Menu personnalisé pour diabète type 2 et allergie aux fruits de mer',
      creePar: 'Dr. Marie Dubois',
      dateCreation: '2025-01-22'
    },
    {
      id: '3',
      nomMenu: 'Menu Standard Neurologie',
      typeMenu: 'Standard',
      service: 'Neurologie',
      dateDebut: '2025-01-27',
      dateFin: '2025-02-02',
      repas: {
        petitDejeuner: [
          { id: '22', plat: 'Smoothie aux fruits mixés', categorie: 'Plat principal', calories: 220, allergenes: ['Lait'] },
          { id: '23', plat: 'Biscuits mous', categorie: 'Collation', calories: 120, allergenes: ['Gluten', 'Œufs'] }
        ],
        dejeuner: [
          { id: '24', plat: 'Velouté de carottes', categorie: 'Entrée', calories: 110, allergenes: [] },
          { id: '25', plat: 'Hachis de bœuf aux légumes', categorie: 'Plat principal', calories: 350, allergenes: [] },
          { id: '26', plat: 'Purée de pommes de terre', categorie: 'Plat principal', calories: 150, allergenes: ['Lait'] },
          { id: '27', plat: 'Crème dessert vanille', categorie: 'Dessert', calories: 130, allergenes: ['Lait', 'Œufs'] }
        ],
        collation: [
          { id: '28', plat: 'Compote mixée', categorie: 'Collation', calories: 70, allergenes: [] }
        ],
        diner: [
          { id: '29', plat: 'Potage de poireaux', categorie: 'Entrée', calories: 85, allergenes: [] },
          { id: '30', plat: 'Filet de sole meunière mixé', categorie: 'Plat principal', calories: 240, allergenes: ['Poisson'] },
          { id: '31', plat: 'Épinards à la crème', categorie: 'Plat principal', calories: 95, allergenes: ['Lait'] },
          { id: '32', plat: 'Flan aux œufs', categorie: 'Dessert', calories: 140, allergenes: ['Lait', 'Œufs'] }
        ]
      },
      restrictionsAppliquees: ['Texture mixée', 'Facile à déglutir'],
      allergiesConsiderees: [],
      valeurNutritionnelle: {
        caloriesTotal: 1710,
        proteines: 92,
        glucides: 185,
        lipides: 68
      },
      statut: 'Validé',
      notes: 'Menu adapté aux troubles de déglutition',
      creePar: 'Dr. Pierre Martin',
      dateCreation: '2025-01-18'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState<Partial<Menu>>({});

  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.nomMenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (menu.service && menu.service.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (menu.patientNom && menu.patientNom.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !typeFilter || menu.typeMenu === typeFilter;
    const matchesStatus = !statusFilter || menu.statut === statusFilter;
    const matchesService = !serviceFilter || menu.service === serviceFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesService;
  });

  const handleAddMenu = () => {
    setEditingMenu(null);
    setFormData({
      nomMenu: '',
      typeMenu: 'Standard',
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      repas: {
        petitDejeuner: [],
        dejeuner: [],
        collation: [],
        diner: []
      },
      restrictionsAppliquees: [],
      allergiesConsiderees: [],
      valeurNutritionnelle: {
        caloriesTotal: 0,
        proteines: 0,
        glucides: 0,
        lipides: 0
      },
      statut: 'Brouillon',
      notes: '',
      creePar: 'Dr. Marie Dubois',
      dateCreation: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setFormData(menu);
    setShowModal(true);
  };

  const handleViewDetails = (menu: Menu) => {
    setSelectedMenu(menu);
    setShowDetailModal(true);
  };

  const handleDuplicateMenu = (menu: Menu) => {
    const duplicatedMenu: Menu = {
      ...menu,
      id: Date.now().toString(),
      nomMenu: `${menu.nomMenu} (Copie)`,
      statut: 'Brouillon',
      dateCreation: new Date().toISOString().split('T')[0],
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setMenus([...menus, duplicatedMenu]);
  };

  const handleDeleteMenu = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) {
      setMenus(menus.filter(m => m.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMenu) {
      setMenus(menus.map(m => 
        m.id === editingMenu.id ? { ...formData as Menu, id: editingMenu.id } : m
      ));
    } else {
      const newMenu: Menu = {
        ...formData as Menu,
        id: Date.now().toString()
      };
      setMenus([...menus, newMenu]);
    }
    
    setShowModal(false);
    setFormData({});
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Brouillon': return 'bg-gray-100 text-gray-800';
      case 'Validé': return 'bg-blue-100 text-blue-800';
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Archivé': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Spécifique': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const types = ['Standard', 'Spécifique'];
  const statuses = ['Brouillon', 'Validé', 'Actif', 'Archivé'];
  const services = ['Cardiologie', 'Neurologie', 'Chirurgie', 'Pédiatrie', 'Urgences'];

  const columns = [
    {
      key: 'menu',
      label: 'Menu',
      render: (menu: Menu) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <UtensilsCrossed className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{menu.nomMenu}</div>
            <div className="text-sm text-gray-500">
              {menu.typeMenu === 'Standard' ? `Service: ${menu.service}` : `Patient: ${menu.patientNom}`}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (menu: Menu) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(menu.typeMenu)}`}>
          {menu.typeMenu}
        </span>
      )
    },
    {
      key: 'periode',
      label: 'Période',
      render: (menu: Menu) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div className="text-sm">
            <div>{new Date(menu.dateDebut).toLocaleDateString('fr-FR')}</div>
            <div className="text-gray-500">au {new Date(menu.dateFin).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>
      )
    },
    {
      key: 'nutrition',
      label: 'Nutrition',
      render: (menu: Menu) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{menu.valeurNutritionnelle.caloriesTotal} kcal</div>
          <div className="text-xs text-gray-500">
            P: {menu.valeurNutritionnelle.proteines}g | 
            G: {menu.valeurNutritionnelle.glucides}g | 
            L: {menu.valeurNutritionnelle.lipides}g
          </div>
        </div>
      )
    },
    {
      key: 'restrictions',
      label: 'Restrictions',
      render: (menu: Menu) => (
        <div className="space-y-1">
          {menu.restrictionsAppliquees.slice(0, 2).map((restriction, index) => (
            <div key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {restriction}
            </div>
          ))}
          {menu.restrictionsAppliquees.length > 2 && (
            <div className="text-xs text-gray-500">
              +{menu.restrictionsAppliquees.length - 2} autres
            </div>
          )}
          {menu.allergiesConsiderees.length > 0 && (
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">{menu.allergiesConsiderees.length} allergie(s)</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (menu: Menu) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(menu.statut)}`}>
          {menu.statut}
        </span>
      )
    },
    {
      key: 'createur',
      label: 'Créé par',
      render: (menu: Menu) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{menu.creePar}</div>
          <div className="text-gray-500">{new Date(menu.dateCreation).toLocaleDateString('fr-FR')}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (menu: Menu) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(menu)}
            className="text-blue-600 hover:text-blue-800"
            title="Voir détails"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditMenu(menu)}
            className="text-green-600 hover:text-green-800"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDuplicateMenu(menu)}
            className="text-purple-600 hover:text-purple-800"
            title="Dupliquer"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteMenu(menu.id)}
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
    total: menus.length,
    standards: menus.filter(m => m.typeMenu === 'Standard').length,
    specifiques: menus.filter(m => m.typeMenu === 'Spécifique').length,
    actifs: menus.filter(m => m.statut === 'Actif').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Menus</h1>
        <button
          onClick={handleAddMenu}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau Menu</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Menus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <UtensilsCrossed className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Standards</p>
              <p className="text-2xl font-bold text-blue-600">{stats.standards}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Spécifiques</p>
              <p className="text-2xl font-bold text-purple-600">{stats.specifiques}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-400" />
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
                placeholder="Rechercher un menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous services</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
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
              {filteredMenus.length} menu(s) trouvé(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredMenus}
          columns={columns}
          keyField="id"
        />
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingMenu ? 'Modifier le Menu' : 'Nouveau Menu'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations générales */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informations générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du menu</label>
                    <input
                      type="text"
                      value={formData.nomMenu || ''}
                      onChange={(e) => setFormData({...formData, nomMenu: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de menu</label>
                    <select
                      value={formData.typeMenu || 'Standard'}
                      onChange={(e) => setFormData({...formData, typeMenu: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {formData.typeMenu === 'Standard' && (
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
                  )}

                  {formData.typeMenu === 'Spécifique' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                      <input
                        type="text"
                        value={formData.patientNom || ''}
                        onChange={(e) => setFormData({...formData, patientNom: e.target.value})}
                        placeholder="Nom du patient"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                    <input
                      type="date"
                      value={formData.dateDebut || ''}
                      onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                    <input
                      type="date"
                      value={formData.dateFin || ''}
                      onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      value={formData.statut || 'Brouillon'}
                      onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Restrictions et allergies */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Restrictions et allergies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restrictions appliquées</label>
                    <input
                      type="text"
                      value={formData.restrictionsAppliquees?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, restrictionsAppliquees: e.target.value.split(', ').filter(r => r.trim())})}
                      placeholder="Séparer par des virgules"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergies considérées</label>
                    <input
                      type="text"
                      value={formData.allergiesConsiderees?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, allergiesConsiderees: e.target.value.split(', ').filter(a => a.trim())})}
                      placeholder="Séparer par des virgules"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Notes sur le menu, instructions spéciales..."
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
                  {editingMenu ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                Détails - {selectedMenu.nomMenu}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-medium text-gray-900">Informations Générales</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedMenu.typeMenu)}`}>
                      {selectedMenu.typeMenu}
                    </span>
                  </div>
                  
                  {selectedMenu.service && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Service:</span>
                      <span className="text-sm text-gray-900">{selectedMenu.service}</span>
                    </div>
                  )}
                  
                  {selectedMenu.patientNom && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Patient:</span>
                      <span className="text-sm text-gray-900">{selectedMenu.patientNom}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Période:</span>
                    <div className="text-sm text-gray-900 text-right">
                      <div>{new Date(selectedMenu.dateDebut).toLocaleDateString('fr-FR')}</div>
                      <div>au {new Date(selectedMenu.dateFin).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Statut:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedMenu.statut)}`}>
                      {selectedMenu.statut}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Créé par:</span>
                    <div className="text-sm text-gray-900 text-right">
                      <div>{selectedMenu.creePar}</div>
                      <div className="text-gray-500">{new Date(selectedMenu.dateCreation).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                </div>

                {/* Valeurs nutritionnelles */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Valeurs Nutritionnelles</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Calories totales:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedMenu.valeurNutritionnelle.caloriesTotal} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Protéines:</span>
                      <span className="text-sm text-gray-900">{selectedMenu.valeurNutritionnelle.proteines}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Glucides:</span>
                      <span className="text-sm text-gray-900">{selectedMenu.valeurNutritionnelle.glucides}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Lipides:</span>
                      <span className="text-sm text-gray-900">{selectedMenu.valeurNutritionnelle.lipides}g</span>
                    </div>
                  </div>
                </div>

                {/* Restrictions et allergies */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Restrictions</h4>
                  <div className="space-y-2">
                    {selectedMenu.restrictionsAppliquees.map((restriction, index) => (
                      <div key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {restriction}
                      </div>
                    ))}
                  </div>
                  
                  {selectedMenu.allergiesConsiderees.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Allergies considérées:</h5>
                      <div className="space-y-1">
                        {selectedMenu.allergiesConsiderees.map((allergie, index) => (
                          <div key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{allergie}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Repas détaillés */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-medium text-gray-900">Composition des Repas</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Petit-déjeuner */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Petit-déjeuner</h4>
                    <div className="space-y-2">
                      {selectedMenu.repas.petitDejeuner.map((item, index) => (
                        <div key={index} className="bg-white p-2 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.plat}</div>
                              <div className="text-xs text-gray-500">{item.categorie}</div>
                            </div>
                            <div className="text-xs text-gray-600">{item.calories} kcal</div>
                          </div>
                          {item.allergenes.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.allergenes.map((allergen, idx) => (
                                <span key={idx} className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Déjeuner */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Déjeuner</h4>
                    <div className="space-y-2">
                      {selectedMenu.repas.dejeuner.map((item, index) => (
                        <div key={index} className="bg-white p-2 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.plat}</div>
                              <div className="text-xs text-gray-500">{item.categorie}</div>
                            </div>
                            <div className="text-xs text-gray-600">{item.calories} kcal</div>
                          </div>
                          {item.allergenes.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.allergenes.map((allergen, idx) => (
                                <span key={idx} className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collation */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Collation</h4>
                    <div className="space-y-2">
                      {selectedMenu.repas.collation.map((item, index) => (
                        <div key={index} className="bg-white p-2 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.plat}</div>
                              <div className="text-xs text-gray-500">{item.categorie}</div>
                            </div>
                            <div className="text-xs text-gray-600">{item.calories} kcal</div>
                          </div>
                          {item.allergenes.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.allergenes.map((allergen, idx) => (
                                <span key={idx} className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dîner */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Dîner</h4>
                    <div className="space-y-2">
                      {selectedMenu.repas.diner.map((item, index) => (
                        <div key={index} className="bg-white p-2 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.plat}</div>
                              <div className="text-xs text-gray-500">{item.categorie}</div>
                            </div>
                            <div className="text-xs text-gray-600">{item.calories} kcal</div>
                          </div>
                          {item.allergenes.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.allergenes.map((allergen, idx) => (
                                <span key={idx} className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedMenu.notes && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Notes:</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{selectedMenu.notes}</p>
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
                  handleEditMenu(selectedMenu);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Modifier
              </button>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  handleDuplicateMenu(selectedMenu);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Dupliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;

