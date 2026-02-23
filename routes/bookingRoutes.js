const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Booking routes
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.get('/user/:userId', bookingController.getUserBookings);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
