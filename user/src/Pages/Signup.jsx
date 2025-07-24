import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [errorMessage, setErrorMessage] = useState("");
  const [formdata, setFormdata] = useState({
    email: "",
    name: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirm_password: ""
  });

  const navigate = useNavigate();

  const handlechange = (e) => {
    setFormdata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formdata.password !== formdata.confirm_password) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "https://smartkart-server-058l.onrender.com/user/create",
        {
          name: formdata.name,
          email: formdata.email,
          password: formdata.password,
          address: formdata.address,
          phoneNumber: formdata.phoneNumber,
        }
      );

      if (res.status === 200) {
        alert(res.data.message || "User created successfully! You can now login.");
        navigate("/"); // redirect to login page after signup
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className='sign-container'>
      <form className='sign-form' onSubmit={handleSubmit}>
        <h1>SignUp Form</h1>
        <input
          className='sign-input'
          placeholder='Email'
          type="email"
          name="email"
          onChange={handlechange}
          value={formdata.email}
          required
        />
        <input
          className='sign-input'
          placeholder='Full Name'
          name="name"
          onChange={handlechange}
          value={formdata.name}
          required
        />
        <input
          className='sign-input'
          placeholder='Password'
          type='password'
          name="password"
          onChange={handlechange}
          value={formdata.password}
          required
        />
        <input
          className='sign-input'
          placeholder='Confirm Password'
          type='password'
          name="confirm_password"
          onChange={handlechange}
          value={formdata.confirm_password}
          required
        />
        <input
          className='sign-input'
          placeholder='Mobile No'
          type='tel'
          name="phoneNumber"
          onChange={handlechange}
          value={formdata.phoneNumber}
          required
        />
        <input
          className='sign-input'
          placeholder='Address For Delivery'
          name="address"
          onChange={handlechange}
          value={formdata.address}
          required
        />

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <button className='sign-btn' type='submit'>Sign up</button>
        <p>
          Have an account with us? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
