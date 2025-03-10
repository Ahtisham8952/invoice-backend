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

    // Redirect directly instead of sending HTML
    res.redirect(`${frontendUrl}/view/${req.params.invoiceNumber}`);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
