import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, IndianRupee, Package, Users, ShoppingBag, 
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import api from '../../api/axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  const StatCard = ({ title, value, prevValue, icon: Icon, color }) => {
    const isIncrease = value > prevValue;
    const diff = prevValue ? Math.round(((value - prevValue) / prevValue) * 100) : 0;
    
    return (
      <div className="bg-black-2 border border-gold/10 p-8 rounded-2xl shadow-xl animate-fade-up relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <Icon size={120} className="text-gold" />
        </div>
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-500`}>
            <Icon size={24} />
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold tracking-widest ${isIncrease ? 'text-luxury-green' : 'text-luxury-red'} bg-black px-2 py-1 rounded`}>
            {isIncrease ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(diff)}%
          </div>
        </div>
        <p className="text-[10px] font-bold text-ivory/30 uppercase tracking-[3px] mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-ivory font-heading">{title === 'Revenue' ? '₹' : ''}{value.toLocaleString()}</h3>
      </div>
    );
  };

  return (
    <div className="space-y-12 pb-20">
      
      <header className="header-vault">
        <div>
          <h1 className="title-vault">Vault Overview</h1>
          <p className="label-vault">Inerrancy Directorial Intelligence Dashboard</p>
        </div>
        <div className="flex bg-black-2 border border-gold/10 rounded-lg overflow-hidden">
           {['24h', '7d', '30d', 'All'].map(t => (
             <button key={t} className={`px-6 py-2.5 text-[10px] font-bold tracking-[2px] uppercase transition-all ${t === '30d' ? 'bg-gold text-black' : 'text-ivory/40 hover:text-gold'}`}>
                {t}
             </button>
           ))}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        <StatCard title="Revenue" value={stats?.totalRevenue || 0} prevValue={stats?.prevRevenue} icon={IndianRupee} color="gold" />
        <StatCard title="Acquisitions" value={stats?.totalOrders || 0} prevValue={stats?.prevOrders} icon={Package} color="gold" />
        <StatCard title="Members" value={stats?.totalUsers || 0} prevValue={stats?.prevUsers} icon={Users} color="gold" />
        <StatCard title="Products" value={stats?.totalProducts || 0} prevValue={stats?.prevProducts} icon={ShoppingBag} color="gold" />
      </div>

      {/* row 2: Charts & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
        
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-black-2 border border-gold/10 p-10 rounded-2xl shadow-xl animate-fade-in">
           <div className="flex justify-between items-center mb-10">
              <h3 className="font-heading text-2xl text-ivory tracking-wide">Acquisition Trajectory</h3>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-gold" />
                 <span className="text-[10px] text-ivory/40 uppercase tracking-widest">Gross Value (INR)</span>
              </div>
           </div>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={stats?.salesData || []}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(201,168,76,0.05)" />
                    <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: 'rgba(245,240,232,0.3)', fontSize: 10, fontWeight: 700}} 
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: 'rgba(245,240,232,0.3)', fontSize: 10, fontWeight: 700}} 
                    />
                    <Tooltip 
                       contentStyle={{backgroundColor: '#111111', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', borderRadius: '8px', fontSize: '11px', textTransform: 'uppercase'}}
                       itemStyle={{color: '#C9A84C'}}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#C9A84C" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-black-2 border border-gold/10 p-10 rounded-2xl shadow-xl animate-fade-in">
           <div className="flex justify-between items-center mb-10">
              <h3 className="font-heading text-2xl text-ivory tracking-wide">Live Transmissions</h3>
              <Link to="/admin/orders" className="text-[10px] text-gold hover:underline uppercase tracking-widest font-bold">Archive</Link>
           </div>
           <div className="space-y-8">
              {stats?.recentOrders?.map((order) => (
                <div key={order._id} className="flex gap-4 items-center group">
                   <div className="w-12 h-12 rounded-xl bg-black border border-gold/5 flex items-center justify-center shrink-0">
                      <Clock size={20} className="text-gold/30 group-hover:text-gold transition-colors" />
                   </div>
                   <div className="grow">
                      <p className="text-xs font-bold text-ivory uppercase tracking-widest">{order.user?.name || 'Guest Explorer'}</p>
                      <p className="text-[9px] text-ivory/30 uppercase tracking-[2px] mt-1">₹{order.totalPrice} • {order.orderStatus}</p>
                   </div>
                   <Link to={`/admin/orders/${order._id}`} className="text-ivory/10 hover:text-gold transition-colors">
                      <ArrowUpRight size={18} />
                   </Link>
                </div>
              ))}
              {stats?.recentOrders?.length === 0 && (
                <p className="text-center text-ivory/20 text-xs py-10 italic">No recent transmissions</p>
              )}
           </div>
        </div>

      </div>

      {/* Row 3: Bottom Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-black-2 border border-gold/10 p-10 rounded-2xl shadow-xl animate-fade-in">
            <h3 className="font-heading text-2xl text-ivory mb-10 tracking-wide">Top Acquisitions</h3>
            <div className="space-y-6">
               {stats?.topProducts?.map((p, i) => (
                 <div key={i} className="flex justify-between items-center pb-6 border-b border-gold/5 last:border-0">
                    <div className="flex gap-4">
                       <span className="text-gold font-heading text-xl opacity-20 w-6">0{i+1}</span>
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-ivory uppercase tracking-widest">{p.name}</span>
                          <span className="text-[9px] text-gold font-bold uppercase tracking-[2px]">{p.brand}</span>
                       </div>
                    </div>
                    <span className="text-xs font-bold text-ivory/60 uppercase tracking-widest">{p.sales} Sales</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-black-2 border border-gold/10 p-10 rounded-2xl shadow-xl animate-fade-in flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 rounded-full border border-gold flex items-center justify-center text-gold mb-8 animate-pulse">
               <ShieldCheck size={40} />
            </div>
            <h3 className="font-heading text-3xl text-ivory mb-4 tracking-wide italic">Vault Integrity: Secured</h3>
            <p className="text-ivory/40 text-[10px] uppercase tracking-[4px] leading-relaxed max-w-sm mb-10">
               Directorial access verified. All systems operational. Curating the future of luxury fragrances in India.
            </p>
            <div className="flex gap-4">
               <div className="flex flex-col items-center px-8 border-r border-gold/10">
                  <span className="text-2xl font-bold text-gold">99.9%</span>
                  <span className="text-[8px] text-ivory/30 uppercase tracking-[2px]">Uptime</span>
               </div>
               <div className="flex flex-col items-center px-8 border-r border-gold/10">
                  <span className="text-2xl font-bold text-gold">TLS 1.3</span>
                  <span className="text-[8px] text-ivory/30 uppercase tracking-[2px]">Socket</span>
               </div>
               <div className="flex flex-col items-center px-8">
                  <span className="text-2xl font-bold text-gold">Curated</span>
                  <span className="text-[8px] text-ivory/30 uppercase tracking-[2px]">Status</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default DashboardPage;
