import React from 'react';
import { UserCheck, UtensilsCrossed, Calendar, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const DieteticienDashboard: React.FC = () => {
  // Mock data - replace with actual API data
  const stats = [
    { 
      title: 'Patients Assignés', 
      value: '32', 
      icon: UserCheck, 
      color: 'bg-blue-500',
      trend: '4 nouveaux ce mois'
    },
    { 
      title: 'Plats Disponibles', 
      value: '147', 
      icon: UtensilsCrossed, 
      color: 'bg-green-500',
      trend: '+8 cette semaine'
    },
    { 
      title: 'Menus en Attente', 
      value: '12', 
      icon: Clock, 
      color: 'bg-yellow-500',
      trend: 'À valider aujourd\'hui'
    },
    { 
      title: 'Allergies Détectées', 
      value: '7', 
      icon: AlertTriangle, 
      color: 'bg-red-500',
      trend: '2 critiques'
    },
  ];

  const urgentTasks = [
    { patient: 'Marie Dupont', room: 'Ch. 204', task: 'Menu diabétique à valider', priority: 'high', time: '14:00' },
    { patient: 'Jean Martin', room: 'Ch. 105', task: 'Allergie aux fruits de mer', priority: 'critical', time: '13:30' },
    { patient: 'Sophie Leclerc', room: 'Ch. 308', task: 'Régime sans gluten', priority: 'medium', time: '15:00' },
    { patient: 'Pierre Moreau', room: 'Ch. 201', task: 'Menu post-opératoire', priority: 'high', time: '16:00' },
  ];

  const todayMenus = [
    { meal: 'Petit-déjeuner', status: 'completed', patients: 32, time: '07:30' },
    { meal: 'Déjeuner', status: 'in-progress', patients: 32, time: '12:00' },
    { meal: 'Collation', status: 'pending', patients: 28, time: '16:00' },
    { meal: 'Dîner', status: 'pending', patients: 32, time: '19:00' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-yellow-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Diététicien</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Tâches Urgentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {urgentTasks.map((task, index) => (
                <div key={index} className={`p-3 border rounded-lg ${getPriorityColor(task.priority)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.patient}</p>
                      <p className="text-xs opacity-75">{task.room}</p>
                      <p className="text-sm mt-1">{task.task}</p>
                    </div>
                    <div className="text-xs opacity-75">
                      {task.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Menus */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Menus du Jour</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayMenus.map((menu, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(menu.status)}
                    <div>
                      <p className="font-medium text-sm text-gray-900">{menu.meal}</p>
                      <p className="text-xs text-gray-500">{menu.patients} patients</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getStatusColor(menu.status)}`}>
                      {menu.status === 'completed' ? 'Terminé' :
                       menu.status === 'in-progress' ? 'En cours' : 
                       'En attente'}
                    </p>
                    <p className="text-xs text-gray-500">{menu.time}</p>
                  </div>
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
            <UserCheck className="h-8 w-8 text-blue-500 mb-2" />
            <p className="font-medium text-gray-900">Mes Patients</p>
            <p className="text-sm text-gray-500">Voir tous les patients assignés</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <UtensilsCrossed className="h-8 w-8 text-green-500 mb-2" />
            <p className="font-medium text-gray-900">Créer un Plat</p>
            <p className="text-sm text-gray-500">Ajouter un nouveau plat</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Calendar className="h-8 w-8 text-purple-500 mb-2" />
            <p className="font-medium text-gray-900">Planifier Menu</p>
            <p className="text-sm text-gray-500">Créer un menu</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <p className="font-medium text-gray-900">Gérer Allergies</p>
            <p className="text-sm text-gray-500">Vérifier les restrictions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DieteticienDashboard;