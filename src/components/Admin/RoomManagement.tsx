// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Edit, Trash2, Building, Users, Bed, AlertCircle } from 'lucide-react';
// import DataTable from '../UI/DataTable';

// interface Salle {
//   ID_SALLE?: string;
//   ID_SERVICE: string;
//   NOM_SALLE: string;
//   lits?: Lit[];
//   service?: Service;
// }

// interface Service {
//   ID_SERVICE: string;
//   NOM_SERVICE: string;
//   DESCRIPTION: string;
//   salles?: Salle[];
// }

// interface Lit {
//   ID_LIT: string;
//   ID_SALLE: string;
//   NUM_LIT: string;
//   salle?: Salle;
//   patient?: Patient;
// }

// interface Personne {
//   ID_PERSONNE: string;
//   NOM: string;
//   PRENOM: string;
//   DATE_NAISSANCE: string;
//   GENRE: string;
//   TELEPHONE: string;
//   EMAIL: string;
// }

// interface Patient {
//   ID_PATIENT: string;
//   ID_PERSONNE: string;
//   ID_LIT: string;
//   DATE_ADMISSION: string;
//   personne?: Personne;
//   lit?: Lit;
// }

// const RoomManagement: React.FC = () => {
//   const [salles, setSalles] = useState<Salle[]>([]);
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [serviceFilter, setServiceFilter] = useState<string>('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingSalle, setEditingSalle] = useState<Salle | null>(null);
//   const [formData, setFormData] = useState<Partial<Salle>>({});
//   const [submitting, setSubmitting] = useState(false);

//   const API_BASE_URL = 'http://127.0.0.1:8000/api';

//   const fetchSalles = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/salles`);
//       if (!response.ok) {
//         throw new Error(`Erreur HTTP: ${response.status}`);
//       }
//       const data = await response.json();
      
//       // Enrichir avec les informations du service
//       const enrichedSalles = data.data.map((salle: Salle) => ({
//         ...salle,
//         service: services.find(s => s.ID_SERVICE === salle.ID_SERVICE)
//       }));
      
//       setSalles(enrichedSalles);
//       setError(null);
//     } catch (err) {
//       setError(`Erreur lors du chargement des salles: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
//       console.error('Erreur fetch salles:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchServices = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/services`);
//       if (!response.ok) {
//         throw new Error(`Erreur HTTP: ${response.status}`);
//       }
//       const data = await response.json();
//       setServices(data.data || data);
//     } catch (err) {
//       console.error('Erreur fetch services:', err);
//       setServices([]);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//     fetchSalles();
//   }, []);

//   const filteredSalles = salles.filter(salle => {
//     const matchesSearch = salle.NOM_SALLE.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           (salle.service && salle.service.NOM_SERVICE.toLowerCase().includes(searchTerm.toLowerCase()));
//     const matchesService = !serviceFilter || salle.ID_SERVICE === serviceFilter;
    
//     return matchesSearch && matchesService;
//   });

//   const handleAddSalle = () => {
//     setEditingSalle(null);
//     setFormData({
//       ID_SERVICE: '',
//       NOM_SALLE: ''
//     });
//     setShowModal(true);
//   };

//   const handleEditSalle = (salle: Salle) => {
//     setEditingSalle(salle);
//     setFormData({
//       ID_SERVICE: salle.ID_SERVICE,
//       NOM_SALLE: salle.NOM_SALLE
//     });
//     setShowModal(true);
//   };

//   const handleDeleteSalle = async (id: string) => {
//     if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/salles/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur HTTP: ${response.status}`);
//       }

//       await fetchSalles();
//     } catch (err) {
//       setError(`Erreur lors de la suppression: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.NOM_SALLE || !formData.ID_SERVICE) {
//       setError('Veuillez remplir tous les champs obligatoires');
//       return;
//     }
    
//     setSubmitting(true);
    
//     try {
//       const url = editingSalle 
//         ? `${API_BASE_URL}/salles/${editingSalle.ID_SALLE}`
//         : `${API_BASE_URL}/salles`;
      
//       const method = editingSalle ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ID_SERVICE: parseInt(formData.ID_SERVICE as string),
//           NOM_SALLE: formData.NOM_SALLE
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur HTTP: ${response.status}`);
//       }

//       await fetchSalles();
//       setShowModal(false);
//       setFormData({});
//       setError(null);
//     } catch (err) {
//       setError(`Erreur lors de la sauvegarde: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const columns = [
//     {
//       key: 'id',
//       label: 'ID',
//       render: (salle: Salle) => (
//         <span className="font-mono text-sm text-gray-600">#{salle.ID_SALLE}</span>
//       )
//     },
//     {
//       key: 'identification',
//       label: 'Identification',
//       render: (salle: Salle) => (
//         <div className="flex items-center space-x-2">
//           <Building className="h-5 w-5 text-gray-400" />
//           <div>
//             <div className="font-medium text-gray-900">{salle.NOM_SALLE}</div>
//             <div className="text-sm text-gray-500">{salle.service?.NOM_SERVICE || 'Service inconnu'}</div>
//           </div>
//         </div>
//       )
//     },
//     {
//       key: 'service',
//       label: 'Service',
//       render: (salle: Salle) => (
//         <div>
//           <div className="font-medium text-gray-900">{salle.service?.NOM_SERVICE || 'Service inconnu'}</div>
//           <div className="text-sm text-gray-500">{salle.service?.DESCRIPTION || ''}</div>
//           <div className="text-xs text-gray-400">ID: {salle.ID_SERVICE}</div>
//         </div>
//       )
//     },
//     {
//       key: 'occupation',
//       label: 'Lits',
//       render: (salle: Salle) => (
//         <div className="flex items-center space-x-2">
//           <Bed className="h-4 w-4 text-gray-400" />
//           <div>
//             <div className="font-medium text-blue-600">
//               {salle.lits ? salle.lits.length : 0} lits
//             </div>
//             <div className="text-xs text-gray-500">
//               {salle.lits ? salle.lits.filter(lit => lit.patient).length : 0} occupés
//             </div>
//           </div>
//         </div>
//       )
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (salle: Salle) => (
//         <div className="flex space-x-2">
//           <button
//             onClick={() => handleEditSalle(salle)}
//             className="text-blue-600 hover:text-blue-800 p-1"
//             title="Modifier"
//           >
//             <Edit className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => salle.ID_SALLE && handleDeleteSalle(salle.ID_SALLE)}
//             className="text-red-600 hover:text-red-800 p-1"
//             title="Supprimer"
//           >
//             <Trash2 className="h-4 w-4" />
//           </button>
//         </div>
//       )
//     }
//   ];

//   const stats = {
//     total: salles.length,
//     totalLits: salles.reduce((sum, salle) => sum + (salle.lits?.length || 0), 0),
//     litsOccupes: salles.reduce((sum, salle) => 
//       sum + (salle.lits?.filter(lit => lit.patient).length || 0), 0
//     ),
//     servicesActifs: new Set(salles.map(s => s.ID_SERVICE)).size
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Chargement des salles...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Gestion des Salles</h1>
//         <button
//           onClick={handleAddSalle}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
//         >
//           <Plus className="h-4 w-4" />
//           <span>Nouvelle Salle</span>
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
//           <AlertCircle className="h-5 w-5 text-red-500" />
//           <span className="text-red-700">{error}</span>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Salles</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//             </div>
//             <Building className="h-8 w-8 text-gray-400" />
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Services Actifs</p>
//               <p className="text-2xl font-bold text-blue-600">{stats.servicesActifs}</p>
//             </div>
//             <Users className="h-8 w-8 text-blue-400" />
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Lits</p>
//               <p className="text-2xl font-bold text-green-600">{stats.totalLits}</p>
//             </div>
//             <Bed className="h-8 w-8 text-green-400" />
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Taux d'Occupation</p>
//               <p className="text-2xl font-bold text-purple-600">
//                 {stats.totalLits > 0 ? Math.round((stats.litsOccupes / stats.totalLits) * 100) : 0}%
//               </p>
//             </div>
//             <Users className="h-8 w-8 text-purple-400" />
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Rechercher une salle..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
//               />
//             </div>
            
//             <select
//               value={serviceFilter}
//               onChange={(e) => setServiceFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Tous les services</option>
//               {services.map(service => (
//                 <option key={service.ID_SERVICE} value={service.ID_SERVICE}>
//                   {service.NOM_SERVICE}
//                 </option>
//               ))}
//             </select>

//             <div className="text-sm text-gray-500">
//               {filteredSalles.length} salle(s) trouvée(s)
//             </div>
//           </div>
//         </div>

//         <DataTable
//           data={filteredSalles}
//           columns={columns}
//           keyField="ID_SALLE"
//         />
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">
//               {editingSalle ? 'Modifier la Salle' : 'Nouvelle Salle'}
//             </h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Nom de la salle <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.NOM_SALLE || ''}
//                   onChange={(e) => setFormData({...formData, NOM_SALLE: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Ex: Salle 204, B12, etc."
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Service <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.ID_SERVICE || ''}
//                   onChange={(e) => setFormData({...formData, ID_SERVICE: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Sélectionner un service</option>
//                   {services.map(service => (
//                     <option key={service.ID_SERVICE} value={service.ID_SERVICE}>
//                       {service.NOM_SERVICE}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex justify-end space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   disabled={submitting}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={submitting || !formData.NOM_SALLE || !formData.ID_SERVICE}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
//                 >
//                   {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
//                   <span>{editingSalle ? 'Modifier' : 'Créer'}</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RoomManagement;


import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Building, Users, Bed, AlertCircle } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface Salle {
  ID_SALLE: string;
  ID_SERVICE: string;
  NOM_SALLE: string;
  lits?: Lit[];
  service?: Service;
}

interface Service {
  ID_SERVICE: string;
  NOM_SERVICE: string;
  DESCRIPTION: string;
  // salles?: Salle[];
}

interface Lit {
  ID_LIT: string;
  ID_SALLE: string;
  NUM_LIT: string;
  salle?: Salle;
  patient?: Patient;
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
  personne?: Personne;
  lit?: Lit;
}

const RoomManagement: React.FC = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingSalle, setEditingSalle] = useState<Salle | null>(null);
  const [formData, setFormData] = useState<Partial<Salle>>({});
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:8000/api';


  const fetchServices = async () => {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const data = await response.json();
    setServices(data.data);
    return data.data; // 👈 retourne les services
  };

  const fetchSalles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/salles`);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();


      const servicesData = await fetchServices(); // 👈 utiliser le retour
      const enrichedSalles = data.data.map((salle: Salle) => ({
        ...salle,
        service: servicesData.find((s: Service) => s.ID_SERVICE === salle.ID_SERVICE)
      }));
      setSalles(enrichedSalles);
      setError(null);
    } catch (err) {
      setError(`Erreur lors du chargement des salles: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchServices();
      await fetchSalles();
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredSalles = salles.filter(salle => {
    const matchesSearch =
      salle.NOM_SALLE.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (salle.service?.NOM_SERVICE?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesService = !serviceFilter || salle.service?.NOM_SERVICE === serviceFilter;
    return matchesSearch && matchesService;
  });

  const handleAddSalle = () => {
    setEditingSalle(null);
    setFormData({
      ID_SERVICE: '',
      NOM_SALLE: ''
    });
    setShowModal(true);
  };

  const handleEditSalle = (salle: Salle) => {
    setEditingSalle(salle);
    setFormData({
      ID_SERVICE: salle.ID_SERVICE,
      NOM_SALLE: salle.NOM_SALLE
    });
    setShowModal(true);
  };

  const handleDeleteSalle = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/salles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      await fetchSalles();
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

  const handleSubmit = async () => {
    if (!formData.NOM_SALLE || !formData.ID_SERVICE) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const url = editingSalle 
        ? `${API_BASE_URL}/salles/${editingSalle.ID_SALLE}`
        : `${API_BASE_URL}/salles`;
      
      const method = editingSalle ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID_SERVICE: parseInt(formData.ID_SERVICE as string),
          NOM_SALLE: formData.NOM_SALLE
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      await fetchSalles();
      setShowModal(false);
      setFormData({});
      setError(null);
    } catch (err) {
      setError(`Erreur lors de la sauvegarde: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'identification',
      label: 'Identification',
      render: (salle: Salle) => (
        <div className="flex items-center space-x-2 justify-center">
          <Building className="h-5 w-5 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">{salle.NOM_SALLE}</div>
            <div className="text-sm text-gray-500">{salle.service?.NOM_SERVICE || 'Service inconnu'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'service',
      label: 'Service',
      render: (salle: Salle) => (
        <div>
          <div className="font-medium text-gray-900">{salle.service?.NOM_SERVICE || 'Service inconnu'}</div>
          <div className="text-sm text-gray-500">{salle.service?.DESCRIPTION || ''}</div>
        </div>
      )
    },
    {
      key: 'occupation',
      label: 'Lits',
      render: (salle: Salle) => (
        <div className="flex items-center space-x-2 justify-center">
          <Bed className="h-4 w-4 text-gray-400" />
          <div>
            <div className="font-medium text-blue-600">
              {salle.lits ? salle.lits.length : 0} lits
            </div>
            <div className="text-xs text-gray-500">
              {salle.lits ? salle.lits.filter(lit => lit.patient).length : 0} occupés
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (salle: Salle) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => handleEditSalle(salle)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => salle.ID_SALLE && handleDeleteSalle(salle.ID_SALLE)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: salles.length,
    totalLits: salles.reduce((sum, salle) => sum + (salle.lits?.length || 0), 0),
    litsOccupes: salles.reduce((sum, salle) => 
      sum + (salle.lits?.filter(lit => lit.patient).length || 0), 0
    ),
    servicesActifs: new Set(salles.map(s => s.ID_SERVICE)).size
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Salles</h1>
        <button
          onClick={handleAddSalle}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle Salle</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Salles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Building className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Services Actifs</p>
              <p className="text-2xl font-bold text-blue-600">{stats.servicesActifs}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Lits</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalLits}</p>
            </div>
            <Bed className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux d'Occupation</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalLits > 0 ? Math.round((stats.litsOccupes / stats.totalLits) * 100) : 0}%
              </p>
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
                placeholder="Rechercher une salle..."
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
                <option key={service.ID_SERVICE} value={service.NOM_SERVICE}>
                  {service.NOM_SERVICE}
                </option>
              ))}
            </select>

            <div className="text-sm text-gray-500">
              {filteredSalles.length} salle(s) trouvée(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredSalles}
          columns={columns}
          keyField="ID_SALLE"
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingSalle ? 'Modifier la Salle' : 'Nouvelle Salle'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la salle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.NOM_SALLE || ''}
                  onChange={(e) => setFormData({...formData, NOM_SALLE: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Salle 204, B12, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.ID_SERVICE || ''}
                  onChange={(e) => setFormData({...formData, ID_SERVICE: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un service</option>
                  {services.map(service => (
                    <option key={service.ID_SERVICE} value={service.ID_SERVICE}>
                      {service.NOM_SERVICE}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !formData.NOM_SALLE || !formData.ID_SERVICE}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  <span>{editingSalle ? 'Modifier' : 'Créer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;