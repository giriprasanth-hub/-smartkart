import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const navigate = useNavigate();
    const [useUrl, setUseUrl] = useState(true);
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [product, setProduct] = useState({
        name: "",
        name_ta: "",
        brand: "",
        category: "",
        description: "",
        purchasePrice: "",
        mrp: "",
        price: "",
        wholesalePrice: "",
        stock: ""
    });

    const handleChange = (e) => {
        setProduct(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imagePath = "";

            if (useUrl) {
                imagePath = imageUrl;
            } else if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const uploadRes = await axios.post("https://smartkart-server-058l.onrender.com/products/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });


                imagePath = uploadRes.data.filename || uploadRes.data.path;
            }

            const finalProduct = { ...product, image: imagePath };

            await axios.post("http://localhost:3333/products/bulk", [finalProduct]); // Using bulk save
            alert("Product added!");
            navigate(-1); // go back
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product");
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add New Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="image-option">
                        <label>Product Image:</label>
                        <div className="radio-group">
                            <input
                                type="radio"
                                id="urlOption"
                                name="imgOption"
                                checked={useUrl}
                                onChange={() => setUseUrl(true)}
                            />
                            <label htmlFor="urlOption">Use Image URL</label>

                            <input
                                type="radio"
                                id="uploadOption"
                                name="imgOption"
                                checked={!useUrl}
                                onChange={() => setUseUrl(false)}
                            />
                            <label htmlFor="uploadOption">Upload Image</label>
                        </div>

                        {useUrl ? (
                            <input
                                type="text"
                                placeholder="https://..."
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        ) : (
                            <input
                                type="file"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                        )}
                    </div>

                    <label>Name (English):</label>
                    <input type="text" name="name" onChange={handleChange} />

                    <label>Name (Tamil):</label>
                    <input type="text" name="name_ta" onChange={handleChange} />

                    <label>Brand:</label>
                    <input type="text" name="brand" onChange={handleChange} />

                    <label>Category:</label>
                    <input type="text" name="category" onChange={handleChange} />

                    <label>Description:</label>
                    <textarea name="description" onChange={handleChange} />

                    <label>Purchase Price ₹:</label>
                    <input type="number" name="purchasePrice" onChange={handleChange} />

                    <label>MRP ₹:</label>
                    <input type="number" name="mrp" onChange={handleChange} />

                    <label>Sale Price ₹:</label>
                    <input type="number" name="price" onChange={handleChange} />

                    <label>Wholesale Price ₹:</label>
                    <input type="number" name="wholesalePrice" onChange={handleChange} />

                    <label>Stock:</label>
                    <input type="number" name="stock" onChange={handleChange} />

                    <button type="submit">Save Product</button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
