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

  // ✅ Revenue Trend
  const chartData = orders.slice(0, 7).map(order => ({
    date: order?.date
      ? new Date(order.date).toLocaleDateString()
      : "N/A",
    revenue: order?.totalAmount || 0
  }));

  // ✅ Status Data
  const statusData = [
    {
      name: "Delivered",
      value: orders.filter(o => o?.status === "Delivered").length
    },
    {
      name: "Placed",
      value: orders.filter(o => o?.status === "Placed").length
    }
  ];

  const COLORS = ["#00C49F", "#FFBB28"];

  // ✅ Monthly Orders
  const monthlyData = orders.map(order => ({
    month: order?.date
      ? new Date(order.date).toLocaleString("default", { month: "short" })
      : "N/A",
    orders: 1
  }));

  const groupedMonthly = Object.values(
    monthlyData.reduce((acc, curr) => {
      acc[curr.month] = acc[curr.month] || { month: curr.month, orders: 0 };
      acc[curr.month].orders += 1;
      return acc;
    }, {})
  );

  // ✅ Orders Trend
  const orderTrendData = orders.slice(0, 7).map(order => ({
    date: order?.date
      ? new Date(order.date).toLocaleDateString()
      : "N/A",
    orders: 1
  }));

  const groupedOrdersTrend = Object.values(
    orderTrendData.reduce((acc, curr) => {
      acc[curr.date] = acc[curr.date] || { date: curr.date, orders: 0 };
      acc[curr.date].orders += 1;
      return acc;
    }, {})
  );

  return (
   <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <p className="active">Dashboard</p>
        <p onClick={() => navigate("/addproduct")}>Add Product</p>
        <p onClick={() => navigate("/manageproduct")}>Manage Product</p>
        <p onClick={() => navigate("/manageorder")}>Manage Orders</p>
        <p onClick={() => navigate("/manageuser")}>Manage Users</p>
      </div>

      {/* Main */}
      <div className="dashboard-main">

        <h2>Welcome to Admin Dashboard</h2>

        {/* Stats */}
        <div className="stats-cards">
          <div className="card">
            <p>{stats?.totalProducts || 0}</p>
            <span>Total Products</span>
          </div>
          <div className="card">
            <p>{stats?.totalOrders || 0}</p>
            <span>Total Orders</span>
          </div>
          <div className="card">
            <p>{stats?.totalUsers || 0}</p>
            <span>Users</span>
          </div>
          <div className="card">
            <p>₹{stats?.totalRevenue || 0}</p>
            <span>Revenue</span>
          </div>
        </div>

        {/* Charts */}
        <div className="bottom-section">

          <div className="chart-box">
            <h3>Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pie-box">
            <h3>Status</h3>
            <PieChart width={250} height={250}>
              <Pie data={statusData} dataKey="value" outerRadius={80}>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>

        </div>

        {/* Monthly */}
        <div className="chart-box">
          <h3>Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={groupedMonthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend */}
        <div className="chart-box">
          <h3>Orders Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={groupedOrdersTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders */}
        <div className="orders-box">
          <h3>Recent Orders</h3>

          {orders.length === 0 && <p>No orders</p>}

          {orders.map(order => (
            <div key={order._id} className="order-row">
              <span>{order?._id?.slice(-6)}</span>
              <span>Rs {order?.totalAmount || 0}</span>
              <span>{order?.status || "Placed"}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
    
  );
}

export default Dashboard;