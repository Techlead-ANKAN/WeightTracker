import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Scale, TrendingUp, Activity, Sun, MoonStar, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout, userId } = useAuth();

  const navItems = [
    { label: 'Today', to: '/', icon: Calendar },
    { label: 'Weight', to: '/weight', icon: Scale },
    { label: 'Progress', to: '/progress', icon: TrendingUp },
    { label: 'Analytics', to: '/analytics', icon: Activity },
    { label: 'Admin', to: '/admin', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60 dark:bg-slate-950/95 dark:border-slate-800">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/scale.png" alt="Weight Tracker" className="h-7 w-7" />
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Weight Tracker
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 dark:text-slate-500 ml-2">
              • {userId}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={clsx(
                    'inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                    isActive 
                      ? 'text-primary' 
                      : 'text-slate-600 dark:text-slate-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle & Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-600 hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-300 dark:hover:bg-slate-900"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonStar className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full p-2 text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-rose-400 dark:hover:bg-rose-900/20"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex items-center gap-6 border-t border-surface-border py-3 md:hidden dark:border-slate-800">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={clsx(
                  'flex flex-1 flex-col items-center gap-1 text-xs font-medium transition-colors',
                  isActive 
                    ? 'text-primary' 
                    : 'text-slate-600 dark:text-slate-400'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
