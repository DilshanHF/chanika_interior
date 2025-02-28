import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  fetchCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  Customer,
} from '../store/slices/customerSlice';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';

const Customers: React.FC = () => {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state: RootState) => state.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>({
    _id: '',
    name: '',
    email: '',
    telephone: '',
    createdAt: '',
    updatedAt: '',
    __v: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers() as any);
  }, [dispatch]);

  const filteredCustomers = customers.filter(
      (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.telephone.includes(searchTerm)
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setCurrentCustomer(customer);
      setIsEditing(true);
    } else {
      setCurrentCustomer({
        _id: '',
        name: '',
        email: '',
        telephone: '',
        createdAt: '',
        updatedAt: '',
        __v: 0,
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer({
      _id: '',
      name: '',
      email: '',
      telephone: '',
      createdAt: '',
      updatedAt: '',
      __v: 0,
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentCustomer.name || !currentCustomer.email || !currentCustomer.telephone) {
      return;
    }

    if (isEditing && currentCustomer._id) {
      await dispatch(updateCustomer(currentCustomer as Customer) as any);
    } else {
      await dispatch(addCustomer(currentCustomer as Omit<Customer, '_id'>) as any);
    }

    handleCloseModal();
  };

  const handleDelete = async (_id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await dispatch(deleteCustomer(_id) as any);
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
              type="text"
              placeholder="Search customers..."
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telephone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                        <tr key={customer._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{customer.telephone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => handleOpenModal(customer)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(customer._id)}
                                className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No customers found
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
        )}

        {/* Customer Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditing ? 'Edit Customer' : 'Add Customer'}
                  </h2>
                  <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                          type="text"
                          id="name"
                          name="name"
                          value={currentCustomer.name}
                          onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                      />
                    </div>
                    { !isEditing && (
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                              type="email"
                              id="email"
                              name="email"
                              value={currentCustomer.email}
                              onChange={(e) => setCurrentCustomer({...currentCustomer, email: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                          />
                        </div>
                    )}
                    <div>
                      <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                        Telephone
                      </label>
                      <input
                          type="tel"
                          id="telephone"
                          name="telephone"
                          value={currentCustomer.telephone}
                          onChange={(e) => setCurrentCustomer({...currentCustomer, telephone: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isEditing ? 'Update' : 'Add'} Customer
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default Customers;