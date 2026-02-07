
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus, ServiceType, PaymentStatus } from '../types';
import { SERVICES_CONFIG, STATUS_FLOW_CONFIG } from '../constants';
import Sidebar, { SidebarItem } from '../components/Sidebar';

interface Address {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  fullAddress: string;
  landmark?: string;
  pincode: string;
  city: 'Bangalore'; // Locked to Bangalore
}

interface PaymentMethod {
  id: string;
  type: 'CARD' | 'UPI' | 'WALLET';
  provider: string;
  last4?: string;
  label: string;
}

interface CustomerAppProps {
  orders: Order[];
  addOrder: (order: Order) => void;
}

type AuthMethod = 'mobile' | 'email';
type AuthStep = 'IDENTIFY' | 'VERIFY' | 'ONBOARD';

interface AuthUser {
  name: string;
  email: string;
  mobile: string;
  isLoggedIn: boolean;
  avatar?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

const LocationBadge: React.FC = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Serving: Bangalore Only</span>
  </div>
);

const ServiceCinematic: React.FC<{ service: ServiceType }> = ({ service }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const getAnimationContent = () => {
    switch (service) {
      case ServiceType.WASH_FOLD:
      case ServiceType.WASH_IRON:
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-blue-600 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`ripple-${i}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: [0, 0.2, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
                className="absolute w-full h-full border-[20px] border-white/10 rounded-full"
              />
            ))}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 250, opacity: 0, scale: Math.random() }}
                animate={{ y: -300, opacity: [0, 0.6, 0.6, 0], x: [0, Math.sin(i) * 30, 0] }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: "linear"
                }}
                className="absolute bg-gradient-to-br from-white/60 to-white/10 rounded-full blur-[1px] shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]"
                style={{
                  width: Math.random() * 25 + 10,
                  height: Math.random() * 25 + 10,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="text-8xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-10"
            >
              🧺
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-blue-400/20" />
          </div>
        );
      case ServiceType.STEAM_IRON:
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-800 overflow-hidden">
             {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: -200, opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
                animate={{ 
                  x: 400, 
                  opacity: [0, 0.4, 0], 
                  scale: [1, 3, 4],
                  y: [0, Math.sin(i) * 50, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
                className="absolute bg-white/10 rounded-full w-48 h-48"
                style={{ top: `${Math.random() * 100}%` }}
              />
            ))}
            <motion.div 
               animate={{ x: [-500, 500] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute w-full h-[2px] bg-white/5 top-1/2 blur-[2px]" 
            />
            <motion.div
              animate={{ 
                x: [-60, 60, -60],
                y: [-10, 20, -10],
                rotate: [-8, 8, -8]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              👔
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 opacity-60" />
          </div>
        );
      case ServiceType.DRY_CLEAN:
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-indigo-900 overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0"
            />
            {[...Array(35)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.5, 0], 
                  rotate: [0, 180],
                  y: [0, -20, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                className="absolute text-yellow-100 text-3xl font-serif"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              >
                ✦
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: [1, 1.15, 1],
                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-9xl z-10 drop-shadow-[0_0_60px_rgba(255,255,255,0.5)]"
            >
              ✨
            </motion.div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.3),transparent_70%)]" />
          </div>
        );
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden">
             <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
                filter: ["hue-rotate(0deg)", "hue-rotate(45deg)", "hue-rotate(0deg)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-9xl drop-shadow-2xl"
            >
              ⚡
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="w-full mt-4 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white h-64 relative bg-black group">
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_12px_rgba(220,38,38,1)]" />
        <span className="text-[10px] font-black text-white uppercase tracking-[0.25em] bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/10">
          FEATURE · CINEMATIC
        </span>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className="px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center text-white/80 border border-white/10">
          <span className="text-[10px] font-black tracking-widest uppercase">HDR 4K</span>
        </div>
      </div>

      {getAnimationContent()}

      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h4 className="text-white font-black text-2xl uppercase tracking-tighter leading-none italic">{service}</h4>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] mt-1.5 drop-shadow-md">Professional Grade Care</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-[10px]">60FPS</div>
          </div>
        </div>

        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 pointer-events-none">
        <motion.div 
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/30 shadow-2xl"
        >
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1.5" />
        </motion.div>
      </div>
    </div>
  );
};

const CustomerApp: React.FC<CustomerAppProps> = ({ orders, addOrder }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('laundro_customer_session');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  });

  const [authMethod, setAuthMethod] = useState<AuthMethod>('mobile');
  const [authStep, setAuthStep] = useState<AuthStep>('IDENTIFY');
  const [inputValue, setInputValue] = useState('');
  const [otpValue, setOtpValue] = useState(['', '', '', '']);
  const [onboardingName, setOnboardingName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [view, setView] = useState<'home' | 'booking' | 'live-orders' | 'history' | 'profile' | 'addresses' | 'edit-address' | 'payment-methods' | 'add-payment'>('home');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Partial<Address>>({ label: 'Home', city: 'Bangalore' });
  const [paymentForm, setPaymentForm] = useState<Partial<PaymentMethod>>({ type: 'CARD' });

  const currentUserId = useMemo(() => user?.mobile || user?.email || '', [user]);

  const activeOrders = useMemo(() => 
    orders.filter(o => o.customerId === currentUserId && o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED),
    [orders, currentUserId]
  );
  
  const pastOrders = useMemo(() => 
    orders.filter(o => o.customerId === currentUserId && (o.status === OrderStatus.DELIVERED || o.status === OrderStatus.CANCELLED)),
    [orders, currentUserId]
  );

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const updateUserSession = (updatedUser: AuthUser) => {
    setUser(updatedUser);
    localStorage.setItem('laundro_customer_session', JSON.stringify(updatedUser));
    const idKey = updatedUser.mobile || updatedUser.email;
    if (idKey) {
      localStorage.setItem(`user_profile_${idKey}`, JSON.stringify(updatedUser));
    }
  };

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('VERIFY');
      setTimer(30);
    }, 800);
  };

  const handleVerify = () => {
    const enteredOtp = otpValue.join('');
    if (enteredOtp.length < 4) return;
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const existingUserStr = localStorage.getItem(`user_profile_${inputValue}`);
      if (existingUserStr) {
        const existingUser = JSON.parse(existingUserStr);
        completeLogin(existingUser);
      } else {
        setAuthStep('ONBOARD');
      }
    }, 1000);
  };

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingName) return;
    const newUser: AuthUser = {
      name: onboardingName,
      email: authMethod === 'email' ? inputValue : '',
      mobile: authMethod === 'mobile' ? inputValue : '',
      isLoggedIn: true,
      avatar: `https://i.pravatar.cc/150?u=${onboardingName}`,
      addresses: [],
      paymentMethods: []
    };
    updateUserSession(newUser);
    completeLogin(newUser);
  };

  const completeLogin = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('laundro_customer_session', JSON.stringify(userData));
    setAuthStep('IDENTIFY');
    setInputValue('');
    setOtpValue(['', '', '', '']);
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('laundro_customer_session');
    setIsDrawerOpen(false);
    setView('home');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUserSession({ ...user, avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newAddresses = [...user.addresses];
    if (editingAddress) {
      const index = newAddresses.findIndex(a => a.id === editingAddress.id);
      if (index !== -1) {
        newAddresses[index] = { 
          ...editingAddress, 
          ...addressForm,
          city: 'Bangalore',
          id: editingAddress.id 
        } as Address;
      }
    } else {
      newAddresses.push({
        id: Math.random().toString(36).substr(2, 9),
        label: addressForm.label || 'Home',
        fullAddress: addressForm.fullAddress || '',
        landmark: addressForm.landmark || '',
        pincode: addressForm.pincode || '',
        city: 'Bangalore',
      });
    }
    updateUserSession({ ...user, addresses: newAddresses });
    setEditingAddress(null);
    setAddressForm({ label: 'Home', city: 'Bangalore' });
    setView('addresses');
  };

  const handleDeleteAddress = (id: string) => {
    if (!user) return;
    const newAddresses = user.addresses.filter(a => a.id !== id);
    updateUserSession({ ...user, addresses: newAddresses });
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newMethods = [...user.paymentMethods];
    newMethods.push({
      id: Math.random().toString(36).substr(2, 9),
      type: paymentForm.type || 'CARD',
      provider: paymentForm.provider || 'Visa',
      last4: paymentForm.last4 || '0000',
      label: paymentForm.label || 'Personal Card'
    });
    updateUserSession({ ...user, paymentMethods: newMethods });
    setPaymentForm({ type: 'CARD' });
    setView('payment-methods');
  };

  const generateUniqueTrackingId = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let id = '';
    for (let i = 0; i < 6; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    const trackingNo = `LP-${id}`;
    return orders.some(o => o.orderNumber === trackingNo) ? generateUniqueTrackingId() : trackingNo;
  };

  const handleBookOrder = () => {
    if (!selectedService || !user) return;
    const service = SERVICES_CONFIG.find(s => s.name === selectedService);
    const primaryAddress = user.addresses.length > 0 ? `${user.addresses[0].fullAddress}, ${user.addresses[0].city} - ${user.addresses[0].pincode}` : 'Store Pickup';
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: generateUniqueTrackingId(),
      customerId: currentUserId,
      customerName: user.name,
      customerPhone: user.mobile || user.email,
      address: primaryAddress,
      serviceType: selectedService,
      status: OrderStatus.PARTNER_ASSIGNED,
      partnerId: 'p1', 
      pickupTime: 'Tomorrow, 10:00 AM',
      deliveryTime: '2 Days later, 06:00 PM',
      totalAmount: service?.price || 0,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
    addOrder(newOrder);
    setView('home');
    setSelectedService(null);
  };

  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: 'easeOut' }
  } as const;

  if (!user?.isLoggedIn) {
    return (
      <div className="h-full bg-slate-900 flex flex-col items-center justify-end overflow-hidden relative">
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-[-5%] right-[-5%] w-80 h-80 bg-indigo-600/30 rounded-full blur-[80px]" />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center text-4xl shadow-2xl mb-6">🧺</motion.div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">LaundroPro</h1>
          <p className="text-indigo-200/60 font-medium text-sm mt-2">Premium laundry on demand</p>
        </div>
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="w-full bg-white rounded-t-[40px] p-8 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] relative z-20">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
          <AnimatePresence mode="wait">
            {authStep === 'IDENTIFY' && (
              <motion.div key="identify" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                  <button onClick={() => { setAuthMethod('mobile'); setInputValue(''); }} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${authMethod === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Mobile</button>
                  <button onClick={() => { setAuthMethod('email'); setInputValue(''); }} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${authMethod === 'email' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Email</button>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome Back!</h2>
                <p className="text-slate-500 text-sm mb-6">Enter your {authMethod} to continue.</p>
                <form onSubmit={handleIdentify} className="space-y-4">
                  <div className="relative">
                    {authMethod === 'mobile' && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+91</span>}
                    <input type={authMethod === 'mobile' ? 'tel' : 'email'} value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={authMethod === 'mobile' ? '9876543210' : 'name@example.com'} className={`w-full p-4 ${authMethod === 'mobile' ? 'pl-14' : 'pl-4'} bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium focus:border-indigo-600 outline-none transition-all`} required />
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-extrabold shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Get OTP'}
                  </button>
                </form>
              </motion.div>
            )}
            {authStep === 'VERIFY' && (
              <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setAuthStep('IDENTIFY')} className="text-indigo-600 font-bold text-sm mb-6 flex items-center gap-2">← Back</button>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Verify OTP</h2>
                <p className="text-slate-500 text-sm mb-8">Sent to <span className="text-slate-900 font-semibold">{inputValue}</span></p>
                <div className="flex justify-between gap-3 mb-8">
                  {otpValue.map((digit, idx) => (
                    <input key={idx} type="text" maxLength={1} value={digit} onChange={(e) => {
                      const newOtp = [...otpValue];
                      newOtp[idx] = e.target.value.slice(-1);
                      setOtpValue(newOtp);
                      if (e.target.value && idx < 3) (document.getElementById(`otp-${idx+1}`) as HTMLInputElement)?.focus();
                    }} id={`otp-${idx}`} className="w-16 h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-2xl font-bold focus:border-indigo-600 outline-none transition-all" />
                  ))}
                </div>
                <button onClick={handleVerify} disabled={isLoading || otpValue.join('').length < 4} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-extrabold shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3">
                   {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify & Continue'}
                </button>
              </motion.div>
            )}
            {authStep === 'ONBOARD' && (
              <motion.div key="onboard" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Join LaundroPro</h2>
                <p className="text-slate-500 text-sm mb-8">What should we call you?</p>
                <form onSubmit={handleOnboard} className="space-y-4">
                  <input type="text" value={onboardingName} onChange={(e) => setOnboardingName(e.target.value)} placeholder="Full Name" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium outline-none" required />
                  <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-extrabold">Complete Onboarding</button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  const customerMenuItems: SidebarItem[] = [
    { label: 'Home', icon: '🏠', active: view === 'home', onClick: () => setView('home') },
    { label: 'Live Orders', icon: '📍', active: view === 'live-orders', onClick: () => setView('live-orders') },
    { label: 'Order History', icon: '📋', active: view === 'history', onClick: () => setView('history') },
    { label: 'Profile Settings', icon: '👤', active: view === 'profile', onClick: () => setView('profile') },
    { label: 'Saved Addresses', icon: '📍', active: view === 'addresses', onClick: () => setView('addresses') },
    { label: 'Logout', icon: '🚪', onClick: handleLogout },
  ];

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-slate-50">
      <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="LaundroPro" subtitle="Customer App" themeColor="bg-indigo-600" items={customerMenuItems} user={{ name: user.name, email: user.email || user.mobile, avatar: user.avatar }} />
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      <div className="px-6 py-4 bg-white flex justify-between items-center border-b border-slate-100 z-10 shadow-sm">
        <button onClick={() => setIsDrawerOpen(true)} className="w-8 h-8 flex flex-col justify-center items-center gap-1">
          <div className="w-5 h-0.5 bg-slate-600 rounded-full" /><div className="w-5 h-0.5 bg-slate-600 rounded-full" /><div className="w-5 h-0.5 bg-slate-600 rounded-full" />
        </button>
        <span className="font-bold text-slate-900">LaundroPro</span>
        <button onClick={() => setView('profile')} className="w-9 h-9 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" {...pageTransition} className="p-6 space-y-8">
              <div className="flex justify-between items-start">
                <header>
                  <h2 className="text-2xl font-extrabold text-slate-900">Hello, {user.name.split(' ')[0]}</h2>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-1">Get your clothes cleaned today</p>
                </header>
                <LocationBadge />
              </div>
              
              {activeOrders.length > 0 && (
                <div onClick={() => setView('live-orders')} className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-600/30 cursor-pointer">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Live Status</p>
                  <h4 className="text-xl font-bold">{activeOrders[0].orderNumber} is {STATUS_FLOW_CONFIG[activeOrders[0].status].label}</h4>
                </div>
              )}
              <section><h3 className="font-bold text-slate-900 mb-4">Our Services</h3><div className="grid grid-cols-2 gap-4">{SERVICES_CONFIG.slice(0, 6).map((s) => (<button key={s.id} onClick={() => { setSelectedService(s.name as ServiceType); setView('booking'); }} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 text-left"><div className="text-2xl mb-3">{s.icon}</div><p className="font-bold text-slate-900 text-sm">{s.name}</p><p className="text-[10px] font-bold text-indigo-600 mt-1">₹{s.price}/kg</p></button>))}</div></section>
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div key="profile" {...pageTransition} className="p-6 space-y-6">
              <header className="flex items-center gap-4"><button onClick={() => setView('home')} className="w-8 h-8 flex items-center justify-center bg-white rounded-full">←</button><h2 className="text-xl font-bold">Profile</h2></header>
              <div className="flex flex-col items-center py-6 bg-white rounded-[32px] shadow-sm border border-slate-100">
                <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-lg object-cover" alt="User" />
                  <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white text-xs">📸</div>
                </div>
                <h3 className="text-xl font-bold mt-4">{user.name}</h3>
                <p className="text-slate-500 text-sm">{user.mobile || user.email}</p>
                <div className="mt-4">
                  <LocationBadge />
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={() => setView('addresses')} className="w-full flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-slate-100"><span className="font-bold text-slate-700">Saved Addresses</span><span className="text-slate-300">›</span></button>
                <button onClick={() => setView('payment-methods')} className="w-full flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-slate-100"><span className="font-bold text-slate-700">Payment Details</span><span className="text-slate-300">›</span></button>
                <button onClick={handleLogout} className="w-full p-5 bg-red-50 text-red-600 rounded-2xl font-bold">Logout</button>
              </div>
            </motion.div>
          )}

          {view === 'addresses' && (
            <motion.div key="addresses" {...pageTransition} className="p-6 space-y-6">
              <header className="flex items-center gap-4">
                <button onClick={() => setView('profile')} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">←</button>
                <h2 className="text-xl font-bold">Saved Addresses</h2>
              </header>
              <div className="space-y-4">
                {user.addresses.map(addr => (
                  <div key={addr.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-start group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-slate-900">{addr.label}</span>
                        <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase">Serviceable</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{addr.fullAddress}</p>
                      <p className="text-xs text-slate-600 font-bold mt-1">{addr.city} - {addr.pincode}</p>
                      {addr.landmark && <p className="text-[10px] text-slate-400 mt-1 italic font-medium">Near {addr.landmark}</p>}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button 
                        onClick={() => {
                          setEditingAddress(addr);
                          setAddressForm(addr);
                          setView('edit-address');
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-bold"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressForm({ label: 'Home', city: 'Bangalore' });
                    setView('edit-address');
                  }} 
                  className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[24px] text-slate-400 font-bold hover:border-indigo-300 hover:text-indigo-400 transition-all"
                >
                  + Add New Address
                </button>
              </div>
            </motion.div>
          )}

          {view === 'edit-address' && (
            <motion.div key="edit-address" {...pageTransition} className="p-6 space-y-6">
              <header className="flex items-center gap-4">
                <button onClick={() => setView('addresses')} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">←</button>
                <h2 className="text-xl font-bold">{editingAddress ? 'Edit Address' : 'New Address'}</h2>
              </header>
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-4">
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-relaxed">
                  ⚠️ Service Restriction: We only operate in Bangalore. Please provide a local address.
                </p>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Label</label>
                  <div className="flex gap-2">
                    {['Home', 'Office', 'Other'].map(l => (
                      <button 
                        key={l}
                        type="button"
                        onClick={() => setAddressForm({...addressForm, label: l as any})}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${addressForm.label === l ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Full Address</label>
                  <textarea 
                    value={addressForm.fullAddress}
                    onChange={e => setAddressForm({...addressForm, fullAddress: e.target.value})}
                    placeholder="House No, Street Name, Area..."
                    className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">City</label>
                    <input 
                      type="text" 
                      value="Bangalore"
                      readOnly
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pincode</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={addressForm.pincode}
                      onChange={e => setAddressForm({...addressForm, pincode: e.target.value.replace(/\D/g, '')})}
                      placeholder="560XXX"
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Landmark (Optional)</label>
                  <input 
                    type="text" 
                    value={addressForm.landmark}
                    onChange={e => setAddressForm({...addressForm, landmark: e.target.value})}
                    placeholder="Near..."
                    className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors"
                  />
                </div>

                <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 mt-6">
                  Save Bangalore Address
                </button>
              </form>
            </motion.div>
          )}

          {view === 'live-orders' && (
            <motion.div key="live" {...pageTransition} className="p-6 space-y-4">
              <header className="flex items-center gap-4 mb-4"><button onClick={() => setView('home')} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">←</button><h2 className="text-xl font-bold">Live Tracking</h2></header>
              {activeOrders.map(o => (
                <div key={o.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4"><div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">📦</div><div><p className="font-bold text-slate-900">{o.orderNumber}</p><p className="text-[10px] text-slate-500">{o.serviceType}</p></div></div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${STATUS_FLOW_CONFIG[o.status].color}`}>{STATUS_FLOW_CONFIG[o.status].label}</span>
                </div>
              ))}
              {activeOrders.length === 0 && <div className="text-center py-20 text-slate-400 font-medium">No ongoing orders</div>}
            </motion.div>
          )}

          {view === 'booking' && (
            <motion.div key="book" {...pageTransition} className="p-6 space-y-6">
              <header className="flex items-center gap-4"><button onClick={() => setView('home')} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">←</button><h2 className="text-xl font-bold">Checkout</h2></header>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6 overflow-hidden">
                <div className="flex gap-4 items-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="w-12 h-12 flex items-center justify-center text-3xl">🧺</div>
                  <div><p className="text-xs font-bold text-indigo-400 uppercase">Service</p><p className="font-bold text-indigo-900">{selectedService}</p></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Address</p>
                    <span className="text-[8px] font-black text-emerald-600 uppercase">Bangalore Delivery Only</span>
                  </div>
                  {user.addresses.length > 0 ? (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user.addresses[0].label}</p>
                      <p className="text-xs text-slate-500">{user.addresses[0].fullAddress}</p>
                      <p className="text-[10px] text-indigo-600 font-bold mt-1">{user.addresses[0].city} - {user.addresses[0].pincode}</p>
                    </div>
                  ) : (
                    <button onClick={() => setView('addresses')} className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-indigo-600 text-xs font-bold">Add Address to Continue</button>
                  )}
                </div>

                <button 
                  onClick={handleBookOrder} 
                  disabled={user.addresses.length === 0}
                  className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl ${user.addresses.length === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white shadow-indigo-600/30'}`}
                >
                  Confirm Order
                </button>
                
                <ServiceCinematic service={selectedService!} />
                
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure Payment Powered by Stripe</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-10 py-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-between z-40 shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.1)]">
        <button onClick={() => setView('home')} className={`text-2xl ${view === 'home' ? 'text-indigo-600' : 'text-slate-300'}`}>🏠</button>
        <button onClick={() => setView('live-orders')} className={`text-2xl ${view === 'live-orders' ? 'text-indigo-600' : 'text-slate-300'}`}>📍</button>
        <button onClick={() => setView('history')} className={`text-2xl ${view === 'history' ? 'text-indigo-600' : 'text-slate-300'}`}>📋</button>
        <button onClick={() => setView('profile')} className={`text-2xl ${['profile', 'addresses', 'payment-methods', 'edit-address'].includes(view) ? 'text-indigo-600' : 'text-slate-300'}`}>👤</button>
      </div>
    </div>
  );
};

export default CustomerApp;
