import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from './Header';

function Login() {
    const [fdata, setfdata] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handledata = (e) => {
        setfdata(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3333/user/login", fdata);
            const { token, userId } = res.data;

            localStorage.setItem("authToken", token);
            localStorage.setItem("userId", userId);

            navigate(`/user/${userId}/home`);
        } catch (error) {
            alert("Invalid email or password!");
        }
    };

    return (
        <>
        <Header/>
        <div className='login-Container'>
            <form id='login' className='login-form' onSubmit={handleSubmit}>
                <h1 className='login-header'>Login Form</h1>
                <input className='login-input-email' type="email" name="email" placeholder='Email' value={fdata.email} onChange={handledata} />
                <input className='login-input-pass' type="password" name="password" placeholder='Password' value={fdata.password} onChange={handledata} />
                <button className='login-btn' type='submit'>Login</button>
                <p>No account yet? <Link to="/signup">Sign up</Link> now!</p>
            </form>
        </div>
        </>
    );
}

export default Login;
