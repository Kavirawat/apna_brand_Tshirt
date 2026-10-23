const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

function isMongoReady() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

function readUsersJSON() {
  try {
    const raw = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsersJSON(data) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}

router.post('/signup', async (req, res, next) => {
  try {
    const { username, email, password, name, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email and password are all required.'
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (isMongoReady()) {
      const existingUsername = await User.findOne({ username: cleanUsername });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'This username is already taken. Please choose another one.'
        });
      }

      const existingEmail = await User.findOne({ email: cleanEmail });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'This email is already registered. Please sign in instead.'
        });
      }

      const newUser = new User({
        username: cleanUsername,
        email: cleanEmail,
        password,
        name: name ? name.trim() : cleanUsername,
        phone: phone ? phone.trim() : ''
      });

      await newUser.save();

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name || newUser.username,
          phone: newUser.phone,
          deliveryAddress: newUser.deliveryAddress || {}
        }
      });
    }

    const users = readUsersJSON();
    if (users.some(u => u.username === cleanUsername)) {
      return res.status(400).json({
        success: false,
        message: 'This username is already taken. Please choose another one.'
      });
    }

    if (users.some(u => u.email === cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please sign in instead.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `USR-${Date.now()}`,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      name: name ? name.trim() : cleanUsername,
      phone: phone ? phone.trim() : '',
      deliveryAddress: {},
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsersJSON(users);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        deliveryAddress: newUser.deliveryAddress
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your username or email and password.'
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    if (isMongoReady()) {
      const user = await User.findOne({
        $or: [
          { username: cleanIdentifier },
          { email: cleanIdentifier }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this username or email.'
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect password. Please verify and try again.'
        });
      }

      return res.json({
        success: true,
        message: `Welcome back, ${user.name || user.username}!`,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name || user.username,
          phone: user.phone || '',
          deliveryAddress: user.deliveryAddress || {}
        }
      });
    }

    const users = readUsersJSON();
    const user = users.find(u => u.username === cleanIdentifier || u.email === cleanIdentifier);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this username or email.'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password. Please verify and try again.'
      });
    }

    return res.json({
      success: true,
      message: `Welcome back, ${user.name || user.username}!`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name || user.username,
        phone: user.phone || '',
        deliveryAddress: user.deliveryAddress || {}
      }
    });
  } catch (error) {
    next(error);
  }
});

router.put('/address', async (req, res, next) => {
  try {
    const { identifier, street, city, state, pincode, phone, landmark } = req.body;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'User identifier (username or email) is required.'
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    if (isMongoReady()) {
      const user = await User.findOne({
        $or: [
          { username: cleanIdentifier },
          { email: cleanIdentifier }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found to update address.'
        });
      }

      user.deliveryAddress = {
        street: street !== undefined ? street.trim() : (user.deliveryAddress?.street || ''),
        city: city !== undefined ? city.trim() : (user.deliveryAddress?.city || ''),
        state: state !== undefined ? state.trim() : (user.deliveryAddress?.state || ''),
        pincode: pincode !== undefined ? pincode.trim() : (user.deliveryAddress?.pincode || ''),
        phone: phone !== undefined ? phone.trim() : (user.deliveryAddress?.phone || user.phone || ''),
        landmark: landmark !== undefined ? landmark.trim() : (user.deliveryAddress?.landmark || '')
      };

      if (phone && !user.phone) {
        user.phone = phone.trim();
      }

      await user.save();

      return res.json({
        success: true,
        message: 'Delivery location updated successfully!',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name || user.username,
          phone: user.phone || '',
          deliveryAddress: user.deliveryAddress
        }
      });
    }

    const users = readUsersJSON();
    const idx = users.findIndex(u => u.username === cleanIdentifier || u.email === cleanIdentifier);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found to update address.'
      });
    }

    const u = users[idx];
    u.deliveryAddress = {
      street: street !== undefined ? street.trim() : (u.deliveryAddress?.street || ''),
      city: city !== undefined ? city.trim() : (u.deliveryAddress?.city || ''),
      state: state !== undefined ? state.trim() : (u.deliveryAddress?.state || ''),
      pincode: pincode !== undefined ? pincode.trim() : (u.deliveryAddress?.pincode || ''),
      phone: phone !== undefined ? phone.trim() : (u.deliveryAddress?.phone || u.phone || ''),
      landmark: landmark !== undefined ? landmark.trim() : (u.deliveryAddress?.landmark || '')
    };

    if (phone && !u.phone) {
      u.phone = phone.trim();
    }

    writeUsersJSON(users);

    return res.json({
      success: true,
      message: 'Delivery location updated successfully!',
      user: {
        id: u.id,
        username: u.username,
        email: u.email,
        name: u.name || u.username,
        phone: u.phone || '',
        deliveryAddress: u.deliveryAddress
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/user/:identifier', async (req, res, next) => {
  try {
    const cleanIdentifier = req.params.identifier.trim().toLowerCase();

    if (isMongoReady()) {
      const user = await User.findOne({
        $or: [
          { username: cleanIdentifier },
          { email: cleanIdentifier }
        ]
      }).select('-password');

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.json({ success: true, user });
    }

    const users = readUsersJSON();
    const user = users.find(u => u.username === cleanIdentifier || u.email === cleanIdentifier);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
