import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCustomer() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const { confirmPassword, ...userData } = form;
      await axios.post('https://smartkart-server-058l.onrender.com/user/create', userData);
      alert("Customer created successfully!");
      navigate(`/admin/${localStorage.getItem("adminId")}/customers`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // 🚪 Handle close button
  const handleClose = () => {
    navigate(`/admin/${localStorage.getItem("adminId")}/customers`);
  };

  return (
    <div className="modal" id="customerModal">
      <div className="modal-content" style={{ position: 'relative' }}>
        
        {/* ❌ Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            fontSize: "20px",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
          aria-label="Close"
        >
          &times;
        </button>

        <h2>Add New Customer</h2>
        <form onSubmit={handleSubmit}>
          <label>Customer Name:</label>
          <input type="text" name="name" onChange={handleChange} required />

          <label>Phone Number:</label>
          <input type="tel" name="phoneNumber" onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required />

          <label>Address:</label>
          <textarea name="address" rows="3" onChange={handleChange} required />

          <label>Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            required
          />

          <label>Confirm Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            onChange={handleChange}
            required
          />

          <div style={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword"> Show Password</label>
          </div>

          <button type="submit">Save Customer</button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;
