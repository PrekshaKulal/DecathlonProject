import React from "react";
import "./MyProfile.css";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="profile-top">
          <div className="profile-avatar">P</div>

          <div>
            <h2>Hello, User 👋</h2>
            <p>Welcome back to your account</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Personal Details</h3>

          <p><strong>Name:</strong> User Name</p>
          <p><strong>Email:</strong> user@gmail.com</p>
          <p><strong>Phone:</strong> 9876543210</p>

          <button>Edit Profile</button>
        </div>

        <div className="profile-section">
          <h3>Saved Addresses</h3>

          <p>Manage your delivery addresses easily.</p>

          <button onClick={() => navigate("/address")}>
            Manage Addresses
          </button>
        </div>

        <div className="profile-section">
          <h3>Wishlist</h3>

          <p>Products you liked will appear here.</p>

          <button onClick={() => navigate("/wishlist")}>
            View Wishlist
          </button>
        </div>

        <div className="profile-section logout-box">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default MyProfile;