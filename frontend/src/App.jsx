import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";
import Homepage from "./Homepage";
import Otp from "./Otp";
import Register from "./Register";
import Home from "./Home";
import Admin from "./Admin";
import Admin_Login from "./Admin_Login";
import Add_Product from "./Add_Product";
import Manage_Products from "./Manage_Products";
import Category from "./Category";
import Individual from "./Individual";
import Cart from "./Cart";
import View_Users from "./View_Users";
import Address from "./Address";
import Addresses from "./Addresses";
import AdminOrders from "./AdminOrders";
import Manage_Orders from "./Manage_Orders";


function Layout() {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Otp" element={<Otp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<Admin_Login />} />
        <Route path="/add" element={<Add_Product />} />
        <Route path="/add/:id"element={<Add_Product/>}/>
        <Route path="/manage" element={<Manage_Products/>}/>
        <Route path="/category" element={<Category/>}/>
        <Route path="/individual/:id" element={<Individual/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/view-users" element={<View_Users/>}/>
        <Route path="/address" element={<Address/>}/>
        <Route path="/addresses" element={<Addresses/>}/>
        <Route path="/admin/orders" element={<AdminOrders/>}/>
        <Route path="/manage-orders" element={<Manage_Orders/>}/>
      </Routes>


    </>
  );
}

function App() {
  return (
    <>
    <BrowserRouter>
      <Layout />
      
    </BrowserRouter>
    
    </>
  );
}

export default App;
