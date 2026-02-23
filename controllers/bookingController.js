const Booking = require('../models/Booking');

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'firstName lastName email');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, serviceName, serviceType, stylist, date, time, duration, price, notes } = req.body;
    
    const booking = new Booking({
      userId,
      serviceName,
      serviceType,
      stylist,
      date,
      time,
      duration,
      price,
      notes,
    });
    
    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId', 'firstName lastName email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
