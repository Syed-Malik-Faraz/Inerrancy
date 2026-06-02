import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Search, User, Calendar, Tag, Check, ArrowRight, MessageSquare, Inbox } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminInboxPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts/admin');
      setInquiries(res.data.contacts || []);
      if (res.data.contacts?.length > 0 && !selectedId) {
        setSelectedId(res.data.contacts[0]._id);
      }
    } catch (err) {
      toast.error('Failed to connect to inquiry archives');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'read' ? 'pending' : 'read';
    try {
      const res = await api.put(`/contacts/admin/${id}/status`, { status: nextStatus });
      toast.success(nextStatus === 'read' ? 'Marked as Read' : 'Marked as Unread');
      setInquiries(inquiries.map(inq => inq._id === id ? res.data.contact : inq));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSendingReply(true);
    // Simulate premium reply transmission
    setTimeout(() => {
      toast.success('Olfactory dispatch transmitted successfully to client vault ✨');
      setReplyText('');
      setSendingReply(false);
    }, 1500);
  };

  const selectedInquiry = inquiries.find(inq => inq._id === selectedId);

  const filteredInquiries = inquiries.filter(inq => {
    const term = search.toLowerCase();
    return (
      inq.name.toLowerCase().includes(term) ||
      inq.email.toLowerCase().includes(term) ||
      inq.subject.toLowerCase().includes(term) ||
      inq.message.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-10 pb-20">
      <header className="header-vault">
        <div>
          <h1 className="title-vault">Olfactory Dispatch Inbox</h1>
          <p className="label-vault">Manage client inquires, custom curation requests, and support narratives</p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="spinner" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="card-vault flex flex-col items-center justify-center py-32 text-center border border-dashed border-gold/10">
          <Inbox size={48} className="text-gold/20 mb-6" />
          <h3 className="text-ivory font-bold uppercase tracking-widest text-sm mb-2">Vault Inbox Vacant</h3>
          <p className="text-ivory/30 text-[10px] uppercase tracking-[2px]">No incoming transmissions detected at this moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px] border border-gold/10 rounded-2xl overflow-hidden bg-black-2">
          
          {/* Left Column: Inquiry List */}
          <div className="lg:col-span-5 flex flex-col border-r border-gold/10 h-full bg-black/40">
            <div className="p-6 border-b border-gold/10">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/25 group-focus-within:text-gold/60 transition-colors duration-300" size={16} />
                <input
                  type="text"
                  placeholder="Filter inquiries..."
                  className="w-full bg-black-2 border border-gold/20 pl-12 pr-5 py-3.5 rounded-xl text-[11px] font-bold tracking-[2px] uppercase text-gold/80 outline-none placeholder-gold/20 focus:border-gold/50 focus:text-gold focus:bg-black-3 transition-all duration-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto grow no-scrollbar division-y divide-gold/5">
              {filteredInquiries.map((inq) => {
                const isSelected = inq._id === selectedId;
                const isRead = inq.status === 'read';
                
                return (
                  <button
                    key={inq._id}
                    onClick={() => {
                      setSelectedId(inq._id);
                      if (!isRead) handleToggleStatus(inq._id, 'pending');
                    }}
                    className={`w-full text-left p-6 transition-all border-b border-gold/5 flex gap-4 hover:bg-gold-muted/10 relative ${isSelected ? 'bg-gold-muted/20 border-r-2 border-r-gold' : ''}`}
                  >
                    <div className="shrink-0 pt-1">
                      {isRead ? (
                        <MailOpen size={18} className="text-ivory/30" />
                      ) : (
                        <Mail size={18} className="text-gold" />
                      )}
                    </div>
                    
                    <div className="grow space-y-2">
                      <div className="flex justify-between items-start">
                        <span className={`text-[11px] uppercase tracking-widest font-bold ${isRead ? 'text-ivory/50' : 'text-gold'}`}>
                          {inq.name}
                        </span>
                        <span className="text-[9px] text-ivory/30 uppercase tracking-[2px]">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h4 className={`text-xs uppercase tracking-wide truncate ${isRead ? 'text-ivory/60 font-medium' : 'text-ivory font-bold'}`}>
                        {inq.subject}
                      </h4>
                      
                      <p className="text-[10px] text-ivory/40 uppercase tracking-[2px] line-clamp-1">
                        {inq.message}
                      </p>
                    </div>

                    {!isRead && (
                      <span className="absolute top-6 right-6 w-2 h-2 rounded-full bg-gold animate-pulse" />
                    )}
                  </button>
                );
              })}
              {filteredInquiries.length === 0 && (
                <div className="p-10 text-center text-ivory/20 text-xs italic tracking-widest">
                  No matching inquiries found
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Inquiry Details */}
          <div className="lg:col-span-7 flex flex-col h-full bg-black/20">
            {selectedInquiry ? (
              <div className="flex flex-col h-full">
                
                {/* Header Action Bar */}
                <div className="p-6 border-b border-gold/10 flex items-center justify-between bg-black/40">
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border transition-all ${selectedInquiry.status === 'read' ? 'text-ivory/40 bg-white/5 border-white/10' : 'text-gold bg-gold/10 border-gold/20'}`}>
                      {selectedInquiry.status === 'read' ? 'Archived / Read' : 'Unread / New'}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleToggleStatus(selectedInquiry._id, selectedInquiry.status)}
                    className="btn btn-outline py-2 px-4 text-[9px] font-bold tracking-[2px] uppercase h-auto"
                  >
                    {selectedInquiry.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-8 space-y-8 grow overflow-y-auto no-scrollbar">
                  
                  {/* Sender Metadata */}
                  <div className="space-y-4 border-b border-gold/10 pb-6">
                    <h2 className="font-heading text-xl lg:text-2xl text-ivory tracking-wide leading-snug">
                      {selectedInquiry.subject}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-ivory/60">
                        <User size={14} className="text-gold/60" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-ivory/80">{selectedInquiry.name}</span>
                        <span className="text-[9px] text-ivory/30 uppercase tracking-[2px]">({selectedInquiry.email})</span>
                      </div>
                      <div className="flex items-center gap-3 text-ivory/60 md:justify-end">
                        <Calendar size={14} className="text-gold/60" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-ivory/80">
                          {new Date(selectedInquiry.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="text-ivory/70 text-sm leading-relaxed p-6 bg-black-2 border border-gold/5 rounded-xl whitespace-pre-wrap font-sans">
                    {selectedInquiry.message}
                  </div>

                  {/* Reply Form */}
                  <div className="pt-4 border-t border-gold/5">
                    <form onSubmit={handleSendReply} className="space-y-4">
                      <label className="text-[10px] font-bold tracking-[2px] uppercase text-gold flex items-center gap-2">
                        <MessageSquare size={12} /> Dispatch Reply Scent
                      </label>
                      <textarea
                        rows="3"
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Compose custom reply message to ${selectedInquiry.name}...`}
                        className="luxury-input w-full p-4 h-24 text-xs resize-none"
                      />
                      <button
                        type="submit"
                        disabled={sendingReply || !replyText.trim()}
                        className="btn btn-primary py-3 px-6 text-[10px] tracking-[2px] font-bold uppercase group inline-flex items-center gap-3 h-auto"
                      >
                        {sendingReply ? 'Dispatching...' : (
                          <>Dispatch Scent <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-12">
                <Mail size={32} className="text-gold/20 mb-4" />
                <p className="text-ivory/40 text-xs italic tracking-widest">Select an inquiry to view the communication trail</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminInboxPage;
