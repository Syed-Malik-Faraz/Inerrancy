import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.583 9 3.583z" fill="#EA4335"/>
  </svg>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

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
    if (!formData.email) return toast.error('Please enter your email address first');
    setOtpLoading(true);
    try {
      await api.post('/auth/send-otp', { email: formData.email });
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
      return toast.error('Passwords do not match');
    }
    if (!otpSent) {
      return toast.error('Please send the verification code to your email first');
    }
    if (!formData.otp) {
      return toast.error('Please enter the verification code');
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.otp);
      toast.success('Account Created ✨');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        await googleLogin(tokenResponse.access_token);
        toast.success('Welcome to Inerrancy ✨');
        navigate('/');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Google sign-in failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error('Google sign-in was cancelled'),
  });

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
              { title: 'Exclusive Curation', desc: 'Access India\'s largest portfolio of authentic Arabian masterpieces.' },
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

          <header className="mb-10">
            <h1 className="font-heading text-4xl lg:text-5xl text-ivory mb-2 tracking-wide">Create Account</h1>
            <p className="text-ivory/30 text-[11px] uppercase tracking-[4px] font-bold">Sign up to start shopping</p>
          </header>

          {/* Google Sign-Up Button */}
          <button
            type="button"
            disabled={googleLoading}
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-4 h-14 border border-gold/20 bg-white/5 hover:bg-white/10 hover:border-gold/40 transition-all text-ivory text-[11px] font-bold tracking-[3px] uppercase mb-8"
          >
            <GoogleIcon />
            {googleLoading ? 'SIGNING IN...' : 'CONTINUE WITH GOOGLE'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gold/10" />
            <span className="text-[10px] text-ivory/30 uppercase tracking-[3px] font-bold">or continue with email</span>
            <div className="flex-1 h-px bg-gold/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="form-group">
              <label className="form-label font-bold tracking-[2px]">Full Name</label>
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
              <label className="form-label font-bold tracking-[2px]">Email Address</label>
              <div className="flex gap-3">
                <div className="relative group flex-1">
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
                <button
                  type="button"
                  disabled={otpLoading || countdown > 0}
                  onClick={handleSendOtp}
                  className="btn btn-outline shrink-0 px-5 text-[10px] tracking-[2px] font-bold h-14 uppercase"
                >
                  {countdown > 0 ? `${countdown}s` : otpLoading ? '...' : otpSent ? 'Resend' : 'Send Code'}
                </button>
              </div>
              {otpSent && (
                <p className="mt-2 text-[10px] text-gold/60 tracking-wider">
                  Code sent to {formData.email}
                </p>
              )}
            </div>

            {otpSent && (
              <div className="form-group animate-fade-in">
                <label className="form-label font-bold tracking-[2px]">Verification Code</label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label font-bold tracking-[2px]">Password</label>
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
                <label className="form-label font-bold tracking-[2px]">Confirm Password</label>
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

            <div className="pt-2 flex flex-col gap-6">
              <p className="text-[10px] text-ivory/30 uppercase tracking-[2px] text-center leading-relaxed">
                By signing up, you agree to our <span className="text-gold cursor-pointer hover:underline">Terms & Conditions</span> and <span className="text-gold cursor-pointer hover:underline">Privacy Policy</span>.
              </p>

              <button
                disabled={loading}
                className="w-full btn btn-primary h-14 text-[12px] font-bold tracking-[6px] uppercase group relative overflow-hidden"
              >
                <span className="relative z-10 transition-transform group-hover:-translate-x-1 inline-flex items-center gap-4">
                  {loading ? 'CREATING ACCOUNT...' : (
                    <>CREATE ACCOUNT <ArrowRight size={18} /></>
                  )}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-14 pt-10 border-t border-gold/10 text-center">
            <p className="text-ivory/40 text-xs tracking-wider uppercase mb-6 font-light">Already have an account?</p>
            <Link to="/login" className="text-[11px] font-bold text-gold tracking-[4px] uppercase border border-gold/30 px-10 py-4 hover:bg-gold-muted hover:border-gold transition-all block">
              SIGN IN
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
