import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'DONOR': return '/donor/dashboard';
      case 'HOSPITAL': return '/hospital/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Verify Transplant', path: '/verify' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                <Activity size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                LifeTrace
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-gray-600 hover:text-brand-600 transition-colors font-medium">
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardLink()} className="text-gray-600 hover:text-brand-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-brand-600 transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors font-medium shadow-lg shadow-brand-500/30">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
