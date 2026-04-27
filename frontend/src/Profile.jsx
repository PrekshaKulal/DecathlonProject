import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    email: "",
    addresses: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="profile-top">
          <div className="profile-avatar">
            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h2>Hello 👋</h2>
            <p>Welcome back to your account</p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="profile-section">
          <h3>Personal Details</h3>

          <p><strong>Email:</strong> {user.email}</p>
        </div>

        {/* Saved Addresses */}
        <div className="profile-section">
          <h3>Saved Addresses</h3>

          {user.addresses.length > 0 ? (
            user.addresses.map((addr) => (
              <div className="address-box" key={addr._id}>
                <p><strong>{addr.Name}</strong></p>
                 <p><strong>{addr.Phone}</strong></p>

                <p>{addr.HouseNo}, {addr.Street}</p>
                <p>{addr.City}, {addr.District}</p>
                <p>{addr.State} - {addr.Pincode}</p>
                <p><strong>Phone:</strong> {addr.Phone}</p>
              </div>
            ))
          ) : (
            <p>No saved addresses</p>
          )}

          <button onClick={() => navigate("/address")}>
            Manage Addresses
          </button>
        </div>

        {/* Logout */}
        <div className="profile-section logout-box">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;