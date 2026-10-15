import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="bg-brand-navy text-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-lg tracking-wide">SecureBank</Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:underline">Dashboard</Link>
            <Link to="/transfer" className="hover:underline">Transfer</Link>
            <button onClick={logout} className="hover:underline">
              Logout ({user.name.split(' ')[0]})
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
