import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

function AdminLogin() {
    const [fdata, setFdata] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleData = (e) => {
        setFdata(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3333/admin/login", {
                email: fdata.email, 
                password: fdata.password
            });

            const { token, adminId } = res.data;

            localStorage.setItem("adminToken", token);
            localStorage.setItem("adminId", adminId);

            navigate(`/admin/${adminId}/dashboard`);
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <>
            <Header />
            <div className='login-Container'>
                <form id='login' className='login-form' onSubmit={handleSubmit}>
                    <h1 className='login-header'>Admin Login</h1>

                    <input
                        className='login-input'
                        type="email"
                        name="email"
                        placeholder='Admin Email'
                        value={fdata.email}
                        onChange={handleData}
                    />
                    <input
                        className='login-input'
                        type="password"
                        name="password"
                        placeholder='Password'
                        value={fdata.password}
                        onChange={handleData}
                    />
                    <button className='login-btn' type='submit'>Login</button>
                    <p>No account yet? <Link to="#">Sign up</Link> now!</p>
                </form>
            </div>
        </>
    );
}

export default AdminLogin;
