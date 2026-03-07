import mongoose, { type Model, Schema, type Document, type Types } from 'mongoose';

export interface IBooking extends Document {
  userId: Types.ObjectId;
  serviceName: string;
  serviceType?: string;
  stylist?: string;
  date: Date;
  time: string;
  duration?: number;
  price?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  serviceType: {
    type: String
  },
  stylist: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number
  },
  price: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = (mongoose.models.Booking as Model<IBooking>) || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;