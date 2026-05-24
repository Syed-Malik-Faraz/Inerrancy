import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../api/axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Timer countdown hook
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      return toast.error('Please enter your email address first');
    }
    if (!formData.phone) {
      return toast.error('Please enter your phone number');
    }
    setOtpLoading(true);
    try {
      await api.post('/auth/send-otp', { phone: formData.phone, email: formData.email });
      setOtpSent(true);
      setCountdown(60);
      toast.success(`Verification code sent to ${formData.email} ✨`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Keycodes do not match');
    }
    if (!otpSent) {
      return toast.error('Please initialize and verify OTP first');
    }
    if (!formData.otp) {
      return toast.error('Please enter the verification key');
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.phone, formData.otp);
      toast.success('Identity Registered ✨');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      
      {/* Decorative Side (Desktop) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center p-20 border-r border-gold/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=1200&q=80" 
            className="w-full h-full object-cover brightness-50 grayscale transition-transform duration-[10000ms] hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        </div>
        
        <div className="relative z-10 space-y-12">
           <div className="text-center">
              <Link to="/"><span className="font-heading text-6xl tracking-[16px] text-gold">INERRANCY</span></Link>
           </div>
           
           <div className="space-y-8 max-w-sm mx-auto">
              {[
                { title: 'Exclusive Curation', desc: 'Access India\'s largest portfolio of authenticate Arabian masterpieces.' },
                { title: 'Priority Dispatch', desc: 'Members receive insured, priority curating for every selection.' },
                { title: 'Inerrancy Circle', desc: 'Secure first access to limited drops and exclusive olfactory events.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 animate-fade-in" style={{ animationDelay: `${i * 200}ms` }}>
                   <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                      <CheckCircle2 size={20} />
                   </div>
                   <div className="text-left">
                      <h4 className="text-xs font-bold text-ivory tracking-[3px] uppercase mb-2">{item.title}</h4>
                      <p className="text-[11px] text-ivory/40 uppercase tracking-widest leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="absolute bottom-10 inset-x-0 text-center opacity-20">
           <p className="text-[9px] tracking-[6px] text-ivory uppercase font-bold">The House of Middle Eastern Excellence</p>
        </div>
      </div>

      {/* Register Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 z-10 relative">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gold/5 blur-[120px] rounded-full -z-10" />
        
        <div className="w-full max-w-[480px] animate-fade-in">
          
          <div className="lg:hidden text-center mb-12">
             <Link to="/"><span className="font-heading text-3xl tracking-[8px] text-gold">INERRANCY</span></Link>
          </div>

          <header className="mb-12">
            <h1 className="font-heading text-4xl lg:text-5xl text-ivory mb-2 tracking-wide">Client Registration</h1>
            <p className="text-ivory/30 text-[11px] uppercase tracking-[4px] font-bold">Join the circle of olfactory connoisseurs</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="form-group">
              <label className="form-label font-bold tracking-[2px]">Full Identity (Name)</label>
              <div className="relative group">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={16} />
                 <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="luxury-input pl-12 h-14"
                  placeholder="Aryan Malik"
                 />
              </div>
            </div>

             <div className="form-group">
              <label className="form-label font-bold tracking-[2px]">Communication Essence (Email)</label>
              <div className="relative group">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={16} />
                 <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="luxury-input pl-12 h-14"
                  placeholder="name@email.com"
                 />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label font-bold tracking-[2px]">Olfactory Contact (Phone Number)</label>
              <div className="flex gap-4 relative group">
                 <div className="relative grow">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 font-bold text-[12px] group-focus-within:text-gold pl-4">+91</span>
                    <input 
                     type="tel" 
                     name="phone"
                     required
                     value={formData.phone}
                     onChange={handleInputChange}
                     className="luxury-input pl-14 h-14"
                     placeholder="9999999999"
                    />
                 </div>
                 <button
                   type="button"
                   disabled={otpLoading || countdown > 0}
                   onClick={handleSendOtp}
                   className="btn btn-outline shrink-0 px-6 text-[10px] tracking-[2px] font-bold h-14 uppercase"
                 >
                   {countdown > 0 ? `Retry in ${countdown}s` : otpLoading ? 'Sending...' : otpSent ? 'Resend' : 'Send OTP'}
                 </button>
              </div>
            </div>

            {otpSent && (
              <div className="form-group animate-fade-in">
                <label className="form-label font-bold tracking-[2px]">Verification Key (OTP)</label>
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={16} />
                   <input 
                    type="text" 
                    name="otp"
                    required
                    maxLength="6"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="luxury-input pl-12 h-14 font-mono font-bold tracking-[6px] text-gold text-lg"
                    placeholder="123456"
                   />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="form-group">
                  <label className="form-label font-bold tracking-[2px]">Access Key (Pass)</label>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={16} />
                     <input 
                      type="password" 
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="luxury-input pl-12 h-14"
                      placeholder="••••••••"
                     />
                  </div>
               </div>
               <div className="form-group">
                  <label className="form-label font-bold tracking-[2px]">Confirm Key</label>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={16} />
                     <input 
                      type="password" 
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="luxury-input pl-12 h-14"
                      placeholder="••••••••"
                     />
                  </div>
               </div>
            </div>

            <div className="pt-4 flex flex-col gap-6">
               <p className="text-[10px] text-ivory/30 uppercase tracking-[2px] text-center leading-relaxed">
                  By registering, you agree to our <span className="text-gold cursor-pointer hover:underline">Terms of Selection</span> and <span className="text-gold cursor-pointer hover:underline">Privacy Portfolio</span>.
               </p>
               
               <button 
                  disabled={loading}
                  className="w-full btn btn-primary h-14 text-[12px] font-bold tracking-[6px] uppercase group relative overflow-hidden"
               >
                  <span className="relative z-10 transition-transform group-hover:-translate-x-1 inline-flex items-center gap-4">
                     {loading ? 'REGISTERING IDENTITY...' : (
                       <>INITIALIZE ACCOUNT <ArrowRight size={18} /></>
                     )}
                  </span>
               </button>
            </div>
          </form>

          <div className="mt-16 pt-10 border-t border-gold/10 text-center">
             <p className="text-ivory/40 text-xs tracking-wider uppercase mb-6 font-light">Already a member of the circle?</p>
             <Link to="/login" className="text-[11px] font-bold text-gold tracking-[4px] uppercase border border-gold/30 px-10 py-4 hover:bg-gold-muted hover:border-gold transition-all block">
                ACCESS YOUR VAULT
             </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
