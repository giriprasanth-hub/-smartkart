import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShop,
  faCartShopping,
  faUser,
  faCaretDown,
  faHouse
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function HomeHeader({ searchText, setSearchText, showSearch = true }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) return;
        const res = await axios.get(`http://localhost:3333/user/${userId}`);
        setUserName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch user name:", err);
      }
    };

    const fetchCart = async () => {
      try {
        if (!userId) return;
        const res = await axios.get(`http://localhost:3333/cart/${userId}`);
        const items = res.data?.items || [];
        const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalQty);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchUser();
    fetchCart();
  }, [userId]);

  const handleNavigate = (path) => {
    setShowDropdown(false);
    if (path === "logout") {
      localStorage.clear();
      navigate("/");
    } else {
      navigate(`/user/${userId}/${path}`);
    }
  };

  return (
    <div className="home-header-container">
      <h1>
        <FontAwesomeIcon icon={faShop} className="logo" /> SmartKart
      </h1>

      {showSearch && (
        <div>
          <input
            className="search-bar"
            type="text"
            placeholder="Search for products..."
            value={searchText}
            style={{ width: "200%" }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      )}

      <nav className="home-nav">
        <Link to={`/user/${userId}/home`}>
          <FontAwesomeIcon icon={faHouse} />
        </Link>

        <Link to={`/user/${userId}/cart`} className="homehead-a">
          <FontAwesomeIcon icon={faCartShopping} /> Cart
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </Link>

        {userName && (
          <div
            className="user-dropdown"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FontAwesomeIcon icon={faUser} />
            <span style={{ marginLeft: "5px" }}>{userName}</span>
            <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: "5px" }} />
            {showDropdown && (
              <div className="dropdown-menu">
                <p onClick={() => handleNavigate("profile")}>My Profile</p>
                <p onClick={() => handleNavigate("orders")}>My Orders</p>
                <p onClick={() => handleNavigate("wishlist")}>My Wishlist</p>
                <p onClick={() => handleNavigate("logout")}>Logout</p>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default HomeHeader;
