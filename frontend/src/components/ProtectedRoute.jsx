import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Componente que protege rutas requiriendo autenticación
 * Si no hay sesión válida, redirige al login
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    useEffect(() => {
        // ✅ Si no está autenticado después de cargar, redirige
        if (!loading && !isAuthenticated) {
            setRedirectToLogin(true);
        }
    }, [loading, isAuthenticated]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Cargando...</p>
                </div>
            </div>
        );
    }

    if (redirectToLogin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
