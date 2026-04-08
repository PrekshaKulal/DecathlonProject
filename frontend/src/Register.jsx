import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [showEmail, setShowEmail] = useState(true);
  const [email, setEmail] = useState("");
 

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!email) {
    alert("Please enter email");
    return;
  }

  navigate("/otp", { state: { email, type:"register" } });
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

        <h2>Let's Go</h2>

<form onSubmit={handleSubmit}>
       
          <div className="main">
            <span
              className={showEmail ? "active" : ""}
              onClick={() => setShowEmail(true)}
            >
              E-mail
            </span>

            <span
              className={!showEmail ? "active" : ""}
              onClick={() => setShowEmail(false)}
            >
              Phone number
            </span>
          </div>

         
          {showEmail ? (
            <>
              <p>Enter an email address</p>
<div className="box">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
</div>
            </>
          ) : (
            <>
              <div className="phone-labels">
                <label>Country:</label>
                <label>Mobile phone number</label>
              </div>

              <div className="phone-row">
                <div className="country-box">
                  <img
                    src="https://flagcdn.com/w20/in.png"
                    alt="India"
                  />
                  <span>+91</span>
                </div>

                <input
                  type="tel"
                  placeholder="Mobile phone number"
                />
              </div>
            </>
          )}

          <button type="submit" className="next">
            NEXT
          </button>
        
           <hr style={{ margin: "15px 0" }} />

        <button className="ways">
          <img
            src="https://login.decathlon.net/assets/google-CXYtgH5h.svg"
            alt="Google"
            align="left"
          />
          Continue with Google
        </button>

        <button className="ways">
          <img
            src="https://login.decathlon.net/assets/facebook-WuuN3sW7.svg"
            alt="Facebook"
            align="left"
          />
          Continue with Facebook
        </button>

        <button className="ways">
          <img
            src="https://login.decathlon.net/assets/apple-BBhyWItP.svg"
            alt="Apple"
            align="left"
          />
          Continue with Apple
        </button>

        <br />

        <br />
        <br />

        <p style={{ fontWeight: "bold" }}>
       Already have an account? 
        </p>
        <span
          className="register"
          onClick={() => navigate("/login")}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "black"
          }}
        >
         Login
        </span>

        <br /> <br />

        <p>✔ Exclusive Deals and Sporty Rewards</p>
        <p>✔ Personalised Experiences</p>
        <p>✔ Faster Checkout</p>
        <p>✔ Easy Returns/Exchange</p>

        <br />

        <p>
          Having trouble logging In ?{" "}
          <a href="#" style={{ textDecoration: "none" }}>
            Privacy
          </a>
        </p>
        <br />

        <div>
          <img
            src="data:image/png;base64,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"
            alt="India Flag"
            style={{ width: "20px", height: "15px", verticalAlign: "middle" }}
          />
          <span style={{ marginLeft: "6px", verticalAlign: "middle" }}>
            English
          </span>
        </div>
     </form>

      </div>
    </>
  );
}

export default Register;