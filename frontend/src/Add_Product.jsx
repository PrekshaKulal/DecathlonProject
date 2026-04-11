import React from 'react';
import "./Add_Product.css";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";



const Add_Product = () => {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [image, setImage] = useState(null);
    const {id} = useParams();

   useEffect(()=>{
 if(id){
  axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
  .then(res=>{
    setProductName(res.data.productName)
    setProductPrice(res.data.productPrice)
    setProductCategory(res.data.productCategory)
    setProductDescription(res.data.productDescription)
    setImage(res.data.image)
  })}},[id])

    const handleImageSelect = (e) => {
        console.log(e);
        const file = e.target.files[0]; 
        if (file) {
        setImage(file);
    }
}
    

 
  const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("productName", productName);
  formData.append("productPrice", productPrice);
  formData.append("productCategory", productCategory);
  formData.append("productDescription", productDescription);
  formData.append("image", image);
  
if(id){
  axios.put(`${import.meta.env.VITE_API_URL}/products/${id}`,formData)
  .then(res=>{
    alert("Product Updated Successfully")
    navigate("/manage")
  })
  .catch(err=>console.log(err));
}else{
    
  axios.post(`${import.meta.env.VITE_API_URL}/products`, formData)
    .then(res=>{
      alert("Product Added Successfully")
     setProductName("");
     setProductPrice("");
     setProductCategory("");
     setProductDescription("");
     setImage(null);
      
      })
    .catch(err => console.log(err));
}}
  
const navigate = useNavigate();       
  return (
    <>
    <header className="login-header">

        <div
          className="header-left"
            onClick={() => navigate("/admin")}
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
    <div className='addcontainer'>   
        <h2 style={{color:'black'}}>Add Product</h2><br/>
        <form onSubmit={handleSubmit}>
        <label>
            Product Name :<br/>
            <input type="text" name="productName" required  value={productName} onChange={(e)=>(setProductName(e.target.value))} />
        </label><br/><br/>
         <label>
           Price :<br/>
            <input type="text" name="productPrice" required value={productPrice} onChange={(e)=>(setProductPrice(e.target.value))} />
        </label><br/><br/>
        <label>
            Category :<br/>
           <select className='category' value={productCategory} onChange={(e)=>(setProductCategory(e.target.value))}>
            <option value="">--Select the category--</option>
            <option value="Hiking and Trekking">Hiking and Trekking</option>
             <option value="Cycling">Cycling</option>
              <option value="Fitness and Gym">Fitness and Gym</option>
                 <option value="CampingMen">Camping</option>
             <option value="Fishing">Fishing</option>
              <option value="Horse Riding">Horse Riding</option>

            <option value="Water Sports">Water Sports</option>
             <option value="Racket Sports">Racket Sports</option>
              <option value="Roller Sports">Roller Sports</option>
               <option value="Skiing and Snowboarding">Skiing and Snowboarding</option>
             <option value="Rock Climbing and Mountaineering">Rock Climbing and Mountaineering</option>
              <option value="Team Sports">Team Sports</option>
           </select>
        </label><br/><br/>
         <label>
            Product Description :<br/>
            <textarea style={{width: '100%', height: '100px', background:'white', color:'black'}} name="productDescription" required value={productDescription} onChange={(e)=>(setProductDescription(e.target.value))} />
        </label><br/><br/>
         <label>
            Upload Image :<br/>
            <input type="file" name="image" id="imageInput" accept='image/*'  onChange={handleImageSelect} />
        </label><br/><br/>
       
        <button type="submit">Add Product</button>
        </form>
    </div>
    </>
  )
}
export default Add_Product;