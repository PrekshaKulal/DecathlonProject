import React from 'react'
import "./Manage_Products.css"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Manage_Products(){
    const [products, setProducts] = useState([]);
    

    useEffect(() => { 
      axios.get("http://localhost:3001/GetProducts")
        .then(res => setProducts(res.data))
        .catch(err => console.log(err));
    }, []);

    const navigate = useNavigate();

    const handleEdit=(id)=>{
  navigate(`/add/${id}`)
}

    const handleDelete = async(id) => {
        axios.delete(`http://localhost:3001/products/${id}`)
          .then(res => {
           setProducts(products.filter(product=>product._id!=id));
          })
          .catch(err => console.log(err));
      };

    return(
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
      <div>
        
        <table className="product-table" >
            <thead>
             <tr>
                <td>Product Name</td>
                <td>  Price</td>
                <td>Category</td>
                <td>Description</td>
                <td>Image</td>
                <td>Actions</td>
              </tr>
               </thead>
              
                <tbody>
                  {
                    products.map((product) => (

                     
                      
                      <tr key={product._id}>
                        <td>{product.productName}</td>
                        <td>Rs {product.productPrice.toFixed(2)}</td>
                        <td>{product.productCategory}</td>
                        <td>{product.productDescription}</td>
                        <td><img src={`http://localhost:3001/uploads/${product.image}`} alt={product.productName} className="product-image" /></td>
                       <td><div className='action-buttons'><button className="edit" onClick={()=>handleEdit(product._id)}>Edit</button >
                        <button className="delete" onClick={()=> { handleDelete(product._id) } }>Delete</button></div></td>
                      </tr>
                    ))
                  
}
                </tbody>
                </table>
                </div>
        </>
               
    )
}
export default Manage_Products;