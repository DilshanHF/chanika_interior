import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { 
  fetchOrders, 
  updateOrderStatus,
  Order
} from '../store/slices/orderSlice';
import { 
  fetchCustomers,
  Customer
} from '../store/slices/customerSlice';
import {
  fetchItems,
  Item
} from '../store/slices/itemSlice';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  setCustomerId,
  clearCart,
  CartItem
} from '../store/slices/cartSlice';
import {   Search,   ShoppingCart,   Plus,   Minus,   X,   Check } from 'lucide-react';

const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const { customers } = useSelector((state: RootState) => state.customers);
  const { items } = useSelector((state: RootState) => state.items);
  const { items: cartItems, customerId } = useSelector((state: RootState) => state.cart);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [searchItemTerm, setSearchItemTerm] = useState('');

  useEffect(() => {
    dispatch(fetchOrders() as any);
    dispatch(fetchCustomers() as any);
    dispatch(fetchItems() as any);
  }, [dispatch]);

  useEffect(() => {
    if (customerId) {
      setSelectedCustomer(customerId);
    }
  }, [customerId]);

  const filteredOrders = orders.filter(
    (order) => {
      const customer = order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const orderId = order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const date = new Date(order.date).toLocaleDateString().includes(searchTerm);
      return customer || orderId || date;
    }
  );

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchItemTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchItemTerm.toLowerCase())
  );

  const handleAddToCart = (item: Item) => {
    dispatch(addToCart(item));
  };

  const handleRemoveFromCart = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ itemId, quantity }));
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCustomer(e.target.value);
    dispatch(setCustomerId(e.target.value));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.item.price * item.quantity, 0);
  };

  const handleCreateOrder = async () => {
    if (!selectedCustomer || cartItems.length === 0) {
      alert('Please select a customer and add items to cart');
      return;
    }

    try {
      const orderItems = cartItems.map((item) => ({
        itemId: item.item.id,
        quantity: item.quantity,
        price: item.item.price
      }));

      // Here you would dispatch the createOrder action
      // await dispatch(createOrder({ customerId: selectedCustomer, orderItems }) as any);
      
      alert('Order created successfully!');
      dispatch(clearCart());
      setIsCartOpen(false);
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order');
    }
  };

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await dispatch(updateOrderStatus({ id: orderId, status }) as any);
  };

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/order-details?id=${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <button
          onClick={() => setIsCartOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          New Order {cartItems.length > 0 && `(${cartItems.length})`}
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search orders..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className={`text-sm rounded-full px-3 py-1 font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewOrderDetails(order.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">New Order</h2>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setIsCartOpen(false)}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="mt-8">
                      <div className="mb-6">
                        <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
                          Select Customer
                        </label>
                        <select
                          id="customer"
                          value={selectedCustomer}
                          onChange={handleCustomerChange}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Select a customer</option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-6">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search items..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={searchItemTerm}
                            onChange={(e) => setSearchItemTerm(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6 max-h-60 overflow-y-auto">
                        {filteredItems.map((item) => (
                          <div key={item.id} className="border rounded-md p-2 flex flex-col">
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.category}</div>
                            <div className="text-sm font-bold mt-1">${item.price.toFixed(2)}</div>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="mt-2 bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3 mr-1" /> Add
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 py-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Cart Items</h3>
                        {cartItems.length === 0 ? (
                          <p className="text-gray-500">No items in cart</p>
                        ) : (
                          <div className="flow-root">
                            <ul className="-my-6 divide-y divide-gray-200">
                              {cartItems.map((cartItem) => (
                                <li key={cartItem.item.id} className="py-6 flex">
                                  <div className="flex-1 flex flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{cartItem.item.name}</h3>
                                        <p className="ml-4">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">{cartItem.item.category}</p>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between text-sm">
                                      <div className="flex items-center">
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                          className="text-gray-600 hover:text-gray-800 p-1"
                                        >
                                          <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="mx-2 text-gray-700">{cartItem.quantity}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                          className="text-gray-600 hover:text-gray-800 p-1"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </button>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFromCart(cartItem.item.id)}
                                        className="font-medium text-red-600 hover:text-red-500"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                      <p>Subtotal</p>
                      <p>${calculateTotal().toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateOrder}
                      disabled={!selectedCustomer || cartItems.length === 0}
                      className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                        !selectedCustomer || cartItems.length === 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Create Order
                    </button>
                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          className="text-indigo-600 font-medium hover:text-indigo-500"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Continue Shopping<span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;