import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building, Users, Bed, MapPin } from 'lucide-react';
import DataTable from '../UI/DataTable';

interface Room {
  id: string;
  numSalle: string;
  service: string;
  capacite: number;
  litsOccupes: number;
  type: 'Standard' | 'Privée' | 'Soins intensifs' | 'Isolement';
  equipements: string[];
  notes?: string;
  statut: 'Active' | 'Maintenance' | 'Fermée';
}

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      numSalle: '204',
      service: 'Cardiologie',
      capacite: 2,
      litsOccupes: 1,
      type: 'Standard',
      equipements: ['Moniteur cardiaque', 'Défibrillateur', 'Oxygène'],
      notes: 'Salle équipée pour surveillance cardiaque',
      statut: 'Active'
    },
    {
      id: '2',
      numSalle: '105',
      service: 'Neurologie',
      capacite: 3,
      litsOccupes: 2,
      type: 'Soins intensifs',
      equipements: ['Moniteur neurologique', 'IRM portable', 'Ventilateur', 'Perfusion'],
      notes: 'Unité de soins intensifs neurologiques',
      statut: 'Active'
    },
    {
      id: '3',
      numSalle: '301',
      service: 'Chirurgie',
      capacite: 1,
      litsOccupes: 0,
      type: 'Privée',
      equipements: ['Moniteur vital', 'Perfusion', 'Télévision'],
      notes: 'Chambre privée post-opératoire',
      statut: 'Active'
    },
    {
      id: '4',
      numSalle: '150',
      service: 'Pédiatrie',
      capacite: 4,
      litsOccupes: 0,
      type: 'Standard',
      equipements: ['Moniteur pédiatrique', 'Jouets', 'Télévision'],
      notes: 'Salle adaptée aux enfants',
      statut: 'Maintenance'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.numSalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = !serviceFilter || room.service === serviceFilter;
    const matchesType = !typeFilter || room.type === typeFilter;
    const matchesStatus = !statusFilter || room.statut === statusFilter;
    
    return matchesSearch && matchesService && matchesType && matchesStatus;
  });

  const handleAddRoom = () => {
    setEditingRoom(null);
    setFormData({
      numSalle: '',
      service: '',
      capacite: 1,
      litsOccupes: 0,
      type: 'Standard',
      equipements: [],
      notes: '',
      statut: 'Active'
    });
    setShowModal(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setShowModal(true);
  };

  const handleDeleteRoom = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoom) {
      setRooms(rooms.map(r => 
        r.id === editingRoom.id ? { ...formData as Room, id: editingRoom.id } : r
      ));
    } else {
      const newRoom: Room = {
        ...formData as Room,
        id: Date.now().toString()
      };
      setRooms([...rooms, newRoom]);
    }
    
    setShowModal(false);
    setFormData({});
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Fermée': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Privée': return 'bg-purple-100 text-purple-800';
      case 'Soins intensifs': return 'bg-red-100 text-red-800';
      case 'Isolement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const rate = occupied / capacity;
    if (rate === 0) return 'text-green-600';
    if (rate < 0.7) return 'text-yellow-600';
    if (rate < 1) return 'text-orange-600';
    return 'text-red-600';
  };

  const services = ['Cardiologie', 'Neurologie', 'Chirurgie', 'Pédiatrie', 'Urgences'];
  const types = ['Standard', 'Privée', 'Soins intensifs', 'Isolement'];
  const statuses = ['Active', 'Maintenance', 'Fermée'];

  const columns = [
    {
      key: 'identification',
      label: 'Identification',
      render: (room: Room) => (
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">Salle {room.numSalle}</div>
            <div className="text-sm text-gray-500">{room.service}</div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (room: Room) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(room.type)}`}>
          {room.type}
        </span>
      )
    },
    {
      key: 'occupation',
      label: 'Occupation',
      render: (room: Room) => (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <div>
            <div className={`font-medium ${getOccupancyColor(room.litsOccupes, room.capacite)}`}>
              {room.litsOccupes}/{room.capacite}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round((room.litsOccupes / room.capacite) * 100)}% occupé
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'equipements',
      label: 'Équipements',
      render: (room: Room) => (
        <div className="space-y-1">
          {room.equipements.slice(0, 2).map((eq, index) => (
            <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {eq}
            </div>
          ))}
          {room.equipements.length > 2 && (
            <div className="text-xs text-gray-500">
              +{room.equipements.length - 2} autres
            </div>
          )}
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (room: Room) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(room.statut)}`}>
          {room.statut}
        </span>
      )
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (room: Room) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {room.notes || '-'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (room: Room) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditRoom(room)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteRoom(room.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: rooms.length,
    active: rooms.filter(r => r.statut === 'Active').length,
    totalCapacity: rooms.reduce((sum, r) => sum + r.capacite, 0),
    totalOccupied: rooms.reduce((sum, r) => sum + r.litsOccupes, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Salles</h1>
        <button
          onClick={handleAddRoom}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle Salle</span>
        </button>
      </div>

      {/* Statistics */}
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
              <p className="text-sm text-gray-600">Salles Actives</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Building className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Capacité Totale</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalCapacity}</p>
            </div>
            <Bed className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux d'Occupation</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((stats.totalOccupied / stats.totalCapacity) * 100)}%
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
                <option key={service} value={service}>{service}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <div className="text-sm text-gray-500">
              {filteredRooms.length} salle(s) trouvée(s)
            </div>
          </div>
        </div>

        <DataTable
          data={filteredRooms}
          columns={columns}
          keyField="id"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingRoom ? 'Modifier la Salle' : 'Nouvelle Salle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de salle</label>
                  <input
                    type="text"
                    value={formData.numSalle || ''}
                    onChange={(e) => setFormData({...formData, numSalle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacité (lits)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacite || 1}
                    onChange={(e) => setFormData({...formData, capacite: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lits occupés</label>
                  <input
                    type="number"
                    min="0"
                    max={formData.capacite || 1}
                    value={formData.litsOccupes || 0}
                    onChange={(e) => setFormData({...formData, litsOccupes: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.statut || 'Active'}
                    onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipements</label>
                <input
                  type="text"
                  value={formData.equipements?.join(', ') || ''}
                  onChange={(e) => setFormData({...formData, equipements: e.target.value.split(', ').filter(eq => eq.trim())})}
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
                  {editingRoom ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;

