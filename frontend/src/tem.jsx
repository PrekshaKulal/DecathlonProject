import React from 'react';
import "./Add_Product.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';



const Add_Product = () => {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [image, setImage] = useState(null);  

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

    axios.post("http://localhost:3001/products", formData)
    .then(res=>{})
    .catch(err=>console.log(err))
    
    alert("Product added successfully!");
}
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
            <input type="text" name="productCategory" required value={productCategory} onChange={(e)=>(setProductCategory(e.target.value))} />
        </label><br/><br/>
         <label>
            Product Description :<br/>
            <textarea style={{width: '100%', height: '100px', background:'white', color:'black'}} name="productDescription" required value={productDescription} onChange={(e)=>(setProductDescription(e.target.value))} />
        </label><br/><br/>
         <label>
            Upload Image :<br/>
            <input type="file" name="image" accept='image/*' onChange={handleImageSelect} />
        </label><br/><br/>
        <button type="submit">Add Product</button>
        </form>
    </div>
    </>
  )
}
/*app.post('/products',async(req,res)=>{
    console.log(req.body);

   ProductModel.create(req.body)
    try{
        const newImage=await ProductModel.create(req.body)
        newImage.save();
        res.status(201).json({msg:"New Product uploaded....!"})
        
    }catch(error){
        res.status(409).json({message:error.message})
    }
})*/

export default Add_Product;