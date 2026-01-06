import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Fingerprint, Lock, User, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithBiometric, enableBiometric, userId } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      
      // Check if biometric is available and already enabled
      if (mobile && window.PublicKeyCredential) {
        const biometricEnabled = localStorage.getItem('biometricEnabled');
        if (biometricEnabled === 'true') {
          setBiometricAvailable(true);
        }
      }
    };

    checkMobile();
  }, []);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);
    
    // Simulate a brief delay for better UX
    setTimeout(() => {
      const success = login(password);
      
      if (success) {
        toast.success('Welcome back, Ankan! 🎉');
        
        // Enable biometric for mobile after successful password login
        if (isMobile && window.PublicKeyCredential) {
          enableBiometric();
          toast.success('Fingerprint login enabled for next time!', { duration: 2000 });
        }
        
        navigate('/');
      } else {
        toast.error('Incorrect password. Please try again.');
        setPassword('');
      }
      
      setIsLoading(false);
    }, 500);
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    
    try {
      await loginWithBiometric();
      toast.success('Welcome back, Ankan! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Biometric authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50/50 to-pink-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 mb-4 p-4">
            <img src="/scale.png" alt="Weight Tracker" className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Weight Tracker
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-surface-border bg-surface p-8 shadow-card dark:bg-slate-900 dark:border-slate-800">
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            {/* User ID (Fixed - Display Only) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                User ID
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={userId}
                  disabled
                  className="w-full rounded-lg border border-surface-border bg-surface-muted px-4 py-3 pl-11 text-sm font-medium text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 cursor-not-allowed opacity-75"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Personal account
              </p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-surface-border px-4 py-3 pl-11 pr-11 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In with Password
                </>
              )}
            </button>

            {/* Biometric Login (Mobile Only) */}
            {isMobile && biometricAvailable && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-border dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-surface px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBiometricLogin}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-80 dark:border-primary/30 dark:bg-primary/10"
                >
                  <Fingerprint className="h-5 w-5" />
                  Use Fingerprint
                </button>

                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  Biometric authentication enabled
                </p>
              </>
            )}
          </form>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Personal Weight Tracking Application
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
