import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import ProductDetail from './Pages/ProductDetail';
import Orders from './Pages/Orders';
import Wishlist from './Pages/Wishlist';
import Cart from './Pages/Cart';
import OrderSummary from './Pages/OrderSummary';
import Payment from './Pages/Payment';
import PaymentSucess from './Pages/PaymentSucess';
import { useEffect } from 'react';

function App() {

  
  return (
    <>
       <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/user/:id/home" element={<Home />} />
      <Route path="/user/:id/profile" element={<Profile />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/user/:id/orders" element={<Orders />} />
      <Route path="/user/:id/wishlist" element={<Wishlist />} />

      <Route path="/user/:id/cart" element={<Cart />} />
      <Route path="/user/:id/cart/ordersummary" element={<OrderSummary />} />
      <Route path="/user/:id/cart/ordersummary/payment" element={<Payment />} />
      <Route path="/user/:id/cart/ordersummary/payment/success" element={<PaymentSucess />} />
    </Routes>
    </>
  );
}

export default App;
