import React from "react";
import { useEffect,useState } from "react";
import "./Cart.css";
import "./Manage_Products.css";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Cart = () => {
    const [products, setProducts] = useState([]);
   const [count, setCount] = useState({});
    const navigate = useNavigate();
 useEffect(() => {
  const fetchCart = async () => {
    const token = localStorage.getItem("token");

if (!token) {
  navigate("/login");
  return;
}
    try {
      const res = await axios.get(`${import.meta.env.API_URL}/get-cart`, {
  headers: {
    Authorization: token
  }
});
      const cartItems = res.data.items;
      const productIds = cartItems.map(item => item.productId);
      const productsRes = await axios.post( `${import.meta.env.API_URL}/get-cart-items`,{ productIds });
      setProducts(productsRes.data);
      let qtyMap = {};
      cartItems.forEach(item => {
        qtyMap[item.productId] = item.quantity;
      });

      setCount(qtyMap);

    } catch (err) {
      console.log(err);
    }
  };

  fetchCart();
}, [navigate]);

 const handleDelete = async (id) => {
  const updatedItems = Object.keys(count)
    .filter(pid => pid !== id)
    .map(pid => ({
      productId: pid,
      quantity: count[pid]
    }));

  await axios.post(
  `${import.meta.env.API_URL}/save-cart`,
  { items: updatedItems },
  {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  }
);
  setProducts(products.filter(p => p._id !== id));
};

let totalAmount = 0;
products.forEach((product) => {
  const qty = count[product._id] || 1;
  totalAmount += product.productPrice * qty;
});

const placeOrder = async () => {
  const userId = localStorage.getItem("userId");
  const orderProducts = products.map((product) => ({
    productId: product._id,
    quantity: count[product._id] || 1
  }));

  try {
  const res = await fetch(`${import.meta.env.API_URL}/orders`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token")
  },
  body: JSON.stringify({
    products: orderProducts,
    totalAmount
  })
});    
    const data = await res.json();
    alert("Order placed successfully");
    await axios.post(
  `${import.meta.env.API_URL}/save-cart`,
  { items: [] },
  {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  }
);
    setProducts([]);
    setCount({});
  } catch (err) {
    console.log(err);
  }
};
    return(
        <>
        <div>
            <section className="cart">

                <button className="shop" onClick={()=>navigate("/")}>Continue Shopping</button>
                <h2 style={{color:'black', textAlign:'center', marginTop:'0px'}}>My Cart</h2>
            </section>
        </div>
        < div className="cart-items">
            <div className="cart-item-container">
                <div className="cart-item">
                     <table className="product-table" >
            <thead>
             <tr>
                <td>Product Name</td>
                <td> Price</td>
                <td>Quantity</td>
                <td>Total</td>
                <td>Actions</td>
               </tr>
               </thead>
                  
                <tbody>
                  {
                    products.map((product) => (

                     
                      
                      <tr key={product._id}>
                        <td><img src={`${import.meta.env.API_URL}/uploads/${product.image}`} alt={product.productName} className="product-image" /><br/>{product.productName}</td>
                        <td>Rs {product.productPrice.toFixed(2)}</td>
                        <td><input type="number" min="1"  value={count[product._id] || 1} onChange={(e) => {const newQty = Number(e.target.value);
 const updatedCount = { ...count, [product._id]: newQty };
  setCount(updatedCount);

  const items = Object.keys(updatedCount).map(id => ({
    productId: id,
    quantity: updatedCount[id]
  }));

  axios.post(
  `${import.meta.env.API_URL}/save-cart`,
  { items },
  {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  }
);
}}className="quantity-input"/></td>

                      <td>Rs {(product.productPrice * (count[product._id] || 1)).toFixed(2)}</td>
                      <td><div> <button className="delete" onClick={()=> { handleDelete(product._id) } }>Remove</button></div></td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    <span className="total-amount"> Total Amount: Rs {totalAmount.toFixed(2)} </span>
                    <br/><br/>
                  <button className="place-order"  onClick={()=>navigate("/addresses")}>Place Order</button>

                   
                </div>
            </div>
        </div>
        </>
    );
}
export default Cart;