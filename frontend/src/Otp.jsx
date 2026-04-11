import React, { useState,useEffect,useRef } from "react";
import "./Otp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";


function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(9);
  const location = useLocation();
  const type = location.state?.type;
  const email = location.state?.email;
  const hasSentOtp = useRef(false);

  const sendOtp = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/send-otp`, {
      email: email
    });

    alert("OTP sent to email");

  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  if (!email) return;

  if (hasSentOtp.current === false) {
    hasSentOtp.current = true;
    sendOtp();
  }
}, []);
const verifyOtp = async () => {

  const enteredOtp = otp.join("");

  try {

    const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify-otp`,{
      otp: enteredOtp,
      email: email,
      type: type
    })

    if(res.data.success){
     localStorage.setItem("token", res.data.token);
     
      alert("Login Successful")
       
      navigate("/")
    }else{
      alert(res.data.message || "Invalid OTP")
    }

  } catch (error) {
    console.log(error);
  }

};

  const handleChange = (value, index) => {
   if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp); 
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    } else if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }     
  };
  const resendOtp = () => {
  sendOtp();
  setSeconds(20);
};

 useEffect(() => {
  if (seconds > 0) {
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }
}, [seconds]);

  return (
    <>
    <header className="login-header">
  <div className="header-left" onClick={() => navigate("/")}>
    <img
      src="https://png.pngtree.com/element_our/sm/20180515/sm_5afb1034cabf4.jpg"
      alt="back"
      className="back-icon"
    />
    <span>Back</span>
  </div>
  <img
    src="https://login.decathlon.net/assets/decathlon-logo-vp-DDH3S1xy.svg"
    height="35"
    alt="logo"
    className="logo"
  />
</header>
    <div className="otp-container">
      <h2>Enter the code you received:</h2>
      <p>
        Enter the 6-digit verification code sent by email to:
        <br />
       {email}<br/><br/> <span className="edit" style={{color: "black",textDecoration: "underline", cursor: "pointer"}}>Edit</span></p>

      <div className="info-box">
        <span style={{ color: "black", fontWeight: "bold" }}>The code is sent </span>
      </div>

      <div className="otp-boxes">
        {otp.map((data, index) => (
          <input key={index} id={`otp-${index}`} type="text" maxLength="1" value={data} onChange={(e) => handleChange(e.target.value, index)} />
        ))}
      </div>

      <button className="next-btn" onClick={verifyOtp}>
        NEXT
      </button>
   <span
  className="resend"
  onClick={seconds === 0 ? resendOtp : null}
>
  {seconds > 0 ? `Resend OTP in ${seconds}s` : "Resend OTP"}
</span> <br />

      <p className="trouble">
        Having trouble logging in? <span>Privacy</span>
      </p>

      <div className="language">
        🇮🇳 English
      </div>
    </div> 
    </>
  );
}


export default Otp;