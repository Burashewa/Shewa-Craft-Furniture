import { useState } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { DashboardOverview } from '../components/admin/DashboaredOverview';
import { ProductsManagement } from '../components/admin/ProductsManagement';
import { OrdersManagement } from '../components/admin/OrderManagement';
import { CustomersManagement } from '../components/admin/CustomerManagment';
import { MessagesManagement } from '../components/admin/MessageManagement';

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState('overview');

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 overflow-auto">
        {currentView === 'overview' && <DashboardOverview />}
        {currentView === 'products' && <ProductsManagement />}
        {currentView === 'orders' && <OrdersManagement />}
        {currentView === 'customers' && <CustomersManagement />}
        {currentView === 'messages' && <MessagesManagement />}
      </div>
    </div>
  );
}
