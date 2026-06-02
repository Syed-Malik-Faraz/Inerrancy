import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Key, Save, Edit3, Camera, Plus, Trash2, X, Home, Briefcase, Star } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const LABEL_PRESETS = ['Home', 'Work', 'Office', 'Other'];

const emptyAddress = { label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });

  // Password form
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [addressLoading, setAddressLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', profileData);
      updateUser(res.data.user);
      toast.success('Profile Updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.put('/users/password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      toast.success('Password Updated');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
      const res = await api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(res.data.user);
      toast.success('Appearance updated', { id: 'avatar' });
    } catch {
      toast.error('Upload failed', { id: 'avatar' });
    }
  };

  const openAddAddress = () => {
    setAddressForm(emptyAddress);
    setEditingAddressId(null);
    setShowAddressModal(true);
  };

  const openEditAddress = (addr) => {
    setAddressForm({
      label: addr.label || 'Home',
      name: addr.name || '',
      phone: addr.phone || '',
      line1: addr.line1 || '',
      line2: addr.line2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: addr.isDefault || false,
    });
    setEditingAddressId(addr._id);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    const { label, name, phone, line1, city, state, pincode } = addressForm;
    if (!label || !name || !phone || !line1 || !city || !state || !pincode) {
      return toast.error('Please fill all required fields');
    }
    setAddressLoading(true);
    try {
      let res;
      if (editingAddressId) {
        res = await api.put(`/users/address/${editingAddressId}`, addressForm);
      } else {
        res = await api.post('/users/address', addressForm);
      }
      updateUser({ ...user, addresses: res.data.addresses });
      setShowAddressModal(false);
      toast.success(editingAddressId ? 'Address updated' : 'Address saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await api.delete(`/users/address/${addressId}`);
      updateUser({ ...user, addresses: res.data.addresses });
      setDeleteConfirmId(null);
      toast.success('Address removed');
    } catch {
      toast.error('Failed to remove address');
    }
  };

  const labelIcon = (label) => {
    const l = (label || '').toLowerCase();
    if (l === 'home') return <Home size={10} />;
    if (l === 'work' || l === 'office') return <Briefcase size={10} />;
    return <Star size={10} />;
  };

  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">

          {/* Sidebar */}
          <aside className="w-full md:w-80 shrink-0">
            <div className="bg-black-2 border border-gold/10 rounded-2xl p-8 sticky top-32 text-center overflow-hidden shadow-2xl">
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
                  { id: 'profile', label: 'My Profile', icon: User },
                  { id: 'security', label: 'Security', icon: Key },
                  { id: 'addresses', label: 'Addresses', icon: MapPin },
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
                    <Save size={16} /> My Orders
                  </Link>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="grow animate-fade-in">

            {activeTab === 'profile' && (
              <div className="space-y-12">
                <header>
                  <h2 className="font-heading text-4xl text-ivory mb-2 tracking-wide">My Profile</h2>
                  <p className="text-ivory/30 text-[10px] uppercase tracking-[3px]">Update your name and email</p>
                </header>
                <form onSubmit={handleProfileSubmit} className="bg-black-2 border border-gold/10 p-10 rounded-2xl shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="luxury-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" value={profileData.email} readOnly className="luxury-input opacity-50 cursor-not-allowed" />
                    </div>
                  </div>
                  <button disabled={loading} className="btn btn-primary px-12 group h-14 uppercase tracking-[4px]">
                    {loading ? 'SAVING...' : 'SAVE CHANGES'} <Save size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12">
                <header>
                  <h2 className="font-heading text-4xl text-ivory mb-2 tracking-wide">Change Password</h2>
                  <p className="text-ivory/30 text-[10px] uppercase tracking-[3px]">Update your login password</p>
                </header>
                <form onSubmit={handlePasswordSubmit} className="bg-black-2 border border-gold/10 p-10 rounded-2xl shadow-2xl">
                  <div className="space-y-8 mb-10">
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30" size={16} />
                        <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="luxury-input pl-12!" placeholder="••••••••" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="luxury-input" placeholder="••••••••" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="luxury-input" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>
                  <button disabled={loading} className="btn btn-primary px-12 h-14 uppercase tracking-[4px]">
                    {loading ? 'SAVING...' : 'UPDATE PASSWORD'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="font-heading text-4xl text-ivory mb-2 tracking-wide">Saved Addresses</h2>
                    <p className="text-ivory/30 text-[10px] uppercase tracking-[3px]">Manage your delivery addresses</p>
                  </div>
                  <button onClick={openAddAddress} className="btn btn-outline btn-sm uppercase tracking-[3px] flex items-center gap-2">
                    <Plus size={14} /> Add Address
                  </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!user?.addresses?.length ? (
                    <div className="md:col-span-2 py-20 text-center border border-dashed border-gold/10 rounded-2xl bg-black-2">
                      <MapPin className="mx-auto text-gold/10 mb-6" size={48} />
                      <p className="text-ivory/40 uppercase tracking-widest text-xs mb-6">No saved addresses yet</p>
                      <button onClick={openAddAddress} className="btn btn-outline btn-sm uppercase tracking-[3px]">
                        <Plus size={14} className="mr-2" /> Add Your First Address
                      </button>
                    </div>
                  ) : (
                    user.addresses.map((addr) => (
                      <div key={addr._id} className="bg-black-2 border border-gold/10 p-8 rounded-2xl relative group transition-all hover:border-gold/30">
                        <div className="flex justify-between items-start mb-5">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-gold-muted rounded-full border border-gold/20 text-[9px] font-bold text-gold uppercase tracking-wider">
                              {labelIcon(addr.label)} {addr.label || 'Address'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[9px] text-ivory/30 uppercase tracking-wider font-bold">Default</span>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditAddress(addr)} className="p-2 text-ivory/30 hover:text-gold transition-colors rounded-lg hover:bg-gold/5">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => setDeleteConfirmId(addr._id)} className="p-2 text-ivory/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/5">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="font-heading text-lg text-ivory mb-1">{addr.name}</p>
                        <p className="text-ivory/50 text-sm leading-relaxed mb-3">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-[10px] text-ivory/30 uppercase tracking-[2px]">
                          {addr.phone}
                        </p>

                        {/* Delete confirm */}
                        {deleteConfirmId === addr._id && (
                          <div className="absolute inset-0 rounded-2xl bg-black/90 flex flex-col items-center justify-center gap-4 p-6 animate-fade-in">
                            <p className="text-xs text-ivory/70 uppercase tracking-wider text-center">Remove this address?</p>
                            <div className="flex gap-3">
                              <button onClick={() => handleDeleteAddress(addr._id)} className="btn btn-sm text-[10px] tracking-[2px] uppercase bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 px-6">
                                Remove
                              </button>
                              <button onClick={() => setDeleteConfirmId(null)} className="btn btn-outline btn-sm text-[10px] tracking-[2px] uppercase px-6">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowAddressModal(false)}>
          <div className="w-full max-w-lg bg-black-2 border border-gold/20 rounded-2xl shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gold/10">
              <div>
                <h3 className="font-heading text-2xl text-ivory tracking-wide">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                <p className="text-[10px] text-ivory/30 uppercase tracking-[3px] mt-1">Fill in your delivery details</p>
              </div>
              <button onClick={() => setShowAddressModal(false)} className="text-ivory/20 hover:text-gold transition-colors p-2">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* Label */}
              <div className="form-group">
                <label className="form-label font-bold tracking-[2px]">Address Label</label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {LABEL_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, label: preset })}
                      className={`px-4 py-2 text-[10px] font-bold tracking-[2px] uppercase border transition-all rounded ${addressForm.label === preset ? 'bg-gold text-black border-gold' : 'border-gold/20 text-ivory/40 hover:border-gold/40 hover:text-ivory'}`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or type a custom label (e.g. Parents, Gym)"
                  value={LABEL_PRESETS.includes(addressForm.label) ? '' : addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  className="luxury-input text-sm"
                />
              </div>

              {/* Recipient Name */}
              <div className="form-group">
                <label className="form-label font-bold tracking-[2px]">Recipient Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="Full name of recipient"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="luxury-input"
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label font-bold tracking-[2px]">Phone Number <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="luxury-input"
                />
              </div>

              {/* Address Line 1 */}
              <div className="form-group">
                <label className="form-label font-bold tracking-[2px]">Address Line 1 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="Flat / House No., Building, Street"
                  value={addressForm.line1}
                  onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                  className="luxury-input"
                />
              </div>

              {/* Address Line 2 */}
              <div className="form-group">
                <label className="form-label font-bold tracking-[2px]">Address Line 2 <span className="text-[10px] text-ivory/30 normal-case tracking-normal ml-1">(optional)</span></label>
                <input
                  type="text"
                  placeholder="Area, Colony, Landmark"
                  value={addressForm.line2}
                  onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                  className="luxury-input"
                />
              </div>

              {/* City / State / Pincode */}
              <div className="grid grid-cols-3 gap-4">
                <div className="form-group col-span-1">
                  <label className="form-label font-bold tracking-[2px]">City <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Mumbai" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="luxury-input" />
                </div>
                <div className="form-group col-span-1">
                  <label className="form-label font-bold tracking-[2px]">State <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Maharashtra" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="luxury-input" />
                </div>
                <div className="form-group col-span-1">
                  <label className="form-label font-bold tracking-[2px]">Pincode <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="400001" maxLength={6} value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} className="luxury-input" />
                </div>
              </div>

              {/* Set as Default */}
              <label className="flex items-center gap-3 cursor-pointer select-none group">
                <div
                  onClick={() => setAddressForm({ ...addressForm, isDefault: !addressForm.isDefault })}
                  className={`w-5 h-5 border flex items-center justify-center transition-all ${addressForm.isDefault ? 'bg-gold border-gold' : 'border-gold/20 group-hover:border-gold/40'}`}
                >
                  {addressForm.isDefault && <div className="w-2.5 h-2.5 bg-black" />}
                </div>
                <span className="text-[11px] text-ivory/50 uppercase tracking-[2px] font-bold group-hover:text-ivory transition-colors">Set as default delivery address</span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-gold/10 flex gap-4">
              <button
                disabled={addressLoading}
                onClick={handleSaveAddress}
                className="flex-1 btn btn-primary h-12 text-[11px] font-bold tracking-[4px] uppercase"
              >
                {addressLoading ? 'SAVING...' : editingAddressId ? 'SAVE CHANGES' : 'ADD ADDRESS'}
              </button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="btn btn-outline h-12 px-8 text-[11px] font-bold tracking-[3px] uppercase"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
