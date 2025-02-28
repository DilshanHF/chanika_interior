import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Items from './pages/Items';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';

// Layout
import DashboardLayout from './components/layouts/DashboardLayout';

function App() {
  let { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/customers" element={isAuthenticated ? <Customers /> : <Navigate to="/login" />} />
          <Route path="/items" element={isAuthenticated ? <Items /> : <Navigate to="/login" />} />
          <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/order-details" element={isAuthenticated ? <OrderDetails /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;