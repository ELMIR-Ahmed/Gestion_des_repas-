import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, Leaf, Droplets } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface Ingredient {
  id: string;
  nomIngredient: string;
  categorie: 'Légumes' | 'Fruits' | 'Viandes' | 'Poissons' | 'Céréales' | 'Légumineuses' | 'Produits laitiers' | 'Épices' | 'Huiles' | 'Autres';
  typeIngredient: 'Frais' | 'Surgelé' | 'Conserve' | 'Sec' | 'Liquide';
  valeurNutritionnelle: {
    calories: number; // pour 100g
    proteines: number;
    glucides: number;
    lipides: number;
    fibres: number;
    sodium: number;
  };
  allergenes: string[];
  saisonnier: boolean;
  saisonDisponible?: string[];
  coutUnitaire: number; // en euros par kg ou litre
  fournisseur: string;
  dureeConservation: number; // en jours
  conditionsStockage: string;
  statut: 'Disponible' | 'Rupture' | 'Saisonnier indisponible';
  notes?: string;
  dateAjout: string;
}

const IngredientManagement: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: '1',
      nomIngredient: 'Saumon frais',
      categorie: 'Poissons',
      typeIngredient: 'Frais',
      valeurNutritionnelle: {
        calories: 208,
        proteines: 25.4,
        glucides: 0,
        lipides: 12.4,
        fibres: 0,
        sodium: 59
      },
      allergenes: ['Poisson'],
      saisonnier: false,
      coutUnitaire: 18.50,
      fournisseur: 'Poissonnerie Atlantique',
      dureeConservation: 2,
      conditionsStockage: 'Réfrigéré 0-4°C',
      statut: 'Disponible',
      notes: 'Riche en oméga-3, excellente source de protéines',
      dateAjout: '2025-01-15'
    },
    {
      id: '2',
      nomIngredient: 'Courgettes',
      categorie: 'Légumes',
      typeIngredient: 'Frais',
      valeurNutritionnelle: {
        calories: 17,
        proteines: 1.2,
        glucides: 3.1,
        lipides: 0.3,
        fibres: 1.0,
        sodium: 8
      },
      allergenes: [],
      saisonnier: true,
      saisonDisponible: ['Printemps', 'Été', 'Automne'],
      coutUnitaire: 2.80,
      fournisseur: 'Maraîchers Locaux',
      dureeConservation: 7,
      conditionsStockage: 'Réfrigéré 8-12°C',
      statut: 'Disponible',
      notes: 'Légume peu calorique, riche en eau',
      dateAjout: '2025-01-10'
    },
    {
      id: '3',
      nomIngredient: 'Quinoa',
      categorie: 'Céréales',
      typeIngredient: 'Sec',
      valeurNutritionnelle: {
        calories: 368,
        proteines: 14.1,
        glucides: 57.2,
        lipides: 6.1,
        fibres: 7.0,
        sodium: 5
      },
      allergenes: [],
      saisonnier: false,
      coutUnitaire: 8.20,
      fournisseur: 'Bio Distribution',
      dureeConservation: 365,
      conditionsStockage: 'Sec, température ambiante',
      statut: 'Disponible',
      notes: 'Pseudo-céréale sans gluten, protéines complètes',
      dateAjout: '2025-01-08'
    },
    {
      id: '4',
      nomIngredient: 'Lait écrémé',
      categorie: 'Produits laitiers',
      typeIngredient: 'Liquide',
      valeurNutritionnelle: {
        calories: 34,
        proteines: 3.4,
        glucides: 5.0,
        lipides: 0.1,
        fibres: 0,
        sodium: 44
      },
      allergenes: ['Lait'],
      saisonnier: false,
      coutUnitaire: 1.20,
      fournisseur: 'Laiterie Centrale',
      dureeConservation: 7,
      conditionsStockage: 'Réfrigéré 0-4°C',
      statut: 'Disponible',
      notes: 'Source de calcium et protéines, faible en matières grasses',
      dateAjout: '2025-01-12'
    },
    {
      id: '5',
      nomIngredient: 'Fraises',
      categorie: 'Fruits',
      typeIngredient: 'Frais',
      valeurNutritionnelle: {
        calories: 32,
        proteines: 0.7,
        glucides: 7.7,
        lipides: 0.3,
        fibres: 2.0,
        sodium: 1
      },
      allergenes: [],
      saisonnier: true,
      saisonDisponible: ['Printemps', 'Été'],
      coutUnitaire: 6.50,
      fournisseur: 'Producteurs Régionaux',
      dureeConservation: 3,
      conditionsStockage: 'Réfrigéré 0-4°C',
      statut: 'Saisonnier indisponible',
      notes: 'Riche en vitamine C et antioxydants',
      dateAjout: '2025-01-05'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState<Partial<Ingredient>>({});

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.nomIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ingredient.categorie.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || ingredient.categorie === categoryFilter;
    const matchesType = !typeFilter || ingredient.typeIngredient === typeFilter;
    const matchesStatus = !statusFilter || ingredient.statut === statusFilter;
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleAddIngredient = () => {
    setEditingIngredient(null);
    setFormData({
      nomIngredient: '',
      categorie: 'Légumes',
      typeIngredient: 'Frais',
      valeurNutritionnelle: {
        calories: 0,
        proteines: 0,
        glucides: 0,
        lipides: 0,
        fibres: 0,
        sodium: 0
      },
      allergenes: [],
      saisonnier: false,
      saisonDisponible: [],
      coutUnitaire: 0,
      fournisseur: '',
      dureeConservation: 0,
      conditionsStockage: '',
      statut: 'Disponible',
      notes: '',
      dateAjout: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData(ingredient);
    setShowModal(true);
  };

  const handleDeleteIngredient = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet ingrédient ?')) {
      setIngredients(ingredients.filter(i => i.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingIngredient) {
      setIngredients(ingredients.map(i => 
        i.id === editingIngredient.id ? { ...formData as Ingredient, id: editingIngredient.id } : i
      ));
    } else {
      const newIngredient: Ingredient = {
        ...formData as Ingredient,
        id: Date.now().toString()
      };
      setIngredients([...ingredients, newIngredient]);
    }
    
    setShowModal(false);
    setFormData({});
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'Rupture': return 'bg-red-100 text-red-800';
      case 'Saisonnier indisponible': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (categorie: string) => {
    switch (categorie) {
      case 'Légumes': return 'bg-green-100 text-green-800';
      case 'Fruits': return 'bg-red-100 text-red-800';
      case 'Viandes': return 'bg-red-100 text-red-800';
      case 'Poissons': return 'bg-blue-100 text-blue-800';
      case 'Céréales': return 'bg-yellow-100 text-yellow-800';
      case 'Légumineuses': return 'bg-orange-100 text-orange-800';
      case 'Produits laitiers': return 'bg-purple-100 text-purple-800';
      case 'Épices': return 'bg-pink-100 text-pink-800';
      case 'Huiles': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Frais': return <Leaf className="h-4 w-4 text-green-500" />;
      case 'Surgelé': return <Package className="h-4 w-4 text-blue-500" />;
      case 'Conserve': return <Package className="h-4 w-4 text-orange-500" />;
      case 'Sec': return <Package className="h-4 w-4 text-brown-500" />;
      case 'Liquide': return <Droplets className="h-4 w-4 text-blue-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const categories = ['Légumes', 'Fruits', 'Viandes', 'Poissons', 'Céréales', 'Légumineuses', 'Produits laitiers', 'Épices', 'Huiles', 'Autres'];
  const types = ['Frais', 'Surgelé', 'Conserve', 'Sec', 'Liquide'];
  const statuses = ['Disponible', 'Rupture', 'Saisonnier indisponible'];
  const saisons = ['Printemps', 'Été', 'Automne', 'Hiver'];

  const columns = [
    {
      key: 'ingredient',
      label: 'Ingrédient',
      render: (ingredient: Ingredient) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Package className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{ingredient.nomIngredient}</div>
            <div className="text-sm text-gray-500">{ingredient.fournisseur}</div>
          </div>
        </div>
      )
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (ingredient: Ingredient) => (
        <div>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(ingredient.categorie)}`}>
            {ingredient.categorie}
          </span>
          <div className="flex items-center space-x-1 mt-1">
            {getTypeIcon(ingredient.typeIngredient)}
            <span className="text-xs text-gray-500">{ingredient.typeIngredient}</span>
          </div>
        </div>
      )
    },
    {
      key: 'nutrition',
      label: 'Nutrition (100g)',
      render: (ingredient: Ingredient) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{ingredient.valeurNutritionnelle.calories} kcal</div>
          <div className="text-xs text-gray-500">
            P: {ingredient.valeurNutritionnelle.proteines}g | 
            G: {ingredient.valeurNutritionnelle.glucides}g | 
            L: {ingredient.valeurNutritionnelle.lipides}g
          </div>
          {ingredient.valeurNutritionnelle.sodium > 100 && (
            <div className="text-xs text-orange-600 flex items-center space-x-1 mt-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Sodium élevé</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'cout',
      label: 'Coût',
      render: (ingredient: Ingredient) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">{ingredient.coutUnitaire.toFixed(2)} €</div>
          <div className="text-xs text-gray-500">par kg/L</div>
        </div>
      )
    },
    {
      key: 'conservation',
      label: 'Conservation',
      render: (ingredient: Ingredient) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{ingredient.dureeConservation} jours</div>
          <div className="text-xs text-gray-500 max-w-xs truncate">{ingredient.conditionsStockage}</div>
        </div>
      )
    },
    {
      key: 'saisonnier',
      label: 'Disponibilité',
      render: (ingredient: Ingredient) => (
        <div>
          {ingredient.saisonnier ? (
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <Leaf className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">Saisonnier</span>
              </div>
              <div className="text-xs text-gray-500">
                {ingredient.saisonDisponible?.join(', ')}
              </div>
            </div>
          ) : (
            <span className="text-xs text-gray-600">Toute l'année</span>
          )}
        </div>
      )
    },
    {
      key: 'allergenes',
      label: 'Allergènes',
      render: (ingredient: Ingredient) => (
        <div className="space-y-1">
          {ingredient.allergenes.length > 0 ? (
            ingredient.allergenes.slice(0, 2).map((allergen, index) => (
              <div key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{allergen}</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-500">Aucun</span>
          )}
          {ingredient.allergenes.length > 2 && (
            <div className="text-xs text-gray-500">
              +{ingredient.allergenes.length - 2} autres
            </div>
          )}
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (ingredient: Ingredient) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ingredient.statut)}`}>
          {ingredient.statut}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (ingredient: Ingredient) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditIngredient(ingredient)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteIngredient(ingredient.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: ingredients.length,
    disponibles: ingredients.filter(i => i.statut === 'Disponible').length,
    saisonniers: ingredients.filter(i => i.saisonnier).length,
    coutMoyen: (ingredients.reduce((sum, i) => sum + i.coutUnitaire, 0) / ingredients.length).toFixed(2)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Ingrédients</h1>
        <button
          onClick={handleAddIngredient}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvel Ingrédient</span>
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
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{stats.disponibles}</p>
            </div>
            <Package className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saisonniers</p>
              <p className="text-2xl font-bold text-orange-600">{stats.saisonniers}</p>
            </div>
            <Leaf className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Coût Moyen</p>
              <p className="text-2xl font-bold text-purple-600">{stats.coutMoyen} €</p>
            </div>
            <Package className="h-8 w-8 text-purple-400" />
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
                placeholder="Rechercher un ingrédient..."
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
              {filteredIngredients.length} ingrédient(s) trouvé(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredIngredients}
          columns={columns}
          keyField="id"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingIngredient ? 'Modifier l\'Ingrédient' : 'Nouvel Ingrédient'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations générales */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informations générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'ingrédient</label>
                    <input
                      type="text"
                      value={formData.nomIngredient || ''}
                      onChange={(e) => setFormData({...formData, nomIngredient: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                    <input
                      type="text"
                      value={formData.fournisseur || ''}
                      onChange={(e) => setFormData({...formData, fournisseur: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      value={formData.categorie || 'Légumes'}
                      onChange={(e) => setFormData({...formData, categorie: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.typeIngredient || 'Frais'}
                      onChange={(e) => setFormData({...formData, typeIngredient: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coût unitaire (€/kg ou L)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.coutUnitaire || 0}
                      onChange={(e) => setFormData({...formData, coutUnitaire: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      value={formData.statut || 'Disponible'}
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

              {/* Valeurs nutritionnelles */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Valeurs nutritionnelles (pour 100g)</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.valeurNutritionnelle?.calories || 0}
                      onChange={(e) => setFormData({
                        ...formData, 
                        valeurNutritionnelle: {
                          ...formData.valeurNutritionnelle,
                          calories: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Protéines (g)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.valeurNutritionnelle?.proteines || 0}
                      onChange={(e) => setFormData({
                        ...formData, 
                        valeurNutritionnelle: {
                          ...formData.valeurNutritionnelle,
                          proteines: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Glucides (g)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.valeurNutritionnelle?.glucides || 0}
                      onChange={(e) => setFormData({
                        ...formData, 
                        valeurNutritionnelle: {
                          ...formData.valeurNutritionnelle,
                          glucides: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lipides (g)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.valeurNutritionnelle?.lipides || 0}
                      onChange={(e) => setFormData({
                        ...formData, 
                        valeurNutritionnelle: {
                          ...formData.valeurNutritionnelle,
                          lipides: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fibres (g)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.valeurNutritionnelle?.fibres || 0}
                      onChange={(e) => setFormData({
                        ...formData, 
                        valeurNutritionnelle: {
                          ...formData.valeurNutritionnelle,
                          fibres: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sodium (mg)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.valeurNutritionnelle?.sodium || 0}
                      onChange={(e) => setFormData({
                        ...formData, 
                        valeurNutritionnelle: {
                          ...formData.valeurNutritionnelle,
                          sodium: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Conservation et saisonnalité */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Conservation et disponibilité</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durée de conservation (jours)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.dureeConservation || 0}
                      onChange={(e) => setFormData({...formData, dureeConservation: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conditions de stockage</label>
                    <input
                      type="text"
                      value={formData.conditionsStockage || ''}
                      onChange={(e) => setFormData({...formData, conditionsStockage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.saisonnier || false}
                      onChange={(e) => setFormData({...formData, saisonnier: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Ingrédient saisonnier</span>
                  </label>
                </div>

                {formData.saisonnier && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Saisons de disponibilité</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {saisons.map(saison => (
                        <label key={saison} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.saisonDisponible?.includes(saison) || false}
                            onChange={(e) => {
                              const currentSaisons = formData.saisonDisponible || [];
                              if (e.target.checked) {
                                setFormData({
                                  ...formData, 
                                  saisonDisponible: [...currentSaisons, saison]
                                });
                              } else {
                                setFormData({
                                  ...formData, 
                                  saisonDisponible: currentSaisons.filter(s => s !== saison)
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{saison}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Allergènes et notes */}
              <div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergènes</label>
                    <input
                      type="text"
                      value={formData.allergenes?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, allergenes: e.target.value.split(', ').filter(all => all.trim())})}
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
                  {editingIngredient ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientManagement;

