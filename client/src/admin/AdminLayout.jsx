import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Users, Ticket,
  MessageSquare, BookOpen, LogOut, Bell, Search, Menu, X, Settings, Mail,
  ShoppingCart, UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', path: '/admin/orders', icon: Package },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Inbox', path: '/admin/inbox', icon: Mail },
    { name: 'Editorial', path: '/admin/blog', icon: BookOpen },
  ];

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch {}
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.notifications.filter(n => !n.isRead).length);
    } catch {}
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBellClick = () => {
    if (!bellOpen) fetchNotifications();
    setBellOpen(prev => !prev);
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleNotificationClick = (n) => {
    if (!n.isRead) handleMarkRead(n._id);
    setBellOpen(false);
    if (n.type === 'new_order') navigate(`/admin/orders`);
    else if (n.type === 'new_user') navigate(`/admin/users`);
  };

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden font-body">

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-black-2 border-r border-gold/10 transition-transform duration-300 transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col pt-12">
          {/* Logo */}
          <div className="px-8 mb-12 flex items-center justify-between">
            <Link to="/admin" className="flex flex-col group">
              <span className="font-heading text-xl tracking-[6px] text-gold uppercase group-hover:text-gold-light transition-colors">INERRANCY</span>
              <span className="text-[8px] tracking-[4px] text-gold/40 uppercase font-bold mt-1">Directorial Vault</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-ivory/40">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-5 px-7 py-5 rounded-2xl text-[10px] font-bold tracking-[3px] uppercase transition-all duration-300 ${isActive ? 'bg-gold-muted text-gold border border-gold/10 shadow-inner' : 'text-ivory/40 hover:text-ivory hover:bg-white/5'}`}
                >
                  <item.icon size={20} className={isActive ? 'text-gold' : 'text-ivory/20'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer Nav */}
          <div className="p-4 border-t border-gold/5 space-y-1">
             <Link to="/" className="flex items-center gap-4 px-6 py-4 rounded-xl text-xs font-bold tracking-[2px] uppercase text-ivory/40 hover:bg-white/5 transition-all">
                <Settings size={18} className="text-ivory/20" /> Store View
             </Link>
             <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-xs font-bold tracking-[2px] uppercase text-luxury-red hover:bg-luxury-red/5 transition-all"
             >
                <LogOut size={18} /> Resign Vault
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Header */}
        <header className="h-20 bg-black-2/50 backdrop-blur-md border-b border-gold/10 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className={`${sidebarOpen ? 'hidden' : 'block'} lg:hidden text-ivory`}>
              <Menu size={24} />
            </button>
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/20" size={16} />
              <input
                type="text"
                placeholder="Lookup in Vault..."
                className="bg-black border border-gold/10 pl-12 pr-4 py-2.5 rounded-lg text-xs font-semibold tracking-widest uppercase text-gold outline-none w-80 focus:border-gold/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={handleBellClick}
                className="relative p-2 text-ivory/40 hover:text-gold transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 bg-luxury-red text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border border-black">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 top-12 w-80 bg-[#111] border border-gold/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gold/10">
                    <span className="text-[10px] font-bold tracking-[2px] uppercase text-gold">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[9px] font-bold tracking-widest uppercase text-ivory/40 hover:text-gold transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-ivory/30 text-xs py-8 tracking-widest uppercase">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <button
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gold/5 hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-gold/5' : ''}`}
                        >
                          <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${n.type === 'new_order' ? 'bg-gold/10' : 'bg-blue-500/10'}`}>
                            {n.type === 'new_order'
                              ? <ShoppingCart size={14} className="text-gold" />
                              : <UserPlus size={14} className="text-blue-400" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-bold tracking-wide ${!n.isRead ? 'text-ivory' : 'text-ivory/50'}`}>{n.title}</p>
                            <p className="text-[10px] text-ivory/40 mt-0.5 leading-relaxed truncate">{n.message}</p>
                            <p className="text-[9px] text-gold/40 mt-1 tracking-wider">{formatTime(n.createdAt)}</p>
                          </div>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-luxury-red shrink-0 mt-1" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-gold/10" />
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-ivory uppercase tracking-widest">{user?.name}</p>
                <p className="text-[9px] text-gold font-bold uppercase tracking-[2px]">High Overseer</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gold-muted border border-gold/20 flex items-center justify-center text-gold font-heading text-xl overflow-hidden">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-12 lg:p-20 no-scrollbar">
          <div className="container-admin">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
