import { inject } from "inversify";
import { controller, httpPost, request, response } from "inversify-express-utils";
import { eventRegService } from "../service/eventReg.service";
import { TYPES } from "../types/TYPES";
import { isLoggedInMiddleware } from "../middleware/authorization.middleware";
import { Request, Response } from "express";
import { ErrorHandling } from "../utils/errorHelper";
import { responseStatus, statusCode } from "../utils";
import { Event, EventRegistrationModel } from "../model";
import { EventRegistration } from "../interface";
import mongoose from "mongoose";
import { sendRegistrationEmailMiddleware } from "../middleware/sendEmail.middleware";

const errorObj = new ErrorHandling();

@controller("/regEvent")
export class eventRegController {
    constructor(@inject<eventRegService>(TYPES.eventRegService) private event: eventRegService) { }

    @httpPost('/registerInEvent/:userId/:eventId', isLoggedInMiddleware)
    async registerInEvent(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { eventId, userId } = req.params;
            const {
                username,
                email,
                phoneNumber,
                registrationDate,
                ticketPrice
            } = req.body;
    
            const requiredFields = [
                "username",
                "email",
                "phoneNumber",
                "registrationDate",
                "ticketPrice"
            ];
    
            const missingFields = requiredFields.filter(field => !req.body[field]);
    
            if (missingFields.length > 0) {
                res.status(400).json({ error: `Please enter the missing fields: ${missingFields.join(', ')}` });
                return;
            }
    
            const eventIdData = new mongoose.Types.ObjectId(eventId);
            const userIdData = new mongoose.Types.ObjectId(userId);
            const existingRegistration = await EventRegistrationModel.findOne({
                eventId: eventIdData,
                userId: userIdData
            });
    
            if (existingRegistration) {
                res.status(statusCode.BAD_REQUEST.code).json({
                    details: "User is already registered for this event",
                    error: "Duplicate registration",
                    response: responseStatus.FAILED
                });
                return;
            }
    
            const validEvent = await Event.findById(eventId);
            if (!validEvent) {
                res.status(statusCode.NOT_FOUND.code).json({
                    details: statusCode.NOT_FOUND.message,
                    response: responseStatus.FAILED,
                    error: "No such event exists"
                });
                return;
            }
    
            if (validEvent.remainingTickets === undefined || validEvent.remainingTickets <= 0) {
                res.status(statusCode.BAD_REQUEST.code).json({
                    details: statusCode.BAD_REQUEST.message,
                    error: "No more tickets available for this event",
                    response: responseStatus.FAILED
                });
                return;
            }
    
            const regDate = new Date(registrationDate);
            if (regDate > validEvent.eventDate) {
                res.status(statusCode.BAD_REQUEST.code).json({
                    details: statusCode.BAD_REQUEST.message,
                    error: "Registration date cannot be after event date",
                    response: responseStatus.FAILED
                });
                return;
            }
            const eventDataRreg: EventRegistration = {
                eventId: eventIdData,
                userId: [userIdData], 
                username,
                email,
                phoneNumber,
                registrationDate: regDate,
                ticketPrice
            };
    
            res.locals.email = eventDataRreg.email;
            res.locals.eventData = eventDataRreg;
            const eventReg = await EventRegistrationModel.create(eventDataRreg);
            await Event.findByIdAndUpdate(eventIdData, { $inc: { remainingTickets: -1 } });
    
            res.status(statusCode.SUCCESS.code).json({
                message: statusCode.SUCCESS.message,
                details: eventReg,
                response: responseStatus.SUCCESS
            });
    
        } catch (error: any) {
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: statusCode.INTERNAL_SERVER_ERROR.message,
                response: responseStatus.FAILED,
                details: message
            });
        }
    }
    
}
