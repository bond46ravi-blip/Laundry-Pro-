
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Order, OrderStatus, PaymentStatus } from '../types';
import { STATUS_FLOW_CONFIG } from '../constants';
import Sidebar, { SidebarItem } from '../components/Sidebar';

interface PartnerAppProps {
  orders: Order[];
  updateOrder: (order: Order) => void;
}

const SwipeButton: React.FC<{
  label: string;
  onComplete: () => void;
  disabled?: boolean;
  successLabel?: string;
}> = ({ label, onComplete, disabled, successLabel = "✓ Done" }) => {
  const x = useMotionValue(0);
  const [isComplete, setIsComplete] = useState(false);
  const threshold = 220;

  const backgroundWidth = useTransform(x, [0, threshold], ["0%", "100%"]);
  const opacity = useTransform(x, [0, threshold], [1, 0]);
  const iconScale = useTransform(x, [0, threshold], [1, 1.2]);

  useEffect(() => {
    setIsComplete(false);
    x.set(0);
  }, [label, x]);

  const handleDragEnd = () => {
    if (x.get() >= threshold) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1200);
    } else {
      x.set(0);
    }
  };

  return (
    <div className={`relative h-20 w-full bg-slate-100 rounded-[24px] overflow-hidden border-2 transition-all duration-300 ${disabled ? 'opacity-40 border-slate-200 pointer-events-none' : 'border-indigo-100 shadow-lg'}`}>
      <motion.div 
        style={{ width: backgroundWidth }} 
        className="absolute top-0 left-0 h-full bg-emerald-500/20 z-0" 
      />
      
      <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <span className={`text-[11px] font-black uppercase tracking-[0.2em] pl-12 ${disabled ? 'text-slate-400' : 'text-indigo-600'}`}>
          {disabled ? 'LOCKED' : label}
        </span>
      </motion.div>

      <AnimatePresence>
        {isComplete ? (
          <motion.div 
            initial={{ y: 80 }} 
            animate={{ y: 0 }} 
            className="absolute inset-0 flex items-center justify-center bg-emerald-600 text-white z-20"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              // Fix: Removed duplicate stiffness property
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">✓</span>
              <span className="text-sm font-black uppercase tracking-widest">{successLabel}</span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            drag="x" 
            dragConstraints={{ left: 0, right: threshold }} 
            dragElastic={0.05} 
            style={{ x, scale: iconScale }} 
            onDragEnd={handleDragEnd} 
            className={`absolute left-2 top-2 h-16 w-16 rounded-2xl flex items-center justify-center shadow-xl cursor-grab active:cursor-grabbing z-30 text-2xl border ${disabled ? 'bg-slate-200 text-slate-400 border-slate-300' : 'bg-white text-emerald-600 border-slate-100'}`}
          >
            <motion.span
              animate={disabled ? {} : { x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PartnerApp: React.FC<PartnerAppProps> = ({ orders, updateOrder }) => {
  const [view, setView] = useState<'orders' | 'detail' | 'schedule' | 'earnings'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [clothCountInput, setClothCountInput] = useState('');
  const [blanketCountInput, setBlanketCountInput] = useState('');
  const [pickupDateTimeInput, setPickupDateTimeInput] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync Monitoring Ref
  const prevOrdersRef = useRef<Order[]>(orders);

  // Actual Partner ID (Simulation)
  const currentPartnerId = "p1"; 

  // Initialize current time for pickup
  useEffect(() => {
    if (view === 'detail' && selectedOrder?.status === OrderStatus.PARTNER_ASSIGNED) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setPickupDateTimeInput(now.toISOString().slice(0, 16));
    }
  }, [view, selectedOrder]);

  // Sync Listener Logic (Simulating Realtime DB)
  useEffect(() => {
    const prevOrders = prevOrdersRef.current;
    
    // Check for changes affecting current selected order
    if (selectedOrder) {
      const currentRemote = orders.find(o => o.id === selectedOrder.id);
      if (currentRemote && currentRemote.status !== selectedOrder.status) {
        // Status changed externally (e.g. Cancelled by Customer)
        setSelectedOrder(currentRemote);
        if (currentRemote.status === OrderStatus.CANCELLED) {
          setNotification("⚠️ Current order was CANCELLED by customer.");
        }
      } else if (!currentRemote) {
        // Order reassigned/deleted externally
        setNotification("🚨 Order has been REASSIGNED to another partner.");
        setSelectedOrder(null);
        setView('orders');
      }
    }

    // Check for new assignments
    const newAssignments = orders.filter(o => 
      o.partnerId === currentPartnerId && 
      !prevOrders.find(prev => prev.id === o.id)
    );
    if (newAssignments.length > 0) {
      setNotification(`🆕 New Task Assigned: ${newAssignments[0].orderNumber}`);
    }

    prevOrdersRef.current = orders;
  }, [orders, selectedOrder, currentPartnerId]);

  // Clear notification after 5s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter tasks assigned specifically to this partner
  const assignedOrders = orders.filter(o => 
    o.partnerId === currentPartnerId && 
    o.status !== OrderStatus.DELIVERED && 
    o.status !== OrderStatus.CANCELLED
  );

  const isPickupValid = clothCountInput !== '' && blanketCountInput !== '' && pickupDateTimeInput !== '';

  const partnerMenuItems: SidebarItem[] = [
    { label: 'Active Tasks', icon: '📋', active: view === 'orders', onClick: () => setView('orders') },
    { label: 'My Schedule', icon: '📅', active: view === 'schedule', onClick: () => setView('schedule') },
    { label: 'Earnings', icon: '💰', active: view === 'earnings', onClick: () => setView('earnings') },
    { label: 'Logout', icon: '🚪' },
  ];

  const handleStatusUpdate = (order: Order, nextStatus: OrderStatus) => {
    const updated = { ...order, status: nextStatus };
    
    if (nextStatus === OrderStatus.PICKED_UP) {
      updated.clothCount = parseInt(clothCountInput) || 0;
      updated.blanketCount = parseInt(blanketCountInput) || 0;
      // Use the partner selected timestamp
      updated.actualPickupTime = new Date(pickupDateTimeInput).toISOString();
    } else if (nextStatus === OrderStatus.READY) {
      updated.readyAtTime = new Date().toISOString();
    } else if (nextStatus === OrderStatus.DELIVERED) {
      updated.actualDeliveryTime = new Date().toISOString();
      updated.paymentStatus = PaymentStatus.COMPLETED;
    }
    
    updateOrder(updated);
    setSelectedOrder(updated);

    if (nextStatus === OrderStatus.DELIVERED) {
      setShowSuccessOverlay(true);
      setTimeout(() => {
        setShowSuccessOverlay(false);
        setView('orders');
      }, 2000);
    }
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === OrderStatus.CANCELLED) return null;
    const sequence = [
      OrderStatus.CREATED, 
      OrderStatus.PARTNER_ASSIGNED, 
      OrderStatus.PICKED_UP, 
      OrderStatus.IN_PROCESSING, 
      OrderStatus.READY, 
      OrderStatus.OUT_FOR_DELIVERY, 
      OrderStatus.DELIVERED
    ];
    const idx = sequence.indexOf(current);
    return (idx !== -1 && idx < sequence.length - 1) ? sequence[idx + 1] : null;
  };

  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 relative overflow-hidden">
      <Sidebar 
        isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} 
        title="Partner" subtitle="Real-time Sync" themeColor="bg-emerald-500"
        items={partnerMenuItems} user={{ name: "Suresh Kumar", email: "suresh@laundro.com", avatar: "https://i.pravatar.cc/150?u=p1" }}
      />

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 20, opacity: 1 }} 
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-20 left-6 right-6 z-[100] bg-white rounded-2xl p-4 shadow-2xl border-l-4 border-indigo-500 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔔</span>
              <p className="text-xs font-bold text-slate-900">{notification}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400">✕</button>
          </motion.div>
        )}

        {showSuccessOverlay && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-emerald-600 flex flex-col items-center justify-center text-white">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl mb-6 backdrop-blur-md">✅</motion.div>
            <h2 className="text-2xl font-black uppercase tracking-widest">Delivered</h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 py-5 bg-slate-950 text-white flex justify-between items-center border-b border-slate-900 z-10">
        <button onClick={() => setIsDrawerOpen(true)} className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="w-5 h-0.5 bg-slate-400 rounded-full" /><div className="w-5 h-0.5 bg-slate-400 rounded-full" /><div className="w-5 h-0.5 bg-slate-400 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="font-extrabold text-[10px] tracking-widest uppercase text-emerald-500">Live Sync</span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {view === 'orders' && (
            <motion.div key="orders" {...pageTransition} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-5 rounded-[28px] border border-slate-800"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Assigned</p><p className="text-2xl font-black text-white">{assignedOrders.length}</p></div>
                <div className="bg-slate-900 p-5 rounded-[28px] border border-slate-800"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p><p className="text-xs font-black text-emerald-500 uppercase">Online</p></div>
              </div>

              <div className="space-y-4">
                {assignedOrders.length > 0 ? assignedOrders.map(order => (
                  <button 
                    key={order.id} 
                    onClick={() => { setSelectedOrder(order); setView('detail'); setClothCountInput(''); setBlanketCountInput(''); }} 
                    className="w-full bg-white p-6 rounded-[32px] text-left shadow-xl hover:scale-[1.02] transition-transform group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{order.orderNumber}</span>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${STATUS_FLOW_CONFIG[order.status].color}`}>{STATUS_FLOW_CONFIG[order.status].label}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-black text-slate-900 text-lg leading-tight">{order.customerName}</h4>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{order.customerPhone}</span>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-2 truncate pr-2">
                        <span className="text-base">📍</span> {order.address}
                      </p>
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-200 shrink-0 text-sm">
                        🗺️
                      </div>
                    </div>
                  </button>
                )) : (
                  <div className="text-center py-20 text-slate-600 font-bold italic">Waiting for incoming tasks...</div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'detail' && selectedOrder && (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-12">
              <button onClick={() => setView('orders')} className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">← Back to List</button>
              
              {selectedOrder.status === OrderStatus.CANCELLED && (
                <div className="bg-red-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
                  <p className="text-xs font-black uppercase tracking-widest">🛑 Order Cancelled</p>
                  <button onClick={() => setView('orders')} className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-bold">ACKNOWLEDGE</button>
                </div>
              )}

              <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black">{selectedOrder.customerName}</h3>
                  <p className="text-indigo-400 text-sm font-bold mt-1">{selectedOrder.customerPhone}</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100">
                 {selectedOrder.status === OrderStatus.PARTNER_ASSIGNED ? (
                   <div className="space-y-6 mb-8">
                     <div className="text-center">
                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.2em]">Item Verification</span>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 tracking-widest text-center">Clothes</label>
                         <input type="number" value={clothCountInput} onChange={e => setClothCountInput(e.target.value)} className="w-full p-4 rounded-xl font-black text-xl text-center bg-slate-50 border border-slate-100 outline-none focus:border-indigo-600 transition-colors" placeholder="0" />
                       </div>
                       <div>
                         <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 tracking-widest text-center">Blankets</label>
                         <input type="number" value={blanketCountInput} onChange={e => setBlanketCountInput(e.target.value)} className="w-full p-4 rounded-xl font-black text-xl text-center bg-slate-50 border border-slate-100 outline-none focus:border-indigo-600 transition-colors" placeholder="0" />
                       </div>
                     </div>
                     <div className="pt-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 tracking-widest text-center">Actual Pickup Time</label>
                        <input 
                          type="datetime-local" 
                          value={pickupDateTimeInput} 
                          onChange={e => setPickupDateTimeInput(e.target.value)} 
                          className="w-full p-4 rounded-xl font-bold text-sm bg-slate-50 border border-slate-100 outline-none focus:border-indigo-600 transition-colors"
                        />
                     </div>
                   </div>
                 ) : (
                   <div className="text-center mb-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                      <h4 className={`text-xl font-black mt-1 ${selectedOrder.status === OrderStatus.CANCELLED ? 'text-red-600' : 'text-slate-900'}`}>
                        {STATUS_FLOW_CONFIG[selectedOrder.status].label}
                      </h4>
                      {selectedOrder.actualPickupTime && (
                        <p className="text-[10px] font-bold text-slate-500 mt-2 italic">
                          Picked up at: {new Date(selectedOrder.actualPickupTime).toLocaleString()}
                        </p>
                      )}
                      {(selectedOrder.clothCount !== undefined) && (
                        <div className="mt-4 flex justify-center gap-4">
                           <div className="px-4 py-2 bg-slate-50 rounded-xl">
                              <p className="text-[8px] font-black text-slate-400 uppercase">Clothes</p>
                              <p className="font-black text-indigo-600">{selectedOrder.clothCount}</p>
                           </div>
                           <div className="px-4 py-2 bg-slate-50 rounded-xl">
                              <p className="text-[8px] font-black text-slate-400 uppercase">Blankets</p>
                              <p className="font-black text-indigo-600">{selectedOrder.blanketCount || 0}</p>
                           </div>
                        </div>
                      )}
                   </div>
                 )}

                 {getNextStatus(selectedOrder.status) && selectedOrder.status !== OrderStatus.CANCELLED ? (
                    <SwipeButton 
                      label={`Swipe to ${getNextStatus(selectedOrder.status)!.replace(/_/g, ' ')}`} 
                      disabled={selectedOrder.status === OrderStatus.PARTNER_ASSIGNED && !isPickupValid} 
                      onComplete={() => handleStatusUpdate(selectedOrder, getNextStatus(selectedOrder.status)!)} 
                    />
                 ) : (
                    <div className={`py-6 text-center font-black uppercase tracking-widest text-xs rounded-[24px] ${selectedOrder.status === OrderStatus.CANCELLED ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {selectedOrder.status === OrderStatus.CANCELLED ? 'Action Prevented' : 'Completed'}
                    </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-10 py-6 bg-slate-900 border-t border-slate-800 flex justify-between z-10 rounded-t-[40px]">
        {['📋', '📅', '💰'].map((icon, idx) => (
          <button key={idx} onClick={() => setView('orders')} className={`text-2xl w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${idx === 0 && view === 'orders' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PartnerApp;
