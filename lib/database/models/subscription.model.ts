import { Document, model, models, Schema, Types } from "mongoose";

export interface ISubscription extends Document{
    _id: Types.ObjectId;
    title: string;
    description?: string;
    imageUrl: string;
    price: string;
    organizer: {_id: string, firstName:string, lastName:string};
    averageRating?: number;
    reviewCount?: number;
}

const SubscriptionSchema = new Schema({
    title: {type:String, required:true},    
    description: {type:String},
    imageUrl: {type: String, required:true},
    price:{type:String},
    organizer: {type: Schema.Types.ObjectId, ref: 'User'},
    averageRating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 }
})

//To Query Faster using indexes of MongoDB
SubscriptionSchema.index({ createdAt: -1 });
SubscriptionSchema.index({ organizer: 1 });

if (models.Subscription) {
  delete models.Subscription;
}

const Subscription = model('Subscription', SubscriptionSchema);

export default Subscription;