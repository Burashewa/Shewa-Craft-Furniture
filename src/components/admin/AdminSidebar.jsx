import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

function SidebarContent({ currentView, onViewChange, setMobileMenuOpen, menuItems }) {
  return (
    <>
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-semibold text-white">ShewaCraft Furniture</h1>
        <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}

export function AdminSidebar({ currentView, onViewChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <>
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-800 text-white">
        <SidebarContent
          currentView={currentView}
          onViewChange={onViewChange}
          setMobileMenuOpen={setMobileMenuOpen}
          menuItems={menuItems}
        />
      </div>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed left-0 top-16 bottom-0 w-64 bg-gray-800 text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              currentView={currentView}
              onViewChange={onViewChange}
              setMobileMenuOpen={setMobileMenuOpen}
              menuItems={menuItems}
            />
          </div>
        </div>
      )}
    </>
  );
}
