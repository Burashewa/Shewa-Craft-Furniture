import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Ban, UserCheck, Mail, X as XIcon } from 'lucide-react';

export function CustomersManagement() {
  const [customers, setCustomers] = useState([
    {
      id: 'cust-001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      status: 'active',
      totalOrders: 12,
      totalSpent: 5478,
      joinDate: '2023-01-15',
      lastOrder: '2024-02-10'
    },
    {
      id: 'cust-002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1234567891',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      status: 'active',
      totalOrders: 8,
      totalSpent: 3250,
      joinDate: '2023-03-20',
      lastOrder: '2024-02-09'
    },
    {
      id: 'cust-003',
      name: 'Mike Brown',
      email: 'mike@example.com',
      phone: '+1234567892',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      status: 'active',
      totalOrders: 15,
      totalSpent: 8920,
      joinDate: '2022-11-10',
      lastOrder: '2024-02-08'
    },
    {
      id: 'cust-004',
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1234567893',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      status: 'blocked',
      totalOrders: 3,
      totalSpent: 890,
      joinDate: '2024-01-05',
      lastOrder: '2024-01-20'
    },
    {
      id: 'cust-005',
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1234567894',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      status: 'active',
      totalOrders: 6,
      totalSpent: 2340,
      joinDate: '2023-08-12',
      lastOrder: '2024-02-05'
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || customer.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleToggleStatus = (customerId) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              status: customer.status === 'active' ? 'blocked' : 'active',
            }
          : customer
      )
    );

    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer({
        ...selectedCustomer,
        status: selectedCustomer.status === 'active' ? 'blocked' : 'active',
      });
    }
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (c) => c.status === 'active'
  ).length;
  const totalRevenue = customers.reduce(
    (sum, c) => sum + c.totalSpent,
    0
  );

  return (
 <div className="lg:pt-0 pt-16">
  {/* Header */}
  <div className="bg-white border-b border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl text-gray-900">Customer Management</h1>
        <p className="text-gray-600 mt-1">Manage your customer base</p>
      </div>
    </div>
  </div>

  <div className="p-6">
    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-sm text-gray-600 mb-1">Total Customers</p>
        <p className="text-3xl text-gray-900">{totalCustomers}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-sm text-gray-600 mb-1">Active Customers</p>
        <p className="text-3xl text-gray-900">{activeCustomers}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
        <p className="text-3xl text-gray-900">${totalRevenue.toLocaleString()}</p>
      </div>
    </div>

    {/* Search and Filter */}
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="all">All Customers</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
    </div>

    {/* Customers Table */}
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">Member since {customer.joinDate}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.totalOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${customer.totalSpent.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    customer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleToggleStatus(customer.id)}
                    className={customer.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                  >
                    {customer.status === 'active' ? 'Block' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {/* Customer Detail Modal */}
  {selectedCustomer && (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl text-gray-900">Customer Details</h2>
          <button onClick={() => setSelectedCustomer(null)}>
            <XIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <img
              src={selectedCustomer.avatar}
              alt={selectedCustomer.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                selectedCustomer.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedCustomer.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
            <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
            <p><span className="font-medium">Phone:</span> {selectedCustomer.phone}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl text-gray-900">{selectedCustomer.totalOrders}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl text-gray-900">${selectedCustomer.totalSpent.toLocaleString()}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
            <p><span className="font-medium">Joined:</span> {selectedCustomer.joinDate}</p>
            <p><span className="font-medium">Last Order:</span> {selectedCustomer.lastOrder}</p>
          </div>
        </div>

        {/* Actions */}
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/messages/inbox/${selectedCustomer.id}`)}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <Mail className="w-5 h-5" />
            Send Message
          </button>
          <button
            onClick={() => handleToggleStatus(selectedCustomer.id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition ${
              selectedCustomer.status === 'active'
                ? 'border border-red-300 text-red-700 hover:bg-red-50'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {selectedCustomer.status === 'active' ? (
              <>
                <Ban className="w-5 h-5" />
                Block Customer
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5" />
                Activate Customer
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
