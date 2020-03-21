import mongoose from 'mongoose';

const NotificationsShema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    user: {
      type: Number,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notifications', NotificationsShema);
