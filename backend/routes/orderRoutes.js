const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Order = require('../models/Order');

const ordersFilePath = path.join(__dirname, '..', 'data', 'orders.json');

function readOrdersJSON() {
  try {
    const raw = fs.readFileSync(ordersFilePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeOrdersJSON(data) {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing orders.json:', err);
  }
}

function buildTrackingStages(status, createdAt, currentLocation, transitNote) {
  const orderDate = new Date(createdAt || Date.now());
  const isPending = status === 'Pending';

  const stages = [
    {
      stage: isPending ? 'Order Placed (Pending Confirmation)' : 'Order Confirmed',
      description: isPending
        ? (transitNote || 'Order placed by customer, pending admin confirmation.')
        : (transitNote && status === 'Confirmed' ? transitNote : 'Sacred order received and confirmed by Brahmman Studio.'),
      time: orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      completed: true,
      current: isPending || status === 'Confirmed'
    },
    {
      stage: 'Processing & Quality Check',
      description: status === 'Processing' && transitNote ? transitNote : '280-340 GSM heavy combed cotton garment inspected & packed.',
      time: new Date(orderDate.getTime() + 12 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      completed: ['Processing', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'].includes(status),
      current: status === 'Processing'
    },
    {
      stage: 'Dispatched / Sent Out',
      description: status === 'Dispatched'
        ? (transitNote || `Package dispatched from ${currentLocation || 'Fulfillment Center'}.`)
        : 'Package handed over to courier for priority delivery.',
      time: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      completed: ['Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'].includes(status),
      current: status === 'Dispatched'
    },
    {
      stage: 'In Transit (On the Way)',
      description: status === 'In Transit'
        ? (`Current Hub: ${currentLocation || 'Regional Logistics Facility'}. ${transitNote || ''}`)
        : 'Shipment in transit moving towards destination city hub.',
      time: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      completed: ['In Transit', 'Out for Delivery', 'Delivered'].includes(status),
      current: status === 'In Transit'
    },
    {
      stage: 'Out for Delivery',
      description: status === 'Out for Delivery'
        ? (`Courier agent out for doorstep delivery. ${currentLocation ? `Area: ${currentLocation}.` : ''} ${transitNote || ''}`)
        : 'Courier agent is on the way to your delivery address.',
      time: new Date(orderDate.getTime() + 72 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      completed: ['Out for Delivery', 'Delivered'].includes(status),
      current: status === 'Out for Delivery'
    },
    {
      stage: 'Delivered',
      description: status === 'Delivered'
        ? (transitNote || 'Order safely delivered to recipient.')
        : 'Order successfully delivered. May your dharma shine.',
      time: new Date(orderDate.getTime() + 80 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      completed: status === 'Delivered',
      current: status === 'Delivered'
    }
  ];
  return stages;
}

router.get('/', async (req, res) => {
  try {
    let mongoOrders = [];
    try {
      mongoOrders = await Order.find().sort({ createdAt: -1 });
    } catch {}

    const jsonOrders = readOrdersJSON();

    const merged = jsonOrders.map(jo => {
      const mo = mongoOrders.find(m => m.orderId === jo.id || m.id === jo.id);
      return {
        id: jo.id,
        orderId: jo.id,
        customer: jo.customer,
        items: jo.items,
        total: jo.total,
        status: mo?.status || jo.status || 'Pending',
        currentLocation: mo?.currentLocation || jo.currentLocation || 'Brahmman Central Hub, New Delhi',
        transitNote: mo?.transitNote || jo.transitNote || 'Order placed by customer, pending confirmation',
        courier: mo?.courier || jo.courier || {
          name: 'Bluedart Express',
          trackingNumber: `BD-8472910`,
          expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        },
        paymentMethod: jo.paymentMethod,
        createdAt: jo.createdAt
      };
    });

    res.json({
      success: true,
      count: merged.length,
      orders: merged
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/track/:query', async (req, res) => {
  try {
    const rawQuery = req.params.query.trim();
    if (!rawQuery) {
      return res.status(400).json({ success: false, message: 'Please provide an Order ID or Phone number' });
    }

    const cleanQuery = rawQuery.toUpperCase();
    const jsonOrders = readOrdersJSON();

    let foundOrder = null;
    try {
      foundOrder = await Order.findOne({
        $or: [
          { orderId: cleanQuery },
          { 'customer.phone': rawQuery },
          { 'customer.email': rawQuery.toLowerCase() }
        ]
      });
    } catch {}

    if (!foundOrder) {
      const match = jsonOrders.find(o =>
        (o.id && o.id.toUpperCase() === cleanQuery) ||
        (o.customer?.phone && o.customer.phone.includes(rawQuery)) ||
        (o.customer?.email && o.customer.email.toLowerCase() === rawQuery.toLowerCase())
      );
      if (match) {
        foundOrder = {
          orderId: match.id,
          id: match.id,
          customer: match.customer,
          items: match.items,
          total: match.total,
          status: match.status || 'Confirmed',
          currentLocation: match.currentLocation || 'Brahmman Central Fulfillment Hub, New Delhi',
          transitNote: match.transitNote || 'Order confirmed and registered in system',
          paymentMethod: match.paymentMethod || 'UPI',
          courier: match.courier || {
            name: 'Bluedart Express',
            trackingNumber: `BD-${Math.floor(1000000 + Math.random() * 9000000)}`,
            expectedDelivery: new Date(new Date(match.createdAt || Date.now()).getTime() + 3 * 24 * 60 * 60 * 1000)
          },
          createdAt: match.createdAt || new Date().toISOString()
        };
      }
    }

    if (!foundOrder) {
      return res.status(404).json({
        success: false,
        message: `No active order found for "${rawQuery}". Please check your Order ID (e.g. ORD-10821) or phone number.`
      });
    }

    const stages = buildTrackingStages(
      foundOrder.status,
      foundOrder.createdAt,
      foundOrder.currentLocation,
      foundOrder.transitNote
    );

    return res.json({
      success: true,
      order: {
        orderId: foundOrder.orderId || foundOrder.id,
        id: foundOrder.orderId || foundOrder.id,
        status: foundOrder.status || 'Confirmed',
        currentLocation: foundOrder.currentLocation || 'Brahmman Central Hub, New Delhi',
        transitNote: foundOrder.transitNote || '',
        customer: foundOrder.customer,
        items: foundOrder.items,
        total: foundOrder.total,
        paymentMethod: foundOrder.paymentMethod,
        courier: foundOrder.courier || {
          name: 'Bluedart Express',
          trackingNumber: `BD-8472910`,
          expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        },
        trackingStages: stages,
        createdAt: foundOrder.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/user/:identifier', async (req, res) => {
  try {
    const rawId = req.params.identifier.trim();
    if (!rawId) {
      return res.status(400).json({ success: false, message: 'Identifier required' });
    }
    const cleanId = rawId.toLowerCase();

    let mongoOrders = [];
    try {
      mongoOrders = await Order.find({
        $or: [
          { 'customer.email': cleanId },
          { 'customer.phone': rawId },
          { 'customer.name': new RegExp(`^${rawId}$`, 'i') }
        ]
      }).sort({ createdAt: -1 });
    } catch {}

    const jsonOrders = readOrdersJSON();
    const matchedJson = jsonOrders.filter(o =>
      (o.customer?.email && o.customer.email.toLowerCase() === cleanId) ||
      (o.customer?.phone && o.customer.phone === rawId) ||
      (o.customer?.name && o.customer.name.toLowerCase() === cleanId)
    );

    const map = new Map();
    mongoOrders.forEach(o => {
      const id = o.orderId || o.id;
      map.set(id, {
        id,
        orderId: id,
        customer: o.customer,
        items: o.items,
        total: o.total,
        status: o.status || 'Pending',
        currentLocation: o.currentLocation || 'Brahmman Central Hub, New Delhi',
        transitNote: o.transitNote || '',
        courier: o.courier,
        paymentMethod: o.paymentMethod || 'UPI',
        createdAt: o.createdAt
      });
    });

    matchedJson.forEach(jo => {
      const id = jo.id || jo.orderId;
      if (!map.has(id)) {
        map.set(id, jo);
      }
    });

    const userOrders = Array.from(map.values());

    return res.json({
      success: true,
      orders: userOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customer, items, total, paymentMethod } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer information and cart items are required'
      });
    }

    const generatedOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrderObj = {
      id: generatedOrderId,
      orderId: generatedOrderId,
      customer: {
        name: customer.name || 'Anonymous Seeker',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || ''
      },
      items,
      total: Number(total) || 0,
      status: 'Pending',
      currentLocation: 'Brahmman Central Fulfillment Hub, New Delhi',
      transitNote: 'Order placed by customer, pending admin confirmation.',
      paymentMethod: paymentMethod || 'UPI',
      courier: {
        name: 'Bluedart Express',
        trackingNumber: `BD-${Math.floor(1000000 + Math.random() * 9000000)}`,
        expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      createdAt: new Date().toISOString()
    };

    try {
      const mongoOrder = new Order({
        orderId: generatedOrderId,
        customer: newOrderObj.customer,
        items: newOrderObj.items,
        total: newOrderObj.total,
        status: 'Pending',
        currentLocation: newOrderObj.currentLocation,
        transitNote: newOrderObj.transitNote,
        paymentMethod: newOrderObj.paymentMethod,
        courier: newOrderObj.courier,
        createdAt: new Date()
      });
      await mongoOrder.save();
    } catch (err) {
      console.log('MongoDB order save note:', err.message);
    }

    const orders = readOrdersJSON();
    orders.unshift(newOrderObj);
    writeOrdersJSON(orders);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Awaiting confirmation.',
      orderId: generatedOrderId,
      order: newOrderObj
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/confirm', async (req, res) => {
  try {
    const orders = readOrdersJSON();
    const orderIndex = orders.findIndex(o => o.id === req.params.id || o.orderId === req.params.id);

    if (orderIndex === -1 && !req.params.id) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updatedNote = 'Order confirmed and registered in production queue.';
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'Confirmed';
      orders[orderIndex].transitNote = updatedNote;
      writeOrdersJSON(orders);
    }

    try {
      await Order.findOneAndUpdate(
        { $or: [{ orderId: req.params.id }, { id: req.params.id }] },
        {
          $set: {
            status: 'Confirmed',
            transitNote: updatedNote
          },
          $push: {
            trackingHistory: {
              status: 'Confirmed',
              location: 'Fulfillment Facility',
              description: updatedNote,
              timestamp: new Date()
            }
          }
        },
        { new: true }
      );
    } catch {}

    res.json({
      success: true,
      message: `Order ${req.params.id} confirmed successfully!`,
      order: orderIndex !== -1 ? orders[orderIndex] : { id: req.params.id, status: 'Confirmed' }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/tracking', async (req, res) => {
  try {
    const { status, currentLocation, transitNote, courierName, trackingNumber, expectedDelivery } = req.body;
    const orders = readOrdersJSON();
    const orderIndex = orders.findIndex(o => o.id === req.params.id || o.orderId === req.params.id);

    if (orderIndex === -1 && !req.params.id) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const currentOrder = orderIndex !== -1 ? orders[orderIndex] : {};
    const updatedData = {
      status: status || currentOrder.status || 'Confirmed',
      currentLocation: currentLocation !== undefined ? currentLocation : (currentOrder.currentLocation || ''),
      transitNote: transitNote !== undefined ? transitNote : (currentOrder.transitNote || ''),
      courier: {
        name: courierName || currentOrder.courier?.name || 'Bluedart Express',
        trackingNumber: trackingNumber || currentOrder.courier?.trackingNumber || `BD-${Math.floor(1000000 + Math.random() * 9000000)}`,
        expectedDelivery: expectedDelivery || currentOrder.courier?.expectedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    };

    if (orderIndex !== -1) {
      orders[orderIndex] = {
        ...orders[orderIndex],
        ...updatedData
      };
      writeOrdersJSON(orders);
    }

    try {
      await Order.findOneAndUpdate(
        { $or: [{ orderId: req.params.id }, { id: req.params.id }] },
        {
          $set: {
            status: updatedData.status,
            currentLocation: updatedData.currentLocation,
            transitNote: updatedData.transitNote,
            courier: updatedData.courier
          },
          $push: {
            trackingHistory: {
              status: updatedData.status,
              location: updatedData.currentLocation || 'Logistics Facility',
              description: updatedData.transitNote || `Status updated to ${updatedData.status}`,
              timestamp: new Date()
            }
          }
        },
        { new: true, upsert: false }
      );
    } catch (err) {
      console.error('Mongo tracking update err:', err.message);
    }

    res.json({
      success: true,
      message: `Order transit location & status updated successfully!`,
      order: orderIndex !== -1 ? orders[orderIndex] : { id: req.params.id, ...updatedData }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orders = readOrdersJSON();
    const orderIndex = orders.findIndex(o => o.id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    orders[orderIndex].status = status;
    writeOrdersJSON(orders);

    try {
      await Order.findOneAndUpdate(
        { orderId: req.params.id },
        { status },
        { new: true }
      );
    } catch {}

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: orders[orderIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
