import React, { useState, useEffect } from "react";
import axios from "axios";

function Report() {
  const [reportType, setReportType] = useState("weekly");
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:3333/user");
      setAllCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3333/products");
      setAllProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchReport = async () => {
    try {
      const params = {
        reportType,
        customer,
        product,
        startDate,
        endDate,
      };

      const res = await axios.get("http://localhost:3333/orders/report", { params });
      setReportData(res.data);
    } catch (err) {
      console.error("Report fetch failed", err);
      alert("Failed to generate report");
    }
  };

  return (
    <div className="reports-container">
      <h2>Sales Reports</h2>

      <div className="report-filters">
        <div className="filter-group">
          <label>Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {reportType === "custom" && (
          <div className="filter-group">
            <label>Date Range:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /> to
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        )}

        <div className="filter-group">
          <label>Customer:</label>
          <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
            <option value="">All</option>
            {allCustomers.map((u) => (
              <option key={u._id} value={u.name}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Product:</label>
          <select value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="">All</option>
            {allProducts.map((p) => (
              <option key={p._id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <button className="generate-btn" onClick={fetchReport}>Generate Report</button>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total ₹</th>
            <th>Bill Type</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length === 0 ? (
            <tr><td colSpan="6">No data found</td></tr>
          ) : (
            reportData.map((order, index) => (
              <tr key={index}>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>{order.userId?.name || "Unknown"}</td>
                <td>{order.products.map(p => p.name).join(", ")}</td>
                <td>{order.totalQuantity}</td>
                <td>₹{order.totalAmount}</td>
                <td>{order.paymentMethod}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="report-actions">
        <button className="export-btn" onClick={() => window.print()}>Print</button>
        {/* Later: Export PDF/Excel */}
      </div>
    </div>
  );
}

export default Report;
