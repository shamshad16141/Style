import type { Request, Response } from 'express';
import Booking from '../models/Booking';

export const getAllBookings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find().populate('userId', 'firstName lastName email');
    res.status(200).json(bookings);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, serviceName, serviceType, stylist, date, time, duration, price, notes } = req.body as Record<string, unknown>;

    const booking = new Booking({
      userId,
      serviceName,
      serviceType,
      stylist,
      date,
      time,
      duration,
      price,
      notes
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }
    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId', 'firstName lastName email');
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }
    res.status(200).json(booking);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};