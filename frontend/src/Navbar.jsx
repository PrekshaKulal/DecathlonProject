import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import Category from "./Category";
import {useState,useEffect} from "react";

/*import {FaBars,FaSearch,FaRegUser,FaStore,FaRegCommentDots,FaRegHeart,FaShoppingCart,FaMapMarkerAlt} from "react-icons/fa";*/


function Navbar() {
   const [showMenu, setShowMenu] = useState(false);
   const [activeCategory, setActiveCategory] = useState("men");

    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
const [token, setToken] = useState(null);

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  setToken(storedToken);
}, []);
   const handleLogout = () => {
  localStorage.removeItem("token");
  setToken(null);
};

return (
  <>
  {/*
    <div className="navbar">
      <div className="nav-left">
       <FaBars
            className="menu-icon"
            onClick={() => setShowMenu(!showMenu)}
            style={{ cursor: "pointer" }}
          />

          <span
            className="all-sports"
            onClick={() => setShowMenu(!showMenu)}
            style={{ cursor: "pointer" }}
          >
            ALL<br />SPORTS
          </span>
 <img src="https://login.decathlon.net/assets/decathlon-logo-vp-DDH3S1xy.svg" alt="logo" className="logo" />
      </div>
      <div className="nav-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder='Search for "Running Shoes"'
        />
      </div>
      <div className="nav-right">

       <div className="location">
  <FaMapMarkerAlt className="pin" />
  <div>
    <span>Delivery Location</span>
    <b>
      560001 <a href="#" className="change-link">CHANGE</a>
    </b>
  </div>
</div>
<div className="nav-icons">

<div
  className="icon-box"
  onMouseEnter={() => setShowDropdown(true)}
  onMouseLeave={() => setShowDropdown(false)}
  onClick={() => {
  if (!token) navigate("/login");
}}
  style={{ position: "relative", cursor: "pointer" }}
>
  <FaRegUser />

  <span>{token ? "Profile" : "Sign In"}</span>

  {token && showDropdown && (
    <div className="dropdown">
      <p onClick={()=>navigate("/manage-orders")}>My Orders</p>
      <p onClick={handleLogout}>Logout</p>
    </div>
  )}
</div>


 <div className="icon-box">
            <FaStore />
            <span>My Store</span>
          </div>
          <div className="icon-box">
            <FaRegCommentDots />
            <span>Support</span>
          </div>

          <div className="icon-box">
            <FaRegHeart />
            <span>Wishlist</span>
          </div>

          <div className="icon-box" onClick={()=>navigate("/cart")} style={{cursor:"pointer"}}>
            <FaShoppingCart />
            <span>Cart</span>
          </div>

        </div>
      </div>

    </div>
     {showMenu && (
  <>
    <div className="category-bar">
       <span className={activeCategory === "all" ? "active" : ""} style={{cursor:"pointer"}} onClick={() => setActiveCategory("all")} > All Sports</span>
      <span className={activeCategory === "men" ? "active" : ""} style={{cursor:"pointer"}} onClick={() => setActiveCategory("men")} > Men Collection</span>
      <span className={activeCategory === "women" ? "active" : ""} style={{cursor:"pointer"}} onClick={() => setActiveCategory("women")}> Women Collection </span>
      <span className={activeCategory === "kids" ? "active" : ""} style={{cursor:"pointer"}} onClick={() => setActiveCategory("kids")}>Kids Collection </span>
      <span className={activeCategory === "gift" ? "active" : ""} style={{cursor:"pointer"}} onClick={() => setActiveCategory("gift")}> Gift Cards</span>
      <span className={activeCategory === "brands" ? "active" : ""} style={{cursor:"pointer"}} onClick={() => setActiveCategory("brands")} > Partner Brands </span>
    </div>
 <Category category={activeCategory} />
  </>
)}
   */}
     </>
  );
 
}


export default Navbar;
