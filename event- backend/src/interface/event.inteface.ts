import mongoose from "mongoose";

export interface IEventDetails {
    _id?:mongoose.Schema.Types.ObjectId
    eventDate: Date;
    venue: string;
    title: string;
    eventPicture?: string; 
    eventType: string;
    totalCapacity: number;
    pricePerTicket: number;
    remainingTickets: number;
}