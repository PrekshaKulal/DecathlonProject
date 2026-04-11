import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrders.css";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetchOrders();
  }, []);
 const fetchOrders = async () => {
    const res = await axios.get(`${import.meta.env.API_URL}/admin/orders`);
    setOrders(res.data);
  };
  const updateStatus = async (id, status) => {
    await axios.put(`${import.meta.env.API_URL}/admin/orders/${id}`, { status });
    fetchOrders(); 
  };
  const deleteOrder = async (id) => {
    await axios.delete(`${import.meta.env.API_URL}/admin/orders/${id}`);
    fetchOrders();
  };
  const navigate = useNavigate();
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
    <h2>Manage Orders</h2>
    {orders.map((order) => (
      <div key={order._id} className="order-card">
        <p><b>Order ID:</b> {order._id}</p>
        <p><b>User ID:</b> {order.userId}</p>
        <p><b>Total:</b> ₹{order.totalAmount}</p>
        <div className="address-box">
          <b>Address:</b>
          <p>
            {order.addressDetails?.Name}, {order.addressDetails?.HouseNo}, 
            {order.addressDetails?.Street}, {order.addressDetails?.City}, 
            {order.addressDetails?.State} - {order.addressDetails?.Pincode}
          </p>
        </div>
        <div className="products-box">
          <b>Products:</b>
          {order.products.map((p, i) => (
            <p key={i}>Product: {p.productId} | Qty: {p.quantity}</p>
          ))}
        </div>
        <p className="status">Status: {order.status}</p>
        <select className="status-select" onChange={(e) => updateStatus(order._id, e.target.value)} >
          <option>Select Status</option>
          <option value="Placed">Placed</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <div className="order-actions">
          <button className="delete-btn" onClick={() => deleteOrder(order._id)}> Delete</button>
        </div>
      </div>
   ))}
  </div>
  </>
);
}

export default AdminOrders;