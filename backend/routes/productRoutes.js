const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

function readProductsJSON() {
  try {
    const raw = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeProductsJSON(data) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing products.json:', err);
    return false;
  }
}

router.get('/', (req, res) => {
  const products = readProductsJSON();
  res.json({
    success: true,
    count: products.length,
    products
  });
});

router.post('/', (req, res) => {
  const products = readProductsJSON();
  const newProduct = {
    id: Date.now(),
    handle: req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `item-${Date.now()}`,
    title: req.body.title || 'Sacred Apparel',
    sanskritTitle: req.body.sanskritTitle || req.body.title || 'ब्रह्मन्',
    subtitle: req.body.category || 'Oversized T-Shirts',
    category: req.body.category || 'Oversized T-Shirts',
    price: Number(req.body.price) || 1800,
    compareAtPrice: Number(req.body.compareAtPrice) || (Number(req.body.price) * 1.3),
    discountPercent: req.body.discountPercent || 25,
    primaryColor: {
      name: req.body.colorName || 'Black',
      hex: req.body.colorHex || '#111113',
      cardBg: req.body.colorHex || '#111113'
    },
    colors: [
      { name: req.body.colorName || 'Black', hex: req.body.colorHex || '#111113' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    rating: 5.0,
    reviewsCount: 1,
    images: req.body.image ? [req.body.image] : ['https://cdn.shopify.com/s/files/1/0665/6638/9834/files/Aghori_ubg.png?v=1791202359'],
    badge: 'NEW DROP',
    gsm: req.body.gsm || '280 GSM Super Combed Cotton',
    fit: 'Oversized Boxy Silhouette with Drop Shoulders',
    philosophyQuote: req.body.philosophy ? `"${req.body.philosophy}"` : '"Wear your dharma."',
    philosophyConcept: 'Deep philosophical roots woven into high-tier Indian streetwear.',
    description: `<p>${req.body.title || 'Sacred streetwear piece'}</p>`,
    details: [
      '100% Super Combed Compact Cotton',
      'Bio-washed & Silicon-softened',
      'High-Density Screen + Puff Print',
      'Pre-shrunk fabric'
    ],
    dropExpiresAt: req.body.dropExpiresAt || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    dropStatus: 'active',
    remainingUnits: Number(req.body.remainingUnits) || 50,
    totalDropUnits: Number(req.body.totalDropUnits) || 50
  };

  products.unshift(newProduct);
  writeProductsJSON(products);

  res.status(201).json({
    success: true,
    message: 'Product & Launch Drop added successfully!',
    product: newProduct
  });
});

router.put('/:id/drop-expiry', (req, res) => {
  const products = readProductsJSON();
  const prodId = Number(req.params.id) || req.params.id;
  const index = products.findIndex(p => p.id == prodId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const { dropExpiresAt, remainingUnits, totalDropUnits } = req.body;

  if (dropExpiresAt) products[index].dropExpiresAt = dropExpiresAt;
  if (remainingUnits !== undefined) products[index].remainingUnits = Number(remainingUnits);
  if (totalDropUnits !== undefined) products[index].totalDropUnits = Number(totalDropUnits);

  const isExpired = new Date(products[index].dropExpiresAt).getTime() < Date.now();
  products[index].dropStatus = (isExpired || products[index].remainingUnits <= 0) ? 'expired' : 'active';

  writeProductsJSON(products);

  res.json({
    success: true,
    message: 'Launch Drop updated successfully!',
    product: products[index]
  });
});

router.put('/:id/remaining-units', (req, res) => {
  const products = readProductsJSON();
  const prodId = Number(req.params.id) || req.params.id;
  const index = products.findIndex(p => p.id == prodId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const { delta, exact } = req.body;
  if (exact !== undefined) {
    products[index].remainingUnits = Number(exact);
  } else if (delta !== undefined) {
    products[index].remainingUnits = Math.max(0, (products[index].remainingUnits || 0) + Number(delta));
  }

  if (products[index].remainingUnits <= 0) {
    products[index].dropStatus = 'expired';
  }

  writeProductsJSON(products);

  res.json({
    success: true,
    remainingUnits: products[index].remainingUnits,
    product: products[index]
  });
});

router.put('/:id', (req, res) => {
  const products = readProductsJSON();
  const prodId = Number(req.params.id) || req.params.id;
  const index = products.findIndex(p => p.id == prodId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body };
  writeProductsJSON(products);

  res.json({
    success: true,
    message: 'Product updated successfully',
    product: products[index]
  });
});

router.delete('/:id', (req, res) => {
  let products = readProductsJSON();
  const prodId = Number(req.params.id) || req.params.id;
  products = products.filter(p => p.id != prodId);
  writeProductsJSON(products);

  res.json({
    success: true,
    message: 'Product removed'
  });
});

module.exports = router;
