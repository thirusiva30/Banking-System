import { useEffect, useState } from 'react';
import api from '../api';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    amount: '',
    description: '',
  });
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/accounts').then((res) => {
      setAccounts(res.data);
      if (res.data[0]) setForm((f) => ({ ...f, fromAccountId: res.data[0]._id }));
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const { data } = await api.post('/transfers', form);
      setMessage({ type: 'ok', text: `Transfer complete. Reference: ${data.reference}` });
      setForm((f) => ({ ...f, toAccountNumber: '', amount: '', description: '' }));
      const refreshed = await api.get('/accounts');
      setAccounts(refreshed.data);
    } catch (err) {
      setMessage({ type: 'err', text: err.response?.data?.message || 'Transfer failed' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-lg space-y-4">
      <h1 className="text-2xl font-bold text-brand-navy">Transfer money</h1>

      {message && (
        <p className={`text-sm p-3 rounded ${message.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </p>
      )}

      <label className="block text-sm">
        From account
        <select name="fromAccountId" value={form.fromAccountId} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2">
          {accounts.map((a) => (
            <option key={a._id} value={a._id}>
              {a.type} ...{a.accountNumber.slice(-4)} (balance {a.balance})
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        Recipient account number
        <input name="toAccountNumber" value={form.toAccountNumber} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2 font-mono" />
      </label>

      <label className="block text-sm">
        Amount (INR)
        <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2" />
      </label>

      <label className="block text-sm">
        Description (optional)
        <input name="description" value={form.description} onChange={handleChange} maxLength={200} className="mt-1 w-full border rounded px-3 py-2" />
      </label>

      <button type="submit" disabled={busy} className="w-full bg-brand-navy text-white py-2 rounded hover:opacity-90 disabled:opacity-50">
        {busy ? 'Processing...' : 'Send money'}
      </button>
    </form>
  );
}
