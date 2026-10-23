const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const chatsFilePath = path.join(__dirname, '..', 'data', 'chats.json');

function readChatsJSON() {
  try {
    const raw = fs.readFileSync(chatsFilePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeChatsJSON(data) {
  try {
    fs.writeFileSync(chatsFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing chats.json:', err);
    return false;
  }
}

router.get('/', (req, res) => {
  const chats = readChatsJSON();
  res.json({
    success: true,
    count: chats.length,
    chats
  });
});

router.get('/:id', (req, res) => {
  const chats = readChatsJSON();
  const session = chats.find(c => c.id === req.params.id);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Chat session not found' });
  }
  res.json({ success: true, session });
});

router.post('/message', (req, res) => {
  let chats = readChatsJSON();
  const { sessionId, sender, senderName, text, customerName, customerEmail, customerPhone } = req.body;

  if (!sessionId || !text) {
    return res.status(400).json({ success: false, message: 'sessionId and text are required' });
  }

  let session = chats.find(c => c.id === sessionId);
  const newMsg = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    sender: sender || 'customer',
    senderName: senderName || (sender === 'admin' ? 'Support Team (Admin)' : (session?.customerName || customerName || 'Customer')),
    text,
    timestamp: new Date().toISOString()
  };

  if (!session) {
    session = {
      id: sessionId,
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || 'customer@gmail.com',
      customerPhone: customerPhone || '+91 98765 43210',
      status: 'active',
      unreadAdmin: sender === 'customer' ? 1 : 0,
      lastUpdated: new Date().toISOString(),
      messages: [newMsg]
    };
    chats.unshift(session);
  } else {
    session.messages.push(newMsg);
    session.lastUpdated = new Date().toISOString();
    if (sender === 'customer') {
      session.unreadAdmin = (session.unreadAdmin || 0) + 1;
    }
    if (customerName) session.customerName = customerName;
    if (customerEmail) session.customerEmail = customerEmail;
    if (customerPhone) session.customerPhone = customerPhone;
    chats = [session, ...chats.filter(c => c.id !== sessionId)];
  }

  writeChatsJSON(chats);
  res.json({ success: true, message: newMsg, session });
});

router.put('/:id/read', (req, res) => {
  const chats = readChatsJSON();
  const session = chats.find(c => c.id === req.params.id);
  if (session) {
    session.unreadAdmin = 0;
    writeChatsJSON(chats);
  }
  res.json({ success: true, session });
});

router.delete('/:id', (req, res) => {
  let chats = readChatsJSON();
  chats = chats.filter(c => c.id !== req.params.id);
  writeChatsJSON(chats);
  res.json({ success: true, message: 'Chat removed' });
});

module.exports = router;
