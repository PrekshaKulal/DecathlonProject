import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAddresses();
  }, [token]);
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/get-addresses`, {
        headers: { Authorization: token }
      });
      setAddresses(res.data);
      if (res.data.length > 0) {
        setSelected(res.data[0]._id);
      }
    } catch (err) {
      console.log(err);
    }
  };
const placeOrder = async () => {
  if (!selected) {
    alert("Select address");
    return;
  }
  try {
    const cartRes = await axios.get(`${import.meta.env.VITE_API_URL}/get-cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const items = cartRes.data.items;
    let totalAmount = 0;
    for (let item of items) {
      const productRes = await axios.get(`${import.meta.env.VITE_API_URL}/products/${item.productId}`);
      totalAmount += productRes.data.productPrice * item.quantity;
    }
    await axios.post(`${import.meta.env.VITE_API_URL}/orders`,{
        products: items,
        totalAmount,
        addressId: selected
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    alert("Order placed successfully");
    navigate("/");
  } catch (err) {
    console.log("ORDER ERROR:", err);
  }
};
  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Address</h2>
      {addresses.map((addr) => (
        <div key={addr._id} style={{ marginBottom: "10px" }}>
          <input type="radio" name="address" checked={selected === addr._id} onChange={() => setSelected(addr._id)} />
          <span style={{ marginLeft: "10px" }}>
            {addr.Name}, {addr.HouseNo}, {addr.Street}, {addr.City}, {addr.State} - {addr.Pincode}
          </span>
        </div>
      ))}
      <button onClick={() => navigate("/address")}>
        + Add New Address
      </button>
      <br /><br />
      <button onClick={placeOrder}>
        Place Order (COD)
      </button>
    </div>
  );
}

export default Addresses;