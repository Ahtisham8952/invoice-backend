const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Redirect short URLs to invoice view
router.get('/:invoiceNumber', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Send an HTML page that automatically redirects
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="refresh" content="0;url=${frontendUrl}/view/${req.params.invoiceNumber}">
        </head>
        <body>
          <script>
            window.location.href = '${frontendUrl}/view/${req.params.invoiceNumber}';
          </script>
          Redirecting to invoice...
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
