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
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`);
    setOrders(res.data);
  };
 const updateItemStatus = async (orderId, productId, status) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/admin/orders/item/${orderId}/${productId}`,
      { status }
    );

    setOrders(prev =>
      prev.map(order =>
        order._id === orderId
          ? {
              ...order,
              products: order.products.map(p =>
                p.productId.toString() === productId.toString()
                  ? { ...p, status }
                  : p
              )
            }
          : order
      )
    );

  } catch (err) {
    console.log(err);
  }
};
  /*const deleteOrder = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/admin/orders/${id}`);
    fetchOrders();
  };*/
  const navigate = useNavigate();
  return (
    <>
     <div
          className="header-left"
          onClick={() => navigate("/dashboard")}
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
        {order.addressDetails?.Name}, {order.addressDetails?.Phone},{order.addressDetails?.HouseNo}, 
        {order.addressDetails?.Street}, {order.addressDetails?.City}, 
        {order.addressDetails?.State} - {order.addressDetails?.Pincode}
      </p>
    </div>
    {order.products.map((p, i) => (
      <div key={i} className="product-row">
  {  /*<img src={p.productId?.file} className="product-img" />*/}

        <div>
          <p>Product ID: {p.productId}</p>
          
          <p>Qty: {p.quantity}</p>
          <p className="status"> Status: {p.status || "Placed"}</p>
          <select className="status-select"  value={p.status || "Placed"}onChange={(e) => updateItemStatus(order._id,p.productId._id || p.productId,e.target.value)} >
            <option value="Placed">Placed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    ))}

  </div>
))}
</div>
  </>
);
}

export default AdminOrders;