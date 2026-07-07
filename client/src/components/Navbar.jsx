import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navBrands, setNavBrands] = useState(['Lattafa', 'Ahmed Al Maghribi', 'Afnan', 'Rasasi', 'Swiss Arabian', 'Khadlaj']);
  const { user, isAdmin, logout } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const refreshBrands = () => {
    api.get('/products/brands').then(res => {
      if (res.data.brands?.length) setNavBrands(res.data.brands);
    }).catch(() => {});
  };

  useEffect(() => {
    refreshBrands();
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('brands-updated', refreshBrands);
    return () => window.removeEventListener('brands-updated', refreshBrands);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'Brands',
      dropdown: navBrands
    },

    {
      name: 'Find Products',
      dropdown: [
        { label: 'By Fragrance', paramKey: 'fragranceFamily', items: ['Sweet', 'Fresh', 'Woody', 'Spicy', 'Floral', 'Aqua'] },
        { label: 'By Occasion', paramKey: 'occasion', items: ['Party & Evening', 'Date Night', 'Daily Wear', 'Office Wear'] },
      ]
    },
    
    { name: 'Shop All', path: '/shop' },
    // { name: 'Blog', path: '/blog' },
    { name: 'AI Finder', path: '/ai-finder', ai: true },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="fixed top-0 w-full h-8 lg:h-10 bg-black-2 border-b border-gold/10 z-[60] flex items-center justify-center overflow-hidden">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-[9px] lg:text-[10px] tracking-[4px] text-gold font-bold uppercase">
              🏺 Complimentary Shipping on Luxury Orders Over ₹999 — Experience Inerrancy
            </span>
          ))}
        </div>
      </div>

      <nav className={`fixed top-8 lg:top-10 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass h-[72px] shadow-2xl border-b border-gold/10' : 'bg-transparent h-[90px]'}`}>
        <div className="container h-full flex items-center justify-between">
          
          {/* Left: Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-ivory hover:text-gold transition-colors">
            <Menu size={24} />
          </button>

          {/* Center: Brand Logo */}
          <Link to="/" className="flex items-center justify-center group">
            <img
              src="/Inerrancy-logo.jpeg"
              alt="Inerrancy Logo"
              className="h-[56px] lg:h-20 w-auto object-contain"
              style={{ transform: 'translateY(2px)' }}
            />
          </Link>

          {/* Middle: Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group py-2">
                {link.path ? (
                  <Link
                    to={link.path}
                    className={`text-xs font-semibold uppercase tracking-[2px] transition-colors hover:text-gold underline-gold flex items-center gap-1.5 ${link.ai ? 'text-gold' : ''}`}
                  >
                    {link.ai && <Sparkles size={12} />}
                    {link.name}
                  </Link>
                ) : (
                  <button className="text-xs font-semibold uppercase tracking-[2px] flex items-center gap-1 transition-colors hover:text-gold">
                    {link.name} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </button>
                )}
                
                {/* Dropdown / Mega Menu */}
                {link.dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-black-2 border border-gold/20 p-6 min-w-[200px] shadow-2xl rounded-sm">
                      <div className="grid grid-cols-1 gap-4">
                        {link.dropdown.map((item, idx) => (
                          typeof item === 'string' ? (
                            <Link key={idx} to={`/shop?brand=${item}`} className="text-[11px] uppercase tracking-wider text-ivory/70 hover:text-gold transition-colors block">
                              {item}
                            </Link>
                          ) : (
                            <div key={idx} className="mb-2">
                              <span className="text-[10px] text-gold font-bold block mb-2 uppercase tracking-[2px] border-b border-gold/10 pb-1">{item.label}</span>
                              <div className="grid grid-cols-1 gap-2">
                                {item.items.map((sub, sIdx) => (
                                  <Link key={sIdx} to={`/shop?${item.paramKey}=${encodeURIComponent(sub)}`} className="text-[11px] text-ivory/60 hover:text-gold transition-colors block">
                                    {sub}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Admin Toggle (Desktop) */}
            {isAdmin && (
              <Link to="/admin" className="text-[10px] font-bold uppercase tracking-[3px] text-gold border border-gold/20 px-5 py-2 hover:bg-gold hover:text-black transition-all">
                Admin
              </Link>
            )}
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-5 lg:gap-7">
            <button
              className="text-ivory hover:text-gold transition-colors hidden sm:block"
              onClick={() => setSearchOpen(prev => !prev)}
            >
              <Search size={20} />
            </button>
            
            <div className="relative group">
              <button 
                className="text-ivory hover:text-gold transition-colors flex items-center gap-2 py-2"
                onClick={() => !user && navigate('/login')}
              >
                <User size={20} />
                {user && <span className="text-[9px] font-bold uppercase tracking-[2px] hidden md:block max-w-[80px] truncate">{user.name}</span>}
              </button>

              {user && (
                <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-black-2 border border-gold/20 min-w-[200px] shadow-2xl rounded-sm py-4">
                    <div className="px-6 py-3 border-b border-gold/10 mb-2">
                       <p className="text-[9px] text-gold font-bold uppercase tracking-[3px]">Signed In As</p>
                       <p className="text-xs font-bold text-ivory truncate uppercase mt-1 tracking-widest">{user.name}</p>
                    </div>

                    <Link to="/profile" className="flex items-center gap-3 px-6 py-3 text-[10px] font-bold uppercase tracking-[2px] text-ivory/60 hover:text-gold hover:bg-gold/5 transition-all">
                       My Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-6 py-3 text-[10px] font-bold uppercase tracking-[2px] text-ivory/60 hover:text-gold hover:bg-gold/5 transition-all">
                       My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-6 py-3 text-[10px] font-bold uppercase tracking-[2px] text-gold hover:bg-gold/5 transition-all border-t border-gold/10 mt-2">
                         Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-6 py-3 text-[10px] font-bold uppercase tracking-[2px] text-luxury-red hover:bg-luxury-red/5 transition-all border-t border-gold/10 mt-2"
                    >
                       Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/wishlist" className="text-ivory hover:text-gold transition-colors hidden sm:block relative">
              <Heart size={20} />
              {user?.wishlist?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-luxury-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {user.wishlist.length}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setCartOpen(true)}
              className="text-ivory hover:text-gold transition-colors relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            className="absolute top-full left-0 w-full bg-black-2 border-b border-gold/20 px-6 py-4 animate-fade-in shadow-2xl"
          >
            <div className="container flex items-center gap-4">
              <Search size={15} className="text-gold/40 shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fragrances, brands..."
                className="flex-1 bg-transparent text-ivory text-sm outline-none placeholder-ivory/30 tracking-wider py-1"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="text-ivory/30 hover:text-gold transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Mobile Drawer */}
        <div className={`fixed inset-0 bg-black/95 z-[100] transition-transform duration-500 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} backdrop-blur-xl`}>
          <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-16">
              <span className="font-heading text-2xl tracking-[4px] text-gold">INERRANCY</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-ivory hover:text-gold transition-colors"><X size={32} /></button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path || '/shop'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-heading tracking-widest uppercase border-b border-gold/10 pb-4 transition-colors flex items-center gap-3 ${link.ai ? 'text-gold' : 'text-ivory hover:text-gold'}`}
                >
                  {link.ai && <Sparkles size={20} />}
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-heading tracking-widest uppercase text-gold">
                  Admin Panel
                </Link>
              )}
            </div>
            <div className="mt-auto pb-10 border-t border-gold/10 pt-10">
               {user ? (
                 <>
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center text-gold font-bold">{user.name[0]}</div>
                      <div>
                         <p className="text-xs font-bold text-ivory uppercase tracking-widest">{user.name}</p>
                         <button onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }} className="text-[10px] text-luxury-red uppercase font-bold tracking-[2px] mt-1 underline">Sign Out</button>
                      </div>
                   </div>
                 </>
               ) : (
                 <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary w-full py-4 text-[10px] font-bold tracking-[3px] uppercase mb-8">Sign In</Link>
               )}
               <p className="text-[10px] text-ivory/20 uppercase tracking-[4px] font-bold mb-4">The House of Luxury</p>
               <div className="w-12 h-0.5 bg-gold/20" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
