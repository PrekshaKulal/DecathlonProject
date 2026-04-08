import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Manage_Orders.css";
import { useNavigate } from "react-router-dom";

function Manage_Orders() {
 const [orders, setOrders] = useState([]); 
const [products, setProducts] = useState([]);
 const navigate = useNavigate(); 
  const token = localStorage.getItem("token");
 useEffect(() => {
  fetchOrders();

  const interval = setInterval(() => {
    fetchOrders(); 
  }, 5000);

  return () => clearInterval(interval);
}, []);
    const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3001/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
};
const fetchProducts = async () => {
    console.log("Fetching products...");
   try {
      const res = await axios.get("http://localhost:3001/products/ordered", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
};
const cancelOrder = async (id) => {
  try {
    await axios.put( `http://localhost:3001/orders/cancel/${id}`,{},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setOrders((prev) => prev.map((ord) => ord._id === id ? { ...ord, status: "Cancelled" } : ord ));
  } catch (err) {
    console.log(err);
  }
};  
  return (
    <>
     <div
          className="header-left"
          onClick={() => navigate("/")}
        >
          <img
            src="https://png.pngtree.com/element_our/sm/20180515/sm_5afb1034cabf4.jpg"
            alt="back"
            className="back-icon"
          />
          <span>Back</span>
        </div>
 
    
 <div className="admin-orders">
  <h2>My Orders</h2>
  {orders.map((ord) => (
    <div key={ord._id} className="order-card">
      <div className="order-header">
        <p><b>Order ID:</b> {ord._id}</p>
        <p><b>Total:</b> ₹{ord.totalAmount}</p>
      </div>
      {ord.products.map((p, i) => (
        <div key={i} className="product-row">
          <img
            src={`http://localhost:3001/uploads/${p.productId?.image}`}
            alt={p.productId?.productName}
            className="product-img"
          />
          <div className="product-info">
            <h4> {p.productId?.productName || p.productId?.name || "No Name"}</h4>
            <p className="desc">{p.productId?.productDescription}</p>
            <p className="qty">Qty: {p.quantity}</p>
            <p className={`status ${ord.status.toLowerCase()}`}> {ord.status}</p>
<button className="cancel-btn" onClick={() => cancelOrder(ord._id)} disabled={ord.status === "Cancelled"}> Cancel Order</button>
          </div>
        </div>
      ))}

    </div>
  ))}
</div>
 
  </>
);
}

export default Manage_Orders;
