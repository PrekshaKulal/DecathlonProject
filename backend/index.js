const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer=require('multer');
const app = express();
app.use(express.json());
app.use(cors());
const nodemailer = require("nodemailer");
app.use('/uploads', express.static('uploads'));
const UserModel  = require('./models/Users');
const ProductModel=require('./models/Product');
const OrderModel  =require('./models/Order');
const CartModel = require("./models/Cart");
const AddressModel = require("./models/Address");
const fs=require("fs")
const path=require("path")
const jwt = require("jsonwebtoken");
const dns = require("dns");
require('dotenv').config();

dns.setServers(['1.1.1.1', '8.8.8.8']);

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.log("Missing environment variables");
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded =jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token data" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};




let otpStore = {};
const transporter = nodemailer.createTransport({
  service: "gmail",
 auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
}
});



app.post("/send-otp", async (req, res) => {
   const { email } = req.body;
 if (!email) {
    return res.status(400).json({ error: "Email required" });
  }
const otp = Math.floor(100000 + Math.random() * 900000).toString();
otpStore[email] = otp;
console.log("Generated OTP:", otp); 
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Otp",
    text: `Your OTP is ${otp}`
  };
try {
 await transporter.sendMail(mailOptions);
  res.json({ success: true });
} catch (error) {
 console.log(error);
 res.status(500).json({ error: "Email failed" });
 }
});

app.post("/verify-otp", async (req, res) => {
  const { otp, email, type } = req.body;

  if (!otpStore[email]) {
    return res.json({ success: false, message: "OTP expired" });
  }

  if (String(otpStore[email]) !== String(otp)) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  delete otpStore[email];

  try {
    let user = await UserModel.findOne({ email });
    if (type === "register") {
      if (user) {
        return res.json({ success: false, message: "User already exists" });
      }

      user = new UserModel({ email });
      await user.save();
    }
    if (type === "login") {
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
    }
    const token =jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error" });
  }
});

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');},
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
})
const upload=multer({storage:storage});
app.post('/products', upload.single('image'), async (req, res) => {     //add product api
    try {
     const product = new ProductModel({
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            productCategory: req.body.productCategory,
            productDescription: req.body.productDescription,
            image: req.file.filename
        });
      await product.save();
     res.json("Product Added Successfully");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
app.delete('/products/:id', async (req, res) => {       //delete product api
    try {
       const data= await ProductModel.findById(req.params.id);
        if(!data){
            return res.json("Product not found");
        }
       const imagePath=path.join(__dirname,"uploads",data.image);
      
       fs.unlink(imagePath,(err)=>{
         if(err){
                console.log(err);
            } else {
                console.log("Image deleted");
            }
       });
        await ProductModel.findByIdAndDelete(req.params.id);
        res.json("Product deleted successfully");
    } catch (err) {
        console.log(err);
      
    }
});
app.get('/products/:id', async (req,res)=>{                 //get data via id api
  try{
    const product = await ProductModel.findById(req.params.id)
    res.json(product)
  }catch(err){
    res.json(err)
  }
})
app.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedProduct = {
    productName: req.body.productName,                      //updating api
    productPrice: req.body.productPrice,
    productCategory: req.body.productCategory,
    productDescription: req.body.productDescription
    }
    if(req.file){
      updatedProduct.image = req.file.filename
    }
    await ProductModel.findByIdAndUpdate(req.params.id, updatedProduct)
    res.json("Product Updated")
  } catch(err){
    res.status(500).json(err)
  }
});



app.get('/GetProducts', (req,res)=>{
    ProductModel.find()                             //display for table api
    .then(products => res.json(products))
    .catch(err => res.json(err));
});

app.post("/check-user", async (req,res)=>{

  const {email} = req.body

  const user = await UserModel.findOne({email})

  if(user){
    res.json({exists:true})
  }else{
    res.json({exists:false})
  }

})

/*app.post('/login', (req, res) => {
    const {email,password} = req.body;
    UserModel.findOne({email:email})                //login api
    .then(user=>{
        if(user){
        if(user.password===password){
            res.json("Success", user)
        }
        else {
            res.json("The password is incorrect")
        }

        }
        else {
            res.json("No record existed")
        }
    })
        });
        

app.post('/register', (req, res) => {           //register api

    console.log(req.body);  

    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err));
});
*/

app.post("/add-address", authMiddleware, async (req, res) => {
  try {
    const address = new AddressModel({
      userId: req.user.id,
      ...req.body 
    });

    await address.save();

    res.json({ success: true, message: "Address added" });

  } catch (err) {
    res.status(500).json({ error: "Saving address failed" });
  }
});
app.get("/get-addresses", authMiddleware, async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user); 

    const addresses = await AddressModel.find({ userId: req.user.id });

    console.log("ADDRESSES:", addresses);   

    res.json(addresses);

  } catch (err) {
    console.log("ERROR IN GET ADDRESSES:", err);
    res.status(500).json({ error: "Fetching addresses failed" });
  }
});

/*app.get("/get-addresses/:userId", async (req, res) => {
  try {
    const addresses = await AddressModel.find({ userId: req.params.userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json(err);
  } 
});*/


app.post("/save-cart", authMiddleware, async (req, res) => {
  const userId = req.user.id;  
  const { items } = req.body;

  try {
    let cart = await CartModel.findOne({ userId });

    if (cart) {
      cart.items = items;
    } else {
      cart = new CartModel({ userId, items });
    }

    await cart.save();
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Saving to cart failed" });
  }
});
app.get("/get-cart", authMiddleware, async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user.id });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post('/get-cart-items', async (req, res) => {
  try {
    const { productIds } = req.body;
    const products = await ProductModel.find({ _id: { $in: productIds } });
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
app.post('/orders', authMiddleware, async (req, res) => {
  try {
    const { products, totalAmount, addressId } = req.body;
    const address = await AddressModel.findById(addressId);
    if (!address) {
      return res.status(400).json({ error: "Address not found" });
    }
    const order = new OrderModel({
      userId: req.user.id,
      products,
      totalAmount,
      addressId,

      addressDetails: {
        Name: address.Name,
        HouseNo: address.HouseNo,
        Street: address.Street,
        City: address.City,
        District: address.District,
        State: address.State,
        Pincode: address.Pincode
      }
    });

    await order.save();
    await CartModel.updateOne(
      { userId: req.user.id },
      { $set: { items: [] } }
    );

    res.json({ success: true, message: "Order placed" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Order failed" });
  }
});
app.get('/users', async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
});

app.get("/admin/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Fetching orders failed" });
  }
});
app.put("/admin/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await OrderModel.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});
app.delete("/admin/orders/:id", async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});
/*app.get("/orders", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching orders...");
    const orders = await OrderModel.find();
    console.log("Orders:", orders); 
    res.json(orders);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Fetching orders failed" });
  }
});*/
app.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.user.id })
      .populate("products.productId") 
      .sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Fetching user orders failed" });
  }
});
app.get("/products/ordered", authMiddleware, async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.user.id });
    const productIds = orders.flatMap(order => order.products.map(p => p.productId));
    const products = await ProductModel.find({ _id: { $in: productIds }});
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Fetching ordered products failed" });
  }
});
app.get("/products/:id", authMiddleware, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Fetching products failed" });
  }
});
app.put("/orders/cancel/:id", authMiddleware, async (req, res) => {
  try {
    await OrderModel.findByIdAndUpdate(req.params.id, {
      status: "Cancelled"
    });
    res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    res.status(500).json({ error: "Cancel failed" });
  }
});
/*app.delete("/orders/:id", authMiddleware, async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});*/
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});