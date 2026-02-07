
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus, ServiceType, PaymentStatus } from '../types';
import { STATUS_FLOW_CONFIG, SERVICES_CONFIG } from '../constants';
import Sidebar, { SidebarItem } from '../components/Sidebar';

interface AdminDashboardProps {
  orders: Order[];
  updateOrder: (order: Order) => void;
}

type AdminView = 'dashboard' | 'orders' | 'customers' | 'partners' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, updateOrder }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Derive Stats from real data
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.totalAmount, 0), [orders]);
  const activeOrdersCount = useMemo(() => orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length, [orders]);
  
  // Extract Unique Customers
  const customers = useMemo(() => {
    const map = new Map();
    orders.forEach(o => {
      if (!map.has(o.customerId)) {
        map.set(o.customerId, {
          id: o.customerId,
          name: o.customerName,
          phone: o.customerPhone,
          totalOrders: 0,
          totalSpent: 0
        });
      }
      const c = map.get(o.customerId);
      c.totalOrders += 1;
      c.totalSpent += o.totalAmount;
    });
    return Array.from(map.values());
  }, [orders]);

  // Extract Unique Partners
  const partners = useMemo(() => {
    const map = new Map();
    orders.forEach(o => {
      if (o.partnerId) {
        if (!map.has(o.partnerId)) {
          map.set(o.partnerId, {
            id: o.partnerId,
            name: o.partnerId === 'p1' ? 'Suresh Kumar' : (o.partnerId === 'p2' ? 'Ramesh Singh' : 'Simulated Partner'),
            activeOrders: 0,
            completedOrders: 0
          });
        }
        const p = map.get(o.partnerId);
        if (o.status === OrderStatus.DELIVERED) p.completedOrders += 1;
        else p.activeOrders += 1;
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: '📦', color: 'bg-blue-500' },
    { label: 'Active Tasks', value: activeOrdersCount, icon: '🚴', color: 'bg-emerald-500' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: 'bg-orange-500' },
    { label: 'Customers', value: customers.length, icon: '👥', color: 'bg-purple-500' },
  ];

  const adminMenuItems: SidebarItem[] = [
    { label: 'Dashboard', icon: '📊', active: activeView === 'dashboard', onClick: () => setActiveView('dashboard') },
    { label: 'Orders', icon: '🧺', active: activeView === 'orders', onClick: () => setActiveView('orders') },
    { label: 'Customers', icon: '👥', active: activeView === 'customers', onClick: () => setActiveView('customers') },
    { label: 'Partners', icon: '🚴', active: activeView === 'partners', onClick: () => setActiveView('partners') },
    { label: 'Settings', icon: '⚙️', active: activeView === 'settings', onClick: () => setActiveView('settings') },
  ];

  const chartData = [
    { name: 'Mon', revenue: totalRevenue * 0.1, orders: Math.floor(orders.length * 0.1) },
    { name: 'Tue', revenue: totalRevenue * 0.12, orders: Math.floor(orders.length * 0.12) },
    { name: 'Wed', revenue: totalRevenue * 0.15, orders: Math.floor(orders.length * 0.15) },
    { name: 'Thu', revenue: totalRevenue * 0.18, orders: Math.floor(orders.length * 0.18) },
    { name: 'Fri', revenue: totalRevenue * 0.22, orders: Math.floor(orders.length * 0.22) },
    { name: 'Sat', revenue: totalRevenue * 0.25, orders: Math.floor(orders.length * 0.25) },
    { name: 'Sun', revenue: totalRevenue * 0.2, orders: Math.floor(orders.length * 0.2) },
  ];

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      updateOrder({ ...order, status: newStatus });
      if (editingOrder?.id === id) {
        setEditingOrder({ ...order, status: newStatus });
      }
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="pb-32 min-h-screen relative bg-slate-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        title="LaundroPro"
        subtitle="Admin Panel"
        themeColor="bg-indigo-600"
        items={adminMenuItems}
        user={{ name: "System Admin", email: "admin@laundro.com", avatar: "https://i.pravatar.cc/150?u=admin" }}
      />

      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <div className="w-5 h-0.5 bg-slate-600 rounded-full" />
            <div className="w-5 h-0.5 bg-slate-600 rounded-full" />
            <div className="w-5 h-0.5 bg-slate-600 rounded-full" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900">Admin</h1>
          </div>
        </div>
        <img src="https://i.pravatar.cc/150?u=admin" className="w-10 h-10 rounded-full border-2 border-indigo-100" alt="Admin" />
      </nav>

      <div className="p-8 max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div key="dashboard" {...pageVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-black text-slate-900 mb-6">Revenue Growth (7 Days)</h3>
                  <div className="h-[300px] w-full min-h-[300px] relative">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-black text-slate-900 mb-6">Status Breakdown</h3>
                  <div className="space-y-4">
                    {Object.entries(STATUS_FLOW_CONFIG).map(([key, value]) => {
                      const count = orders.filter(o => o.status === key).length;
                      const percentage = Math.round((count / (orders.length || 1)) * 100) || 0;
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-[10px] font-black mb-1">
                            <span className="text-slate-500 uppercase">{value.label}</span>
                            <span className="text-slate-900">{count}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full">
                            <div 
                              className={`h-full rounded-full ${value.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`} 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'orders' && (
            <motion.div key="orders" {...pageVariants}>
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                  <input 
                    type="text" 
                    placeholder="Search by order ID or customer..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full md:w-96 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors"
                  />
                  <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                    <button 
                      onClick={() => setStatusFilter('ALL')}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${statusFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                      All
                    </button>
                    {Object.keys(STATUS_FLOW_CONFIG).map(s => (
                      <button 
                        key={s}
                        onClick={() => setStatusFilter(s as OrderStatus)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {(STATUS_FLOW_CONFIG as any)[s].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <th className="px-8 py-4">ID</th>
                        <th className="px-8 py-4">Customer</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Amount</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 font-black text-slate-900">{order.orderNumber}</td>
                          <td className="px-8 py-6">
                            <p className="font-bold text-slate-900">{order.customerName}</p>
                            <p className="text-xs text-slate-400">{order.customerPhone}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${STATUS_FLOW_CONFIG[order.status]?.color}`}>
                              {STATUS_FLOW_CONFIG[order.status]?.label}
                            </span>
                          </td>
                          <td className="px-8 py-6 font-black text-slate-900">₹{order.totalAmount}</td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => setEditingOrder(order)}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-transform"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'customers' && (
            <motion.div key="customers" {...pageVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map(c => (
                <div key={c.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-2xl mb-4 font-black text-indigo-600">
                    {c.name.charAt(0)}
                  </div>
                  <h4 className="font-black text-slate-900 text-lg">{c.name}</h4>
                  <p className="text-slate-500 text-xs mb-6">{c.phone}</p>
                  <div className="grid grid-cols-2 w-full gap-4 pt-6 border-t border-slate-50">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Orders</p>
                        <p className="font-black text-slate-900">{c.totalOrders}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Spent</p>
                        <p className="font-black text-indigo-600">₹{c.totalSpent}</p>
                     </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeView === 'partners' && (
            <motion.div key="partners" {...pageVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map(p => (
                <div key={p.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl">🚴</div>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[8px] font-black uppercase">Active</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-lg">{p.name}</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase mb-6 tracking-widest">Partner ID: {p.id}</p>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-black uppercase tracking-widest">Active Tasks</span>
                        <span className="text-indigo-600 font-black">{p.activeOrders}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-black uppercase tracking-widest">Total Completed</span>
                        <span className="text-emerald-600 font-black">{p.completedOrders}</span>
                     </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeView === 'settings' && (
            <motion.div key="settings" {...pageVariants} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm max-w-2xl">
               <h3 className="text-2xl font-black text-slate-900 mb-10">System Control</h3>
               <div className="space-y-10">
                  <div className="flex items-center justify-between">
                     <div>
                        <h4 className="font-black text-slate-900">Accepting New Orders</h4>
                        <p className="text-sm text-slate-400 mt-1">Temporarily pause customer bookings</p>
                     </div>
                     <button className="w-14 h-8 bg-emerald-500 rounded-full flex items-center px-1">
                        <div className="w-6 h-6 bg-white rounded-full translate-x-6 shadow-sm" />
                     </button>
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                     <div>
                        <h4 className="font-black text-slate-900">Partner Auto-Assign</h4>
                        <p className="text-sm text-slate-400 mt-1">Smart matching logic (In Beta)</p>
                     </div>
                     <button className="w-14 h-8 bg-slate-200 rounded-full flex items-center px-1">
                        <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
                     </button>
                  </div>
                  <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Save Configuration</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {editingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setEditingOrder(null)} 
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
             />
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
               className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl relative z-10 overflow-hidden"
             >
                <div className="p-10 bg-indigo-600 text-white">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2">Order Management</p>
                   <h3 className="text-3xl font-black">{editingOrder.orderNumber}</h3>
                </div>
                <div className="p-10 space-y-8">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Update Status</label>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                         {Object.entries(STATUS_FLOW_CONFIG).map(([k, v]) => (
                            <button 
                              key={k}
                              onClick={() => handleUpdateStatus(editingOrder.id, k as OrderStatus)}
                              className={`px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter border-2 transition-all ${editingOrder.status === k ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-400 hover:border-slate-200'}`}
                            >
                              {v.label}
                            </button>
                         ))}
                      </div>
                   </div>
                   <button 
                      onClick={() => setEditingOrder(null)}
                      className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                   >
                      Done
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
