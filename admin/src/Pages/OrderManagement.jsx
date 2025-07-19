import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://smartkart-server-058l.onrender.com/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-container">
      <h2>Orders Management</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total ₹</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6">No orders found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-5)}</td>
                  <td>{order.userId?.name || "N/A"}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>₹{order.totalAmount}</td>
                  <td><span className={`status ${order.status}`}>{order.status}</span></td>
                  <td>
                    <button className="view-btn" onClick={() => alert("Invoice view coming soon")}>View Invoice</button>
                    <button className="reprint-btn" onClick={() => alert("Reprint coming soon")}>Reprint</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderManagement;
