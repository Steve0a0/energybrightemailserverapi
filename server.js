const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or another email provider
  auth: {
    user: "domesticfixesie@gmail.com", // Replace with your email
    pass: "imgb ueat lzix cteb", // Replace with your email app-specific password
  },
});

// API Endpoint to send emails
app.post("/sendEmail", async (req, res) => {
  const { customerEmail, handymanEmail, customerDetails, handymanDetails } = req.body;

  if (!customerEmail || !handymanEmail) {
    return res.status(400).json({ error: "Missing email addresses" });
  }

  try {
    // Extract details
    const { name: customerName, phoneNumber: customerPhoneNumber, serviceType, quoteAmount,jobDescription} = customerDetails;
    const finalQuoteAmount = quoteAmount || "N/A";
    const { name: handymanName } = handymanDetails;

    // Email to the customer
    const customerMailOptions = {
      from: "domesticfixesie@gmail.com",
      to: customerEmail,
      subject: "Your Booking with DomesticFixes is Confirmed!",
      text: `Dear ${customerName},

Thank you for choosing DomesticFixes! We are pleased to confirm that your booking has been successfully processed.

Here are the details of your service appointment:

Handyman Details:
Name: ${handymanName}
Contact: ${handymanEmail}

Service Details:
Service Type: ${serviceType}
Quote Amount: €${finalQuoteAmount}

Your Details:
Name: ${customerName}
Contact: ${customerPhoneNumber}

We recommend reaching out to your assigned handyman directly if you have specific requests or need to provide additional information. Your handyman will be well-prepared to meet your requirements on the scheduled day.

Should you have any questions or if there’s anything further we can assist you with, please don't hesitate to contact us at domesticfixesie@gmail.com.

We appreciate your trust in DomesticFixes and look forward to providing you with outstanding service!

Warm regards,  
The DomesticFixes Team`,
    };

    // Email to the handyman
    const handymanMailOptions = {
      from: "domesticfixesie@gmail.com",
      to: handymanEmail,
      subject: "New Service Request Confirmed!",
      text: `Dear ${handymanName},

We’re pleased to inform you that your quote for €${quoteAmount} has been accepted by the customer. Here are the details of the service request:

Customer Details:
Name: ${customerName}
Contact: ${customerPhoneNumber}
Request Information: ${jobDescription}

Service Details:
Service Type: ${serviceType}
Scheduled Amount: €${finalQuoteAmount}

Please make any necessary arrangements and prepare to provide exceptional service to our valued customer. If you have any questions or need additional details, feel free to reach out to us.

Thank you for being a trusted partner with DomesticFixes. We look forward to helping you deliver excellent service.

Best regards,  
The DomesticFixes Team`,
    };

    // Send emails
    await transporter.sendMail(customerMailOptions);
    await transporter.sendMail(handymanMailOptions);

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
