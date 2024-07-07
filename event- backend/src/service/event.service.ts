import { injectable } from "inversify";
import { IEventDetails } from "../interface";
import { Event } from "../model";

@injectable()

export class eventService{
    async postEventData(eventData:IEventDetails):Promise<IEventDetails | null>{
        try {
            const event = await Event.create(eventData)
            return event
        } catch (error:any) {
            throw new Error(error)
        }
    }
}