const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./path-to-your-service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Webhook Endpoint
app.post('/paypal-webhook', (req, res) => {
  const webhookEvent = req.body;

  if (webhookEvent.event_type === 'PAYMENT.SALE.COMPLETED') {
    const quoteId = webhookEvent.resource.custom; // Extract custom field (quoteId)
    updateQuoteStatus(quoteId, 'Payment Complete');
  }

  res.status(200).send('Webhook processed successfully.');
});

async function updateQuoteStatus(quoteId, status) {
  try {
    const quoteDocRef = db.collection('quotes').doc(quoteId);
    await quoteDocRef.update({ status });
    console.log(`Quote ${quoteId} updated to status: ${status}`);
  } catch (error) {
    console.error('Error updating quote status:', error);
  }
}

app.listen(3000, () => console.log('Server running on port 3000'));
