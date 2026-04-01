import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestionar la autenticación
 * Verifica localStorage directamente en lugar de mantener estado
 */
export const useAuth = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Solo marca como cargado después del primer render
        setLoading(false);
    }, []);

    // ✅ SIEMPRE lee de localStorage (no cachea el estado)
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const usuarioJSON = typeof window !== 'undefined' ? localStorage.getItem('usuario') : null;
    
    let usuario = null;
    try {
        usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
    } catch (e) {
        console.error('Error parsing usuario:', e);
    }

    const isAuthenticated = !!token && !!usuario;

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('usuario');
        // Fuerza re-render
        window.location.href = '/login';
    };

    return {
        usuario,
        isAuthenticated,
        loading,
        logout,
    };
};