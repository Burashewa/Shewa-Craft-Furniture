import { useCallback, useState } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { DashboardOverview } from '../components/admin/DashboaredOverview';
import { ProductsManagement, normalizeProduct } from '../components/admin/ProductsManagement';
import { OrdersManagement, INITIAL_ORDERS } from '../components/admin/OrderManagement';
import { CustomersManagement, INITIAL_CUSTOMERS } from '../components/admin/CustomerManagment';
import { MessagesManagement, INITIAL_CONVERSATIONS } from '../components/admin/MessageManagement';
import { products as catalogProducts } from '../data/products';

function countUnread(conversations) {
  return conversations.filter((conversation) => conversation.unread).length;
}

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState('overview');
  const [chatFocus, setChatFocus] = useState(null);
  const [orderStatusFocus, setOrderStatusFocus] = useState(null);
  const [productStockFocus, setProductStockFocus] = useState(null);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [products, setProducts] = useState(() =>
    catalogProducts.map(normalizeProduct)
  );
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);

  const handleMessageCustomer = useCallback((payload) => {
    setChatFocus(payload);
    setOrderStatusFocus(null);
    setProductStockFocus(null);
    setCurrentView('messages');
  }, []);

  const clearChatFocus = useCallback(() => setChatFocus(null), []);

  const handleViewChange = (view, focus = {}) => {
    if (view !== 'messages') {
      setChatFocus(null);
    }
    setOrderStatusFocus(view === 'orders' ? focus.status || null : null);
    setProductStockFocus(view === 'products' ? focus.stock || null : null);
    setCurrentView(view);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        unreadCount={countUnread(conversations)}
      />

      <div className="flex-1 overflow-auto">
        {currentView === 'overview' && (
          <DashboardOverview
            orders={orders}
            products={products}
            customers={customers}
            conversations={conversations}
            onNavigate={handleViewChange}
          />
        )}
        {currentView === 'products' && (
          <ProductsManagement
            products={products}
            onProductsChange={setProducts}
            initialStock={productStockFocus || 'all'}
          />
        )}
        {currentView === 'orders' && (
          <OrdersManagement
            orders={orders}
            onOrdersChange={setOrders}
            initialStatus={orderStatusFocus || 'all'}
            onMessageCustomer={handleMessageCustomer}
          />
        )}
        {currentView === 'customers' && (
          <CustomersManagement
            customers={customers}
            onCustomersChange={setCustomers}
            onMessageCustomer={handleMessageCustomer}
          />
        )}
        {currentView === 'messages' && (
          <MessagesManagement
            conversations={conversations}
            onConversationsChange={setConversations}
            chatFocus={chatFocus}
            onChatFocusConsumed={clearChatFocus}
          />
        )}
      </div>
    </div>
  );
}
