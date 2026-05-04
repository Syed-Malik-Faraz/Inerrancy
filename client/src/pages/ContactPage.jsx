import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, Clock } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Message Received in Vault. Our curators will respond shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 border-b border-gold/10">
      <div className="container">
        
        {/* Header */}
        <div className="text-center mb-24 animate-fade-in">
           <span className="section-label">COMMUNICATION</span>
           <h1 className="font-heading text-5xl lg:text-7xl text-ivory mb-6 tracking-wide">Connect With the Curators</h1>
           <div className="gold-divider mx-auto" />
           <p className="text-ivory/60 text-lg lg:text-xl font-light max-w-2xl mx-auto italic leading-relaxed font-heading">
             "Our client specialists are available to guide your olfactory discovery."
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
           
           {/* Left: Contact Info */}
           <div className="space-y-16 animate-fade-in translate-up">
              <div className="space-y-10">
                 <div className="flex gap-8 group">
                    <div className="w-16 h-16 rounded-2xl bg-black-2 border border-gold/10 flex items-center justify-center text-gold transition-all group-hover:bg-gold group-hover:text-black shrink-0">
                       <MapPin size={28} />
                    </div>
                    <div>
                       <h4 className="text-xs font-bold text-ivory uppercase tracking-[3px] mb-3">Principal HQ</h4>
                       <p className="text-ivory/40 text-[11px] uppercase tracking-[2px] leading-relaxed scale-95 origin-left">
                          DLF Cyber City, Tower 10, Level 15<br />
                          Gurgaon, Haryana 122002, India
                       </p>
                    </div>
                 </div>

                 <div className="flex gap-8 group">
                    <div className="w-16 h-16 rounded-2xl bg-black-2 border border-gold/10 flex items-center justify-center text-gold transition-all group-hover:bg-gold group-hover:text-black shrink-0">
                       <Mail size={28} />
                    </div>
                    <div>
                       <h4 className="text-xs font-bold text-ivory uppercase tracking-[3px] mb-3">Direct Dispatch</h4>
                       <p className="text-ivory/40 text-[11px] uppercase tracking-[2px] leading-relaxed scale-95 origin-left mb-2">
                          Primary Support: support@inerrancy.in
                       </p>
                       <p className="text-ivory/40 text-[11px] uppercase tracking-[2px] leading-relaxed scale-95 origin-left">
                          Business Enquiries: curator@inerrancy.in
                       </p>
                    </div>
                 </div>

                 <div className="flex gap-8 group">
                    <div className="w-16 h-16 rounded-2xl bg-black-2 border border-gold/10 flex items-center justify-center text-gold transition-all group-hover:bg-gold group-hover:text-black shrink-0">
                       <Phone size={28} />
                    </div>
                    <div>
                       <h4 className="text-xs font-bold text-ivory uppercase tracking-[3px] mb-3">Voice Access</h4>
                       <p className="text-ivory/40 text-[11px] uppercase tracking-[2px] leading-relaxed scale-95 origin-left mb-1">
                          Concierge: +91 82877 91303
                       </p>
                       <p className="text-ivory/40 text-[11px] uppercase tracking-[2px] leading-relaxed scale-95 origin-left italic">
                          Mon–Sat: 10:00 – 19:00 IST
                       </p>
                    </div>
                 </div>
              </div>

              {/* Socials */}
              <div className="p-10 bg-black-2 border-l-2 border-gold rounded-r-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-2xl rounded-full" />
                 <h4 className="text-xs font-bold text-ivory uppercase tracking-[3px] mb-6">Social Portfolios</h4>
                 <div className="flex gap-6">
                    {[FaInstagram, FaFacebookF, FaTwitter].map((Icon, i) => (
                      <a key={i} href="#" className="w-12 h-12 rounded-full border border-gold/10 flex items-center justify-center text-ivory/40 hover:text-gold hover:border-gold transition-all duration-300">
                         <Icon size={20} />
                      </a>
                    ))}
                 </div>
              </div>

              <div className="flex items-center gap-4 text-gold/40 text-[10px] uppercase tracking-[4px]">
                 <ShieldCheck size={16} /> END-TO-END ENCRYPTED COMMUNICATION
              </div>
           </div>

           {/* Right: Contact Form */}
           <div className="animate-fade-in translate-up">
              <form onSubmit={handleSubmit} className="bg-black-2 border border-gold/10 p-10 lg:p-14 rounded-3xl shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gold px-4" />
                 <h3 className="font-heading text-3xl text-ivory mb-10 tracking-wide uppercase">Transmit Message</h3>
                 
                 <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="form-group">
                          <label className="form-label">Your Name</label>
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="luxury-input" 
                            placeholder="Full Identity" 
                          />
                       </div>
                       <div className="form-group">
                          <label className="form-label">Email Essence</label>
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="luxury-input" 
                            placeholder="name@email.com" 
                          />
                       </div>
                    </div>

                    <div className="form-group">
                       <label className="form-label">Subject of Inquiry</label>
                       <input 
                          type="text" 
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="luxury-input" 
                          placeholder="e.g. Order Tracking / Product Discovery" 
                       />
                    </div>

                    <div className="form-group">
                       <label className="form-label">Your Narrative</label>
                       <textarea 
                          required
                          rows="5"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="luxury-input resize-none py-4" 
                          placeholder="How may we assist your journey?"
                       ></textarea>
                    </div>

                    <button 
                      disabled={loading}
                      className="w-full btn btn-primary py-5 text-[12px] font-bold tracking-[6px] uppercase group overflow-hidden relative"
                    >
                       <span className="relative z-10 flex items-center justify-center gap-4 transition-transform group-hover:-translate-x-1">
                          {loading ? 'TRANSMITTING...' : <>SEND MESSAGE <Send size={18} /></>}
                       </span>
                    </button>
                    
                    <p className="text-center text-[9px] text-ivory/30 uppercase tracking-[3px] mt-8 flex items-center justify-center gap-2">
                       <Clock size={10} /> Average Response Time: 4 Hours
                    </p>
                 </div>
              </form>
           </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
