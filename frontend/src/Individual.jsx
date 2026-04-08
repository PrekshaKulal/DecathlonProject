import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Individual.css";
import axios from "axios";


function Individual() {

  const { id } = useParams();
  
  const navigate = useNavigate();
   const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/products/${id}`);
        const data = await res.json();
        console.log(data);
        setProduct(data);
      } catch (err) {
        console.log(err);
      } };
  fetchProduct();
  }, [id]);
 const addToCart = async () => {
 const token = localStorage.getItem("token");

if (!token) {
  navigate("/login");
  return;
}

  try {
    const res = await axios.get("http://localhost:3001/get-cart", {
  headers: { Authorization: `Bearer ${token}` }
});
    let items = res.data.items || [];
  const existing = items.find(i => i.productId === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ productId: product._id, quantity: 1 });
    }
await axios.post(
  "http://localhost:3001/save-cart",
  { items },
  {
        headers: {
          Authorization: `Bearer ${token}`
    }
  }
);
    alert("Item added to cart");
    navigate("/cart");
  } catch (err) {
    console.log(err);
  }
};

  return (
    <>
      <header className="login-header">
        <div className="header-left" onClick={() => navigate("/")} >
          <img
            src="https://png.pngtree.com/element_our/sm/20180515/sm_5afb1034cabf4.jpg"
            alt="back"
            className="back-icon"
          />
          <span>Back</span>
        </div>

        <img
          src="https://login.decathlon.net/assets/decathlon-logo-vp-DDH3S1xy.svg"
          alt="logo"
          className="header-logo"
        />
      </header>
      
 <div className="product-details">

  <div className="product-image-container">
    <img src={`http://localhost:3001/uploads/${product.image}`} alt={product.productName} className="product-image"/>
  
</div>
  <div className="product-content">
    <h2 className="product-name" style={{color: "blue"}}>{product.productName}</h2>
    <h3 className="price">Rs {product.productPrice}</h3>
    <p className="description">{product.productDescription}</p>
  </div>
  <button className="add-to-cart-btn" onClick={(addToCart)} > Add to Cart </button>
</div>

    </>
  );
}

export default Individual;

