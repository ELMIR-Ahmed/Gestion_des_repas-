import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, UtensilsCrossed, Clock, Users, Star, AlertTriangle } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface Dish {
  id: string;
  nomPlat: string;
  description: string;
  categorie: 'Entrée' | 'Plat principal' | 'Dessert' | 'Collation';
  type: 'Standard' | 'Diabétique' | 'Sans sel' | 'Sans gluten' | 'Végétarien' | 'Mixé';
  ingredients: string[];
  allergenes: string[];
  valeurNutritionnelle: {
    calories: number;
    proteines: number;
    glucides: number;
    lipides: number;
    sodium: number;
  };
  tempsPreparation: number; // en minutes
  difficulte: 1 | 2 | 3 | 4 | 5;
  cout: number; // en euros
  popularite: number; // nombre de fois commandé
  statut: 'Actif' | 'Inactif' | 'Saisonnier';
  notes?: string;
  dateCreation: string;
}

const DishManagement: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([
    {
      id: '1',
      nomPlat: 'Saumon grillé aux légumes',
      description: 'Filet de saumon grillé accompagné de légumes de saison vapeur',
      categorie: 'Plat principal',
      type: 'Standard',
      ingredients: ['Saumon', 'Courgettes', 'Brocolis', 'Carottes', 'Huile d\'olive', 'Citron'],
      allergenes: ['Poisson'],
      valeurNutritionnelle: {
        calories: 320,
        proteines: 28,
        glucides: 12,
        lipides: 18,
        sodium: 180
      },
      tempsPreparation: 25,
      difficulte: 2,
      cout: 8.50,
      popularite: 45,
      statut: 'Actif',
      notes: 'Plat riche en oméga-3, adapté aux régimes cardiaques',
      dateCreation: '2025-01-15'
    },
    {
      id: '2',
      nomPlat: 'Compote de pommes sans sucre',
      description: 'Compote de pommes maison sans sucre ajouté',
      categorie: 'Dessert',
      type: 'Diabétique',
      ingredients: ['Pommes', 'Cannelle', 'Eau'],
      allergenes: [],
      valeurNutritionnelle: {
        calories: 85,
        proteines: 0.5,
        glucides: 22,
        lipides: 0.2,
        sodium: 2
      },
      tempsPreparation: 15,
      difficulte: 1,
      cout: 1.20,
      popularite: 32,
      statut: 'Actif',
      notes: 'Adapté aux diabétiques, riche en fibres',
      dateCreation: '2025-01-10'
    },
    {
      id: '3',
      nomPlat: 'Soupe de légumes mixée',
      description: 'Soupe de légumes variés finement mixée pour faciliter la déglutition',
      categorie: 'Entrée',
      type: 'Mixé',
      ingredients: ['Poireaux', 'Carottes', 'Pommes de terre', 'Courgettes', 'Bouillon de légumes'],
      allergenes: [],
      valeurNutritionnelle: {
        calories: 95,
        proteines: 3,
        glucides: 18,
        lipides: 1.5,
        sodium: 220
      },
      tempsPreparation: 30,
      difficulte: 2,
      cout: 2.80,
      popularite: 28,
      statut: 'Actif',
      notes: 'Texture adaptée aux troubles de déglutition',
      dateCreation: '2025-01-12'
    },
    {
      id: '4',
      nomPlat: 'Salade quinoa sans gluten',
      description: 'Salade fraîche de quinoa avec légumes croquants et vinaigrette',
      categorie: 'Plat principal',
      type: 'Sans gluten',
      ingredients: ['Quinoa', 'Tomates cerises', 'Concombre', 'Avocat', 'Huile d\'olive', 'Citron'],
      allergenes: [],
      valeurNutritionnelle: {
        calories: 280,
        proteines: 12,
        glucides: 35,
        lipides: 14,
        sodium: 95
      },
      tempsPreparation: 20,
      difficulte: 1,
      cout: 4.20,
      popularite: 18,
      statut: 'Actif',
      notes: 'Riche en protéines végétales, sans gluten',
      dateCreation: '2025-01-08'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState<Partial<Dish>>({});

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.nomPlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || dish.categorie === categoryFilter;
    const matchesType = !typeFilter || dish.type === typeFilter;
    const matchesStatus = !statusFilter || dish.statut === statusFilter;
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleAddDish = () => {
    setEditingDish(null);
    setFormData({
      nomPlat: '',
      description: '',
      categorie: 'Plat principal',
      type: 'Standard',
      ingredients: [],
      allergenes: [],
      valeurNutritionnelle: {
        calories: 0,
        proteines: 0,
        glucides: 0,
        lipides: 0,
        sodium: 0
      },
      tempsPreparation: 0,
      difficulte: 1,
      cout: 0,
      popularite: 0,
      statut: 'Actif',
      notes: '',
      dateCreation: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setFormData(dish);
    setShowModal(true);
  };

  const handleDeleteDish = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      setDishes(dishes.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDish) {
      setDishes(dishes.map(d => 
        d.id === editingDish.id ? { ...formData as Dish, id: editingDish.id } : d
      ));
    } else {
      const newDish: Dish = {
        ...formData as Dish,
        id: Date.now().toString()
      };
      setDishes([...dishes, newDish]);
    }
    
    setShowModal(false);
    setFormData({});
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Inactif': return 'bg-red-100 text-red-800';
      case 'Saisonnier': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Standard': return 'bg-gray-100 text-gray-800';
      case 'Diabétique': return 'bg-blue-100 text-blue-800';
      case 'Sans sel': return 'bg-purple-100 text-purple-800';
      case 'Sans gluten': return 'bg-orange-100 text-orange-800';
      case 'Végétarien': return 'bg-green-100 text-green-800';
      case 'Mixé': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const categories = ['Entrée', 'Plat principal', 'Dessert', 'Collation'];
  const types = ['Standard', 'Diabétique', 'Sans sel', 'Sans gluten', 'Végétarien', 'Mixé'];
  const statuses = ['Actif', 'Inactif', 'Saisonnier'];

  const columns = [
    {
      key: 'plat',
      label: 'Plat',
      render: (dish: Dish) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <UtensilsCrossed className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{dish.nomPlat}</div>
            <div className="text-sm text-gray-500 max-w-xs truncate">{dish.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (dish: Dish) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{dish.categorie}</div>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getTypeColor(dish.type)}`}>
            {dish.type}
          </span>
        </div>
      )
    },
    {
      key: 'nutrition',
      label: 'Nutrition',
      render: (dish: Dish) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{dish.valeurNutritionnelle.calories} kcal</div>
          <div className="text-xs text-gray-500">
            P: {dish.valeurNutritionnelle.proteines}g | 
            G: {dish.valeurNutritionnelle.glucides}g | 
            L: {dish.valeurNutritionnelle.lipides}g
          </div>
          {dish.valeurNutritionnelle.sodium > 200 && (
            <div className="text-xs text-orange-600 flex items-center space-x-1 mt-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Sodium élevé</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'preparation',
      label: 'Préparation',
      render: (dish: Dish) => (
        <div className="text-center">
          <div className="flex items-center space-x-1 mb-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{dish.tempsPreparation} min</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            {getDifficultyStars(dish.difficulte)}
          </div>
        </div>
      )
    },
    {
      key: 'popularite',
      label: 'Popularité',
      render: (dish: Dish) => (
        <div className="text-center">
          <div className="flex items-center space-x-1 mb-1">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">{dish.popularite}</span>
          </div>
          <div className="text-xs text-gray-500">commandes</div>
        </div>
      )
    },
    {
      key: 'cout',
      label: 'Coût',
      render: (dish: Dish) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">{dish.cout.toFixed(2)} €</div>
        </div>
      )
    },
    {
      key: 'allergenes',
      label: 'Allergènes',
      render: (dish: Dish) => (
        <div className="space-y-1">
          {dish.allergenes.length > 0 ? (
            dish.allergenes.slice(0, 2).map((allergen, index) => (
              <div key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{allergen}</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-500">Aucun</span>
          )}
          {dish.allergenes.length > 2 && (
            <div className="text-xs text-gray-500">
              +{dish.allergenes.length - 2} autres
            </div>
          )}
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (dish: Dish) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dish.statut)}`}>
          {dish.statut}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (dish: Dish) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditDish(dish)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteDish(dish.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: dishes.length,
    actifs: dishes.filter(d => d.statut === 'Actif').length,
    moyenneCalories: Math.round(dishes.reduce((sum, d) => sum + d.valeurNutritionnelle.calories, 0) / dishes.length),
    coutMoyen: (dishes.reduce((sum, d) => sum + d.cout, 0) / dishes.length).toFixed(2)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Plats</h1>
        <button
          onClick={handleAddDish}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau Plat</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Plats</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <UtensilsCrossed className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Plats Actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
            </div>
            <UtensilsCrossed className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Calories Moy.</p>
              <p className="text-2xl font-bold text-blue-600">{stats.moyenneCalories}</p>
            </div>
            <Star className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Coût Moyen</p>
              <p className="text-2xl font-bold text-purple-600">{stats.coutMoyen} €</p>
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
                placeholder="Rechercher un plat..."
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
              {filteredDishes.length} plat(s) trouvé(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredDishes}
          columns={columns}
          keyField="id"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingDish ? 'Modifier le Plat' : 'Nouveau Plat'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations générales */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informations générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat</label>
                    <input
                      type="text"
                      value={formData.nomPlat || ''}
                      onChange={(e) => setFormData({...formData, nomPlat: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      value={formData.categorie || 'Plat principal'}
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
                      value={formData.type || 'Standard'}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
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

              {/* Valeurs nutritionnelles */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Valeurs nutritionnelles</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

              {/* Autres informations */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temps de préparation (min)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.tempsPreparation || 0}
                      onChange={(e) => setFormData({...formData, tempsPreparation: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté (1-5)</label>
                    <select
                      value={formData.difficulte || 1}
                      onChange={(e) => setFormData({...formData, difficulte: parseInt(e.target.value) as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coût (€)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cout || 0}
                      onChange={(e) => setFormData({...formData, cout: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingrédients</label>
                    <input
                      type="text"
                      value={formData.ingredients?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, ingredients: e.target.value.split(', ').filter(ing => ing.trim())})}
                      placeholder="Séparer par des virgules"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

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
                  {editingDish ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishManagement;

