import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HomeHeader from "./HomeHeader";
import axios from "axios";

function Orders() {
  const { id: userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`https://smartkart-server-058l.onrender.com/orders?userId=${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.put(`https://smartkart-server-058l.onrender.com/orders/${orderId}/cancel`);
      alert("Order Cancelled Successfully");
      fetchOrders();
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel the order");
    }
  };

  const filteredOrders = [...orders]
    .reverse()
    .map(order => {
      const filteredProducts = order.products.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      return { ...order, products: filteredProducts };
    })
    .filter(order => order.products.length > 0);

  return (
    <>
      <HomeHeader showSearch={false} />
      <div className="order-container">
        <div className="order-search-bar">
          <input
            type="text"
            placeholder="Search your orders here"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button><i className="fas fa-search"></i> Search Orders</button>
        </div>

        {filteredOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} className="order-card-container">
              <h3>Order #{filteredOrders.length - index}</h3>
              <p>Total Amount: ₹{order.totalAmount}</p>
              <p>Order Status: <strong>{order.status}</strong></p>
              <p>Delivery Address: {order.deliveryAddress}</p>
              <p style={{ fontStyle: "italic", color: "#777" }}>
                Placed on {new Date(order.orderDate).toLocaleDateString()}
              </p>

              {order.products.map((product, idx) => (
                <div className="order-card" key={idx}>
                  <img src={product.image} alt={product.name} />
                  <div className="order-details">
                    <h3>{product.name}</h3>
                    <p className="order-price">₹{product.price}</p>
                    <p className="order-status arriving">Arriving tomorrow by 11 pm</p>
                    <p className="order-info">Your item has been received in the hub nearest to you</p>
                  </div>
                </div>
              ))}

              {/* Cancel Order Button */}
              {order.status !== "Cancelled" && (
                <button
                  className="cancel-order-btn"
                  onClick={() => cancelOrder(order._id)}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Cancel Order
                </button>
              )}
              {order.status === "Cancelled" && (
                <p style={{ color: "red", marginTop: "10px" }}>
                  This order has been cancelled.
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Orders;
