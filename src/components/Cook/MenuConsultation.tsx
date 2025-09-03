import React, { useState } from 'react';
import { Calendar, Clock, Users, ChefHat, CheckCircle, AlertCircle } from 'lucide-react';

const MenuConsultation: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMeal, setSelectedMeal] = useState('all');

  // Mock data - replace with actual API data
  const menus = [
    {
      id: '1',
      meal: 'Petit-déjeuner',
      time: '07:30',
      dishes: [
        {
          name: 'Pain grillé au beurre',
          portions: 45,
          ingredients: [
            { name: 'Pain de mie', quantity: '1.8 kg', available: true },
            { name: 'Beurre doux', quantity: '450 g', available: true },
          ],
          status: 'pending'
        },
        {
          name: 'Confiture de fraises',
          portions: 32,
          ingredients: [
            { name: 'Confiture fraises', quantity: '800 g', available: true },
          ],
          status: 'pending'
        },
        {
          name: 'Café au lait',
          portions: 38,
          ingredients: [
            { name: 'Café moulu', quantity: '200 g', available: true },
            { name: 'Lait entier', quantity: '1.5 L', available: false },
          ],
          status: 'pending'
        }
      ]
    },
    {
      id: '2',
      meal: 'Déjeuner',
      time: '12:00',
      dishes: [
        {
          name: 'Blanquette de veau',
          portions: 42,
          ingredients: [
            { name: 'Épaule de veau', quantity: '3.2 kg', available: true },
            { name: 'Carottes', quantity: '1.5 kg', available: true },
            { name: 'Oignons', quantity: '800 g', available: true },
            { name: 'Crème fraîche', quantity: '500 ml', available: true },
          ],
          status: 'in-progress'
        },
        {
          name: 'Riz pilaf',
          portions: 42,
          ingredients: [
            { name: 'Riz basmati', quantity: '1.2 kg', available: true },
            { name: 'Bouillon de légumes', quantity: '2 L', available: true },
          ],
          status: 'completed'
        },
        {
          name: 'Haricots verts',
          portions: 35,
          ingredients: [
            { name: 'Haricots verts', quantity: '2 kg', available: true },
            { name: 'Beurre', quantity: '100 g', available: true },
          ],
          status: 'pending'
        }
      ]
    },
    {
      id: '3',
      meal: 'Dîner',
      time: '19:00',
      dishes: [
        {
          name: 'Soupe de légumes',
          portions: 40,
          ingredients: [
            { name: 'Courgettes', quantity: '1.5 kg', available: true },
            { name: 'Pommes de terre', quantity: '1 kg', available: true },
            { name: 'Poireaux', quantity: '800 g', available: true },
          ],
          status: 'pending'
        },
        {
          name: 'Omelette aux fines herbes',
          portions: 38,
          ingredients: [
            { name: 'Œufs', quantity: '114 unités', available: true },
            { name: 'Fines herbes', quantity: '50 g', available: true },
            { name: 'Beurre', quantity: '200 g', available: true },
          ],
          status: 'pending'
        }
      ]
    }
  ];

  const meals = ['all', 'Petit-déjeuner', 'Déjeuner', 'Collation', 'Dîner'];

  const filteredMenus = selectedMeal === 'all' 
    ? menus 
    : menus.filter(menu => menu.meal === selectedMeal);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <ChefHat className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const updateDishStatus = (menuId: string, dishIndex: number, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating dish status: Menu ${menuId}, Dish ${dishIndex}, Status: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Consultation des Menus</h1>
        <div className="text-sm text-gray-500">
          Planning de préparation
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repas
            </label>
            <select
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {meals.map(meal => (
                <option key={meal} value={meal}>
                  {meal === 'all' ? 'Tous les repas' : meal}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Menus */}
      <div className="space-y-6">
        {filteredMenus.map((menu) => (
          <div key={menu.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">{menu.meal}</h3>
                  <span className="text-sm text-gray-500">{menu.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{menu.dishes.reduce((acc, dish) => acc + dish.portions, 0)} portions totales</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {menu.dishes.map((dish, dishIndex) => (
                  <div key={dishIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{dish.name}</h4>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dish.status)}`}>
                            {getStatusIcon(dish.status)}
                            <span className="ml-1 capitalize">
                              {dish.status === 'completed' ? 'Terminé' :
                               dish.status === 'in-progress' ? 'En cours' : 
                               'À préparer'}
                            </span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          <Users className="h-4 w-4 inline mr-1" />
                          {dish.portions} portions à préparer
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {dish.status === 'pending' && (
                          <button
                            onClick={() => updateDishStatus(menu.id, dishIndex, 'in-progress')}
                            className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
                          >
                            Commencer
                          </button>
                        )}
                        {dish.status === 'in-progress' && (
                          <button
                            onClick={() => updateDishStatus(menu.id, dishIndex, 'completed')}
                            className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
                          >
                            Terminer
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Ingrédients nécessaires :</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {dish.ingredients.map((ingredient, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2 rounded text-sm ${
                              ingredient.available
                                ? 'bg-green-50 text-green-800'
                                : 'bg-red-50 text-red-800'
                            }`}
                          >
                            <span className="font-medium">{ingredient.name}</span>
                            <div className="flex items-center space-x-2">
                              <span>{ingredient.quantity}</span>
                              {ingredient.available ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMenus.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun menu trouvé pour les critères sélectionnés.</p>
        </div>
      )}
    </div>
  );
};

export default MenuConsultation;