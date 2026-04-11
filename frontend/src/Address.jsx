import {useState} from "react";   
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Address.css";


function Address(){
    const navigate = useNavigate();
    const handleSave = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login to save address");
          navigate("/login");
          return;
        } 
        /*
        const formData= new FormData();
        formData.append("userId", userId);
        formData.append("Name", address.Name);
        formData.append("HouseNo", address.HouseNo);
        formData.append("Street", address.Street);  
        formData.append("City", address.City);
        formData.append("District", address.District);*/
        try {
await axios.post(`${import.meta.env.API_URL}/add-address`,form,  
  {
      headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`  
    }
  }
);
          alert("Address saved successfully");
          navigate("/addresses");
        } catch (err) {
          console.log(err);
        }   
        };

 const [form,setForm]=useState({
    Name:"",
  HouseNo: "",
  Street: "",
 
  City: "",
  District: "",
  State: "",
  Pincode: ""
});
    const handleChange = (e) => {
        setForm({...form,[e.target.name]:e.target.value})
    }
    return (
        <>
        
        <div className="addcontainer">
            <Navbar/>
            <h2>Add Delivery Address</h2>
            
           {
            Object.keys(form).map(key=>(
                <input key={key} name={key} placeholder={key} value={form[key]} onChange={handleChange} />
            ))
        
           }<br/>
           <div className="add-address">
            <button  onClick={handleSave}>Save Address</button></div>
    
</div>
        </>
    )
}
export default Address;
