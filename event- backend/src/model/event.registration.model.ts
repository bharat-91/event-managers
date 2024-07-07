import mongoose, { Schema } from "mongoose";
import { EventRegistration } from "../interface";

const EventRegistrationSchema = new Schema<EventRegistration & Document>({
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    username: { type: Schema.Types.String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: Schema.Types.String, required: true, trim: true, lowercase: true },
    phoneNumber: { type: Schema.Types.String, trim: true},
    registrationDate: { type: Schema.Types.Date, required: true },
    ticketPrice:{type:Number, min:0, required:[true, "Please enter the Ticket Price"]}
});
export const EventRegistrationModel = mongoose.model<EventRegistration & Document>('EventRegistration', EventRegistrationSchema);
