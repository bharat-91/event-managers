import mongoose from "mongoose";

export interface EventRegistration {
    eventId: mongoose.Types.ObjectId; 
    userId: mongoose.Types.ObjectId[];
    username: string; 
    email: string;
    phoneNumber?: string; 
    registrationDate: Date; 
    ticketPrice:number
}
