import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    email: "",
    addressCount: 0
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

        <h2>My Profile</h2>

        <div className="profile-section">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Saved Addresses:</strong> {user.addressCount}</p>
        </div>

        <div className="profile-buttons">
          <button onClick={() => navigate("/address")}>
            Manage Addresses
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;