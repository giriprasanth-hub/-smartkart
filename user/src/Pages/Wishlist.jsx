import React, { useEffect, useState } from 'react';
import HomeHeader from './HomeHeader';
import axios from 'axios';

function Wishlist() {
  const userId = localStorage.getItem("userId");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:3333/wishlist/${userId}`);
      setWishlist(res.data.items || []);
    } catch (err) {
      console.error("Error fetching wishlist", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:3333/wishlist/${userId}/${productId}`);
      fetchWishlist();
    } catch (err) {
      console.error("Failed to remove product", err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post("http://localhost:3333/cart/add", {
        userId,
        productId,
        quantity: 1
      });
      alert("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart", err);
    }
  };

  return (
    <div>
      <HomeHeader showSearch={false} />
      <div className="wishlist-container">
        <h1>Your Wishlist ❤️</h1>

        <div className="wishlist-grid">
          {wishlist.length === 0 ? (
            <p>No items in wishlist.</p>
          ) : (
            [...wishlist]
              .reverse()
              .filter(product => product.productId)
              .map(product => (
                <div className="wishlist-card" key={product.productId._id} style={{ width: "300px" }}>
                  <div className='img-port'>
                    <img src={product.productId.image} alt={product.productId.name} />
                  </div>
                  <div className="wishlist-info">
                    <h3>{product.productId.name}</h3>
                    <p className="wishlist-price">MRP: ₹{product.productId.price}</p>
                    <div className="wishlist-actions">
                      <button
                        className="wishlist-cart-btn"
                        onClick={() => handleAddToCart(product.productId._id)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="wishlist-remove-btn"
                        onClick={() => handleRemove(product.productId._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Wishlist;