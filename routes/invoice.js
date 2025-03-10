const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const shortid = require('shortid');

// Create new invoice
router.post('/', async (req, res) => {
  try {
    const invoiceNumber = shortid.generate();
    
    const invoice = new Invoice({
      invoiceNumber,
      ...req.body
    });

    await invoice.save();
    res.status(201).json({ invoice });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single invoice by invoice number
router.get('/:invoiceNumber', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
