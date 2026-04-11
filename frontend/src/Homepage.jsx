import React from 'react';
import "./Homepage.css";
import { useEffect,useState } from 'react';
import { Carousal } from './Carousal';
import { slides } from "./data/Data";
import axios from 'axios';

import { Link } from 'react-router-dom';
function Homepage(){
    const [products, setProducts] = useState([]);
 

useEffect(() => {
  axios.get(`${import.meta.env.VITE_API_URL}/GetProducts`)
  .then(res => setProducts(res.data))
  .catch(err => console.log(err));}, []);
    return(
        <>
        <div className='homecards'>
            <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1371134/k$314e5f23e193aab04dceff5d9bcbdee4/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
            <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1371135/k$32718b4fcaeb9d44d9f8fc32e8bd8a79/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
               
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1370638/k$e6586b427aa24c55db9bc271c4cf72e3/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1370636/k$552986ee3799fc5f4513fd850641b008/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1370641/k$26a2b82ff5431235f37597a6b4676459/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1370672/k$fecd38615345f00927138feb65406f4b/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1370635/k$0a71226977a82eba06258ecb6759b28a/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1370637/k$21b259867711768cf130d45f28d3c98c/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
               
            </div>
        </div>
        <div className="carousal">
                <Carousal data={slides} />
              </div>
        <div className='homecards'>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1370289/k$d820be0e342ede9f2b2c6580b515d62f/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
            <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1370287/k$ceb9cec361ac92f847ecbf499fe7e864/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
               
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1375900/k$3bcabe3b481a40871ca5ef40a3ad3f62/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1370290/k$626a6c73bfda5cb367ea530a4045f951/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1375613/k$788a9e879b996c27f0ad06a3687a7e67/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1370291/k$f1ef3860d63cf52768596c1fa06fb688/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1375610/k$350db7fbe08310ff7a075a07d0a3f93b/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
             <div className='eachcard'>
                <img src="https://contents.mediadecathlon.com/s1375611/k$1e76b523bd90c417df9293bc4788ebf1/defaut.jpg?format=auto&quality=70&f=160x0" alt="card1" />
                
            </div>
            </div>
           
          
            <div className='homecards'>

{products.map((product) => (
<Link to={`/individual/${product._id}`} className='eachcard' key={product._id}>
<img src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`} alt={product.productName} />
<p className='bigcardtext'>{product.productName}</p>
<h3 className='smalltext'>MRP Rs {product.productPrice}</h3>

</Link>
))}
</div>
 </>
);}

export default Homepage;