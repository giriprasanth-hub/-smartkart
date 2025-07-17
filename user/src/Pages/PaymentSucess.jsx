import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function PaymentSucess() {
    const userId = localStorage.getItem("userId"); 

    return (
        <div className='Paymentsucess-Page'>
            <div className="success-container">
                <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                <h1 className="success-title">Order Confirmed!</h1>
                <p className="success-text">Thank you for your purchase. Your order has been placed successfully.</p>
                <div className="success-buttons">
                    <Link to={`/user/${userId}/orders`} className="btn primary">View Orders</Link>
                    <Link to={`/user/${userId}/home`} className="btn secondary">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
}

export default PaymentSucess;
