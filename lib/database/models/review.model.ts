import { Document, Schema, model, models, Types } from "mongoose";

export interface IReview extends Document {
  _id: Types.ObjectId;
  subscription: Types.ObjectId | string;
  user: { _id: string; firstName: string; lastName: string; photo: string };
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema({
  subscription: { type: Schema.Types.ObjectId, ref: "Subscription", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

ReviewSchema.index({ subscription: 1, createdAt: -1 });

const Review = models.Review || model("Review", ReviewSchema);

export default Review;
