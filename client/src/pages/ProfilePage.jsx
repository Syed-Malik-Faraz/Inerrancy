import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, MapPin, Key, Save, Edit3, Camera, Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form States
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Password Form States
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', profileData);
      updateUser(res.data.user);
      toast.success('Identity Updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await api.put('/users/password', passwordData);
      toast.success('Credential Secured');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    
    toast.loading('Uploading avatar...', { id: 'avatar' });
    try {
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(res.data.user);
      toast.success('Appearance updated', { id: 'avatar' });
    } catch (err) {
      toast.error('Upload failed', { id: 'avatar' });
    }
  };

  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container max-w-6xl">
        
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Sidebar / Sidebar Nav */}
          <aside className="w-full md:w-80 shrink-0">
            <div className="bg-black-2 border border-gold/10 rounded-2xl p-8 sticky top-32 text-center overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold" />
              
              <div className="relative group mx-auto w-32 h-32 mb-6">
                 <div className="w-full h-full rounded-full border-2 border-gold/20 p-1">
                    <div className="w-full h-full rounded-full bg-black-3 flex items-center justify-center overflow-hidden border border-gold/10">
                       {user?.avatar ? (
                         <img src={user.avatar} className="w-full h-full object-cover" />
                       ) : (
                         <User size={48} className="text-gold/20" />
                       )}
                    </div>
                 </div>
                 <label className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-gold text-black flex items-center justify-center cursor-pointer hover:bg-gold-light transition-all shadow-xl">
                    <Camera size={18} />
                    <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                 </label>
              </div>

              <h2 className="font-heading text-2xl text-ivory mb-1">{user?.name}</h2>
              <p className="text-[10px] text-ivory/30 uppercase tracking-[3px] mb-8">{user?.email}</p>

              <nav className="flex flex-col gap-2">
                {[
                  { id: 'profile', label: 'My Identity', icon: User },
                  { id: 'security', label: 'Vault Access', icon: Key },
                  { id: 'addresses', label: 'Dispatch Points', icon: MapPin },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-xl text-xs font-bold tracking-[2px] uppercase transition-all duration-300 ${activeTab === tab.id ? 'bg-gold-muted text-gold shadow-inner border border-gold/10' : 'text-ivory/40 hover:text-ivory hover:bg-white/5'}`}
                  >
                    <tab.icon size={16} /> {tab.label}
                  </button>
                ))}
                <div className="pt-8 mt-8 border-t border-gold/10">
                   <Link to="/orders" className="flex items-center gap-4 px-6 py-4 rounded-xl text-xs font-bold tracking-[2px] uppercase text-gold hover:bg-gold/5 transition-all">
                      <Save size={16} /> Order Archives
                   </Link>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="grow animate-fade-in">
            {activeTab === 'profile' && (
              <div className="space-y-12">
                <header>
                  <h2 className="font-heading text-4xl text-ivory mb-2 tracking-wide">My Identity</h2>
                  <p className="text-ivory/30 text-[10px] uppercase tracking-[3px]">Secure your personal profile data</p>
                </header>

                <form onSubmit={handleProfileSubmit} className="bg-black-2 border border-gold/10 p-10 rounded-2xl shadow-2xl">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div className="form-group">
                         <label className="form-label">Full Name</label>
                         <input 
                           type="text" 
                           value={profileData.name}
                           onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                           className="luxury-input" 
                         />
                      </div>
                      <div className="form-group">
                         <label className="form-label">Email Essence</label>
                         <input 
                           type="email" 
                           value={profileData.email}
                           readOnly
                           className="luxury-input opacity-50 cursor-not-allowed" 
                         />
                      </div>
                   </div>
                   <button disabled={loading} className="btn btn-primary px-12 group h-14 uppercase tracking-[4px]">
                      {loading ? 'CURATING...' : 'UPDATE IDENTITY'} <Save size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12">
                <header>
                  <h2 className="font-heading text-4xl text-ivory mb-2 tracking-wide">Vault Access</h2>
                  <p className="text-ivory/30 text-[10px] uppercase tracking-[3px]">Manage your secure login credentials</p>
                </header>

                <form onSubmit={handlePasswordSubmit} className="bg-black-2 border border-gold/10 p-10 rounded-2xl shadow-2xl">
                   <div className="space-y-8 mb-10">
                      <div className="form-group">
                         <label className="form-label">Current Keycode</label>
                         <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30" size={16} />
                            <input 
                              type="password" 
                              required
                              value={passwordData.oldPassword}
                              onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                              className="luxury-input pl-12" 
                              placeholder="••••••••"
                            />
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="form-group">
                           <label className="form-label">New Keycode</label>
                           <input 
                              type="password" 
                              required
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              className="luxury-input" 
                              placeholder="••••••••"
                           />
                        </div>
                        <div className="form-group">
                           <label className="form-label">Confirm New Keycode</label>
                           <input 
                             type="password" 
                             required
                             value={passwordData.confirmPassword}
                             onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                             className="luxury-input" 
                             placeholder="••••••••"
                           />
                        </div>
                      </div>
                   </div>
                   <button disabled={loading} className="btn btn-primary px-12 h-14 uppercase tracking-[4px]">
                      {loading ? 'SECURING...' : 'SECURE ACCESS'}
                   </button>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="font-heading text-4xl text-ivory mb-2 tracking-wide">Dispatch Points</h2>
                    <p className="text-ivory/30 text-[10px] uppercase tracking-[3px]">Where your masterpieces should arrive</p>
                  </div>
                  <button className="btn btn-outline btn-sm uppercase tracking-[3px]"><Plus size={14} /> NEW DESTINATION</button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {user?.addresses?.length === 0 ? (
                     <div className="md:col-span-2 py-20 text-center border border-dashed border-gold/10 rounded-2xl bg-black-2">
                        <MapPin className="mx-auto text-gold/10 mb-6" size={48} />
                        <p className="text-ivory/40 uppercase tracking-widest text-xs">No dispatch points registered in vault</p>
                     </div>
                   ) : (
                     user?.addresses?.map((addr, i) => (
                       <div key={i} className="bg-black-2 border border-gold/10 p-8 rounded-2xl relative group transition-all hover:border-gold/30">
                          <div className="flex justify-between items-start mb-6">
                             <div className="flex items-center gap-2 px-3 py-1 bg-gold-muted rounded-full border border-gold/20 text-[9px] font-bold text-gold uppercase tracking-wider">
                                <MapPin size={10} /> {addr.isDefault ? 'Primary' : 'Dispatch Pt.'}
                             </div>
                             <div className="flex gap-2">
                                <button className="p-2 text-ivory/10 hover:text-gold transition-colors"><Edit3 size={14} /></button>
                                <button className="p-2 text-ivory/10 hover:text-luxury-red transition-colors"><Trash2 size={14} /></button>
                             </div>
                          </div>
                          <p className="font-heading text-lg text-ivory mb-1">{addr.name || user.name}</p>
                          <p className="text-ivory/60 text-sm leading-relaxed mb-4">
                            {addr.line1} {addr.line2}<br />
                            {addr.city}, {addr.state} {addr.pincode}
                          </p>
                          <p className="text-[10px] text-ivory/30 uppercase tracking-[2px]">T: {addr.phone}</p>
                       </div>
                     ))
                   )}
                </div>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
