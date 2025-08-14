import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Bed, UserCheck, ChefHat, UtensilsCrossed, Truck, Settings, Guitar as Hospital, CalendarDays, Package, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: Home, label: 'Tableau de bord' },
          { to: '/admin/users', icon: Users, label: 'Gestion des utilisateurs' },
          { to: '/admin/patients', icon: UserCheck, label: 'Gestion des patients' },
          { to: '/admin/lits', icon: Bed, label: 'Gestion des lits' },
          { to: '/admin/salles', icon: Hospital, label: 'Gestion des salles' },
          { to: '/admin/services', icon: Settings, label: 'Gestion des services' },
        ];
      case 'dieteticien':
        return [
          { to: '/dieteticien/dashboard', icon: Home, label: 'Tableau de bord' },
          { to: '/dieteticien/mes-patients', icon: UserCheck, label: 'Mes patients' },
          { to: '/dieteticien/plats', icon: UtensilsCrossed, label: 'Gestion des plats' },
          { to: '/dieteticien/ingredients', icon: Package, label: 'Gestion des ingrédients' },
          { to: '/dieteticien/allergies', icon: AlertTriangle, label: 'Gestion des allergies' },
          { to: '/dieteticien/menus', icon: CalendarDays, label: 'Gestion des menus' },
        ];
      case 'cuisinier':
        return [
          { to: '/cook/menus', icon: ChefHat, label: 'Consulter menus' },
        ];
      case 'distributeur':
        return [
          { to: '/distributor/dashboard', icon: Home, label: 'Tableau de bord' },
          { to: '/distributor/deliveries', icon: Truck, label: 'Validation des livraisons' },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Nutrix</span>
          </div>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © 2025 Hospital Meal System v1.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;