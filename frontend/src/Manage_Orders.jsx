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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
};
/*const fetchProducts = async () => {
    console.log("Fetching products...");
   try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/ordered`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
};*/
const cancelItem = async (orderId, productId) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/orders/cancel-item/${orderId}/${productId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setOrders(prev =>
      prev.map(order =>
        order._id === orderId
          ? {
              ...order,
              products: order.products.map(prod =>
                prod.productId._id === productId
                  ? { ...prod, status: "Cancelled" }
                  : prod
              )
            }
          : order
      )
    );
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

  {orders.flatMap((ord) =>
    ord.products.map((p, i) => (
      <div key={`${ord._id}-${i}`} className="order-card">

        <div className="order-header">
          <p><b>Order ID:</b> {ord._id}</p>
          <p><b>Total:</b> ₹{ord.totalAmount}</p>
        </div>

        <div className="product-row">
          <img src={p.productId?.file} className="product-img" />

          <div className="product-info">
            <h4>{p.productId?.productName || p.productId?.name || "No Name"}</h4>
            <p className="desc">{p.productId?.productDescription}</p>
            <p className="qty">Qty: {p.quantity}</p>

            <p className={`status ${p.status.toLowerCase()}`}>
              {pageXOffset.status}
            </p>

            <button
              className="cancel-btn"
             onClick={() => cancelItem(ord._id, p.productId._id)}
              disabled={p.status === "Cancelled"}
            >
              Cancel Order
            </button>
          </div>
        </div>

      </div>
    ))
  )}
</div>
 
  </>
);
}

export default Manage_Orders;
