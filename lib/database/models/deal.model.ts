import { Document, Schema, model, models } from "mongoose";

export interface IDeal extends Document {
  _id: string;
  emoji: string;
  name: string;
  original: string;
  price: string;
  off: string;
  color: string;
  order: number;
  createdAt: Date;
}

const DealSchema = new Schema({
  emoji: { type: String, required: true },
  name: { type: String, required: true },
  original: { type: String, required: true },
  price: { type: String, required: true },
  off: { type: String, required: true },
  color: { type: String, default: 'bg-primary/10 text-primary' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Deal = models.Deal || model("Deal", DealSchema);

export default Deal;
