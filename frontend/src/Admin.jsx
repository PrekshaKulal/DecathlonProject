import React from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {BsFillArchiveFill,BsFillGrid3X3GapFill,BsPeopleFill,BsFillBellFill} from 'react-icons/bs'
//import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
//import { RechartsDevtools } from '@recharts/devtools';
import {Chart as ChartJS,defaults} from "chart.js"
import {Line,Bar,Doughnut,Pie} from "react-chartjs-2"
import {useState,useEffect} from 'react'
function Admin() {
  //const {data}= axios.get(`${import.meta.env.VITE_API_URL}/order-list`);
  
   const [totalOrders, setTotalOrders] = useState(0);
const [totalUsers, setTotalUsers] = useState(0);
const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
  const fetchCounts = async () => {
    try {
      const base = import.meta.env.VITE_API_URL;

      const [ordersRes, usersRes, productsRes] =
        await Promise.all([
          axios.get(`${base}/count`),
          axios.get(`${base}/users/count`),
          axios.get(`${base}/products/count`),
         
        ]);

      setTotalOrders(ordersRes.data.count);
      setTotalUsers(usersRes.data.count);
      setTotalProducts(productsRes.data.count);
      

    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  fetchCounts();
}, []);

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
       
        <button className="menu-btn" style={{color:"red"}} onClick={()=>Navigate("/admin-login")}>Logout</button>
      </div>
 <div className="main-content">
         <h1>Welcome Admin</h1>
        <div className="card-container">
          {/*
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

        </div>*/}
      
        <div className="card">
          <BsFillArchiveFill className="card-icons"/>

          <h3>Products</h3>
<h3>{totalProducts}</h3>

        </div>
       
        <div className="card">
          <BsPeopleFill className="card-icons"/>
          <h3>Users</h3>
<h3>{totalUsers}</h3>

        </div>
        <div className="card">
          <BsFillBellFill className="card-icons"/>
          <h3>Orders</h3>
<h3>{totalOrders}</h3>

        </div>
        {/*  <BarChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar dataKey="pv" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
      <Bar dataKey="uv" fill="#82ca9d" activeBar={{ fill: 'gold', stroke: 'purple' }} radius={[10, 10, 0, 0]} />
    <RechartsDevtools />
    </BarChart>*/}
      </div>

    </div>
    </div>
  );
}

export default Admin;