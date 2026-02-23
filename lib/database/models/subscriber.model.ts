import { Document, model, models, Schema } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
}

const SubscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

SubscriberSchema.index({ subscribedAt: -1 });

const Subscriber = models.Subscriber || model("Subscriber", SubscriberSchema);

export default Subscriber;
