import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShop } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Header() {
    const navigate = useNavigate();
    const [role, setRole] = useState('');

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setRole(selectedRole);

        // Navigate to login page based on selected role
        switch (selectedRole) {
            case 'retailer':
                window.location.href = '/adminapp'; 
                break;
            case 'user':
                window.location.href = '/userapp'; 
                break;
            default:
                break;
        }
    };

    return (
        <div className="header-container">
            <h1>
                <FontAwesomeIcon icon={faShop} className="head-logo" /> SmartKart
            </h1>

            <nav className="head-nav">
                <Link to="/"><button>Login</button></Link>
                <Link to="/signup"><button>Sign Up</button></Link>

                <select id="dropdown" value={role} onChange={handleRoleChange}>
                    <option value="">Select Role</option>
                    <option value="retailer">Retailer</option>
                    <option value="user">User</option>
                </select>
            </nav>
        </div>
    );
}

export default Header;
