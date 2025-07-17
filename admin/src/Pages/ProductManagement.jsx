import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const adminId = localStorage.getItem("adminId");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3333/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3333/products/${productId}`);
      fetchProducts(); // refresh product list
    } catch (err) {
      console.error("Error deleting product", err);
      alert("Failed to delete product");
    }
  };

  const filtered = products.filter((prod) =>
    prod.name?.toLowerCase().includes(search.toLowerCase()) ||
    prod.name_ta?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="product-container">
      <h1 className='product-tittle'>🛒 Product Management</h1>

      <input
        type="text"
        id="product-searchInput"
        placeholder="Search by Name..."
        className="product-search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Link to={`/admin/${adminId}/products/addproduct`}>
        <button className="product-add-btn">+ Add Product</button>
      </Link>

      <div className="product-table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name (EN)</th>
              <th>Name (TA)</th>
              <th>Purchase ₹</th>
              <th>MRP ₹</th>
              <th>Sale ₹</th>
              <th>Wholesale ₹</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod) => (
              <tr key={prod._id}>
                <td>
                  <img
                    src={
                      prod.image?.includes("http")
                        ? prod.image
                        : `http://localhost:3333${prod.image}`
                    }
                    alt="Product"
                    width="50"
                  />
                </td>
                <td>{prod.name}</td>
                <td>{prod.name_ta}</td>
                <td>₹{prod.purchasePrice}</td>
                <td>₹{prod.mrp}</td>
                <td>₹{prod.price}</td>
                <td>₹{prod.wholesalePrice}</td>
                <td>{prod.stock}</td>
                <td>
                  <button
                    className="product-edit"
                    onClick={() => navigate(`/admin/${adminId}/products/edit/${prod._id}`)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    className="product-delete"
                    onClick={() => handleDelete(prod._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Outlet />
    </div>
  );
}

export default ProductManagement;
