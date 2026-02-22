import { Document, model, models, Schema, Types } from "mongoose";

export interface IEvent extends Document{
    _id: Types.ObjectId;
    title: string;
    description?: string;
    imageUrl: string;
    price: string;
    organizer: {_id: string, firstName:string, lastName:string};
}

const EventSchema = new Schema({
    title: {type:String, required:true},    
    description: {type:String},
    imageUrl: {type: String, required:true},
    price:{type:String},
    organizer: {type: Schema.Types.ObjectId, ref: 'User'}
})

//To Query Faster using indexes of MongoDB
EventSchema.index({ createdAt: -1 });
EventSchema.index({ organizer: 1 });

const Event = models.Event || model('Event', EventSchema);

export default Event;