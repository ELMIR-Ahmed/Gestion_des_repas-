import React from 'react';
import { Users, UserCheck, Bed, UtensilsCrossed, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock data - replace with actual API data
  const stats = [
    { 
      title: 'Utilisateurs Actifs', 
      value: '24', 
      icon: Users, 
      color: 'bg-blue-500',
      trend: '+2 ce mois'
    },
    { 
      title: 'Patients Hospitalisés', 
      value: '156', 
      icon: UserCheck, 
      color: 'bg-green-500',
      trend: '+12 cette semaine'
    },
    { 
      title: 'Lits Disponibles', 
      value: '28', 
      icon: Bed, 
      color: 'bg-yellow-500',
      trend: '85% d\'occupation'
    },
    { 
      title: 'Repas Servis Aujourd\'hui', 
      value: '468', 
      icon: UtensilsCrossed, 
      color: 'bg-purple-500',
      trend: '+5.2% vs hier'
    },
  ];

  const recentActivities = [
    { time: '14:30', action: 'Nouveau patient ajouté', user: 'Dr. Martin', type: 'patient' },
    { time: '13:45', action: 'Menu mis à jour', user: 'Marie Dubois', type: 'menu' },
    { time: '12:20', action: 'Utilisateur créé', user: 'Admin', type: 'user' },
    { time: '11:15', action: 'Lit assigné', user: 'Sophie Bernard', type: 'bed' },
    { time: '10:30', action: 'Service modifié', user: 'Admin', type: 'service' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'patient': return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'menu': return <UtensilsCrossed className="h-4 w-4 text-purple-500" />;
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'bed': return <Bed className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
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
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Activités Récentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">par {activity.user}</p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-400">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Répartition des Patients</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Cardiologie</span>
                </div>
                <span className="text-sm font-medium text-gray-900">42 patients</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Neurologie</span>
                </div>
                <span className="text-sm font-medium text-gray-900">38 patients</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Chirurgie</span>
                </div>
                <span className="text-sm font-medium text-gray-900">34 patients</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pédiatrie</span>
                </div>
                <span className="text-sm font-medium text-gray-900">28 patients</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Urgences</span>
                </div>
                <span className="text-sm font-medium text-gray-900">14 patients</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <p className="font-medium text-gray-900">Ajouter Utilisateur</p>
            <p className="text-sm text-gray-500">Créer un nouveau compte</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <UserCheck className="h-8 w-8 text-green-500 mb-2" />
            <p className="font-medium text-gray-900">Nouveau Patient</p>
            <p className="text-sm text-gray-500">Enregistrer un patient</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Bed className="h-8 w-8 text-yellow-500 mb-2" />
            <p className="font-medium text-gray-900">Gérer les Lits</p>
            <p className="text-sm text-gray-500">Attribution et libération</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
            <p className="font-medium text-gray-900">Rapports</p>
            <p className="text-sm text-gray-500">Générer des statistiques</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;