import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Shield, Trash2, Edit3, Mail, 
  Calendar, CheckCircle2, UserCheck, UserX, Crown
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users?keyword=${search}`);
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error('Failed to connect to Client Directory');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Escalate/De-escalate ${u.name} to ${newRole}?`)) return;
    
    try {
      await api.put(`/users/${u._id}/role`, { role: newRole });
      toast.success(`Access Level Adjusted: ${newRole.toUpperCase()}`);
      fetchUsers();
    } catch {
      toast.error('Identity modification failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Void this identity from the vault permanently?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Identity Voided');
      fetchUsers();
    } catch {
      toast.error('Operation failed');
    }
  };

  return (
    <div className="space-y-20 lg:space-y-32 pb-20">
      
      <header className="header-vault">
        <div>
          <h1 className="title-vault">Client Directory</h1>
          <p className="label-vault">Manage identity archives and vault access levels</p>
        </div>
      </header>

      <div className="card-vault overflow-hidden">
        <div className="flex flex-wrap gap-4 mb-20 justify-between items-center">
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/25 group-focus-within:text-gold/60 transition-colors duration-300" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, role..."
              className="w-full bg-black-2 border border-gold/20 pl-12 pr-5 py-3.5 rounded-xl text-[11px] font-bold tracking-[2px] uppercase text-gold/80 outline-none placeholder-gold/20 focus:border-gold/50 focus:text-gold focus:bg-black-3 transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table-vault">
            <thead>
              <tr>
                <th>Identity Fragment</th>
                <th>Access Level</th>
                <th>Joined Archive</th>
                <th>Engagement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="group italic-links">
                  <td>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-gold-muted border border-gold/10 flex items-center justify-center text-gold font-heading text-xl overflow-hidden shrink-0">
                          {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.name?.[0]}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-ivory uppercase tracking-widest flex items-center gap-2">
                             {u.name} {u.role === 'admin' && <Crown size={12} className="text-gold" />}
                          </p>
                          <p className="text-[10px] text-ivory/20 uppercase tracking-[2px] group-hover:text-gold/40 transition-colors uppercase">{u.email}</p>
                       </div>
                    </div>
                  </td>
                  <td>
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border transition-all ${u.role === 'admin' ? 'text-gold bg-gold/10 border-gold/20 shadow-gold' : 'text-ivory/40 bg-white/5 border-white/10'}`}>
                      {u.role === 'admin' ? 'High Overseer' : 'Curated Client'}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                       <span className="text-[10px] text-ivory/40 uppercase tracking-widest">{new Date(u.createdAt).toLocaleDateString()}</span>
                       <span className="text-[8px] text-ivory/20 uppercase tracking-[2px] mt-1 italic">V1 Vault</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-bold text-gold uppercase tracking-widest">{u.orders?.length || 0} Acquisitions</span>
                       <span className="text-[8px] text-ivory/20 uppercase tracking-[2px] mt-1 italic">Value: ₹{u.totalSpent || 0}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                       <button onClick={() => toggleRole(u)} className="p-2.5 bg-gold-muted/30 text-gold rounded-lg border border-gold/10 hover:bg-gold hover:text-black transition-all" title="Toggle Access Level">
                          {u.role === 'admin' ? <UserX size={14} /> : <UserCheck size={14} />}
                       </button>
                       <button onClick={() => handleDelete(u._id)} className="p-2.5 bg-luxury-red/10 text-luxury-red rounded-lg border border-luxury-red/10 hover:bg-luxury-red hover:text-white transition-all" title="Void Identity">
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && !loading && (
             <p className="text-center py-20 text-ivory/20 text-xs italic tracking-widest">No matching identities in vault directory</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminUsersPage;
