import React from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";

function Admin() {
  const Navigate = useNavigate();
  return (
    <div className="dashboard">
      <div className="sidebar">
         <img
          src="https://login.decathlon.net/assets/decathlon-logo-vp-DDH3S1xy.svg"
          alt="logo"
          className="header-logo"
        />
        <h2 className="logo">Admin Panel</h2>
         <button className="menu-btn" onClick={()=>Navigate("/view-users")}>View Users</button>
        <button className="menu-btn" onClick={()=>Navigate("/add")}>Add Product</button>
        <button className="menu-btn" onClick={()=>Navigate("/manage")}>Manage Products</button>
        <button className="menu-btn" onClick={()=>Navigate("/admin/orders")}>View Orders</button>
        <button className="menu-btn">Manage Products</button>
        <button className="menu-btn" style={{color:"red"}} onClick={()=>Navigate("/admin-login")}>Logout</button>
      </div>
 <div className="main-content">
         <h1>Welcome Admin</h1>
        <div className="card-container">
         <div className="card">
            <h3>Users</h3>
            <p>Check registered users</p>
            <button onClick={()=>Navigate("/view-users")}>View Users</button>
          </div>

          <div className="card">
            <h3>Products</h3>
            <p>Add  products</p>
            <button onClick={()=> Navigate("/add")}>Add Product</button>
          </div>
           <div className="card">
            <h3>Manage</h3>
            <p>Edit or Delete products</p>
            <button onClick={()=> Navigate("/manage")} >Manage Products</button>
          </div>

          <div className="card">
            <h3>Orders</h3>
            <p>Track customer orders</p>
            <button onClick={()=>Navigate("/admin/orders")}>View Orders</button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Admin;