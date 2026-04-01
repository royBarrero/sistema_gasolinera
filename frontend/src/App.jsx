import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import GestionUsuarios from './components/GestionUsuarios';
import GestionRolesPermisos from './components/GestionRolesPermisos';
import Bitacora from './components/Bitacora';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/administracion/usuarios" element={<ProtectedRoute><GestionUsuarios /></ProtectedRoute>} />
        <Route path="/administracion/roles-permisos" element={<ProtectedRoute><GestionRolesPermisos /></ProtectedRoute>} />
        <Route path="/bitacora" element={<ProtectedRoute><Bitacora /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;