import nodemailer from "nodemailer";

export const sendOrderEmail = async (req, res) => {
  try {
    const { product, quantity, total, customer, phone } = req.body;

    // create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // email content
    const mailOptions = {
      from: `"Leather Store" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "🛒 New Order Received",
      html: `
        <h2>New Customer Order</h2>

        <p><strong>Product:</strong> ${product}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total:</strong> ₦${total}</p>

        <hr/>

        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${customer}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Order email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
