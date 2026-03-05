import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { product, quantity, total, customer, phone } = req.body;

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

    res.status(200).json({ message: "Order sent successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email failed ❌" });
  }
}
