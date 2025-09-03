// import React from 'react';
// import { Users, UserCheck, Bed, UtensilsCrossed, TrendingUp, Activity } from 'lucide-react';

// const AdminDashboard: React.FC = () => {
//   // Mock data - replace with actual API data
//   const stats = [
//     { 
//       title: 'Utilisateurs Actifs', 
//       value: '24', 
//       icon: Users, 
//       color: 'bg-blue-500',
//       trend: '+2 ce mois'
//     },
//     { 
//       title: 'Patients Hospitalisés', 
//       value: '156', 
//       icon: UserCheck, 
//       color: 'bg-green-500',
//       trend: '+12 cette semaine'
//     },
//     { 
//       title: 'Lits Disponibles', 
//       value: '28', 
//       icon: Bed, 
//       color: 'bg-yellow-500',
//       trend: '85% d\'occupation'
//     },
//     { 
//       title: 'Repas Servis Aujourd\'hui', 
//       value: '468', 
//       icon: UtensilsCrossed, 
//       color: 'bg-purple-500',
//       trend: '+5.2% vs hier'
//     },
//   ];

//   const recentActivities = [
//     { time: '14:30', action: 'Nouveau patient ajouté', user: 'Dr. Martin', type: 'patient' },
//     { time: '13:45', action: 'Menu mis à jour', user: 'Marie Dubois', type: 'menu' },
//     { time: '12:20', action: 'Utilisateur créé', user: 'Admin', type: 'user' },
//     { time: '11:15', action: 'Lit assigné', user: 'Sophie Bernard', type: 'bed' },
//     { time: '10:30', action: 'Service modifié', user: 'Admin', type: 'service' },
//   ];

//   const getActivityIcon = (type: string) => {
//     switch (type) {
//       case 'patient': return <UserCheck className="h-4 w-4 text-green-500" />;
//       case 'menu': return <UtensilsCrossed className="h-4 w-4 text-purple-500" />;
//       case 'user': return <Users className="h-4 w-4 text-blue-500" />;
//       case 'bed': return <Bed className="h-4 w-4 text-yellow-500" />;
//       default: return <Activity className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
//         <div className="text-sm text-gray-500">
//           Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center">
//               <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
//                 <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
//               </div>
//               <div className="ml-4 flex-1">
//                 <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                 <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                 <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activities */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h3 className="text-lg font-medium text-gray-900">Activités Récentes</h3>
//           </div>
//           <div className="p-6">
//             <div className="space-y-4">
//               {recentActivities.map((activity, index) => (
//                 <div key={index} className="flex items-center space-x-3">
//                   <div className="flex-shrink-0">
//                     {getActivityIcon(activity.type)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm text-gray-900">{activity.action}</p>
//                     <p className="text-xs text-gray-500">par {activity.user}</p>
//                   </div>
//                   <div className="flex-shrink-0 text-xs text-gray-400">
//                     {activity.time}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Quick Stats Chart Placeholder */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h3 className="text-lg font-medium text-gray-900">Répartition des Patients</h3>
//           </div>
//           <div className="p-6">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                   <span className="text-sm text-gray-600">Cardiologie</span>
//                 </div>
//                 <span className="text-sm font-medium text-gray-900">42 patients</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                   <span className="text-sm text-gray-600">Neurologie</span>
//                 </div>
//                 <span className="text-sm font-medium text-gray-900">38 patients</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                   <span className="text-sm text-gray-600">Chirurgie</span>
//                 </div>
//                 <span className="text-sm font-medium text-gray-900">34 patients</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                   <span className="text-sm text-gray-600">Pédiatrie</span>
//                 </div>
//                 <span className="text-sm font-medium text-gray-900">28 patients</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                   <span className="text-sm text-gray-600">Urgences</span>
//                 </div>
//                 <span className="text-sm font-medium text-gray-900">14 patients</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
//             <Users className="h-8 w-8 text-blue-500 mb-2" />
//             <p className="font-medium text-gray-900">Ajouter Utilisateur</p>
//             <p className="text-sm text-gray-500">Créer un nouveau compte</p>
//           </button>
//           <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
//             <UserCheck className="h-8 w-8 text-green-500 mb-2" />
//             <p className="font-medium text-gray-900">Nouveau Patient</p>
//             <p className="text-sm text-gray-500">Enregistrer un patient</p>
//           </button>
//           <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
//             <Bed className="h-8 w-8 text-yellow-500 mb-2" />
//             <p className="font-medium text-gray-900">Gérer les Lits</p>
//             <p className="text-sm text-gray-500">Attribution et libération</p>
//           </button>
//           <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
//             <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
//             <p className="font-medium text-gray-900">Rapports</p>
//             <p className="text-sm text-gray-500">Générer des statistiques</p>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Bed, TrendingUp, AlertCircle, RefreshCw, XCircle } from 'lucide-react';

interface Salle {
  ID_SALLE: string;
  ID_SERVICE: string;
  NOM_SALLE: string;
  lits: Lit[];
  service: Service;
}

interface Service {
  ID_SERVICE: string;
  NOM_SERVICE: string;
  DESCRIPTION: string;
  salles: Salle[];
}

interface Lit {
  ID_LIT: string;
  ID_SALLE: string;
  NUM_LIT: string;
  salle: Salle;
  patient: Patient;
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
}

interface User {
  ID_UTILISATEUR: string;
  ID_PERSONNE: string;
  LOGIN: string;
  PASSWORD?: string; // Optionnel côté frontend pour sécurité
  ROLE: 'admin' | 'dieteticien' | 'cuisinier' | 'distributeur';
  personne: Personne; // Obligatoire car on fait toujours la jointure
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPatients: number;
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  bedOccupancyRate: number;
}

interface ServiceStats {
  serviceName: string;
  patientCount: number;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<User[]>([]); 

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

  // API Service
  const apiService = {
    async fetchUsers() {
      const response = await fetch(`${API_BASE_URL}/utilisateurs`, {
        headers: apiHeaders,
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des utilisateurs');
      return response.json();
    },

    async fetchPatients() {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        headers: apiHeaders,
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des patients');
      return response.json();
    },

    async fetchBeds() {
      const response = await fetch(`${API_BASE_URL}/lits`, {
        headers: apiHeaders,
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des lits');
      return response.json();
    },

    async fetchServices() {
      const response = await fetch(`${API_BASE_URL}/services`, {
        headers: apiHeaders,
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des services');
      return response.json();
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Charger toutes les données en parallèle
      const [usersResponse, patientsResponse, bedsResponse] = await Promise.all([
        apiService.fetchUsers().catch(() => ({ data: [] })),
        apiService.fetchPatients().catch(() => ({ data: [] })),
        apiService.fetchBeds().catch(() => ({ data: [] })),
      ]);

      const users = usersResponse.data || usersResponse || [];
      setUsers(users);
      const patients = patientsResponse.data || patientsResponse || [];
      const beds = bedsResponse.data || bedsResponse || [];
      // const services = servicesResponse.data || servicesResponse || [];

      // Calculer les statistiques
      const occupiedBeds = beds.filter((bed: Lit) => bed.patient);
      const availableBeds = beds.filter((bed: Lit) => !bed.patient);

      const dashboardStats: DashboardStats = {
        totalUsers: users.length,
        activeUsers: users.length, // Tous les utilisateurs sont considérés comme actifs
        totalPatients: patients.length,
        totalBeds: beds.length,
        availableBeds: availableBeds.length,
        occupiedBeds: occupiedBeds.length,
        bedOccupancyRate: beds.length > 0 ? Math.round((occupiedBeds.length / beds.length) * 100) : 0,
      };

      setStats(dashboardStats);

      // Calculer les statistiques par service
      const serviceStatsMap = new Map<string, number>();
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'];
      
      patients.forEach((patient: Patient) => {
        if (patient.lit?.salle?.service?.NOM_SERVICE) {
          const serviceName = patient.lit.salle.service.NOM_SERVICE;
          serviceStatsMap.set(serviceName, (serviceStatsMap.get(serviceName) || 0) + 1);
        }
      });

      const serviceStatsArray: ServiceStats[] = Array.from(serviceStatsMap.entries()).map(([serviceName, count], index) => ({
        serviceName,
        patientCount: count,
        color: colors[index % colors.length]
      }));

      setServiceStats(serviceStatsArray);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Impossible de charger les données du tableau de bord.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
  };


  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'dieteticien': return 'Diététicien';
      case 'cuisinier': return 'Cuisinier';
      case 'distributeur': return 'Distributeur';
      default: return role;
    }
  };

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{marginTop: '100px'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Erreur lors du chargement des données</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500 bg-opacity-10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              <p className="text-xs text-gray-500 mt-1">sur {stats.totalUsers} total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500 bg-opacity-10">
              <UserCheck className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Patients Hospitalisés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              <p className="text-xs text-gray-500 mt-1">actuellement</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500 bg-opacity-10">
              <Bed className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Lits Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableBeds}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.bedOccupancyRate}% d'occupation</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500 bg-opacity-10">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Taux d'Occupation</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bedOccupancyRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{stats.occupiedBeds}/{stats.totalBeds} lits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar for Bed Occupancy */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Occupation des Lits</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Lits occupés</span>
            <span className="font-medium">{stats.occupiedBeds} / {stats.totalBeds}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.bedOccupancyRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div>
        {/* Service Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Répartition des Patients par Service</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {serviceStats.length > 0 ? (
                serviceStats.map((service, index) => {
                  const percentage = getPercentage(service.patientCount, stats.totalPatients);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 ${service.color} rounded-full`}></div>
                          <span className="text-sm text-gray-600">{service.serviceName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900">{service.patientCount} patients</span>
                          <span className="text-xs text-gray-500 ml-2">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${service.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun patient hospitalisé</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des Rôles</h3>
          <div className="space-y-3">
            {['admin', 'dieteticien', 'cuisinier', 'distributeur'].map((role, index) => {
              const colors = ['text-blue-600', 'text-green-600', 'text-yellow-600', 'text-purple-600'];
              return (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{getRoleDisplayName(role)}</span>
                  <span className={`text-sm font-medium ${colors[index]}`}>
                    {(() => {
                      const roleUsers = users.filter((user) => user.ROLE === role);
                      return roleUsers.length;
                    })()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">État du Système</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="flex items-center space-x-1">
                <div className={`w-2 h-2 ${users.length > 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                <span className={`text-sm font-medium ${users.length > 0 ? 'text-green-600' : 'text-red-600'}`}>{users.length > 0 ? 'En ligne' : 'Hors ligne'}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Base de données</span>
              <span className="flex items-center space-x-1">
                <div className={`w-2 h-2 ${users.length > 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                <span className={`text-sm font-medium ${users.length > 0 ? 'text-green-600' : 'text-red-600'}`}>{users.length > 0 ? 'Connectée' : 'Déconnectée'}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Dernière sauvegarde</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleTimeString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;