import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Importamos el nuevo componente
import Dashboard from './components/Dashboard';
import GestionUsuarios from './components/GestionUsuarios';
import GestionRolesPermisos from './components/GestionRolesPermisos';
import Bitacora from './components/Bitacora';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* El Dashboard lo haremos después */}
       <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/administracion/usuarios" element={<GestionUsuarios />} />
        <Route path="/administracion/roles-permisos" element={<GestionRolesPermisos />} />
        <Route path="/bitacora" element={<Bitacora />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;