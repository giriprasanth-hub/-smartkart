import React, { useState, useEffect } from "react";
import axios from "axios";

function StockManagement() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalSearchText, setModalSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockQty, setStockQty] = useState(0);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://smartkart-server-058l.onrender.com/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockIn = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalSearchText("");
    setSuggestions([]);
    setSelectedProduct(null);
    setStockQty(0);
  };

  const handleModalSearch = (query) => {
    setModalSearchText(query);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return alert("Select a product first");
    try {
      const updatedStock = selectedProduct.stock + Number(stockQty);
      await axios.put(`https://smartkart-server-058l.onrender.com/products/${selectedProduct._id}`, {
        stock: updatedStock,
      });
      fetchProducts();
      closeModal();
      alert("Stock updated successfully");
    } catch (error) {
      console.error("Error updating stock", error);
      alert("Failed to update stock");
    }
  };

  return (
    <div className="stock-container">
      <h2>📦 Stock Management</h2>

      {/* Top Search Bar */}
      <div className="stock-controls">
        <input
          type="text"
          placeholder="Search product..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="stock-in-btn" onClick={handleStockIn}>
          Stock In
        </button>
      </div>

      {/* Product Table */}
      <table className="stock-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>₹{product.price}</td>
                <td>
                  <span className={product.stock > 0 ? "in-stock" : "out-stock"}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Stock In</h3>

            <label>Product Name</label>
            <input
              type="text"
              value={modalSearchText}
              onChange={(e) => handleModalSearch(e.target.value)}
              placeholder="Type to search product"
            />

            {suggestions.length > 0 && (
              <ul className="suggestion-list">
                {suggestions.map((product) => (
                  <li
                    key={product._id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setModalSearchText(product.name);
                      setSuggestions([]);
                    }}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}

            {selectedProduct && (
              <>
                <label>Current Stock: {selectedProduct.stock}</label>
                <label>Add Quantity</label>
                <input
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(Number(e.target.value))}
                  placeholder="Enter quantity to add"
                />
              </>
            )}

            <div className="modal-actions">
              <button className="save-btn" onClick={handleSubmit}>
                Update Stock
              </button>
              <button className="close-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockManagement;
