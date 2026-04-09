const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Resend } = require("resend");

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

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

app.post("/orders", async (req, res) => {
  try {
    const { product, quantity, total, customer, phone, address } = req.body;
    console.log("Order received:", {
      product,
      quantity,
      total,
      customer,
      phone,
      address,
    });

    // Send email notification via Resend
    try {
      await resend.emails.send({
        from: "Leather Store <onboarding@resend.dev>",
        to: process.env.OWNER_EMAIL,
        subject: "🛒 New Order Received",
        html: `
          <h2>New Order</h2>
          <p><strong>Product:</strong> ${product}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Total:</strong> ₦${total}</p>
          <p><strong>Delivery Address:</strong> ${address}</p>
          <hr/>
          <p><strong>Name:</strong> ${customer}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        `,
      });
      console.log("Email sent successfully for order:", product);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the order submission if email fails
    }

    // Return success to frontend regardless of email status
    return res.json({ success: true, message: "Order sent successfully! We'll contact you soon." });
  } catch (error) {
    console.error("Order processing error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to process order" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
