import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! ✨');
      const origin = location.state?.from?.pathname || '/';
      navigate(origin);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Incorrect email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      
      {/* Decorative Brand Side (Desktop) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center p-20 border-r border-gold/10">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Oud-perfume-home.jpg" 
            className="w-full h-full object-cover brightness-50 grayscale" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
        <div className="relative z-10 text-center max-w-lg">
          <Link to="/" className="inline-block mb-12 group">
            <span className="font-heading text-5xl tracking-[12px] text-gold group-hover:text-gold-light transition-colors">INERRANCY</span>
          </Link>
          <div className="h-0.5 w-12 bg-gold mx-auto mb-12" />
          <h2 className="font-heading text-3xl lg:text-4xl text-ivory mb-6 tracking-widest italic opacity-0 animate-fade-in translate-up">
            "Enter the world of olfactory excellence. Your curated collection awaits."
          </h2>
          <p className="text-gold/60 text-[10px] uppercase tracking-[4px] font-bold">The Official Destination for Arabian Luxury</p>
        </div>
        <div className="absolute bottom-10 left-10 flex gap-10 opacity-30">
           <div className="flex items-center gap-3 text-[10px] text-ivory tracking-[4px] uppercase font-bold"><ShieldCheck size={16} /> Secure Portal</div>
           <div className="flex items-center gap-3 text-[10px] text-ivory tracking-[4px] uppercase font-bold"><Lock size={16} /> Vault Encryption</div>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 z-10">
        <div className="w-full max-w-[440px] animate-fade-in">
          
          <div className="lg:hidden text-center mb-12">
             <Link to="/"><span className="font-heading text-3xl tracking-[8px] text-gold">INERRANCY</span></Link>
          </div>

          <header className="mb-12">
            <h1 className="font-heading text-4xl text-ivory mb-2 tracking-wide">Sign In</h1>
            <p className="text-ivory/30 text-[11px] uppercase tracking-[3px] font-bold">Enter your email and password to continue</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="relative group">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={16} />
                 <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="luxury-input pl-12! h-14"
                  placeholder="name@luxury.com"
                 />
              </div>
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center mb-3">
                <label className="form-label !mb-0">Password</label>
                <Link to="/forgot-password" size="sm" className="text-[10px] text-gold hover:underline uppercase tracking-widest font-bold">Forgot password?</Link>
              </div>
              <div className="relative group">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={16} />
                 <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="luxury-input pl-12! h-14"
                  placeholder="••••••••"
                 />
                 <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/20 hover:text-gold transition-colors"
                 >
                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
               <input type="checkbox" id="remember" className="w-4 h-4 bg-black border-gold/20 rounded accent-gold" />
               <label htmlFor="remember" className="text-[10px] text-ivory/40 uppercase tracking-widest cursor-pointer select-none">Remember me</label>
            </div>

            <button 
              disabled={loading}
              className="w-full btn btn-primary h-14 text-[12px] font-bold tracking-[6px] uppercase group mt-4 relative overflow-hidden"
            >
              <span className="relative z-10 transition-transform group-hover:-translate-x-1 inline-flex items-center gap-4">
                 {loading ? 'SIGNING IN...' : (
                   <>SIGN IN <ArrowRight size={18} /></>
                 )}
              </span>
            </button>
          </form>

          <div className="mt-16 pt-10 border-t border-gold/10 text-center">
             <p className="text-ivory/40 text-xs tracking-wider uppercase mb-6 font-light">Don't have an account?</p>
             <Link to="/register" className="text-[11px] font-bold text-gold tracking-[4px] uppercase border border-gold/30 px-10 py-4 hover:bg-gold-muted hover:border-gold transition-all block">
                CREATE ACCOUNT
             </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;
