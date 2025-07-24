import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HomeHeader from "./HomeHeader";

function Cart() {
    const [cart, setCart] = useState(null);
    const userId = localStorage.getItem("userId");

    const fetchCart = async () => {
        try {
            const res = await axios.get(`https://smartkart-server-058l.onrender.com/cart/${userId}`);
            setCart(res.data);
        } catch (err) {
            console.error("Failed to load cart:", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [userId]);

    const handleUpdateQuantity = async (productId, change) => {
        const item = cart.items.find(i => i.productId._id === productId);
        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {

            console.warn("Minimum quantity is 1");
            return;
        }

        try {
            const res = await axios.put(`https://smartkart-server-058l.onrender.com/cart/update/${cart.userId}`, {
                productId,
                quantity: newQuantity,
            });

            setCart(res.data.cart);
        } catch (error) {
            console.error("Quantity update failed:", error);
        }
    };


    return (
        <>
            <HomeHeader showSearch={false} />

            <div className="cart-page">
                <div className="cart-container">
                    {Array.isArray(cart?.items) &&
                        [...cart.items].reverse().map((item, index) => (
                            <div key={index} className="cart-card">
                                <img
                                    src={item.productId.image}
                                    alt={item.productId.name}
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                />
                                <div className="cart-cart-align">
                                    <div className="cart-cartdetail">
                                        <h3>{item.productId.name}</h3>
                                        <pre>MRP: ₹{item.productId.price} || Qty: {item.quantity}</pre>
                                    </div>
                                    <div className="qty-container">
                                        <button
                                            className="qty-btn1"
                                            onClick={() => handleUpdateQuantity(item.productId._id, -1)}
                                        >
                                            −
                                        </button>
                                        <input className="qty-input" readOnly value={item.quantity} />
                                        <button
                                            className="qty-btn2"
                                            onClick={() => handleUpdateQuantity(item.productId._id, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>


                <div className="price-box">
                    <h4>PRICE DETAILS</h4>
                    <div className="price-item">
                        <span>MRP ({cart?.totalItems || 0} items)</span>
                        <span>₹{cart?.totalAmount || 0}</span>
                    </div>
                    <div className="price-item">
                        <span>Product Discount</span>
                        <span className="green">– ₹0</span>
                    </div>
                    <div className="price-item">
                        <span>Platform Fee</span>
                        <span>₹9</span>
                    </div>
                    <div className="price-item">
                        <span>Delivery Fee</span>
                        <span><del>₹50</del> <span className="green">Free</span></span>
                    </div>
                    <hr />
                    <div className="price-item total">
                        <span>Total Amount</span>
                        <span>₹{cart ? cart.totalAmount + 9 : 0}</span>
                    </div>
                    <hr />
                    <div className="savings-msg">
                        You will save ₹0 on this order
                    </div>
                    <Link to={`/user/${userId}/cart/ordersummary`}>
                        <button className="place-order-btn">PLACE ORDER</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Cart;
