import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://smartkart-server-058l.onrender.com/products/${id}`);
        const productData = res.data;
        setProduct(productData);
        setMainImage(productData.images?.[0] || productData.image);
        setSelectedWeight(productData.weight || '');
      } catch (err) {
        console.error("Product fetch failed", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!userId) {
      setMessage("Please log in first.");
      return;
    }

    try {
      await axios.post("https://smartkart-server-058l.onrender.com/cart/add", {
        userId,
        productId: product._id,
        quantity: 1
      });
      setMessage(" Product added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      setMessage(" Failed to add to cart");
    }
  };

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product Not Found</h2>
        <p>No product found with ID: <strong>{id}</strong></p>
      </div>
    );
  }

  return (
    <>
      <HomeHeader />
      <div className="product-container">
        <div className="left-panel">
          <img src={mainImage} alt={product.name} className="main-img" />
          <div className="thumbs">
            {(product.images || [product.image]).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setMainImage(img)}
                className={`thumb ${mainImage === img ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="right-panel">
          <h1>{product.name}</h1>
          <p><strong>MRP:</strong> ₹{product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>

          {product.availableWeights?.length > 0 && (
            <div className="weight-options">
              <label><strong>Weight:</strong></label>
              <div className="weights">
                {product.availableWeights.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedWeight(w)}
                    className={selectedWeight === w ? 'selected' : ''}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="specs">
            <h3>Specifications:</h3>
            <ul>
              {product.specifications &&
                Object.entries(product.specifications).map(([key, val], i) => (
                  <li key={i}><strong>{key}:</strong> {val}</li>
                ))
              }
            </ul>
          </div>

          <button className="add-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
