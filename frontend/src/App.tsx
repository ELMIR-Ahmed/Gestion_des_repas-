import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout/Layout';
import LoginPage from './components/Auth/LoginPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';
import PatientManagement from './components/Admin/PatientManagement';
import BedManagement from './components/Admin/BedManagement';
import RoomManagement from './components/Admin/RoomManagement';
import ServiceManagement from './components/Admin/ServiceManagement';
import DieteticienDashboard from './components/Dieteticien/DieteticienDashboard';
import MyPatients from './components/Dieteticien/MyPatients';
import DishManagement from './components/Dieteticien/DishManagement';
import IngredientManagement from './components/Dieteticien/IngredientManagement';
import AllergyManagement from './components/Dieteticien/AllergyManagement';
import MenuManagement from './components/Dieteticien/MenuManagement';
import MenuConsultation from './components/Cook/MenuConsultation';
import DistributorDashboard from './components/Distributor/DistributorDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'dieteticien': return '/dieteticien/dashboard';
      case 'cuisinier': return '/cook/menus';
      case 'distributeur': return '/distributor/dashboard';
      default: return '/login';
    }
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        {/* Admin routes */}
        <Route path="admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="admin/patients" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PatientManagement />
          </ProtectedRoute>
        } />
        <Route path="admin/lits" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <BedManagement />
          </ProtectedRoute>
        } />
        <Route path="admin/salles" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <RoomManagement />
          </ProtectedRoute>
        } />
        <Route path="admin/services" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ServiceManagement />
          </ProtectedRoute>
        } />

        {/* Dietitian routes */}
        <Route path="dieteticien/dashboard" element={
          <ProtectedRoute allowedRoles={['dieteticien']}>
            <DieteticienDashboard />
          </ProtectedRoute>
        } />
        <Route path="dieteticien/mes-patients" element={
          <ProtectedRoute allowedRoles={['dieteticien']}>
            <MyPatients />
          </ProtectedRoute>
        } />
        <Route path="dieteticien/plats" element={
          <ProtectedRoute allowedRoles={['dieteticien']}>
            <DishManagement />
          </ProtectedRoute>
        } />
        <Route path="dieteticien/ingredients" element={
          <ProtectedRoute allowedRoles={['dieteticien']}>
            <IngredientManagement />
          </ProtectedRoute>
        } />
        <Route path="dieteticien/allergies" element={
          <ProtectedRoute allowedRoles={['dieteticien']}>
            <AllergyManagement />
          </ProtectedRoute>
        } />
        <Route path="dieteticien/menus" element={
          <ProtectedRoute allowedRoles={['dieteticien']}>
            <MenuManagement />
          </ProtectedRoute>
        } />

        {/* Cook routes */}
        <Route path="cook/menus" element={
          <ProtectedRoute allowedRoles={['cuisinier']}>
            <MenuConsultation />
          </ProtectedRoute>
        } />

        {/* Distributor routes */}
        <Route path="distributor/dashboard" element={
          <ProtectedRoute allowedRoles={['distributeur']}>
            <DistributorDashboard />
          </ProtectedRoute>
        } />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;