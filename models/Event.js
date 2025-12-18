import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    page: { type: String, required: true },
    event: { type: String, required: true },
    time: { type: Date, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
