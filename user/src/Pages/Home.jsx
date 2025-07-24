import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import HomeHeader from "./HomeHeader";

function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState({ items: [] });
  const [searchText, setSearchText] = useState("");

  const userId = localStorage.getItem("userId");

  const categories = [
    { id: "stap", name: "Staples", image: "/img/staples.webp" },
    { id: "snack", name: "Snacks & Beverages", image: "/img/snacks.webp" },
    { id: "food", name: "Packaged Food", image: "/img/pakage.webp" },
    { id: "baby", name: "Personal & Baby Care", image: "/img/personal.webp" },
    { id: "house", name: "Household Care", image: "/img/household.webp" },
    { id: "dairy", name: "Dairy & Eggs", image: "/img/dairy.webp" }
  ];

  useEffect(() => {
    getProducts();
    fetchCart();
    fetchWishlist();
  }, []);

  const getProducts = async () => {
    try {
      const res = await axios.get("https://smartkart-server-058l.onrender.com/products");
      if (res.status === 200) setAllProducts(res.data);
    } catch {
      alert("Error fetching products");
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`https://smartkart-server-058l.onrender.com/cart/${userId}`);
      if (res.status === 200) setCartItems(res.data.items || []);
    } catch {
      console.warn("Cart fetch failed");
      setCartItems([]);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`https://smartkart-server-058l.onrender.com/wishlist/${userId}`);
      if (res.status === 200 && res.data?.items) {
        const normalizedItems = res.data.items.map(item => ({
          ...item,
          productId: typeof item.productId === "object" ? item.productId._id : item.productId
        }));
        setWishlist({ items: normalizedItems });
      }
    } catch (err) {
      console.warn("Wishlist fetch error", err);
      setWishlist({ items: [] });
    }
  };

  const handleAddToCart = async (productId) => {
    if (!userId) return alert("User not logged in");

    try {
      await axios.post("https://smartkart-server-058l.onrender.com/cart/add", {
        userId,
        productId,
        quantity: 1
      });
      fetchCart();
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
      alert("Failed to add to cart");
    }
  };

  const handleQtyChange = async (productId, change) => {
    const item = cartItems.find(item =>
      typeof item.productId === 'object'
        ? item.productId._id === productId
        : item.productId === productId
    );
    const newQty = (item?.quantity || 0) + change;

    if (newQty <= 0) {
      await axios.delete(`https://smartkart-server-058l.onrender.com/cart/${userId}/${productId}`);
    } else {
      await axios.put(`https://smartkart-server-058l.onrender.com/cart/update/${userId}`, {
        productId,
        quantity: newQty
      });
    }

    fetchCart();
  };

  const getCartQty = (productId) => {
    const item = cartItems.find((item) => {
      if (!item || !item.productId) return false;
      const idToCompare = typeof item.productId === 'object' ? item.productId._id : item.productId;
      return idToCompare === productId;
    });
    return item ? item.quantity : 0;
  };

  const isWishlisted = (productId) =>
    wishlist.items.some(item =>
      typeof item.productId === 'object'
        ? item.productId._id === productId
        : item.productId === productId
    );

  const toggleWishlist = async (productId) => {
    try {
      const alreadyWishlisted = isWishlisted(productId);

      if (alreadyWishlisted) {
        await axios.delete(`https://smartkart-server-058l.onrender.com/wishlist/${userId}/${productId}`);
        setWishlist(prev => ({
          ...prev,
          items: prev.items.filter(item =>
            typeof item.productId === "object"
              ? item.productId._id !== productId
              : item.productId !== productId
          )
        }));
      } else {
        await axios.post("https://smartkart-server-058l.onrender.com/wishlist/add", {
          userId,
          productId
        });
        setWishlist(prev => ({
          ...prev,
          items: [...prev.items, { productId }]
        }));
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };

  return (
    <>
      <HomeHeader searchText={searchText} setSearchText={setSearchText} showSearch={true} />

      <div className="home-page">
        <div className="category-header">
          {categories.map(cat => (
            <div key={cat.id} className="cardhead">
              <a href={`#${cat.id}`}>
                <img src={cat.image} alt={cat.name} />
                <p>{cat.name}</p>
              </a>
            </div>
          ))}
        </div>

        {categories.map(cat => (
          <div key={cat.id}>
            <h2 className="card-catagory-head" id={cat.id}>{cat.name}</h2>
            <div className="card-container">
              {allProducts
                .filter(product =>
                  product.category === cat.name &&
                  product.name?.toLowerCase().includes(searchText.toLowerCase())
                )
                .map(product => {
                  const qty = getCartQty(product._id);
                  return (
                    <div key={product._id} className="card" style={{ position: 'relative' }}>
                      <div
                        className="wishlist-icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product._id);
                        }}
                        style={{
                          cursor: "pointer",
                          position: "absolute",
                          top: 10,
                          right: 10,
                          fontSize: "24px"
                        }}
                      >
                        {isWishlisted(product._id) ? "❤️" : "🤍"}
                      </div>

                      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                        <h3>{product.name}</h3>
                        <p>MRP: ₹{product.price}</p>
                        <p>{product.description}</p>
                      </Link>

                      {qty === 0 ? (
                        <button className="card-btn" onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleAddToCart(product._id);
                        }}>
                          Add to Cart
                        </button>
                      ) : (
                        <div className="qty-container">
                          <button className="qty-btn1" onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleQtyChange(product._id, -1);
                          }}>−</button>
                          <input className="qty-input" readOnly value={qty} />
                          <button className="qty-btn2" onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleQtyChange(product._id, 1);
                          }}>+</button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
