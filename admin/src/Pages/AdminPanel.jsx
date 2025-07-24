// import { useEffect, useState } from "react";
// import axios from "axios";

function AdminPanel() {
//   const [admin, setAdmin] = useState(null);
//   const [error, setError] = useState("");

//   const adminId = localStorage.getItem("adminId");
//   const token = localStorage.getItem("adminToken");

//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const res = await axios.get(`https://smartkart-server-058l.onrender.com/admin/${adminId}/dashboard`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setAdmin(res.data);
//       } catch (err) {
//         console.error(err);
//         setError("Unauthorized. Please login again.");
//       }
//     };

//     fetchAdminData();
//   }, [adminId, token]);

  return (
    <div className="admin-container">
      <main className="admin-main">
        <h1>Welcome, </h1>
        {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

        <div className="admin-cards">
          <div className="admin-card">
            <h3>Total Sales</h3>
            <p>₹35,000</p>
          </div>
          <div className="admin-card">
            <h3>Today's Orders</h3>
            <p>12 Orders</p>
          </div>
          <div className="admin-card">
            <h3>Low Stock Alerts</h3>
            <p>5 Products</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
