import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft } from 'lucide-react';

const Bitacora = () => {
    const navigate = useNavigate();
    const [registros, setRegistros] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('bitacora/')
        .then(res => setRegistros(res.data))
        .catch(() => setError('Error al cargar la bitácora'));
}, []);

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleString('es-BO');
    };

    return (
        <div className="min-h-screen bg-slate-100">

            <div className="bg-slate-900 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 border border-slate-700 rounded-lg px-3 py-1.5 text-xs hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Volver
                </button>
                <span className="text-white font-semibold text-sm">Bitácora de auditoría</span>
            </div>

            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Registro de actividad</h3>

                    {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm mb-4">{error}</div>}

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">Usuario</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">Acción</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">Tabla</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">IP</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registros.map(r => (
                                    <tr key={r.id} className="border-b border-gray-50">
                                        <td className="py-3 pr-4 text-slate-800">{r.usuario__nombre}</td>
                                        <td className="py-3 pr-4">
                                            <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-md">
                                                {r.accion}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 text-slate-600">{r.tabla || '-'}</td>
                                        <td className="py-3 pr-4 text-slate-600">{r.ip || '-'}</td>
                                        <td className="py-3 text-slate-600">{formatFecha(r.fecha)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bitacora;