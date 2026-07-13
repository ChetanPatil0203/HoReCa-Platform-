import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, Eye, EyeOff, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import HrcHubLogo from '../../assets/HoReCa_Logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate mock login
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'admin@hrchub.in' || email.includes('admin')) {
        // Successful login
        localStorage.setItem('hrchub_user', JSON.stringify({
          name: 'Super Admin',
          email: email,
          role: 'superadmin',
          businessName: 'HRCHUB HQ'
        }));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use admin@hrchub.in for the demo.');
      }
    }, 1200);
  };

  const handleFillDemo = () => {
    setEmail('admin@hrchub.in');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#091124] relative overflow-hidden px-4">
      {/* Decorative gradient blur background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-900/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0b162f]/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-[#081a3a] border border-[#d4af37]/30 flex items-center justify-center p-2 shadow-lg shadow-black/30">
              <img src={HrcHubLogo} alt="HRC HUB Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-[#d4af37]">HRC</span> HUB
            </h1>
            <p className="text-[10px] text-[#d4af37] font-semibold tracking-[0.2em] uppercase">Super Admin Control</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center animate-fadeIn">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="admin@hrchub.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0c1936] border border-slate-800 rounded-2xl text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-[#0c1936] border border-slate-800 rounded-2xl text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-2xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In Control Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full my-6">
            <div className="h-[1px] bg-slate-800 flex-1" />
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Demo Sandbox</span>
            <div className="h-[1px] bg-slate-800 flex-1" />
          </div>

          {/* Quick Login Button */}
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-3 bg-[#081a3a]/40 border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#081a3a]/75 text-[#d4af37] font-bold rounded-2xl text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Use Super Admin Demo Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
}
