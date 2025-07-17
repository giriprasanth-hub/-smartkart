import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom'; // 👈 import Outlet
import axios from 'axios';

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3333/user")
      .then(res => setCustomers(res.data))
      .catch(err => console.error("Failed to fetch users", err));

    axios.get("http://localhost:3333/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to fetch orders", err));
  }, []);

  const getOrderCount = (userId) => {
    return orders.filter(order => order.userId === userId).length;
  };

  return (
    <div className="customers-container">
      <h2>Customer Management</h2>

      <Link to={`/admin/${localStorage.getItem("adminId")}/customers/addcus`}>
        <button className='add-cus'>+ Add Customer</button>
      </Link>

      <table className="customers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Orders</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.phoneNumber}</td>
              <td>{getOrderCount(user._id)}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Outlet /> {/* 👈 This renders AddCustomer if route matches */}
    </div>
  );
}

export default CustomerManagement;
