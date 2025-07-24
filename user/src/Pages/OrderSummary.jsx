import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { faArrowLeft, faShop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function OrderSummary() {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);


  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: ""
  });

  useEffect(() => {
    fetchUser();
    fetchCart();
    fetchAddresses();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3333/user/${userId}`);
      setUser(data);
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3333/cart/${userId}`);
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3333/userextras/address/${userId}`);
      setAddresses(data);
      if (data.length > 0) setSelectedAddressId(data[0]._id);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const openModal = (addr = null) => {
    if (addr) {
      setEditingAddress(addr);
      setForm({
        addressLine: addr.addressLine,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        country: addr.country
      });
    } else {
      setEditingAddress(null);
      setForm({ addressLine: "", city: "", state: "", pincode: "", country: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        
        await axios.put(`https://smartkart-server-058l.onrender.com/userextras/address/${editingAddress._id}`, {
          userId,
          ...form
        });
      } else {
        
        await axios.post("https://smartkart-server-058l.onrender.com/userextras/address", {
          userId,
          ...form
        });
      }
      closeModal();
      fetchAddresses();
    } catch (err) {
      console.error("Address save failed", err);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <div className="home-header-container">
        <h1>
          <FontAwesomeIcon icon={faShop} className="logo" /> SmartKart
        </h1>
      </div>

      <div className="ordersum-page">
        <div className="delivery-section">
          <h2>
            <Link to={`/user/${userId}/cart`}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "1.5em" }} />
            </Link>{" "}
            📦 DELIVERY ADDRESS
          </h2>

          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`address-card ${selectedAddressId === addr._id ? "selected" : ""}`}
            >
              <div className="radio">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr._id}
                  onChange={() => {
                    setSelectedAddressId(addr._id);
                    localStorage.setItem(
                      "selectedAddressText",
                      `${addr.addressLine}, ${addr.city}, ${addr.state} - ${addr.pincode}, ${addr.country}`
                    );
                  }}
                />

                <label>
                  <strong>{user?.name}</strong> &nbsp; {user?.phoneNumber}
                </label>
              </div>
              <p>
                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}, {addr.country}
              </p>
              <button className="edit-link" onClick={() => openModal(addr)}>
                EDIT
              </button>
            </div>
          ))}

          <button className="add-address" onClick={() => openModal()}>
            + Add a new address
          </button>
        </div>

        <div className="price-details">
          <h3>PRICE DETAILS</h3>
          <div className="price-row">
            <span>Price ({cart?.totalItems || 0} items)</span>
            <span>₹{cart?.totalAmount || 0}</span>
          </div>
          <div className="price-row">
            <span>Delivery Charges</span>
            <span>
              <s>₹50</s> <span className="free">FREE</span>
            </span>
          </div>
          <div className="price-row">
            <span>
              Platform Fee <span title="Basic processing fee">🛈</span>
            </span>
            <span>₹9</span>
          </div>
          <hr />
          <div className="price-row total">
            <span>Total Payable</span>
            <span>₹{cart ? cart.totalAmount + 9 : 0}</span>
          </div>
          <p className="savings">
            Your Total Savings on this order <span>₹0</span>
          </p>
        </div>

        <Link to={`/user/${userId}/cart/ordersummary/payment`}>
          <button className="continue-btn">Continue</button>
        </Link>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editingAddress ? "Edit Address" : "Add New Address"}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Address Line
                <input
                  name="addressLine"
                  value={form.addressLine}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                City
                <input name="city" value={form.city} onChange={handleChange} required />
              </label>
              <label>
                State
                <input name="state" value={form.state} onChange={handleChange} required />
              </label>
              <label>
                Pincode
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Country
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit">{editingAddress ? "Save" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderSummary;
