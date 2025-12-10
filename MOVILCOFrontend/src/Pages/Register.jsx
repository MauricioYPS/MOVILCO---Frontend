import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../store/api';
import AuthLayout from './auth/AuthLayout';

const Register = ({ withLayout = true }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await axios.post(`${api}/api/auth/register`, formData);
      if (data?.ok) {
        if (data?.token) localStorage.setItem('auth_token', data.token);
        if (data?.user) localStorage.setItem('auth_user', JSON.stringify(data.user));
        if (data?.token) axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
        setMessage('Registro exitoso');
        navigate('/home');
      } else {
        setError('No se pudo registrar, intenta nuevamente');
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Error al registrar';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="nombre@movilco.com"
          className="block w-full px-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            placeholder="********"
            className="block w-full px-3 py-3 pr-10 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </div>
      {message && <div className="text-sm text-emerald-600 text-center">{message}</div>}
      {error && <div className="text-sm text-red-600 text-center">{error}</div>}
    </form>
  );

  if (!withLayout) {
    return form;
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Completa tus datos para solicitar acceso al portal."
    >
      {form}
    </AuthLayout>
  );
};

export default Register;
