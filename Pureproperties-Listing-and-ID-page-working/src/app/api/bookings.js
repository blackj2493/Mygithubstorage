// app/api/bookings.js
const express = require('express');
const router = express.Router();

const bookings = [];

router.post('/', (req, res) => {
  const { property, date, time } = req.body;
  const newBooking = { id: bookings.length + 1, property, date, time, status: 'pending' };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

router.get('/', (req, res) => {
  res.json(bookings);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = bookings.find((b) => b.id === parseInt(id));
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  booking.status = status;
  res.json(booking);
});

module.exports = router;