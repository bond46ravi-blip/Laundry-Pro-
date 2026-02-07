
import React from 'react';

export interface SidebarItem {
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  items: SidebarItem[];
  themeColor?: string; // e.g., 'bg-indigo-600' or 'bg-emerald-500'
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  items, 
  themeColor = 'bg-indigo-600', 
  user 
}) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 w-72 bg-slate-900 text-white h-full z-[60] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${themeColor} rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg`}>
              {title.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">{title}</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">{subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.onClick) item.onClick();
                onClose();
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active ? `${themeColor} text-white shadow-lg` : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="flex items-center gap-3 p-2">
            <img src={user.avatar || "https://i.pravatar.cc/150?u=user"} className="w-10 h-10 rounded-full border-2 border-slate-700" alt="User" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold hover:bg-red-900/20 hover:text-red-400 transition-colors">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
