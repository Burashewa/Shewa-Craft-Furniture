import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export function DashboardOverview() {
  const stats = [
    {
      label: 'Total Revenue',
      value: '$48,574',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      label: 'Total Orders',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Products',
      value: '48',
      change: '+2',
      trend: 'up',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      label: 'Total Customers',
      value: '1,234',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Smith', product: 'Modern Sofa', amount: 1299, status: 'pending' },
    { id: 'ORD-002', customer: 'Sarah Johnson', product: 'Dining Table Set', amount: 899, status: 'approved' },
    { id: 'ORD-003', customer: 'Mike Brown', product: 'Office Chair', amount: 349, status: 'pending' },
    { id: 'ORD-004', customer: 'Emily Davis', product: 'Bookshelf', amount: 459, status: 'shipped' },
    { id: 'ORD-005', customer: 'David Wilson', product: 'Coffee Table', amount: 299, status: 'approved' },
  ];

  return (
    <div className="lg:pt-0 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-3xl text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.product}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 font-medium">${order.amount}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">Pending Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-medium">5 Orders Awaiting Approval</p>
                    <p className="text-sm text-gray-600 mt-1">Review and approve payment confirmations</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-medium">8 Unread Messages</p>
                    <p className="text-sm text-gray-600 mt-1">Customers waiting for responses</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-gray-900 font-medium">3 Products Low Stock</p>
                    <p className="text-sm text-gray-600 mt-1">Consider restocking soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
