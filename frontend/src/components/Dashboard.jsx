import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fuel, ShoppingCart, Gauge, AlertTriangle, Users, BarChart2, Settings, LogOut, ClipboardList } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    const obtenerUsuario = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    };

    const usuario = obtenerUsuario();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const kpis = [
        { label: 'Ventas del día', value: 'Bs. 0.00', icon: <ShoppingCart size={22} className="text-blue-600" /> },
        { label: 'Nivel de tanques', value: '0%', icon: <Fuel size={22} className="text-green-600" /> },
        { label: 'Surtidores activos', value: '0 / 0', icon: <Gauge size={22} className="text-amber-600" /> },
        { label: 'Alertas activas', value: '0', icon: <AlertTriangle size={22} className="text-red-500" /> },
    ];

    const modulos = [
        { label: 'Ventas y POS', icon: <ShoppingCart size={28} className="text-blue-600" />, ruta: '/ventas' },
        { label: 'Surtidores', icon: <Gauge size={28} className="text-amber-600" />, ruta: '/surtidores' },
        { label: 'Inventario', icon: <Fuel size={28} className="text-green-600" />, ruta: '/inventario' },
        { label: 'IA y Analítica', icon: <BarChart2 size={28} className="text-purple-600" />, ruta: '/analitica' },
        { label: 'Gestión de usuarios', icon: <Users size={28} className="text-slate-700" />, ruta: '/administracion/usuarios' },
        { label: 'Roles y permisos', icon: <Settings size={28} className="text-indigo-600" />, ruta: '/administracion/roles-permisos' },
        { label: 'Bitacora', icon: <ClipboardList size={28} className="text-teal-600" />, ruta: '/bitacora' },
    ];

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Navbar */}
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Fuel size={20} color="white" />
                    <span className="text-white font-semibold text-sm">Sistema Gasolinera</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm hidden sm:block">{usuario?.nombre || 'Usuario'}</span>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 border border-slate-700 rounded-lg px-3 py-1.5 text-xs hover:text-white transition-colors">
                        <LogOut size={14} /> Cerrar sesión
                    </button>
                </div>
            </div>

            <div className="p-6 max-w-5xl mx-auto">

                <h2 className="text-sm font-semibold text-slate-700 mb-4">Resumen del día</h2>

                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {kpis.map((kpi, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
                            <div className="bg-slate-100 rounded-lg p-2">{kpi.icon}</div>
                            <div>
                                <div className="text-base font-bold text-slate-900">{kpi.value}</div>
                                <div className="text-xs text-gray-400">{kpi.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-sm font-semibold text-slate-700 mb-4">Módulos del sistema</h2>

                {/* Módulos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {modulos.map((mod, i) => (
                        <div key={i} onClick={() => navigate(mod.ruta)} className="bg-white rounded-xl p-5 flex flex-col items-center gap-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                            {mod.icon}
                            <span className="text-xs font-medium text-slate-800 text-center">{mod.label}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;