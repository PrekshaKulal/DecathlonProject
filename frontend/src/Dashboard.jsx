import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

import {
  PieChart, Pie, Cell, Legend,
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/stats`
      );
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/recent-orders`
      );
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getOrderStatus = (order) => {
    if (!order.products) return "Placed";

    const statuses = order.products.map(p => p.status);

    if (statuses.includes("Cancelled")) return "Cancelled";
    if (statuses.every(s => s === "Delivered")) return "Delivered";
    if (statuses.includes("Shipped")) return "Shipped";
    if (statuses.includes("Packed")) return "Packed";

    return "Placed";
  };

  const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric"
  });
};
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    last7Days.push({
      date: formatDate(d),
      revenue: 0,
      orders: 0
    });
  }
  orders.forEach(order => {
    if (!order.orderDate) return;

    const orderDate = formatDate(order.orderDate);

    const day = last7Days.find(d => d.date === orderDate);

    if (day) {
      day.revenue += order.totalAmount || 0;
      day.orders += 1;
    }
  });

  const chartData = last7Days;


  const statusData = [
    {
      name: "Delivered",
      value: orders.reduce((count, order) => {
        return count + (order.products || []).filter(
          p => p?.status?.toLowerCase() === "delivered"
        ).length;
      }, 0)
    },
    {
      name: "Placed",
      value: orders.reduce((count, order) => {
        return count + (order.products || []).filter(
          p => p?.status?.toLowerCase() === "placed"
        ).length;
      }, 0)
    },
    {
      name: "Cancelled",
      value: orders.reduce((count, order) => {
        return count + (order.products || []).filter(
          p => p?.status?.toLowerCase() === "cancelled"
        ).length;
      }, 0)
    }
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF4C4C"];

  return (
    <div className="dashboard-wrapper">

      <div className="sidebar">
        <p className="active">Dashboard</p>
        <p onClick={() => navigate("/add")}>Add Product</p>
        <p onClick={() => navigate("/manage")}>Manage Product</p>
        <p onClick={() => navigate("/admin/orders")}>Manage Orders</p>
        <p onClick={() => navigate("/view-users")}>Manage Users</p>
        <p onClick={() => navigate("/admin-login")}>Logout</p>
      </div>

      <div className="dashboard-main">

        <h2 style={{ color: "#007bff" }}>Welcome to Admin Dashboard</h2>

        <div className="stats-cards">
          <div className="card">
            <p style={{ color: "#007bff" }}>{stats?.totalProducts || 0}</p>
            <span>Total Products</span>
          </div>
          <div className="card">
            <p style={{ color: "#007bff" }}>{stats?.totalOrders || 0}</p>
            <span>Total Orders</span>
          </div>
          <div className="card">
            <p style={{ color: "#007bff" }}>{stats?.totalUsers || 0}</p>
            <span>Users</span>
          </div>
          <div className="card">
            <p style={{ color: "#007bff" }}>Rs {stats?.totalRevenue || 0}</p>
            <span>Revenue</span>
          </div>
        </div>

       
        <div className="bottom-section">

 
          <div className="chart-box">
            <h3>Revenue Trend</h3>
           <ResponsiveContainer width="100%" height={300}>
             <LineChart 
  data={chartData}
  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
>
 <XAxis 
  dataKey="date"
  tick={{ fontSize: 12 }}
  interval="preserveStartEnd"
/>
  <YAxis width={60} />
  <Tooltip formatter={(value) => `₹ ${value}`} />
  <Line 
    type="monotone" 
    dataKey="revenue" 
    stroke="#007bff" 
    name="Revenue"
  />
  <Legend />
</LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pie-box">
            <h3>Status</h3>
            <PieChart width={300} height={300}>
  <Pie
  data={statusData}
  dataKey="value"
  outerRadius={90}
>
  {statusData.map((_, i) => (
    <Cell key={i} fill={COLORS[i]} />
  ))}
</Pie>
              <Legend />
            </PieChart>
          </div>

        </div>

       
        <div className="chart-box">
          <h3>Orders Trend</h3>
         <ResponsiveContainer width="100%" height={300}>
          <BarChart 
  data={chartData}
  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
>
  <XAxis 
  dataKey="date"
  tick={{ fontSize: 12 }}
  interval="preserveStartEnd"
/>
 <YAxis width={60} />
  <Tooltip formatter={(value) => `${value} Orders`} />
  <Bar 
    dataKey="orders" 
    fill="#28a745" 
    name="Orders"
  />
  <Legend />
</BarChart>
          </ResponsiveContainer>
        </div>

      
        <div className="orders-box">
          <h3>Recent Orders</h3>

          {orders.length === 0 && <p>No orders</p>}

          {orders.map(order => (
            <div key={order._id} className="order-row">
              <span>
                {order && order._id ? order._id.slice(-6) : "N/A"}
              </span>
              <span>Rs {order?.totalAmount || 0}</span>
              <span>{getOrderStatus(order)}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;