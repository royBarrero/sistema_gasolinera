import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Trash2, Pencil } from 'lucide-react';

const GestionUsuarios = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({ nombre: '', email: '', password: '', rol_id: '' });
    const [editando, setEditando] = useState(null);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    useEffect(() => {
        cargarUsuarios();
        api.get('roles/').then(res => setRoles(res.data)).catch(() => setRoles([]));
    }, []);

    const cargarUsuarios = () => {
        api.get('usuarios/').then(res => setUsuarios(res.data)).catch(() => setUsuarios([]));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setExito('');
        try {
            if (editando) {
                await api.put(`usuarios/editar/${editando}/`, form);
                setExito('Usuario actualizado correctamente');
                setEditando(null);
            } else {
                await api.post('usuarios/crear/', form);
                setExito('Usuario creado correctamente');
            }
            setForm({ nombre: '', email: '', password: '', rol_id: '' });
            cargarUsuarios();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar usuario');
        }
    };

    const handleEditar = (usuario) => {
        setEditando(usuario.id);
        setForm({ nombre: usuario.nombre, email: usuario.email, password: '', rol_id: '' });
        setError(''); setExito('');
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
        try {
            await api.delete(`usuarios/eliminar/${id}/`);
            setExito('Usuario eliminado correctamente');
            cargarUsuarios();
        } catch (err) {
            setError('Error al eliminar usuario');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">

            <div className="bg-slate-900 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 border border-slate-700 rounded-lg px-3 py-1.5 text-xs hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Volver
                </button>
                <span className="text-white font-semibold text-sm">Gestión de usuarios</span>
            </div>

            <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">

                {/* Formulario */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">{editando ? 'Editar usuario' : 'Nuevo usuario'}</h3>

                    {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm mb-4">{error}</div>}
                    {exito && <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-4 py-2 text-sm mb-4">{exito}</div>}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Nombre completo</label>
                            <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-slate-900 outline-none" placeholder="Ej: Juan Pérez" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Correo electrónico</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-slate-900 outline-none" placeholder="correo@ejemplo.com" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Contraseña {editando && '(dejar vacío para no cambiar)'}</label>
                            <input name="password" type="password" value={form.password} onChange={handleChange} required={!editando} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-slate-900 outline-none" placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Rol</label>
                            <select name="rol_id" value={form.rol_id} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-slate-900 outline-none">
                                <option value="">Sin rol asignado</option>
                                {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-2 flex gap-3">
                            <button type="submit" className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                {editando ? 'Guardar cambios' : 'Crear usuario'}
                            </button>
                            {editando && (
                                <button type="button" onClick={() => { setEditando(null); setForm({ nombre: '', email: '', password: '', rol_id: '' }); }} className="bg-slate-100 text-slate-700 text-sm px-5 py-2 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Usuarios registrados</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">Nombre</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">Email</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">Estado</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id} className="border-b border-gray-50">
                                        <td className="py-3 pr-4 text-slate-800">{u.nombre}</td>
                                        <td className="py-3 pr-4 text-slate-600">{u.email}</td>
                                        <td className="py-3 pr-4">
                                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${u.activo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                                {u.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="py-3 flex gap-2">
                                            <button onClick={() => handleEditar(u)} className="bg-slate-100 text-blue-600 rounded-lg p-1.5 hover:bg-blue-50 transition-colors"><Pencil size={15} /></button>
                                            <button onClick={() => handleEliminar(u.id)} className="bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100 transition-colors"><Trash2 size={15} /></button>
                                        </td>
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

export default GestionUsuarios;