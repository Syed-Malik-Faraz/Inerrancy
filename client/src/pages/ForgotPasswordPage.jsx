import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
      setCountdown(60);
      toast.success(`Reset code sent to ${email} ✨`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setCountdown(60);
      toast.success('New reset code sent ✨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the verification code');
    if (!newPassword) return toast.error('Please enter a new password');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
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
            src="https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=1200&q=80"
            className="w-full h-full object-cover brightness-50 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
        <div className="relative z-10 text-center max-w-lg">
          <Link to="/" className="inline-block mb-12 group">
            <span className="font-heading text-5xl tracking-[12px] text-gold group-hover:text-gold-light transition-colors">INERRANCY</span>
          </Link>
          <div className="h-0.5 w-12 bg-gold mx-auto mb-12" />
          <h2 className="font-heading text-3xl text-ivory mb-6 tracking-widest italic opacity-0 animate-fade-in">
            "Reclaim your access to the world of olfactory excellence."
          </h2>
          <p className="text-gold/60 text-[10px] uppercase tracking-[4px] font-bold">The Official Destination for Arabian Luxury</p>
        </div>
        <div className="absolute bottom-10 left-10 flex gap-10 opacity-30">
          <div className="flex items-center gap-3 text-[10px] text-ivory tracking-[4px] uppercase font-bold"><ShieldCheck size={16} /> Secure Portal</div>
          <div className="flex items-center gap-3 text-[10px] text-ivory tracking-[4px] uppercase font-bold"><Lock size={16} /> Vault Encryption</div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 z-10">
        <div className="w-full max-w-[440px] animate-fade-in">

          <div className="lg:hidden text-center mb-12">
            <Link to="/"><span className="font-heading text-3xl tracking-[8px] text-gold">INERRANCY</span></Link>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-10">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all ${step >= 1 ? 'bg-gold border-gold text-black' : 'border-gold/20 text-ivory/30'}`}>1</div>
            <div className={`flex-1 h-px transition-all ${step >= 2 ? 'bg-gold' : 'bg-gold/10'}`} />
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all ${step >= 2 ? 'bg-gold border-gold text-black' : 'border-gold/20 text-ivory/30'}`}>2</div>
          </div>

          {step === 1 && (
            <>
              <header className="mb-10">
                <h1 className="font-heading text-4xl text-ivory mb-2 tracking-wide">Forgot Password</h1>
                <p className="text-ivory/30 text-[11px] uppercase tracking-[3px] font-bold">Enter your registered email to receive a reset code</p>
              </header>

              <form onSubmit={handleSendCode} className="space-y-8">
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
                      placeholder="name@email.com"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full btn btn-primary h-14 text-[12px] font-bold tracking-[6px] uppercase group relative overflow-hidden"
                >
                  <span className="relative z-10 transition-transform group-hover:-translate-x-1 inline-flex items-center gap-4">
                    {loading ? 'SENDING CODE...' : (
                      <>SEND RESET CODE <ArrowRight size={18} /></>
                    )}
                  </span>
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <header className="mb-10">
                <h1 className="font-heading text-4xl text-ivory mb-2 tracking-wide">Reset Password</h1>
                <p className="text-ivory/30 text-[11px] uppercase tracking-[3px] font-bold">
                  Enter the code sent to <span className="text-gold">{email}</span>
                </p>
              </header>

              <form onSubmit={handleResetPassword} className="space-y-7">
                <div className="form-group">
                  <div className="flex justify-between items-center mb-3">
                    <label className="form-label !mb-0">Verification Code</label>
                    <button
                      type="button"
                      disabled={countdown > 0 || loading}
                      onClick={handleResendCode}
                      className="text-[10px] text-gold hover:underline uppercase tracking-widest font-bold disabled:opacity-40 disabled:no-underline"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={16} />
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="luxury-input pl-12! h-14 font-mono font-bold tracking-[6px] text-gold text-lg"
                      placeholder="123456"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors" size={16} />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="luxury-input pl-12! h-14"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/20 hover:text-gold transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full btn btn-primary h-14 text-[12px] font-bold tracking-[6px] uppercase group relative overflow-hidden"
                >
                  <span className="relative z-10 transition-transform group-hover:-translate-x-1 inline-flex items-center gap-4">
                    {loading ? 'RESETTING...' : (
                      <>RESET PASSWORD <ArrowRight size={18} /></>
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-[10px] text-ivory/30 hover:text-gold uppercase tracking-[3px] font-bold transition-colors"
                >
                  ← Use a different email
                </button>
              </form>
            </>
          )}

          <div className="mt-14 pt-10 border-t border-gold/10 text-center">
            <p className="text-ivory/40 text-xs tracking-wider uppercase mb-6 font-light">Remember your password?</p>
            <Link to="/login" className="text-[11px] font-bold text-gold tracking-[4px] uppercase border border-gold/30 px-10 py-4 hover:bg-gold-muted hover:border-gold transition-all block">
              BACK TO SIGN IN
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ForgotPasswordPage;
