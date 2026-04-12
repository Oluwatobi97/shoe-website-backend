const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Resend } = require("resend");

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();

app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
  }),
);
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

app.post("/orders", async (req, res) => {  // ✅ correct
  try {
    const { product, quantity, total, customer, phone } = req.body;
    console.log("Order received:", {
      product,
      quantity,
      total,
      customer,
      phone,
    });

    // Send email using Resend
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.OWNER_EMAIL,  // ✅ correct
      subject: "New Shoe Order!",
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
