import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import { Mail, Lock, Fuel, AlertCircle } from 'lucide-react';

const Login = () => {
    // Pre-rellenar con credenciales de desarrollo
    const [email, setEmail] = useState('test@ejemplo.com');
    const [password, setPassword] = useState('test123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        console.log('📤 Enviando login...', { email, password: '***' });
        
        // ✅ Limpiar tokens viejos/inválidos antes de intentar login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('usuario');
        console.log('🧹 localStorage limpiado');
        
        try {
            // ✅ Crear instancia nueva de axios SIN interceptor para login
            const loginResponse = await axios.post(
                'http://127.0.0.1:8000/api/login/', 
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            console.log('✅ Login exitoso, respuesta:', loginResponse.data);
            
            // Guardar tokens
            localStorage.setItem('access_token', loginResponse.data.access);
            localStorage.setItem('refresh_token', loginResponse.data.refresh);
            localStorage.setItem('usuario', JSON.stringify(loginResponse.data.usuario));
            
            console.log('💾 Tokens guardados en localStorage');
            console.log('👤 Usuario:', loginResponse.data.usuario.nombre);
            
            // ✅ Pequeña pausa para asegurar que localStorage se sincronice
            setTimeout(() => {
                navigate('/dashboard');
            }, 100);
            
        } catch (err) {
            console.error('❌ Error en login:', err);
            console.error('Status:', err.response?.status);
            console.error('Data:', err.response?.data);
            const errorMessage = err.response?.data?.detail || err.response?.data?.error || "Credenciales incorrectas o servidor caído";
            setError(errorMessage);
            console.log('⚠️ Error mostrado:', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const useDevelopmentCredentials = () => {
        setEmail('test@ejemplo.com');
        setPassword('test123');
        setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8">

                <div className="flex justify-center mb-6">
                    <div className="bg-blue-600 rounded-2xl p-4">
                        <Fuel size={32} color="white" />
                    </div>
                </div>

                <h2 className="text-center text-xl font-semibold text-slate-900 mb-1">Sistema Gasolinera</h2>
                <p className="text-center text-sm text-gray-400 mb-6">Ingresa tus credenciales para continuar</p>

                {/* Aviso de modo desarrollo */}
                <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-xs mb-4 flex gap-2">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Modo Desarrollo</p>
                        <p>Credenciales pre-cargadas: test@ejemplo.com / test123</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Correo electrónico</label>
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 mb-4">
                        <Mail size={16} color="#888" />
                        <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} required className="bg-transparent outline-none ml-2 w-full text-sm text-slate-900" />
                    </div>

                    <label className="text-xs font-semibold text-gray-600 block mb-1">Contraseña</label>
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 mb-6">
                        <Lock size={16} color="#888" />
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="bg-transparent outline-none ml-2 w-full text-sm text-slate-900" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={useDevelopmentCredentials}
                    className="w-full mt-3 bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs hover:bg-slate-300 transition-colors"
                >
                    ↻ Usar Credenciales de Desarrollo
                </button>

                <p className="text-center text-xs text-gray-300 mt-6">Estación de Servicio · v1.0</p>
            </div>
        </div>
    );
};

export default Login;