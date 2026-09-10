import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Search,
  Ban,
  UserCheck,
  Mail,
  X as XIcon,
  Eye,
  Filter,
  Users,
  UserX,
  DollarSign,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { formatOrderStatus, getStatusClasses } from '../../data/orders';
import { patchAdminCustomerStatus } from '../../services/adminService';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ProductStatCard } from './dashboard/ProductStatCard';

const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

function customerStatusStyles(status) {
  return status === 'active'
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : 'bg-rose-50 text-rose-800 border-rose-200';
}

export function CustomersManagement({
  onMessageCustomer,
  customers,
  onCustomersChange,
}) {
  const { showToast } = useToast();
  const setCustomers = onCustomersChange;
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('spent-desc');
  const [pendingToggle, setPendingToggle] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === 'active').length;
    const blocked = total - active;
    const revenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgSpend = total ? Math.round(revenue / total) : 0;
    return { total, active, blocked, revenue, avgSpend };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let list = customers.filter((customer) => {
      const matchesSearch =
        !query ||
        (customer.name || '').toLowerCase().includes(query) ||
        (customer.email || '').toLowerCase().includes(query) ||
        (customer.phone || '').toLowerCase().includes(query) ||
        String(customer.id || '').toLowerCase().includes(query) ||
        (customer.location || '').toLowerCase().includes(query);

      const matchesStatus =
        filterStatus === 'all' || customer.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'orders-desc':
          return b.totalOrders - a.totalOrders;
        case 'recent':
          return String(b.lastOrder || '').localeCompare(String(a.lastOrder || ''));
        case 'spent-asc':
          return a.totalSpent - b.totalSpent;
        case 'spent-desc':
        default:
          return b.totalSpent - a.totalSpent;
      }
    });

    return list;
  }, [customers, searchQuery, filterStatus, sortBy]);

  const handleToggleStatus = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;
    setPendingToggle(customer);
  };

  const confirmToggleStatus = async () => {
    const customer = pendingToggle;
    if (!customer) return;

    const isBlocking = customer.status === 'active';
    const nextStatus = isBlocking ? 'blocked' : 'active';
    try {
      const updated = await patchAdminCustomerStatus(customer.id, nextStatus);
      setCustomers((prev) =>
        prev.map((item) =>
          item.id === customer.id ? { ...item, ...updated } : item
        )
      );
      setSelectedCustomer((current) =>
        current?.id === customer.id ? { ...current, ...updated } : current
      );

      showToast({
        type: 'success',
        title: isBlocking ? 'Customer blocked' : 'Customer unblocked',
        message: `${customer.name} has been ${isBlocking ? 'blocked' : 'reactivated'}.`,
      });
      setPendingToggle(null);
    } catch (err) {
      showToast({
        type: 'error',
        title: isBlocking ? 'Could not block customer' : 'Could not unblock customer',
        message: err.message || 'Please try again.',
      });
    }
  };

  const handleMessageCustomer = () => {
    if (!selectedCustomer || !onMessageCustomer) return;
    onMessageCustomer({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      customerAvatar: selectedCustomer.avatar,
    });
    setSelectedCustomer(null);
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setSearchQuery('');
  };

  const averageOrderValue = selectedCustomer?.totalOrders
    ? Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders)
    : 0;

  const entrance = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  return (
    <MotionDiv
      className="lg:pt-0 pt-16"
      {...entrance}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
    >
      <div className="bg-white border-b border-gray-200 p-6">
        <div>
          <h1 className="text-3xl text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">
            Review accounts, spending, and block or message customers
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <ProductStatCard
            label="Total customers"
            value={stats.total}
            icon={Users}
            active={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
          />
          <ProductStatCard
            label="Active"
            value={stats.active}
            active={filterStatus === 'active'}
            onClick={() => setFilterStatus('active')}
          />
          <ProductStatCard
            label="Blocked"
            value={stats.blocked}
            icon={UserX}
            active={filterStatus === 'blocked'}
            onClick={() => setFilterStatus('blocked')}
          />
          <ProductStatCard
            label="Lifetime revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            icon={DollarSign}
            className="col-span-2 xl:col-span-1"
          >
            <p className="text-xs text-gray-500 mt-1">
              Avg. ${stats.avgSpend.toLocaleString()} per customer
            </p>
          </ProductStatCard>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
            <Filter className="w-4 h-4" />
            Search & filters
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="relative xl:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, phone, ID, or address..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Search customers"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Sort customers"
            >
              <option value="spent-desc">Sort: Spent high–low</option>
              <option value="spent-asc">Sort: Spent low–high</option>
              <option value="orders-desc">Sort: Most orders</option>
              <option value="recent">Sort: Recent order</option>
              <option value="name-asc">Sort: Name A–Z</option>
            </select>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="text-gray-900 font-medium">
                {filteredCustomers.length}
              </span>{' '}
              of {customers.length} customers
            </p>
            {(filterStatus !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={clearFilters}
                className={`text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2 transition duration-200 ${focusRing}`}
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 font-medium">No customers found</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Try a different search or clear the status filter.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className={`mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ${focusRing}`}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={customer.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-500">{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 tabular-nums">
                        ${customer.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.lastOrder}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-1 text-xs border rounded-sm ${customerStatusStyles(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCustomer(customer)}
                            className={`inline-flex items-center gap-1 px-2 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition duration-200 ${focusRing}`}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(customer.id)}
                            className={`px-2 py-1.5 text-sm transition duration-200 ${focusRing} ${
                              customer.status === 'active'
                                ? 'text-rose-700 hover:bg-rose-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {customer.status === 'active' ? 'Block' : 'Unblock'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full my-8 max-h-[92vh] overflow-y-auto border border-gray-200 rounded-xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl text-gray-900">Customer details</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedCustomer.id}</p>
              </div>
              <button type="button" onClick={() => setSelectedCustomer(null)}>
                <XIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCustomer.avatar}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-xl text-gray-900">{selectedCustomer.name}</h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs border rounded-sm mt-2 ${customerStatusStyles(
                      selectedCustomer.status
                    )}`}
                  >
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
                <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                <p>
                  <span className="font-medium text-gray-900">Email:</span>{' '}
                  <span className="text-gray-600">{selectedCustomer.email}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Phone:</span>{' '}
                  <span className="text-gray-600">{selectedCustomer.phone}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Delivery address:</span>{' '}
                  <span className="text-gray-600">{selectedCustomer.location}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Preferred payment:</span>{' '}
                  <span className="text-gray-600">
                    {selectedCustomer.preferredPayment}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Orders</p>
                  <p className="text-2xl text-gray-900">{selectedCustomer.totalOrders}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Total spent</p>
                  <p className="text-2xl text-gray-900">
                    ${selectedCustomer.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Avg. order</p>
                  <p className="text-2xl text-gray-900">
                    ${averageOrderValue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Member since</p>
                  <p className="text-lg text-gray-900">{selectedCustomer.joinDate}</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Account notes</h4>
                <p className="text-sm text-gray-700">{selectedCustomer.notes}</p>
                <p className="text-sm text-gray-500 mt-3">
                  Last order: {selectedCustomer.lastOrder}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent orders</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">
                          Order
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">
                          Total
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedCustomer.recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-3 text-gray-900">{order.id}</td>
                          <td className="px-4 py-3 text-gray-700">{order.product}</td>
                          <td className="px-4 py-3 text-gray-900 tabular-nums">
                            ${order.total.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-1 text-xs border rounded-sm ${getStatusClasses(
                                order.status
                              )}`}
                            >
                              {formatOrderStatus(order.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-wrap justify-end gap-3 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={handleMessageCustomer}
                className="flex items-center gap-2 px-5 py-2 border border-gray-900 rounded-md text-gray-900 hover:bg-gray-50 transition"
              >
                <Mail className="w-5 h-5" />
                Message customer
              </button>
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedCustomer.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-md transition ${
                  selectedCustomer.status === 'active'
                    ? 'border border-rose-300 text-rose-700 hover:bg-rose-50'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {selectedCustomer.status === 'active' ? (
                  <>
                    <Ban className="w-5 h-5" />
                    Block customer
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    Unblock customer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingToggle)}
        title={pendingToggle?.status === 'active' ? 'Block customer?' : 'Unblock customer?'}
        message={
          pendingToggle?.status === 'active'
            ? `Block ${pendingToggle.name}? They will not be able to place new orders until reactivated.`
            : `Unblock ${pendingToggle?.name}? Their account will become active again.`
        }
        confirmLabel={pendingToggle?.status === 'active' ? 'Block' : 'Unblock'}
        onCancel={() => setPendingToggle(null)}
        onConfirm={confirmToggleStatus}
      />
    </MotionDiv>
  );
}
