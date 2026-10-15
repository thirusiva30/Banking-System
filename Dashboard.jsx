import { useEffect, useState } from 'react';
import api from '../api';

const formatMoney = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

const maskNumber = (num) => `XXXX XXXX ${num.slice(-4)}`;

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const loadAccounts = async () => {
    try {
      const { data } = await api.get('/accounts');
      setAccounts(data);
      setSelectedId((prev) => prev ?? data[0]?._id ?? null);
    } catch {
      setError('Could not load accounts');
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    api
      .get(`/accounts/${selectedId}/transactions`)
      .then((res) => setTransactions(res.data))
      .catch(() => setTransactions([]));
  }, [selectedId]);

  const openAccount = async (type) => {
    setError('');
    try {
      await api.post('/accounts', { type });
      await loadAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not open account');
    }
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-gray-500">Total balance</p>
        <h2 className="text-3xl font-bold text-brand-navy">{formatMoney(totalBalance)}</h2>
      </section>

      {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded">{error}</p>}

      <section className="grid md:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <button
            key={acc._id}
            onClick={() => setSelectedId(acc._id)}
            className={`text-left bg-white rounded-lg shadow p-5 border-2 ${
              selectedId === acc._id ? 'border-brand-accent' : 'border-transparent'
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-gray-500">{acc.type} account</p>
            <p className="font-mono text-sm mt-1">{maskNumber(acc.accountNumber)}</p>
            <p className="text-2xl font-semibold text-brand-navy mt-3">{formatMoney(acc.balance)}</p>
          </button>
        ))}
      </section>

      <div className="flex gap-3">
        <button onClick={() => openAccount('savings')} className="bg-white border border-brand-navy text-brand-navy px-4 py-2 rounded hover:bg-brand-navy hover:text-white">
          Open savings account
        </button>
        <button onClick={() => openAccount('checking')} className="bg-white border border-brand-navy text-brand-navy px-4 py-2 rounded hover:bg-brand-navy hover:text-white">
          Open checking account
        </button>
      </div>

      <section className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="px-5 py-3 font-semibold border-b">Recent transactions</h3>
        {transactions.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-5 py-2">Date</th>
                <th className="px-5 py-2">Description</th>
                <th className="px-5 py-2">Counterparty</th>
                <th className="px-5 py-2 text-right">Amount</th>
                <th className="px-5 py-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="px-5 py-2">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-2">{t.description}</td>
                  <td className="px-5 py-2 font-mono text-xs">{t.counterpartyAccount || '-'}</td>
                  <td className={`px-5 py-2 text-right ${t.type === 'credit' ? 'text-green-700' : 'text-red-700'}`}>
                    {t.type === 'credit' ? '+' : '-'}{formatMoney(t.amount)}
                  </td>
                  <td className="px-5 py-2 text-right">{formatMoney(t.balanceAfter)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
