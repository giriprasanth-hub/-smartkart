import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  faChartLine, faCashRegister, faBox, faFileInvoice, faBoxes, 
  faUsers, faClipboard, faCog, faSignOutAlt 
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const adminId = localStorage.getItem("adminId");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: `/admin/${adminId}/dashboard`, label: "Dashboard", icon: faChartLine },
    { path: `/admin/${adminId}/billing`, label: "Billing", icon: faCashRegister },
    { path: `/admin/${adminId}/products`, label: "Products", icon: faBox },
    { path: `/admin/${adminId}/orders`, label: "Orders", icon: faFileInvoice },
    { path: `/admin/${adminId}/stock`, label: "Stock", icon: faBoxes },
    { path: `/admin/${adminId}/customers`, label: "Customers", icon: faUsers },
    { path: `/admin/${adminId}/reports`, label: "Reports", icon: faClipboard },
    { path: `/admin/${adminId}/settings`, label: "Settings", icon: faCog },
    { path: "/", label: "Logout", icon: faSignOutAlt },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "active" : ""}`}>
        <h2 className="product-logo">🛒 SmartKart</h2>
        <ul className="admin-nav-links">
          {navItems.map((item) => (
            <li
              key={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label === "Logout" ? (
                <button onClick={handleLogout} className="link">
                  <FontAwesomeIcon icon={item.icon} /> {item.label}
                </button>
              ) : (
                <Link to={item.path} className="link">
                  <FontAwesomeIcon icon={item.icon} /> {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
