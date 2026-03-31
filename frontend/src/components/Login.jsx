import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock, Fuel } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('login/', { email, password });
            localStorage.setItem('token', response.data.access);
            navigate('/dashboard');
        } catch (err) {
            setError("Credenciales incorrectas o servidor caído");
        } finally {
            setLoading(false);
        }
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

                <p className="text-center text-xs text-gray-300 mt-6">Estación de Servicio · v1.0</p>
            </div>
        </div>
    );
};

export default Login;