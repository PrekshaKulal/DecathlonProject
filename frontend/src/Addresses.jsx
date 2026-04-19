import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState("");
  const [paymentType, setPaymentType] = useState("COD");

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
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      // Get Cart Items
      const cartRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const items = cartRes.data.items;

      if (!items || items.length === 0) {
        alert("Cart is empty");
        return;
      }

      // ===============================
      // CASH ON DELIVERY
      // ===============================
      if (paymentType === "COD") {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/orders`,
          {
            products: items,
            addressId: selected,
            paymentMethod: "COD",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("COD Order Placed Successfully");
        navigate("/");
      }

      // ===============================
      // ONLINE PAYMENT
      // ===============================
      else if (paymentType === "RAZORPAY") {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/create-order`,
          {
            products: items,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.razorpayOrder.amount,
          currency: "INR",
          name: "My Store",
          order_id: data.razorpayOrder.id,

          handler: async function (response) {
            try {
              await axios.post(
                `${import.meta.env.VITE_API_URL}/orders`,
                {
                  products: items,
                  addressId: selected,
                  paymentMethod: "RAZORPAY",
                  paymentId: response.razorpay_payment_id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              alert("Payment Successful & Order Placed");
              navigate("/");
            } catch (err) {
              console.log(err);
              alert("Order saving failed after payment");
            }
          },

          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.log("ORDER ERROR:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Address</h2>

      {addresses.map((addr) => (
        <div key={addr._id} style={{ marginBottom: "10px" }}>
          <input
            type="radio"
            name="address"
            checked={selected === addr._id}
            onChange={() => setSelected(addr._id)}
          />

          <span style={{ marginLeft: "10px" }}>
            {addr.Name}, {addr.HouseNo}, {addr.Street}, {addr.City},{" "}
            {addr.State} - {addr.Pincode}
          </span>
        </div>
      ))}

      <button onClick={() => navigate("/address")}>
        + Add New Address
      </button>

      <br />
      <br />

      <h3>Choose Payment Method</h3>

      <div>
        <label>
          <input
            type="radio"
            value="COD"
            checked={paymentType === "COD"}
            onChange={() => setPaymentType("COD")}
          />
          Cash on Delivery
        </label>
      </div>

      <div>
        <label>
          <input
            type="radio"
            value="RAZORPAY"
            checked={paymentType === "RAZORPAY"}
            onChange={() => setPaymentType("RAZORPAY")}
          />
          Online Payment (Razorpay)
        </label>
      </div>

      <br />

      <button onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default Addresses;