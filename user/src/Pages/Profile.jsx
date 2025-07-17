import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import HomeHeader from "./HomeHeader";

function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const { id: userId } = useParams();

  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({});
  const [editMode, setEditMode] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [upis, setUpis] = useState([]);
  const [giftCards, setGiftCards] = useState([]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [showUpiForm, setShowUpiForm] = useState(false);
  const [newUpi, setNewUpi] = useState("");

  const [showGiftCardForm, setShowGiftCardForm] = useState(false);
  const [giftAmount, setGiftAmount] = useState("");

  const [showCardForm, setShowCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardType: "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, addrRes, cardRes, upiRes, giftRes] = await Promise.all([
          axios.get(`http://localhost:3333/user/${userId}`),
          axios.get(`http://localhost:3333/userextras/address/${userId}`),
          axios.get(`http://localhost:3333/userextras/card/${userId}`),
          axios.get(`http://localhost:3333/userextras/upi/${userId}`),
          axios.get(`http://localhost:3333/userextras/giftcard/${userId}`),
        ]);
        setUser(userRes.data);
        setEditableUser(userRes.data);
        setAddresses(addrRes.data);
        setCards(cardRes.data);
        setUpis(upiRes.data);
        setGiftCards(giftRes.data);
      } catch (err) {
        console.error("Fetching error:", err);
      }
    };
    fetchAll();
  }, [userId]);

  const handleUserChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const handleSaveUser = async () => {
    try {
      await axios.put(`http://localhost:3333/user/${userId}`, editableUser);
      setUser(editableUser);
      setEditMode(false);
      alert("Profile Updated");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3333/userextras/address", {
        ...newAddress,
        userId,
      });
      alert("Address saved!");
      setShowAddressForm(false);
      setNewAddress({ addressLine: "", city: "", state: "", pincode: "", country: "" });
      const res = await axios.get(`http://localhost:3333/userextras/address/${userId}`);
      setAddresses(res.data);
    } catch (err) {
      console.error("Error saving address", err);
    }
  };

  const handleAddUpi = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3333/userextras/upi", {
        userId,
        upiId: newUpi,
        verified: false,
      });
      alert("UPI ID added!");
      setShowUpiForm(false);
      setNewUpi("");
      const res = await axios.get(`http://localhost:3333/userextras/upi/${userId}`);
      setUpis(res.data);
    } catch (err) {
      console.error("Error adding UPI ID:", err);
      alert("Failed to add UPI ID.");
    }
  };

  const handleAddGiftCard = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3333/userextras/giftcard", {
        userId,
        amount: giftAmount,
        isUsed: false,
      });
      alert("Gift card added!");
      setShowGiftCardForm(false);
      setGiftAmount("");
      const res = await axios.get(`http://localhost:3333/userextras/giftcard/${userId}`);
      setGiftCards(res.data);
    } catch (err) {
      console.error("Error adding gift card", err);
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3333/userextras/card", {
        ...newCard,
        userId,
      });
      alert("Card added!");
      setShowCardForm(false);
      setNewCard({ cardNumber: "", cardType: "" });
      const res = await axios.get(`http://localhost:3333/userextras/card/${userId}`);
      setCards(res.data);
    } catch (err) {
      console.error("Error saving card", err);
    }
  };

  return (
    <>
      <HomeHeader showSearch={false} />
      <div className="profile-page">
        <div className="sidebar">
          <div className="user-box">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="avatar" />
            <p>Hello, <strong>{user?.name || "User"}</strong></p>
          </div>

          <div className="menu">
            <div className="menu-section">
              <Link to={`/user/${userId}/orders`} className="section-title">MY ORDERS</Link>
            </div>
            <div className="menu-section">
              <Link to={`/user/${userId}/wishlist`} className="section-title">MY WISHLIST</Link>
            </div>
            <div className="menu-section">
              <p className="section-title">ACCOUNT SETTINGS</p>
              <ul>
                <li onClick={() => setActiveTab("profile")}>Profile Information</li>
                <li onClick={() => setActiveTab("address")}>Manage Addresses</li>
              </ul>
            </div>
            <div className="menu-section">
              <p className="section-title">PAYMENTS</p>
              <ul>
                <li onClick={() => setActiveTab("giftcards")}>Gift Cards <span className="green">₹{giftCards.reduce((acc, g) => acc + g.amount, 0)}</span></li>
                <li onClick={() => setActiveTab("savedupi")}>Saved UPI</li>
                <li onClick={() => setActiveTab("savedcards")}>Saved Cards</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="profile-details">
          {activeTab === "profile" && user && (
            <div className="section">
              <div className="section-title-row">
                <h2>Personal Information</h2>
                {editMode ? (
                  <button className="btn" onClick={handleSaveUser}>Save</button>
                ) : (
                  <button className="btn" onClick={() => setEditMode(true)}>Edit</button>
                )}
              </div>
              <input type="text" name="name" value={editableUser.name || ""} onChange={handleUserChange} disabled={!editMode} />
              <input className="emailprof" type="text" name="email" value={editableUser.email || ""} onChange={handleUserChange} disabled={!editMode} />
              <input type="text" name="phoneNumber" value={editableUser.phoneNumber || ""} onChange={handleUserChange} disabled={!editMode} />
              <input type="text" name="address" value={editableUser.address || ""} onChange={handleUserChange} disabled={!editMode} />
            </div>
          )}

          {activeTab === "address" && (
            <div className="section">
              <h2>Manage Addresses</h2>
              {addresses.length > 0 ? (
                addresses.map((addr, idx) => (
                  <div key={idx} className="address-card">
                    <p>{addr.addressLine}, {addr.city}, {addr.state}, {addr.pincode}, {addr.country}</p>
                  </div>
                ))
              ) : <p>No addresses found.</p>}

              {!showAddressForm ? (
                <button className="btn" onClick={() => setShowAddressForm(true)}>Add New Address</button>
              ) : (
                <form className="address-form" onSubmit={handleAddAddress}>
                  <input type="text" name="addressLine" placeholder="Address Line" value={newAddress.addressLine} onChange={handleAddressChange} required />
                  <input type="text" name="city" placeholder="City" value={newAddress.city} onChange={handleAddressChange} required />
                  <input type="text" name="state" placeholder="State" value={newAddress.state} onChange={handleAddressChange} required />
                  <input type="text" name="pincode" placeholder="Pincode" value={newAddress.pincode} onChange={handleAddressChange} required />
                  <input type="text" name="country" placeholder="Country" value={newAddress.country} onChange={handleAddressChange} required />
                  <button className="btn" type="submit">Save Address</button>
                  <button className="btn cancel" type="button" onClick={() => setShowAddressForm(false)}>Cancel</button>
                </form>
              )}
            </div>
          )}

          {activeTab === "giftcards" && (
            <div className="section">
              <h2>Gift Cards</h2>
              {giftCards.length === 0 ? <p>No gift cards.</p> : giftCards.map((g, i) => (
                <p key={i}>₹{g.amount} - {g.isUsed ? "Used" : "Available"}</p>
              ))}
              {!showGiftCardForm ? (
                <button className="btn" onClick={() => setShowGiftCardForm(true)}>Buy a Gift Card</button>
              ) : (
                <form onSubmit={handleAddGiftCard}>
                  <input type="number" value={giftAmount} onChange={(e) => setGiftAmount(e.target.value)} placeholder="Enter Amount" required />
                  <button className="btn" type="submit">Save</button>
                  <button className="btn cancel" type="button" onClick={() => setShowGiftCardForm(false)}>Cancel</button>
                </form>
              )}
            </div>
          )}

          {activeTab === "savedupi" && (
            <div className="section">
              <h2>Saved UPI</h2>
              {upis.length === 0 ? <p>No UPI saved.</p> : upis.map((u, i) => (
                <p key={i}>{u.upiId} ({u.verified ? "Verified" : "Unverified"})</p>
              ))}
              {!showUpiForm ? (
                <button className="btn" onClick={() => setShowUpiForm(true)}>Add UPI ID</button>
              ) : (
                <form onSubmit={handleAddUpi}>
                  <input type="text" value={newUpi} onChange={(e) => setNewUpi(e.target.value)} placeholder="Enter UPI ID" required />
                  <button className="btn" type="submit">Save</button>
                  <button className="btn cancel" type="button" onClick={() => setShowUpiForm(false)}>Cancel</button>
                </form>
              )}
            </div>
          )}

          {activeTab === "savedcards" && (
            <div className="section">
              <h2>Saved Cards</h2>
              {cards.length === 0 ? <p>No cards saved.</p> : cards.map((c, i) => (
                <p key={i}>{c.cardNumber} - {c.cardType}</p>
              ))}
              {!showCardForm ? (
                <button className="btn" onClick={() => setShowCardForm(true)}>Add New Card</button>
              ) : (
                <form onSubmit={handleAddCard}>
                  <input type="text" name="cardNumber" value={newCard.cardNumber} onChange={handleCardChange} placeholder="Card Number" required />
                  <input type="text" name="cardType" value={newCard.cardType} onChange={handleCardChange} placeholder="Card Type (e.g. Visa)" required />
                  <button className="btn" type="submit">Save</button>
                  <button className="btn cancel" type="button" onClick={() => setShowCardForm(false)}>Cancel</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
