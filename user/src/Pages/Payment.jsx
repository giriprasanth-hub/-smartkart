import { faArrowLeft, faShop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Payment() {
    const { id: userId } = useParams();
    const navigate = useNavigate();



    const [activeTab, setActiveTab] = useState("upi");
    const [upiId, setUpiId] = useState("");
    const [cart, setCart] = useState(null);
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState("");

    useEffect(() => {
        fetchCart();
        fetchUser();
        const savedAddress = localStorage.getItem("selectedAddressText");
        if (savedAddress) {
            setAddress(savedAddress);
        }
    }, [userId]);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`http://localhost:3333/cart/${userId}`);
            setCart(res.data);
        } catch (err) {
            console.error("Cart fetch failed:", err);
        }
    };

    const fetchUser = async () => {
        try {
            const res = await axios.get(`http://localhost:3333/user/${userId}`);
            setUser(res.data);
        } catch (err) {
            console.error("User fetch failed:", err);
        }
    };

    const handlePlaceOrder = async () => {
        if (!cart || !user) return;

        const deliveryAddress = localStorage.getItem("selectedAddressText");
        if (!deliveryAddress) {
            alert("Please select a delivery address.");
            return;
        }

        const productIds = cart.items.map(item => item.productId);
        const totalAmount = cart.totalAmount + 9;

        const orderData = {
            userId,
            products: productIds,
            totalAmount,
            paymentMethod: activeTab === "upi" ? "upi" : "cash_on_delivery",
            deliveryAddress,
            totalQuantity: productIds.length,
            ...(activeTab === "upi" && upiId && { upiId }) 
        };

        try {
            const res = await axios.post("http://localhost:3333/orders", orderData);
            if (res.status === 200) {
                navigate(`/user/${userId}/cart/ordersummary/payment/success`);
            } else {
                alert("Order failed");
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("Order failed. Please try again.");
        }
    };


    const totalPrice = cart ? cart.totalAmount + 9 : 0;

    return (
        <>
            <div className="home-header-container">
                <h1>
                    <FontAwesomeIcon icon={faShop} className="logo" /> SmartKart
                </h1>
            </div>

            <div className="payment-container">
                <h2>
                    <Link to={`/user/${userId}/cart/ordersummary`}>
                        <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "1.5em" }} />
                    </Link>{" "}
                    Complete Payment
                </h2>

                <div className="payment-content">
                    <div className="payment-methods">
                        <div
                            className={`method ${activeTab === "upi" ? "selected" : ""}`}
                            onClick={() => setActiveTab("upi")}
                        >
                            💳 UPI
                            <span>Pay by any UPI app</span>
                        </div>
                        <div
                            className={`method ${activeTab === "cod" ? "selected" : ""}`}
                            onClick={() => setActiveTab("cod")}
                        >
                            💵 Cash on Delivery
                        </div>
                    </div>

                    <div className="upi-section">
                        {activeTab === "upi" && (
                            <>
                                <div className="upi-option">
                                    <input type="radio" checked readOnly />
                                    <label>Add new UPI ID</label>
                                </div>
                                <div className="upi-form">
                                    <input
                                        type="text"
                                        placeholder="Enter your UPI ID"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                    <button className="verify-btn">Verify</button>
                                </div>
                                <button className="continue-btn" onClick={handlePlaceOrder}>
                                    Pay ₹{totalPrice}
                                </button>
                            </>
                        )}

                        {activeTab === "cod" && (
                            <>
                                <h3>Cash on Delivery Selected</h3>
                                <p>You can pay by cash when the item is delivered to your doorstep.</p>
                                <button className="continue-btn" onClick={handlePlaceOrder}>
                                    Place Order
                                </button>
                            </>
                        )}
                    </div>

                    <div className="price-summary">
                        <div className="price-row">
                            <span>Price ({cart?.totalItems || 0} items)</span>
                            <span>₹{cart?.totalAmount || 0}</span>
                        </div>
                        <div className="price-row">
                            <span>Delivery Charges</span>
                            <span>₹0</span>
                        </div>
                        <div className="price-row">
                            <span>Platform fee</span>
                            <span>₹9</span>
                        </div>
                        <hr />
                        <div className="price-row total">
                            <strong>Total Amount</strong>
                            <span className="amount">₹{totalPrice}</span>
                        </div>
                    </div>
                </div>

               
                <footer>
                    <p>Policies: Returns Policy | Privacy</p>
                    <p>© SmartKart</p>
                    <p>
                        Need help? Visit the <a href="#">Help Center</a> or{" "}
                        <a href="#">Contact Us</a>
                    </p>
                </footer>
            </div>
        </>
    );
}

export default Payment;
