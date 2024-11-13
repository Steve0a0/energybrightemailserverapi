const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Enable CORS for all routes


// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: "gmail", // or your preferred email service provider
    auth: {
        user: "stephenangelo4@gmail.com",
        pass: "wvve vhmj jpyc ozap" // Use an app-specific password if using Gmail
    }
});

// API route to accept the quote and send emails
app.post("/api/accept-quote", (req, res) => {
  const { customerEmail, handymanEmail, handymanName, quoteAmount } = req.body;

  console.log("Request Body:", req.body);  // Log to check incoming data
  console.log("Customer Email:", customerEmail);  // Verify customer email specifically

  // Mail options
  const mailOptionsCustomer = {
      from: "stephenangelo4@gmail.com",
      to: customerEmail,
      subject: "Quote Accepted - Booking Confirmation",
      text: `Hello,\n\nYour quote for ${handymanName} has been accepted for ${quoteAmount} EUR. You are now booked for the requested service.\n\nThank you!`
  };

  const mailOptionsHandyman = {
      from: "stephenangelo4@gmail.com",
      to: handymanEmail,
      subject: "New Booking Confirmation",
      text: `Hello ${handymanName},\n\nYour quote for ${quoteAmount} EUR has been accepted by the customer. Please proceed with the necessary arrangements.\n\nThank you!`
  };

  Promise.all([
      transporter.sendMail(mailOptionsCustomer),
      transporter.sendMail(mailOptionsHandyman)
  ])
  .then(() => {
      console.log("Emails sent successfully.");
      res.status(200).send("Emails sent successfully.");
  })
  .catch((error) => {
      console.error("Error sending emails:", error);
      res.status(500).send("Error sending emails.");
  });
});

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
