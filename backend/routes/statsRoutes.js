const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
const ordersFilePath = path.join(__dirname, '..', 'data', 'orders.json');

function readJSON(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

router.get('/', (req, res) => {
  try {
    const products = readJSON(productsFilePath);
    const orders = readJSON(ordersFilePath);

    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    res.json({
      success: true,
      stats: {
        totalSales,
        totalOrders,
        totalProducts,
        avgOrderValue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
