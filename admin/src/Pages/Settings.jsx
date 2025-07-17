import React, { useState, useEffect } from "react";
import axios from "axios";

function Settings() {
  const [settings, setSettings] = useState({
    storeName: "",
    email: "",
    phone: "",
    address: "",
    notifications: true,
    theme: "light",
  });

  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    if (!adminId) return;

    axios.get("http://localhost:3333/settings", { params: { adminId } })
      .then(res => res.data && setSettings(res.data))
      .catch(() => console.warn("No settings found"));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3333/settings", {
        adminId,
        ...settings
      });
      alert("Settings saved!");
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  return (
    <div className="settings-container">
      <h2>⚙️ Settings</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <label>Store Name</label>
        <input type="text" name="storeName" value={settings.storeName} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={settings.email} onChange={handleChange} />

        <label>Phone</label>
        <input type="text" name="phone" value={settings.phone} onChange={handleChange} />

        <label>Address</label>
        <textarea name="address" value={settings.address} onChange={handleChange}></textarea>

        <label>
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
          />
          Enable Notifications
        </label>

        <label>Theme</label>
        <select name="theme" value={settings.theme} onChange={handleChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <button type="submit" className="save-settings-btn">Save Settings</button>
      </form>
    </div>
  );
}

export default Settings;
