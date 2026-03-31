import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Trash2, Pencil } from 'lucide-react';

const GestionRolesPermisos = () => {
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [formRol, setFormRol] = useState({ nombre: '', descripcion: '' });
    const [editandoRol, setEditandoRol] = useState(null);
    const [errorRol, setErrorRol] = useState('');
    const [exitoRol, setExitoRol] = useState('');

    const [permisos, setPermisos] = useState([]);
    const [formPermiso, setFormPermiso] = useState({ codigo: '', modulo: '' });
    const [editandoPermiso, setEditandoPermiso] = useState(null);
    const [errorPermiso, setErrorPermiso] = useState('');
    const [exitoPermiso, setExitoPermiso] = useState('');

    useEffect(() => {
        cargarRoles();
        cargarPermisos();
    }, []);

    const cargarRoles = () => {
        api.get('roles/').then(res => setRoles(res.data)).catch(() => setRoles([]));
    };

    const cargarPermisos = () => {
        api.get('permisos/').then(res => setPermisos(res.data)).catch(() => setPermisos([]));
    };

    const handleRolSubmit = async (e) => {
        e.preventDefault();
        setErrorRol(''); setExitoRol('');
        try {
            if (editandoRol) {
                await api.put(`roles/editar/${editandoRol}/`, formRol);
                setExitoRol('Rol actualizado correctamente');
                setEditandoRol(null);
            } else {
                await api.post('roles/crear/', formRol);
                setExitoRol('Rol creado correctamente');
            }
            setFormRol({ nombre: '', descripcion: '' });
            cargarRoles();
        } catch (err) {
            setErrorRol(err.response?.data?.error || 'Error al guardar rol');
        }
    };

    const handleEditarRol = (rol) => {
        setEditandoRol(rol.id);
        setFormRol({ nombre: rol.nombre, descripcion: rol.descripcion || '' });
        setErrorRol(''); setExitoRol('');
    };

    const handleEliminarRol = async (id) => {
        if (!window.confirm('¿Eliminar este rol?')) return;
        try {
            await api.delete(`roles/eliminar/${id}/`);
            setExitoRol('Rol eliminado');
            cargarRoles();
        } catch (err) {
            setErrorRol('Error al eliminar rol');
        }
    };

    const handlePermisoSubmit = async (e) => {
        e.preventDefault();
        setErrorPermiso(''); setExitoPermiso('');
        try {
            if (editandoPermiso) {
                await api.put(`permisos/editar/${editandoPermiso}/`, formPermiso);
                setExitoPermiso('Permiso actualizado correctamente');
                setEditandoPermiso(null);
            } else {
                await api.post('permisos/crear/', formPermiso);
                setExitoPermiso('Permiso creado correctamente');
            }
            setFormPermiso({ codigo: '', modulo: '' });
            cargarPermisos();
        } catch (err) {
            setErrorPermiso(err.response?.data?.error || 'Error al guardar permiso');
        }
    };

    const handleEditarPermiso = (permiso) => {
        setEditandoPermiso(permiso.id);
        setFormPermiso({ codigo: permiso.codigo, modulo: permiso.modulo });
        setErrorPermiso(''); setExitoPermiso('');
    };

    const handleEliminarPermiso = async (id) => {
        if (!window.confirm('¿Eliminar este permiso?')) return;
        try {
            await api.delete(`permisos/eliminar/${id}/`);
            setExitoPermiso('Permiso eliminado');
            cargarPermisos();
        } catch (err) {
            setErrorPermiso('Error al eliminar permiso');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">

            <div className="bg-slate-900 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 border border-slate-700 rounded-lg px-3 py-1.5 text-xs hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Volver
                </button>
                <span className="text-white font-semibold text-sm">Gestión de roles y permisos</span>
            </div>

            <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">

                {/* ROLES */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">{editandoRol ? 'Editar rol' : 'Nuevo rol'}</h3>

                    {errorRol && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm mb-4">{errorRol}</div>}
                    {exitoRol && <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-4 py-2 text-sm mb-4">{exitoRol}</div>}

                    <form onSubmit={handleRolSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Nombre del rol</label>
                            <input value={formRol.nombre} onChange={e => setFormRol({...formRol, nombre: e.target.value})} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-slate-900 outline-none" placeholder="Ej: Gerente" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Descripción</label>
                            <input value={formRol.descripcion} onChange={e => setFormRol({...formRol, descripcion: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-slate-900 outline-none" placeholder="Descripción opcional" />
                        </div>
                        <div className="sm:col-span-2 flex gap-3">
                            <button type="submit" className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                {editandoRol ? 'Guardar cambios' : 'Crear rol'}
                            </button>
                            {editandoRol && (
                                <button type="button" onClick={() => { setEditandoRol(null); setFormRol({ nombre: '', descripcion: '' }); }} className="bg-slate-100 text-slate-700 text-sm px-5 py-2 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>

                    <h3 className="text-sm font-semibold text-slate-800 mt-6 mb-4">Roles registrados</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">Nombre</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">Descripción</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map(r => (
                                    <tr key={r.id} className="border-b border-gray-50">
                                        <td className="py-3 pr-4 text-slate-800">{r.nombre}</td>
                                        <td className="py-3 pr-4 text-slate-600">{r.descripcion || '-'}</td>
                                        <td className="py-3 flex gap-2">
                                            <button onClick={() => handleEditarRol(r)} className="bg-slate-100 text-blue-600 rounded-lg p-1.5 hover:bg-blue-50 transition-colors"><Pencil size={15} /></button>
                                            <button onClick={() => handleEliminarRol(r.id)} className="bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100 transition-colors"><Trash2 size={15} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PERMISOS */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">{editandoPermiso ? 'Editar permiso' : 'Nuevo permiso'}</h3>

                    {errorPermiso && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm mb-4">{errorPermiso}</div>}
                    {exitoPermiso && <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-4 py-2 text-sm mb-4">{exitoPermiso}</div>}

                    <form onSubmit={handlePermisoSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Código</label>
                            <input value={formPermiso.codigo} onChange={e => setFormPermiso({...formPermiso, codigo: e.target.value})} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-slate-900 outline-none" placeholder="Ej: usuarios.crear" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Módulo</label>
                            <input value={formPermiso.modulo} onChange={e => setFormPermiso({...formPermiso, modulo: e.target.value})} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-slate-900 outline-none" placeholder="Ej: Administración" />
                        </div>
                        <div className="sm:col-span-2 flex gap-3">
                            <button type="submit" className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                {editandoPermiso ? 'Guardar cambios' : 'Crear permiso'}
                            </button>
                            {editandoPermiso && (
                                <button type="button" onClick={() => { setEditandoPermiso(null); setFormPermiso({ codigo: '', modulo: '' }); }} className="bg-slate-100 text-slate-700 text-sm px-5 py-2 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>

                    <h3 className="text-sm font-semibold text-slate-800 mt-6 mb-4">Permisos registrados</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">Código</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">Módulo</th>
                                    <th className="text-left text-xs font-semibold text-gray-400 pb-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permisos.map(p => (
                                    <tr key={p.id} className="border-b border-gray-50">
                                        <td className="py-3 pr-4 text-slate-800">{p.codigo}</td>
                                        <td className="py-3 pr-4 text-slate-600">{p.modulo}</td>
                                        <td className="py-3 flex gap-2">
                                            <button onClick={() => handleEditarPermiso(p)} className="bg-slate-100 text-blue-600 rounded-lg p-1.5 hover:bg-blue-50 transition-colors"><Pencil size={15} /></button>
                                            <button onClick={() => handleEliminarPermiso(p.id)} className="bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100 transition-colors"><Trash2 size={15} /></button>
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

export default GestionRolesPermisos;