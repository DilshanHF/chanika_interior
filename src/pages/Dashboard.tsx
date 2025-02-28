import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchItems } from '../store/slices/itemSlice';
import { fetchCustomers } from '../store/slices/customerSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import { Users, ShoppingBag, ClipboardList, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.items);
  const { customers } = useSelector((state: RootState) => state.customers);
  const { orders } = useSelector((state: RootState) => state.orders);
  const [categoryItems, setCategoryItems] = useState<Record<string, number>>({});

  useEffect(() => {
    dispatch(fetchItems() as any);
    dispatch(fetchCustomers() as any);
    dispatch(fetchOrders() as any);
  }, [dispatch]);

  useEffect(() => {
    const categoryCounts: Record<string, number> = {};
    items.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
    setCategoryItems(categoryCounts);
  }, [items]);

  const stats = [
    { name: 'Total Customers', value: customers.length, icon: <Users className="h-6 w-6 text-blue-500" /> },
    { name: 'Total Items', value: items.length, icon: <ShoppingBag className="h-6 w-6 text-green-500" /> },
    { name: 'Total Orders', value: orders.length, icon: <ClipboardList className="h-6 w-6 text-purple-500" /> },
    {
      name: 'Revenue',
      value: `LKR ${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}`,
      icon: <TrendingUp className="h-6 w-6 text-yellow-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome to Chanikma Interior Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">{stat.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Items by Category */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Items by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryItems).map(([category, count]) => (
            <div key={category} className="border rounded-lg p-4 flex justify-between items-center">
              <span className="font-medium text-gray-700">{category}</span>
              <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm">
                {count} items
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Items */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.slice(0, 8).map((item) => (
            <div key={item._id} className="border rounded-lg overflow-hidden">
              <img
                src={item.image || `https://source.unsplash.com/random/300x200/?furniture,${item.category}`}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="mt-1 font-bold">LKR {item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;