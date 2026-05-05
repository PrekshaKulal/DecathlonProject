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


const last7Days = [];


// create last 7 days (including today)
for (let i = 6; i >= 0; i--) {
 const d = new Date();
d.setDate(d.getDate() - i);
  const key = d.toLocaleDateString("en-CA");

  last7Days.push({
    date: key,
    revenue: 0
  });
}

// fill data from orders
orders.forEach(order => {
  if (!order.orderDate) return;

  const orderDate = new Date(order.orderDate)
  .toLocaleDateString("en-CA");

  const day = last7Days.find(d => d.date === orderDate);

  if (day) {
    day.revenue += order.totalAmount || 0;
  }
});

const chartData = last7Days;


  // ✅ Status Data
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
      return count +(order.products || []).filter(
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
const monthlyData = Object.values(
  orders.reduce((acc, order) => {
    if (!order.orderDate) return acc;

    const date = new Date(order.orderDate);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!acc[key]) {
      acc[key] = {
        month: date.toLocaleString("default", {
          month: "short",
          year: "numeric"
        }),
        orders: 0,
        sortKey: new Date(date.getFullYear(), date.getMonth())
      };
    }

    acc[key].orders += 1;

    return acc;
  }, {})
).sort((a, b) => a.sortKey - b.sortKey);

  /*
const sortedMonthly = groupedMonthly.sort(
  (a, b) => new Date(a.month) - new Date(b.month)
);*/

  // ✅ Orders Trend
 /*const orderTrendData = orders.slice(0, 7).map(order => ({
  date: order?.orderDate
    ? new Date(order.orderDate).toLocaleDateString()
    : "N/A",
  orders: 1
}));*/

 const ordersTrend = [...last7Days].map(d => ({
  date: d.date,
  orders: 0
}));

orders.forEach(order => {
  if (!order.orderDate) return;

  const orderDate = new Date(order.orderDate)
  .toLocaleDateString("en-CA");

  const day = ordersTrend.find(d => d.date === orderDate);

  if (day) {
    day.orders += 1;
  }
});
  return (
   <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <p className="active">Dashboard</p>
        <p onClick={() => navigate("/add")}>Add Product</p>
        <p onClick={() => navigate("/manage")}>Manage Product</p>
        <p onClick={() => navigate("/admin/orders")}>Manage Orders</p>
        <p onClick={() => navigate("/view-users")}>Manage Users</p>
         <p onClick={() => navigate("/admin-login")}>Logout</p>
         
      </div>

      {/* Main */}
      <div className="dashboard-main">

        <h2 style={{color:" #007bff"}}>Welcome to Admin Dashboard</h2>

        {/* Stats */}
        <div className="stats-cards">
          <div className="card">
            <p style={{color:" #007bff"}}>{stats?.totalProducts || 0}</p>
            <span>Total Products</span>
          </div>
          <div className="card">
            <p style={{color:" #007bff"}}>{stats?.totalOrders || 0}</p>
            <span>Total Orders</span>
          </div>
          <div className="card">
            <p style={{color:" #007bff"}}>{stats?.totalUsers || 0}</p>
            <span>Users</span>
          </div>
          <div className="card">
            <p style={{color:" #007bff"}}>Rs {stats?.totalRevenue || 0}</p>
            <span>Revenue</span>
          </div>
        </div>

        {/* Charts */}
        <div className="bottom-section">

          <div className="chart-box">
            <h3>Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
             <LineChart data={chartData}>
               <XAxis
  dataKey="date"
  tickFormatter={(d) => new Date(d).toLocaleDateString()}
/>
                <YAxis />
               <Tooltip
  labelFormatter={(label) =>
    new Date(label).toLocaleDateString()
  }
/>
               <Line type="monotone" dataKey="revenue" stroke="#007bff" />
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
          <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
           <Tooltip />
             <Bar dataKey="orders" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend */}
        <div className="chart-box">
          <h3>Orders Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
           <LineChart data={ordersTrend}>
             <XAxis
  dataKey="date"
  tickFormatter={(d) => new Date(d).toLocaleDateString()}
/>
              <YAxis />
             <Tooltip
  labelFormatter={(label) =>
    new Date(label).toLocaleDateString()
  }
/>
             <Line type="monotone" dataKey="orders" stroke="#28a745" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders */}
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