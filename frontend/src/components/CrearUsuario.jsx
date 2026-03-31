import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft } from 'lucide-react';

const CrearUsuario = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({ nombre: '', email: '', password: '', rol_id: '' });
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    useEffect(() => {
        api.get('roles/').then(res => setRoles(res.data)).catch(() => setRoles([]));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');
        try {
            await api.post('usuarios/crear/', form);
            setExito('Usuario creado correctamente');
            setForm({ nombre: '', email: '', password: '', rol_id: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear usuario');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
                    <ArrowLeft size={16} /> Volver
                </button>
                <span style={styles.navTitle}>Crear usuario</span>
            </div>

            <div style={styles.content}>
                <div style={styles.card}>
                    {error && <div style={styles.errorBox}>{error}</div>}
                    {exito && <div style={styles.exitoBox}>{exito}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.fieldLabel}>Nombre completo</div>
                        <input name="nombre" value={form.nombre} onChange={handleChange} required style={styles.input} placeholder="Ej: Juan Pérez" />

                        <div style={styles.fieldLabel}>Correo electrónico</div>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required style={styles.input} placeholder="correo@ejemplo.com" />

                        <div style={styles.fieldLabel}>Contraseña</div>
                        <input name="password" type="password" value={form.password} onChange={handleChange} required style={styles.input} placeholder="••••••••" />

                        <div style={styles.fieldLabel}>Rol</div>
                        <select name="rol_id" value={form.rol_id} onChange={handleChange} style={styles.input}>
                            <option value="">Sin rol asignado</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>{r.nombre}</option>
                            ))}
                        </select>

                        <button type="submit" style={styles.button}>Crear usuario</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
    navbar: { backgroundColor: '#0f172a', padding: '0.9rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' },
    navTitle: { color: '#fff', fontWeight: '600', fontSize: '1rem' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.82rem' },
    content: { display: 'flex', justifyContent: 'center', padding: '2rem' },
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
    fieldLabel: { fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', marginTop: '1rem' },
    input: { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: '#f9fafb', boxSizing: 'border-box', color: '#0f172a' },
    button: { width: '100%', padding: '0.75rem', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', marginTop: '1.5rem' },
    errorBox: { backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.82rem', marginBottom: '1rem' },
    exitoBox: { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.82rem', marginBottom: '1rem' },
};

export default CrearUsuario;