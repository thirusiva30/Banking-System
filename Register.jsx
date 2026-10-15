import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy text-center">Open your account</h1>

        {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded">{error}</p>}

        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" placeholder="Password (min 8 characters)" value={form.password} onChange={handleChange} required minLength={8} className="w-full border rounded px-3 py-2" />

        <button type="submit" disabled={busy} className="w-full bg-brand-navy text-white py-2 rounded hover:opacity-90 disabled:opacity-50">
          {busy ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-sm text-center">
          Already a customer? <Link to="/login" className="text-brand-accent underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
