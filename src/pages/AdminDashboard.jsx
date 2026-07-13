import { useCallback, useState } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { DashboardOverview } from '../components/admin/DashboaredOverview';
import { ProductsManagement } from '../components/admin/ProductsManagement';
import { OrdersManagement } from '../components/admin/OrderManagement';
import { CustomersManagement } from '../components/admin/CustomerManagment';
import { MessagesManagement } from '../components/admin/MessageManagement';

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState('overview');
  const [chatFocus, setChatFocus] = useState(null);

  const handleMessageCustomer = useCallback((payload) => {
    setChatFocus(payload);
    setCurrentView('messages');
  }, []);

  const clearChatFocus = useCallback(() => setChatFocus(null), []);

  const handleViewChange = (view) => {
    if (view !== 'messages') {
      setChatFocus(null);
    }
    setCurrentView(view);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar currentView={currentView} onViewChange={handleViewChange} />

      <div className="flex-1 overflow-auto">
        {currentView === 'overview' && (
          <DashboardOverview onNavigate={handleViewChange} />
        )}
        {currentView === 'products' && <ProductsManagement />}
        {currentView === 'orders' && (
          <OrdersManagement onMessageCustomer={handleMessageCustomer} />
        )}
        {currentView === 'customers' && (
          <CustomersManagement onMessageCustomer={handleMessageCustomer} />
        )}
        {currentView === 'messages' && (
          <MessagesManagement
            chatFocus={chatFocus}
            onChatFocusConsumed={clearChatFocus}
          />
        )}
      </div>
    </div>
  );
}
