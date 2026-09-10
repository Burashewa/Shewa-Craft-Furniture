import { useCallback, useEffect, useState } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { DashboardOverview } from '../components/admin/DashboaredOverview';
import { ProductsManagement, normalizeProduct } from '../components/admin/ProductsManagement';
import { OrdersManagement, normalizeAdminOrder } from '../components/admin/OrderManagement';
import { CustomersManagement } from '../components/admin/CustomerManagment';
import { MessagesManagement } from '../components/admin/MessageManagement';
import { useChatSocketEvent } from '../context/ChatSocketContext';
import { listAdminConversations } from '../services/messageService';
import {
  listAdminCustomers,
  listAdminOrders,
  listAdminProducts,
} from '../services/adminService';
import { applyAdminConversationEvent } from '../services/chatEvents';

function countUnread(conversations) {
  return conversations.filter((conversation) => conversation.unread).length;
}

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState('overview');
  const [chatFocus, setChatFocus] = useState(null);
  const [orderStatusFocus, setOrderStatusFocus] = useState(null);
  const [productStockFocus, setProductStockFocus] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);

  const refreshConversations = useCallback(async () => {
    const next = await listAdminConversations();
    setConversations(next);
    setConversationsLoading(false);
    return next;
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [nextProducts, nextOrders, nextCustomers] = await Promise.all([
          listAdminProducts(),
          listAdminOrders(),
          listAdminCustomers(),
        ]);
        if (!active) return;
        setProducts(nextProducts.map(normalizeProduct));
        setOrders(nextOrders.map(normalizeAdminOrder));
        setCustomers(nextCustomers);
      } catch {
        if (!active) return;
        setProducts([]);
        setOrders([]);
        setCustomers([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setConversationsLoading(true);
    const tick = () => {
      listAdminConversations()
        .then((next) => {
          if (!active) return;
          setConversations(next);
          setConversationsLoading(false);
        })
        .catch(() => {
          if (!active) return;
          setConversations([]);
          setConversationsLoading(false);
        });
    };
    tick();
    return () => {
      active = false;
    };
  }, []);

  useChatSocketEvent('conversation:message', (payload) => {
    setConversations((prev) => applyAdminConversationEvent(prev, payload));
  });

  useChatSocketEvent('conversation:unread', (payload) => {
    if (payload?.all) {
      setConversations((prev) =>
        prev.map((conversation) => ({ ...conversation, unread: false }))
      );
      return;
    }
    setConversations((prev) => applyAdminConversationEvent(prev, payload));
  });

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
            onRefreshConversations={refreshConversations}
            loading={conversationsLoading}
            chatFocus={chatFocus}
            onChatFocusConsumed={clearChatFocus}
          />
        )}
      </div>
    </div>
  );
}
