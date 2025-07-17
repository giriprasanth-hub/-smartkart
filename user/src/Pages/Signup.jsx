import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Signup() {
  //http://localhost:3333
  const [errorMessage, setErrorMessage] = useState("");
  const [formdata, setFormdata] = useState({
    email: "", name: "", phoneNumber: "", address: "", password: "", confirm_password: ""
  })

  const handlechange = (e) => {
    setFormdata((prev) => {
      let newData = {
        ...prev,
        [e.target.name]: e.target.value
      }
      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (formdata.password === formdata.confirm_password) {
        await axios.post("http://localhost:3333/user/create", {
          name: formdata.name,
          email: formdata.email,
          password: formdata.password,
          address: formdata.address,
          phoneNumber: formdata.phoneNumber,
        });
        alert("User created successfully! You can now login."); 


      } else {
        setErrorMessage("Passwords do not match");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };


  return (
    <>
      <div className='sign-container'>
        <form className='sign-form' onSubmit={handleSubmit}>
          <h1>SignUp Form</h1>
          <input className='sign-input'
            placeholder='Email'
            type="email"
            name="email"
            onChange={handlechange}
            value={formdata.email}
          />
          <input className='sign-input'
            placeholder='Full Name'
            name="name"
            onChange={handlechange}
            value={formdata.name}
          />
          <input className='sign-input'
            placeholder='Password'
            type='password' name="password" onChange={handlechange} value={formdata.password} />
          <input className='sign-input'
            placeholder='Confirm Password'
            type='password' name="confirm_password" onChange={handlechange} value={formdata.confirm_password} />
          <input className='sign-input'
            placeholder='Mobile No'
            type='tel' name="phoneNumber" onChange={handlechange} value={formdata.phoneNumber} />
          <input className='sign-input'
            placeholder='Address For Delivery'
            name="address"
            onChange={handlechange}
            value={formdata.address}
          />

          <button className='sign-btn' type='submit'>Sign up</button>
          <p>Have an account with us? <Link to="/">Login </Link></p>
        </form>
      </div>
    </>
  )
}

export default Signup
