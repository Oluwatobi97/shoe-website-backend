import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

app.post("/api/orders", async (req, res) => {
  try {
    const { product, quantity, total, customer, phone } = req.body;
    console.log("Order received:", {
      product,
      quantity,
      total,
      customer,
      phone,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Leather Store" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "🛒 New Order Received",
      html: `
        <h2>New Order</h2>
        <p><strong>Product:</strong> ${product}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total:</strong> ₦${total}</p>
        <hr/>
        <p><strong>Name:</strong> ${customer}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    });

    return res.json({ success: true, message: "Order sent successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
