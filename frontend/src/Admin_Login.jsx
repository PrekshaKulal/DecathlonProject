import { useState } from "react";
import "./Admin_Login.css";
import { useNavigate } from "react-router-dom";

function Admin_Login() {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
     if(email === "admin@gmail.com" && password === "admin123"){
        alert("Admin Login Successful");
        navigate("/admin");
    }
    else{
        alert("Invalid Admin Credentials");
    }
  };
 return (
    <>
      <header className="login-header">
      <div
          className="header-left"
          onClick={() => navigate("/")}
        >
          <img
            src="https://png.pngtree.com/element_our/sm/20180515/sm_5afb1034cabf4.jpg"
            alt="back"
            className="back-icon"
          />
          <span>Back</span>
        </div>
        <img
          src="https://login.decathlon.net/assets/decathlon-logo-vp-DDH3S1xy.svg"
          alt="logo"
          className="header-logo"
        />
      </header>
  <div className="loginpage">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
<p>Admin Email</p>
          <input type="email"placeholder="Enter admin email" required value={email}  onChange={(e)=>setEmail(e.target.value)}/>

          <p>Password</p>
          <input type="password" placeholder="Enter password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
<br/><br/>
          <button type="submit" className="next">
            NEXT
          </button>
        </form>
      </div>
    </>
  );
}

export default Admin_Login;