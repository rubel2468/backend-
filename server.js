import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
// import addressRouter from "./Routes/address.js";
import { Stripe } from 'stripe';

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: "https://client-ecommarce-22.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ... (rest of the code remains the same)



// home testing route

// user Router




app.get("/",(req,res)=>{
  res.send("server is running")
})
app.use("/api/user", userRouter);

// product Router
app.use("/api/product", productRouter);

// cart Router
app.use("/api/cart", cartRouter);

// address Router
// app.use("/api/address", addressRouter);



// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect("mongodb://127.0.0.1:27017/e-comarce");
//     console.log("Connected to MongoDB");
//   } catch {
//     console.error("Error connecting to the database");
//   }
// };

// connectDB();
mongoose.connect("mongodb://127.0.0.1:27017/e-comarce", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



const stripe = new Stripe('sk_test_51Ob4rpFgYk7v8C4gIKDVqtRfSRQSAdNbwZxeUQQOpNzDmZh39U2RNBX101wXjHBz8yVu4QuwyE9mwt86T1u9D9UL00WGQExVZn');

app.post('/api/create-checkout-session', async (req, res) => {
  const {  cart } = req.body;

console.log(cart)
  if ( !cart) {
    
    return res.status(400).json({ error: 'Products is required' });
  
  }

  const lineItems = cart.map((product)=>({
    price_data:{
        currency:"inr",
        product_data:{
            name:product.title,
            images:[product.imgSrc]
        },
        unit_amount:product.price * 100,
    },
    quantity:product.qty
}));

  try {
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items:lineItems,
      mode:"payment",
      success_url:"https://client-ecommarce-22.vercel.app/sucess",
      cancel_url:"https://client-ecommarce-22.vercel.app/cancel",
  });

  res.json({id:session.id})
  }
   catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

const port = 2000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
