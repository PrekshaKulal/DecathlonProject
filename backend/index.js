const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer=require('multer');
const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://decathlonproject-1.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

//app.use('/uploads', express.static('uploads'));
const UserModel  = require('./models/Users');
const ProductModel=require('./models/Product');
const OrderModel  =require('./models/Order');
const CartModel = require("./models/Cart");
const AddressModel = require("./models/Address");
//const fs=require("fs")
//const path=require("path")
const jwt = require("jsonwebtoken");
const dns = require("dns");
require('dotenv').config();
const Razorpay = require("razorpay");
const sgMail = require('@sendgrid/mail');
const {CloudinaryStorage} =require("multer-storage-cloudinary")
const {v2:cloudinary} =require("cloudinary")
const PDFDocument = require("pdfkit-table");


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
  if (!token)
     return res.status(401).json({ error: "No token" });
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
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp,expiresAt: Date.now() + 5 * 60 * 1000};
  console.log("Generated OTP:", otp);
  const msg = {
    to: email,
    from:process.env.EMAIL_USER, 
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
    html: `<h2>Your OTP is ${otp}</h2>`
  };
  try {
    await sgMail.send(msg);
    res.json({ success: true });
  }catch (error) {
  console.log("FULL ERROR:", error);
  console.log("SENDGRID ERROR:", error.response?.body);
  res.status(500).json({ error: error.message });
}
});

app.post("/verify-otp", async (req, res) => {
  const { otp, email, type } = req.body;
  const record = otpStore[email];
  if (!record) {
    return res.json({ success: false, message: "OTP expired" });
  }
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.json({ success: false, message: "OTP expired" });
  }
  if (record.otp !== otp) {
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
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

const sendOrderEmail = async (email, status, order, pdfBuffer = null) => {
  try {
    const msg = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: `Order Update - ${status}`,

      html: `
        <h2>Order Update</h2>
        <p>Your order <b>${order._id}</b> status is now:</p>
        <h3>${status}</h3>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <p>Thank you for shopping with us.</p>
      `
    };

    if (pdfBuffer) {
      msg.attachments = [
        {
          content: pdfBuffer.toString("base64"),
          filename: `Invoice-${order._id}.pdf`,
          type: "application/pdf",
          disposition: "attachment"
        }
      ];
    }

    await sgMail.send(msg);

  } catch (err) {
    console.log(err.response?.body || err);
  }
};
const generateInvoicePDF = async (order) => {
  return new Promise(async (resolve, reject) => {
    try {
      let buffers = [];
      const doc = new PDFDocument({
        margin: 30,
        size: "A4",
      });
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
     doc.fontSize(20).text("DECATHLON");
     doc.moveDown();

      doc.fontSize(20).font("Helvetica-Bold").text("OFFICIAL RECEIPT", 0, 40, {align: "center",});
      doc.moveDown(4);
  
      doc.fontSize(10).font("Helvetica").text("Decathlon India Pvt Ltd",{align:"right"}).text("Corporate Office:",{align:"right"}).text("Bangalore, Karnataka, India",{align:"right"}).text("Email: decathlon.1903@gmail.com",{align:"right"}) .text("Phone: +91 9876543210",{align:"right"});
      doc.moveDown();
      doc
        .fontSize(11)
        .text(`Invoice #: INV-${Date.now()}-${order._id.toString().slice(-5)}`)
        .text(`Order ID: ${order._id}`)
        .text(`Date: ${new Date().toLocaleDateString("en-IN")}`)
        .text(`Payment: ${order.paymentMethod}`)
        .text(`Status: ${order.status || "Placed"}`)
        .text(`Shipping: Standard Delivery`)
        .text(`Estimated: 3-5 Days`)
        .text(`Shipping Cost: Free`);
      doc.moveDown();
      doc.font("Helvetica-Bold").text("Billed To:").font("Helvetica").text(order.addressDetails.Name).text(order.email).text(`${order.addressDetails.HouseNo}, ${order.addressDetails.Street},`).text(`${order.addressDetails.City}, ${order.addressDetails.District},`).text(`${order.addressDetails.State} - ${order.addressDetails.Pincode}`);
      doc.moveDown();
       let rows = [];
      let taxableSubtotal = 0;
      let totalTax = 0;
      for (let item of order.products) {
        const product = await ProductModel.findById(item.productId);
        const qty = Number(item.quantity);
        const price = Number(product.productPrice);
        const total = price * qty;
        const base = total / 1.18;
        const gst = total - base;
        

        taxableSubtotal += base;
        totalTax += gst;

        rows.push([
          product.productName,
          qty,
          `₹${price.toFixed(2)}`,
          `₹${base.toFixed(2)}`,
         
          `₹${total.toFixed(2)}`
        ]);
      }

      const table = {
        headers: [
          "Item",
          "Qty",
          "Price",
          "Base",
         
          "Total"
        ],
        rows: rows
      };

      await doc.table(table);

      doc.moveDown();

    
      doc
        .font("Helvetica")
        .text(`Taxable Subtotal: ₹${taxableSubtotal.toFixed(2)}`, {
          align: "right",
        })
        .text(`Total Tax (GST 18%): ₹${totalTax.toFixed(2)}`, {
          align: "right",
        })
        .text(`Shipping: FREE`, {
          align: "right",
        })
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(`Grand Total: ₹${Number(order.totalAmount).toFixed(2)}`, {
          align: "right",
        });

      doc.moveDown(2);

     
      doc
        .font("Helvetica")
        .fontSize(11)
        .text("Thank you for shopping with Decathlon!", {
          align: "center",
        });

      doc.end();

    } catch (err) {
      reject(err);
    }
  });
};
/*const GenerateBill = async (email, status, orderId,productName="",productPrice,quantity, paymentId,totalAmount) => {
  try {
    await sgMail.send({
      to: email,
      from: process.env.EMAIL_USER,
      subject: `Payment Receipt`,
      html: `
        <h2>Invoice</h2>
      <p>Your order <b>${orderId}</b> status is now:</p>
        <h3>${status}</h3>
        <p>with the payment Id of <b> ${paymentId}</b></p>
        <p>Order ID: ${orderId}</p>
        <p>Find your invoice attached </p>
        <table>
        <thead>
        <tr>
        <th>Product Name</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total</th>
        </tr>
        </thead>
        <tr>
        <td>${productName}</td>
        <td>${productPrice}</td>
         <td>${quantity}</td>
        <td>${productPrice*quantity}</td>

        </tr>
        </table>
        <p>Total Amount: ${totalAmount}</p>
        <p>Thank you for shopping with us.</p>
      `
    });
  } catch (err) {
    console.log("Email error:", err.response?.body || err);
  }
};*/

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Decathlon',
    format: async (req, file) => 'jpeg', 
    public_id: (req, file) => file.fieldname+'-'+Date.now(),
  },
});
/*const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');},
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
})*/
const upload=multer({storage:storage});
app.post('/products', upload.single('file'), async (req, res) => {
  try {
    const product = new ProductModel({
      productName: req.body.productName,
      productPrice: req.body.productPrice,
      productCategory: req.body.productCategory,
      productDescription: req.body.productDescription,
      file: req.file.path   
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
app.put('/products/:id', upload.single('file'), async (req, res) => {
  try {
    const updatedProduct = {
    productName: req.body.productName,                      //updating api
    productPrice: req.body.productPrice,
    productCategory: req.body.productCategory,
    productDescription: req.body.productDescription
    }
    if(req.file){
      updatedProduct.file = req.file.path
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

app.post('/get-cart-items',authMiddleware, async (req, res) => {
  try {
    const { productIds } = req.body;
    const products = await ProductModel.find({ _id: { $in: productIds } });
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { products } = req.body; 
    // products = [{productId, quantity}]
    let subtotal = 0;
    for (let item of products) {
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      subtotal += Number(product.productPrice) * Number(item.quantity);
    }
    const gst = subtotal * 0.18;   // 18%
    const finalAmount = subtotal + gst;
    const options = {
      amount: Math.round(finalAmount * 100), // paisa
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ razorpayOrder,subtotal,gst,finalAmount});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Payment order failed" });
  }
});

app.post('/orders', authMiddleware, async (req, res) => {
  try {
    const { products, totalAmount, addressId, paymentMethod, paymentId } = req.body;
    const address = await AddressModel.findById(addressId);
    if (!address) {
      return res.status(400).json({ error: "Address not found" });
    }
    const order = new OrderModel({
      userId: req.user.id,
      email:req.user.email,
      products: products.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        status: "Placed"
      })),
      totalAmount,
      addressId,
      paymentMethod,
      paymentId: paymentId || "",
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
    const user = await UserModel.findById(req.user.id);
  try {
  const pdfBuffer = await generateInvoicePDF(order);
  await sendOrderEmail(user.email, "PLACED",order, pdfBuffer);
} catch (mailErr) {
  console.log("EMAIL/PDF ERROR:", mailErr);
}
    await CartModel.updateOne(
      { userId: req.user.id },
      { $set: { items: [] } }
    );
    res.json({success: true,message: "Order placed successfully"});
  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json({
      error: "Order failed"
    });
  }
});


app.put("/orders/cancel-item/:orderId/:productId", authMiddleware, async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.products = order.products.map(p => {
  if (p.productId.toString() === productId) {
    return { ...p.toObject(), status: "Cancelled" };
  }
  return p;
});
    await order.save();
    const user = await UserModel.findById(order.userId); 
   await sendOrderEmail(user.email, "Cancelled", order); 
    res.json({ success: true, message: "Item cancelled" });
  } catch (err) {
    res.status(500).json({ error: "Cancel failed" });
  }
});
app.get('/users', async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
});

app.get("/admin/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find()
    
      .sort({ date: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Fetching orders failed" });
  }
});

app.put("/admin/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.status = status;
    await order.save();
    const user = await UserModel.findById(order.userId);
    await sendOrderEmail(user.email, status, order);
    res.json({ success: true, message: "Status updated + email sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Update failed" });
  }
});
/*
app.put("/orders/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    order.status = "Cancelled";
    await order.save();
    const user = await UserModel.findById(order.userId);
    await sendOrderEmail(user.email, "Cancelled", order._id);
    res.json({ success: true, message: "Order cancelled + email sent" });
  } catch (err) {
    res.status(500).json({ error: "Cancel failed" });
  }
});
*/
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
app.put("/admin/orders/item/:orderId/:productId", async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const { status } = req.body;
   const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.products = order.products.map(p => {
    if (p.productId.toString() === productId) {
        return { ...p.toObject(), status };
      }
      return p;
    });
    await order.save();
    const user = await UserModel.findById(order.userId);
  await sendOrderEmail(user.email, status, order);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});
/*app.get("/products/ordered", authMiddleware, async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.user.id });
    const productIds = orders.flatMap(order => order.products.map(p => p.productId));
    const products = await ProductModel.find({ _id: { $in: productIds }});
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Fetching ordered products failed" });
  }
});*/

app.get("/products/:id", authMiddleware, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Fetching products failed" });
  }
});











/*
app.put("/orders/cancel/:id", authMiddleware, async (req, res) => {
  try {
    await OrderModel.findByIdAndUpdate(req.params.id, {
      status: "Cancelled"
    });
    res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    res.status(500).json({ error: "Cancel failed" });
  }
});*/

/*app.delete("/orders/:id", authMiddleware, async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});*/



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});