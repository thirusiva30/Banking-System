import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy text-center">SecureBank Login</h1>

        {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-brand-navy text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {busy ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="text-sm text-center">
          New here? <Link to="/register" className="text-brand-accent underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
