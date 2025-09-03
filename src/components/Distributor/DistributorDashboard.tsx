import React from 'react';
import { Truck, CheckCircle, Clock, MapPin, Users, Package } from 'lucide-react';

const DistributorDashboard: React.FC = () => {
  // Mock data - replace with actual API data
  const stats = [
    { 
      title: 'Livraisons en Attente', 
      value: '28', 
      icon: Clock, 
      color: 'bg-yellow-500',
      trend: 'À livrer maintenant'
    },
    { 
      title: 'Livraisons Complétées', 
      value: '156', 
      icon: CheckCircle, 
      color: 'bg-green-500',
      trend: 'Aujourd\'hui'
    },
    { 
      title: 'Patients à Servir', 
      value: '42', 
      icon: Users, 
      color: 'bg-blue-500',
      trend: 'Actifs'
    },
    { 
      title: 'Services Couverts', 
      value: '8', 
      icon: MapPin, 
      color: 'bg-purple-500',
      trend: 'Sur 8 services'
    },
  ];

  const pendingDeliveries = [
    {
      id: '1',
      patient: 'Marie Dupont',
      room: 'Ch. 204',
      service: 'Cardiologie',
      meal: 'Déjeuner',
      dishes: ['Blanquette de veau', 'Riz pilaf', 'Haricots verts'],
      time: '12:00',
      priority: 'high',
      allergies: ['Gluten']
    },
    {
      id: '2',
      patient: 'Jean Martin',
      room: 'Ch. 105',
      service: 'Neurologie',
      meal: 'Déjeuner',
      dishes: ['Soupe de légumes', 'Poisson grillé', 'Purée'],
      time: '12:15',
      priority: 'critical',
      allergies: ['Fruits de mer', 'Lactose']
    },
    {
      id: '3',
      patient: 'Sophie Leclerc',
      room: 'Ch. 308',
      service: 'Chirurgie',
      meal: 'Déjeuner',
      dishes: ['Salade verte', 'Poulet rôti', 'Légumes vapeur'],
      time: '12:30',
      priority: 'medium',
      allergies: []
    },
    {
      id: '4',
      patient: 'Pierre Moreau',
      room: 'Ch. 201',
      service: 'Pédiatrie',
      meal: 'Déjeuner',
      dishes: ['Compote', 'Jambon', 'Purée de carotte'],
      time: '12:45',
      priority: 'medium',
      allergies: ['Œufs']
    },
  ];

  const completedDeliveries = [
    { time: '11:45', patient: 'Anne Durand', room: 'Ch. 102', meal: 'Petit-déjeuner' },
    { time: '11:30', patient: 'Paul Leroy', room: 'Ch. 205', meal: 'Petit-déjeuner' },
    { time: '11:15', patient: 'Claire Moreau', room: 'Ch. 301', meal: 'Petit-déjeuner' },
    { time: '11:00', patient: 'Marc Dubois', room: 'Ch. 108', meal: 'Petit-déjeuner' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeliveryComplete = (deliveryId: string) => {
    // In a real app, this would make an API call
    console.log(`Marking delivery ${deliveryId} as completed`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Distributeur</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Deliveries */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Livraisons en Attente</h3>
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                <Clock className="h-3 w-3 mr-1" />
                {pendingDeliveries.length} en attente
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className={`border-2 rounded-lg p-4 ${getPriorityColor(delivery.priority)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{delivery.patient}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(delivery.priority)}`}>
                          {delivery.priority === 'critical' ? 'Critique' :
                           delivery.priority === 'high' ? 'Urgent' : 'Normal'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {delivery.room} - {delivery.service}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {delivery.time}
                        </span>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">{delivery.meal} :</p>
                        <div className="flex flex-wrap gap-1">
                          {delivery.dishes.map((dish, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {dish}
                            </span>
                          ))}
                        </div>
                      </div>
                      {delivery.allergies.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Package className="h-4 w-4 text-red-500" />
                          <span className="text-xs text-red-600 font-medium">
                            Allergies: {delivery.allergies.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeliveryComplete(delivery.id)}
                      className="ml-4 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Livré
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Completed Deliveries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Livraisons Récentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {completedDeliveries.map((delivery, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{delivery.patient}</p>
                    <p className="text-xs text-gray-500">{delivery.room} - {delivery.meal}</p>
                  </div>
                  <span className="text-xs text-gray-400">{delivery.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Truck className="h-8 w-8 text-blue-500 mb-2" />
            <p className="font-medium text-gray-900">Voir Itinéraire</p>
            <p className="text-sm text-gray-500">Optimiser les livraisons</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <MapPin className="h-8 w-8 text-green-500 mb-2" />
            <p className="font-medium text-gray-900">Localiser Salles</p>
            <p className="text-sm text-gray-500">Plan de l'hôpital</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Package className="h-8 w-8 text-purple-500 mb-2" />
            <p className="font-medium text-gray-900">Vérifier Plateaux</p>
            <p className="text-sm text-gray-500">Contrôle qualité</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <CheckCircle className="h-8 w-8 text-yellow-500 mb-2" />
            <p className="font-medium text-gray-900">Rapport Journalier</p>
            <p className="text-sm text-gray-500">Bilan des livraisons</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;