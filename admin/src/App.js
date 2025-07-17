import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import AdminPanel from "./Pages/AdminPanel";
import Billing from "./Pages/Billing";
import Products from "./Pages/ProductManagement";
import Orders from "./Pages/OrderManagement";
import Customers from "./Pages/CustomerManagement";
import Report from "./Pages/Report";
import Login from "./Pages/Login"
import AddProduct from "./Pages/AddProduct"
import AddCustomer from "./Pages/AddCustomer"
import './App.css';
import StockManagement from "./Pages/StockManagement";
import Settings from "./Pages/Settings";
import Signup from "./Pages/Signup";
// import AdminLogin from "./Pages/Login";
// import UserLogin from "../";


function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/:id" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminPanel />} />
                <Route path="billing" element={<Billing />} />
                <Route path="products" element={<Products />} >
                    <Route path="addproduct" element={<AddProduct />} />
                </Route>
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} >
                    <Route path="addcus" element={<AddCustomer />} />
                </Route>
                <Route path="reports" element={<Report />} />
                <Route path="stock" element={<StockManagement />} />
                <Route path="settings" element={<Settings />} />
                {/* <Route path="/adminapp" element={<AdminLogin />} />
                <Route path="/userapp" element={<UserLogin />} /> */}
            </Route>

        </Routes>
    );
}

export default App;