import { Link, Outlet, useLocation } from "react-router-dom";
import { faChartLine, faCashRegister, faBox, faFileInvoice, faBoxes, faUsers, faClipboard, faCog, faSignOutAlt, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";


function AdminLayout() {
    const location = useLocation();
    const adminId = localStorage.getItem("adminId"); //


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

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div className="adminlay-sidebar">
                <h2>🛒 SmartKart</h2>
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={location.pathname === item.path ? 'active' : ''}
                    >
                        <FontAwesomeIcon icon={item.icon} /> {item.label}
                    </Link>
                ))}

            </div>

            <div className="adminlay-content">
                <Outlet />
            </div>
        </div >
    );
}

export default AdminLayout