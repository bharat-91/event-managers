import { injectable } from "inversify"
import { EventRegistration } from "../interface"
import { EventRegistrationModel } from "../model"

@injectable()
export class eventRegService{
    async postEventData(eventData:EventRegistration):Promise<EventRegistration | null>{
        try {
            const event = await EventRegistrationModel.create(eventData)
            return event
        } catch (error:any) {
            throw new Error(error)
        }
    }
}