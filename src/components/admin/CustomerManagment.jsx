import { useMemo, useState } from 'react';
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

const INITIAL_CUSTOMERS = [
  {
    id: 'cust-001',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1234567890',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    status: 'active',
    totalOrders: 12,
    totalSpent: 5478,
    joinDate: '2023-01-15',
    lastOrder: '2024-02-10',
    location: '123 Main St, New York, NY 10001',
    preferredPayment: 'Bank transfer',
    notes: 'Prefers weekday deliveries after 5 PM.',
    recentOrders: [
      { id: 'ORD-001', product: 'Modern Sofa', total: 1299, status: 'pending', date: '2024-02-10' },
      { id: 'ORD-101', product: 'Coffee Table', total: 449, status: 'delivered', date: '2024-01-18' },
      { id: 'ORD-088', product: 'Floor Lamp', total: 189, status: 'delivered', date: '2023-12-02' },
    ],
  },
  {
    id: 'cust-002',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1234567891',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    status: 'active',
    totalOrders: 8,
    totalSpent: 3250,
    joinDate: '2023-03-20',
    lastOrder: '2024-02-09',
    location: '456 Oak Ave, Brooklyn, NY 11201',
    preferredPayment: 'Chase Bank',
    notes: 'Asks for assembly guidance on larger items.',
    recentOrders: [
      { id: 'ORD-002', product: 'Dining Table Set', total: 899, status: 'approved', date: '2024-02-09' },
      { id: 'ORD-076', product: 'Dining Chairs (2)', total: 520, status: 'delivered', date: '2023-11-14' },
    ],
  },
  {
    id: 'cust-003',
    name: 'Mike Brown',
    email: 'mike@example.com',
    phone: '+1234567892',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    status: 'active',
    totalOrders: 15,
    totalSpent: 8920,
    joinDate: '2022-11-10',
    lastOrder: '2024-02-08',
    location: '789 Pine Rd, Queens, NY 11375',
    preferredPayment: 'Wells Fargo',
    notes: 'High-value account; often buys office sets.',
    recentOrders: [
      { id: 'ORD-003', product: 'Office Chair', total: 698, status: 'pending', date: '2024-02-08' },
      { id: 'ORD-112', product: 'Executive Desk', total: 1590, status: 'shipped', date: '2024-01-28' },
      { id: 'ORD-095', product: 'Bookshelf', total: 420, status: 'delivered', date: '2023-12-19' },
    ],
  },
  {
    id: 'cust-004',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1234567893',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    status: 'blocked',
    totalOrders: 3,
    totalSpent: 890,
    joinDate: '2024-01-05',
    lastOrder: '2024-01-20',
    location: '22 Maple Lane, Jersey City, NJ 07302',
    preferredPayment: 'Bank of America',
    notes: 'Payment disputes on last two orders; review before reactivating.',
    recentOrders: [
      { id: 'ORD-054', product: 'Side Table', total: 220, status: 'rejected', date: '2024-01-20' },
      { id: 'ORD-041', product: 'Accent Chair', total: 410, status: 'delivered', date: '2024-01-12' },
    ],
  },
  {
    id: 'cust-005',
    name: 'David Wilson',
    email: 'david@example.com',
    phone: '+1234567894',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    status: 'active',
    totalOrders: 6,
    totalSpent: 2340,
    joinDate: '2023-08-12',
    lastOrder: '2024-02-05',
    location: '901 Cedar Blvd, Newark, NJ 07102',
    preferredPayment: 'Bank transfer',
    notes: 'Usually reorders matching living room pieces.',
    recentOrders: [
      { id: 'ORD-120', product: 'TV Stand', total: 560, status: 'delivered', date: '2024-02-05' },
      { id: 'ORD-099', product: 'Ottoman', total: 280, status: 'delivered', date: '2023-12-30' },
    ],
  },
];

function orderStatusStyles(status) {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'approved':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'rejected':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'shipped':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'delivered':
      return 'bg-violet-50 text-violet-800 border-violet-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

function customerStatusStyles(status) {
  return status === 'active'
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : 'bg-rose-50 text-rose-800 border-rose-200';
}

export function CustomersManagement({ onMessageCustomer }) {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('spent-desc');

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
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query) ||
        customer.location.toLowerCase().includes(query);

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
          return b.lastOrder.localeCompare(a.lastOrder);
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

    const isBlocking = customer.status === 'active';
    const confirmed = window.confirm(
      isBlocking
        ? `Block ${customer.name}? They will not be able to place new orders until reactivated.`
        : `Unblock ${customer.name}? Their account will become active again.`
    );
    if (!confirmed) return;

    const nextStatus = isBlocking ? 'blocked' : 'active';
    setCustomers((prev) =>
      prev.map((item) =>
        item.id === customerId ? { ...item, status: nextStatus } : item
      )
    );
    setSelectedCustomer((current) =>
      current?.id === customerId ? { ...current, status: nextStatus } : current
    );

    showToast({
      type: 'success',
      title: isBlocking ? 'Customer blocked' : 'Customer unblocked',
      message: `${customer.name} has been ${isBlocking ? 'blocked' : 'reactivated'}.`,
    });
  };

  const handleMessageCustomer = () => {
    if (!selectedCustomer || !onMessageCustomer) return;
    onMessageCustomer({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
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

  return (
    <div className="lg:pt-0 pt-16">
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
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Users className="w-3.5 h-3.5" />
              Total customers
            </div>
            <p className="text-2xl text-gray-900">{stats.total}</p>
          </div>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className="text-left bg-white border border-gray-200 p-4 hover:border-gray-400 transition"
          >
            <p className="text-xs text-gray-500 mb-1">Active</p>
            <p className="text-2xl text-gray-900">{stats.active}</p>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('blocked')}
            className="text-left bg-white border border-gray-200 p-4 hover:border-gray-400 transition"
          >
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <UserX className="w-3.5 h-3.5" />
              Blocked
            </div>
            <p className="text-2xl text-gray-900">{stats.blocked}</p>
          </button>
          <div className="bg-white border border-gray-200 p-4 col-span-2 xl:col-span-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              Lifetime revenue
            </div>
            <p className="text-2xl text-gray-900">
              ${stats.revenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Avg. ${stats.avgSpend.toLocaleString()} per customer
            </p>
          </div>
        </section>

        <section className="bg-white border border-gray-200 p-4 md:p-5">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Search customers"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                className="text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        <section className="bg-white border border-gray-200 overflow-hidden">
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
                className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
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
                          className={`inline-block px-2 py-1 text-xs border ${customerStatusStyles(
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
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(customer.id)}
                            className={`px-2 py-1.5 text-sm transition ${
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
          <div className="bg-white max-w-2xl w-full my-8 max-h-[92vh] overflow-y-auto border border-gray-200">
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
                    className={`inline-block px-2 py-1 text-xs border mt-2 ${customerStatusStyles(
                      selectedCustomer.status
                    )}`}
                  >
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 space-y-2 text-sm">
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
                <div className="bg-gray-50 border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Orders</p>
                  <p className="text-2xl text-gray-900">{selectedCustomer.totalOrders}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Total spent</p>
                  <p className="text-2xl text-gray-900">
                    ${selectedCustomer.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Avg. order</p>
                  <p className="text-2xl text-gray-900">
                    ${averageOrderValue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Member since</p>
                  <p className="text-lg text-gray-900">{selectedCustomer.joinDate}</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900 mb-2">Account notes</h4>
                <p className="text-sm text-gray-700">{selectedCustomer.notes}</p>
                <p className="text-sm text-gray-500 mt-3">
                  Last order: {selectedCustomer.lastOrder}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent orders</h4>
                <div className="border border-gray-200 overflow-hidden">
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
                              className={`inline-block px-2 py-1 text-xs border ${orderStatusStyles(
                                order.status
                              )}`}
                            >
                              {order.status}
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
                className="flex items-center gap-2 px-5 py-2 border border-gray-900 text-gray-900 hover:bg-gray-50 transition"
              >
                <Mail className="w-5 h-5" />
                Message customer
              </button>
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedCustomer.id)}
                className={`flex items-center gap-2 px-5 py-2 transition ${
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
    </div>
  );
}
