import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Billing() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [billType, setBillType] = useState('retail');
    const [language, setLanguage] = useState('english');
    const [customerName, setCustomerName] = useState('');
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const printRef = useRef();

    const getPrice = (p) => (billType === 'wholesale' ? p.wholesalePrice : p.price);
    const total = cart.reduce((sum, item) => sum + getPrice(item) * item.qty, 0);

    useEffect(() => {
        axios.get('http://localhost:3333/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Product fetch error:", err));
    }, []);

    const addProductToCart = (product) => {
        const exists = cart.find(item => item._id === product._id);
        if (exists) {
            setCart(prev => prev.map(p => p._id === product._id ? { ...p, qty: p.qty + 1 } : p));
        } else {
            setCart(prev => [...prev, { ...product, qty: 1 }]);
        }
    };

    const updateQty = (id, qty) => {
        setCart(prev => prev.map(p => p._id === id ? { ...p, qty } : p));
    };

    const removeProduct = (id) => {
        setCart(prev => prev.filter(p => p._id !== id));
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (p.name_ta && p.name_ta.toLowerCase().includes(searchText.toLowerCase()))
    );

    const searchCustomer = async (query) => {
        if (!query) return setCustomers([]);
        try {
            const res = await axios.get(`https://smartkart-server-058l.onrender.com/user?name=${query}`);
            setCustomers(res.data);
        } catch (err) {
            console.error('Customer search error:', err);
        }
    };

    const handlePrint = () => {
        const original = document.body.innerHTML;
        const printContent = printRef.current.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = original;
        saveOrder(); // Save after print
    };

    const handleWhatsApp = () => {
        const msg = `🧾 *SmartKart Bill*\n` +
            `👤 Customer: ${selectedCustomer?.name || customerName || '-'}\n` +
            cart.map(i => `• ${i.name} x${i.qty} = ₹${getPrice(i) * i.qty}`).join('\n') +
            `\n💰 Total: ₹${total}\n🕒 ${new Date().toLocaleString()}`;

        const encodedMessage = encodeURIComponent(msg);

        // This tries to open the WhatsApp Desktop app
        const desktopURL = `whatsapp://send?text=${encodedMessage}`;

        // Try to open WhatsApp Desktop app
        const win = window.open(desktopURL, '_blank');

        setTimeout(() => {
            if (!win || win.closed || typeof win.closed === 'undefined') {
                const webURL = `https://web.whatsapp.com/send?text=${encodedMessage}`;
                window.open(webURL, '_blank');
            }
        }, 700);

        saveOrder();
    };


    const saveOrder = async () => {
        try {
            await axios.post("http://localhost:3333/orders", {
                userId: selectedCustomer?._id || null,
                products: cart.map(i => i._id),
                totalAmount: total,
                paymentMethod: "cash_on_delivery",
                deliveryAddress: "SmartKart Store",
            });
            alert("🧾 Order saved successfully");
            resetBilling();
        } catch (err) {
            console.error("❌ Failed to save order", err);
        }
    };

    const resetBilling = () => {
        setCart([]);
        setCustomerName('');
        setSelectedCustomer(null);
        setSearchText('');
    };

    return (
        <>
            <div className="billing-container">
                <h2>🗾️ Billing Section</h2>

                <div className="search-scan">
                    <label htmlFor="productSearch">Scan / Search Product:</label>
                    <input
                        type="text"
                        id="productSearch"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Enter product name or scan barcode..."
                    />
                    {searchText && (
                        <ul className="search-dropdown">
                            {filteredProducts.map((p, i) => (
                                <li key={i} onClick={() => addProductToCart(p)}>{p.name}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bill-options">
                    <div className="bill-type">
                        <label>Bill Type:</label>
                        <div className="radio-group">
                            <input type="radio" id="retail" name="billType" value="retail" checked={billType === 'retail'} onChange={() => setBillType('retail')} />
                            <label htmlFor="retail">Retail</label>
                            <input type="radio" id="wholesale" name="billType" value="wholesale" checked={billType === 'wholesale'} onChange={() => setBillType('wholesale')} />
                            <label htmlFor="wholesale">Wholesale</label>
                        </div>
                    </div>

                    <div className="print-lang">
                        <label>Print Language:</label>
                        <div className="radio-group">
                            <input type="radio" id="english" name="printLang" value="english" checked={language === 'english'} onChange={() => setLanguage('english')} />
                            <label htmlFor="english">English</label>
                            <input type="radio" id="tamil" name="printLang" value="tamil" checked={language === 'tamil'} onChange={() => setLanguage('tamil')} />
                            <label htmlFor="tamil">Tamil</label>
                        </div>
                    </div>
                </div>

                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price (₹)</th>
                            <th>Total (₹)</th>
                            <th>🗑️</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, idx) => (
                            <tr key={item._id}>
                                <td>{idx + 1}</td>
                                <td>{language === 'tamil' ? item.name_ta : item.name}</td>
                                <td><input type="number" value={item.qty} min="1" onChange={e => updateQty(item._id, parseInt(e.target.value))} /></td>
                                <td>{getPrice(item)}</td>
                                <td>{getPrice(item) * item.qty}</td>
                                <td><button className="delete-btn" onClick={() => removeProduct(item._id)}>🗑️</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="customer-input">
                    <label htmlFor="customerName">Customer Name:</label>
                    <input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={e => {
                            setCustomerName(e.target.value);
                            setSelectedCustomer(null);
                            searchCustomer(e.target.value);
                        }}
                        placeholder="Enter customer name..."
                        autoComplete="off"
                    />
                    {customers.length > 0 && (
                        <ul className="customer-dropdown">
                            {customers.map(c => (
                                <li
                                    key={c._id}
                                    onClick={() => {
                                        setCustomerName(c.name);
                                        setSelectedCustomer(c);
                                        setCustomers([]);
                                    }}
                                >
                                    {c.name} • {c.email}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="billing-actions">
                    <h3>Total: ₹{total}</h3>
                    <button className="print-btn" onClick={handlePrint}>🖨️ Print Bill</button>
                    <button className="whatsapp-btn" onClick={handleWhatsApp}>📤 Send via WhatsApp</button>
                </div>
            </div>

            {/* 3-inch Bill Print Section */}
            <div style={{ display: 'none' }}>
                <div ref={printRef} style={{ width: '300px', fontSize: '12px', padding: '8px' }}>
                    <h2>🛍️ SmartKart Receipt</h2>
                    <p>Date: {new Date().toLocaleString()}</p>
                    {selectedCustomer && <p>Customer: {selectedCustomer.name}</p>}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ borderBottom: '1px solid #000' }}>Item</th>
                                <th>Qty</th>
                                <th>₹</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item._id}>
                                    <td>{language === 'tamil' ? item.name_ta : item.name}</td>
                                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                                    <td style={{ textAlign: 'right' }}>{getPrice(item) * item.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3 style={{ textAlign: 'right' }}>Total: ₹{total}</h3>
                    <p>Thank you for your purchase!</p>
                </div>
            </div>
        </>
    );
}

export default Billing;
