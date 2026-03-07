import { Router } from 'express';
import { createBooking, deleteBooking, getAllBookings, getBookingById, getUserBookings, updateBooking } from '../controllers/bookingController';

const router = Router();

router.get('/', getAllBookings);
router.get('/user/:userId', getUserBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;