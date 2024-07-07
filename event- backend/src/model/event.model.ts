import mongoose, { Model } from "mongoose";
import { IEventDetails } from "../interface";
import { EventType } from "../enum";

const EventSchema = new mongoose.Schema<IEventDetails>({
    eventDate: {
        type: Date,
        default: Date.now,
        required: [true, "Please enter the Date of the Event"]
    },
    venue: {
        type: String,
        required: [true, "Please specify the venue of the event"]
    },
    title: {
        type: String,
        required: [true, "Please enter the title of the Event"]
    },
    eventPicture: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/The_Event_2010_Intertitle.svg/1200px-The_Event_2010_Intertitle.svg.png"
    },
    eventType: {
        type: String,
        enum: Object.values(EventType), 
        required: [true, "Please Select the Event Type"]
    },
    totalCapacity: {
        type: Number,
        required: [true, "Please enter the Total Capacity of the Event"],
        min: 0
    },
    pricePerTicket: {
        type: Number,
        required: [true, "Please enter the ticket Price"],
        min: 0
    },
    remainingTickets: {
        type: Number,
        default: function () {
            return this.totalCapacity;
        }
    }
});

export const Event: Model<IEventDetails> = mongoose.model<IEventDetails>("Event", EventSchema);
