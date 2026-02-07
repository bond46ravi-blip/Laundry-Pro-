
import React, { useState, useEffect } from 'react';
import { UserRole, Order, OrderStatus, User, ServiceType, PaymentStatus } from './types';
import AdminDashboard from './views/AdminDashboard';
import CustomerApp from './views/CustomerApp';
import PartnerApp from './views/PartnerApp';

const MOCK_CURRENT_USER: User = {
  id: 'u1',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+91 9876543210',
  role: UserRole.ADMIN,
  avatar: 'https://i.pravatar.cc/150?u=u1'
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'o1',
    orderNumber: '#1001',
    customerId: 'c1',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 9123456780',
    address: 'Flat 402, Sunshine Apts, Mumbai',
    serviceType: ServiceType.WASH_FOLD,
    status: OrderStatus.DELIVERED,
    clothCount: 12,
    pickupTime: '2023-10-25 10:00 AM',
    actualPickupTime: '2023-10-25T10:15:00Z',
    readyAtTime: '2023-10-26T14:30:00Z',
    actualDeliveryTime: '2023-10-27T18:00:00Z',
    deliveryTime: '2023-10-27 06:00 PM',
    totalAmount: 588,
    paymentStatus: PaymentStatus.COMPLETED,
    partnerId: 'p1',
    createdAt: '2023-10-25T08:30:00Z'
  },
  {
    id: 'o2',
    orderNumber: '#1002',
    customerId: 'c1',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 9123456781',
    address: 'Flat 402, Sunshine Apts, Mumbai',
    serviceType: ServiceType.DRY_CLEAN,
    status: OrderStatus.PICKED_UP,
    clothCount: 5,
    pickupTime: '2023-10-26 02:00 PM',
    actualPickupTime: '2023-10-26T14:10:00Z',
    deliveryTime: '2023-10-29 11:00 AM',
    totalAmount: 745,
    paymentStatus: PaymentStatus.PENDING,
    partnerId: 'p2',
    createdAt: '2023-10-26T12:15:00Z'
  }
];

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.ADMIN);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('laundro_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('laundro_orders', JSON.stringify(orders));
  }, [orders]);

  const updateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const addOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Simulation Role Switcher - Moved to TOP to avoid blocking bottom nav */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-slate-200 flex gap-2 items-center">
        <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest mr-1">Switch View</span>
        <button 
          onClick={() => setActiveRole(UserRole.ADMIN)} 
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${activeRole === UserRole.ADMIN ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Admin
        </button>
        <button 
          onClick={() => setActiveRole(UserRole.CUSTOMER)} 
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${activeRole === UserRole.CUSTOMER ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Customer
        </button>
        <button 
          onClick={() => setActiveRole(UserRole.PARTNER)} 
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${activeRole === UserRole.PARTNER ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Partner
        </button>
      </div>

      {activeRole === UserRole.ADMIN && (
        <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
          <AdminDashboard orders={orders} updateOrder={updateOrder} />
        </main>
      )}

      {activeRole === UserRole.CUSTOMER && (
        <div className="flex-1 flex justify-center bg-slate-900 overflow-y-auto">
          <div className="w-full max-w-[420px] bg-white h-full shadow-2xl relative pt-12 md:pt-0">
            <CustomerApp orders={orders} addOrder={addOrder} />
          </div>
        </div>
      )}

      {activeRole === UserRole.PARTNER && (
        <div className="flex-1 flex justify-center bg-slate-800 overflow-y-auto">
          <div className="w-full max-w-[420px] bg-white h-full shadow-2xl relative pt-12 md:pt-0">
            <PartnerApp orders={orders} updateOrder={updateOrder} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
