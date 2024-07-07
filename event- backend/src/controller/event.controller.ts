import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  request,
  response,
} from "inversify-express-utils";
import { isLoggedInMiddleware } from "../middleware/authorization.middleware";
import { Request, Response } from "express";
import { ErrorHandling } from "../utils/errorHelper";
import { getEventsPipeline, responseStatus, statusCode } from "../utils";
import { IEventDetails } from "../interface";
import { inject } from "inversify";
import { TYPES } from "../types/TYPES";
import { eventService } from "../service";
import { Event } from "../model";
import { upload } from "../middleware/multer.middleware";
import { handleCloudinaryUpload } from "../middleware/cloudinary.middleware";

const errorObj = new ErrorHandling();

@controller("/event")
export class eventController {
  constructor(
    @inject<eventService>(TYPES.eventService) private event: eventService
  ) {}
  @httpPost("/postEvent", isLoggedInMiddleware)
  async postEvents(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    try {
      const {
        eventDate,
        venue,
        title,
        eventType,
        totalCapacity,
        pricePerTicket,
        remainingTickets,
      } = req.body;
      const requiredFields = [
        "eventDate",
        "venue",
        "title",
        "eventType",
        "totalCapacity",
        "pricePerTicket",
        "remainingTickets",
      ];
      const missingFields = requiredFields.filter((fields) => {
        !req.body[fields];
      });

      if (missingFields.length > 0) {
        res.status(statusCode.BAD_REQUEST.code).json({
          error: `Please enter the missing fields: ${missingFields.join(", ")}`,
          details: statusCode.BAD_REQUEST.message,
          response: responseStatus.FAILED,
        });
      }

      const eventData: IEventDetails = {
        eventDate,
        venue,
        title,
        eventType,
        totalCapacity,
        pricePerTicket,
        remainingTickets,
      };

      const event = await this.event.postEventData(eventData);
      res.status(statusCode.CREATED.code).json({
        response: responseStatus.SUCCESS,
        details: statusCode.CREATED.message,
        data: event,
      });
    } catch (error: any) {
      const message = errorObj.getErrorMsg(error) || error.message;
      res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: statusCode.INTERNAL_SERVER_ERROR.message,
        response: responseStatus.FAILED,
        details: message,
      });
    }
  }

  @httpGet("/getEvents", isLoggedInMiddleware)
  async getEvents(req: Request, res: Response): Promise<void> {
    try {
      let { page, limit, ...filters } = req.query;

      const pageNumber = page ? parseInt(page as string, 10) : 1;
      const pageSize: number | undefined = limit
        ? parseInt(limit as string, 10)
        : undefined;

      const pipeline = getEventsPipeline({
        ...filters,
        pageNumber,
        pageLimit: pageSize,
      });

      const events = await Event.aggregate(pipeline);

      res.status(statusCode.CREATED.code).json({
        response: responseStatus.SUCCESS,
        details: statusCode.CREATED.message,
        data: events,
      });
    } catch (error: any) {
      const message = error.message || "Internal Server Error";
      res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: statusCode.INTERNAL_SERVER_ERROR.message,
        response: responseStatus.FAILED,
        details: message,
      });
    }
  }

  @httpPut("/uploadEventPhoto/:eventId", isLoggedInMiddleware, upload.single("content"))
  async uploadEventPhoto(req: Request, res: Response): Promise<void> {
    try {
        const {eventId} = req.params
        const eventData = req.body
        const validEvent = await Event.findById({_id:eventId})
        if(!validEvent){
            res.status(statusCode.NOT_FOUND.code).json({
                details:statusCode.NOT_FOUND.message,
                response:responseStatus.FAILED,
                error:"No such event Exists"
            })
        }

        if (req.file) {
            eventData.eventPicture = await handleCloudinaryUpload(req.file);
        }

        const uploadEventPic = await Event.findByIdAndUpdate(eventId, eventData)
        res.status(statusCode.CREATED.code).json({
            response: responseStatus.SUCCESS,
            details: statusCode.CREATED.message,
            data: uploadEventPic,
          });
    } catch (error: any) {
      const message = error.message || "Internal Server Error";
      res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: statusCode.INTERNAL_SERVER_ERROR.message,
        response: responseStatus.FAILED,
        details: message,
      });
    }
  }

  @httpPut("/updateEvent/:eventId", isLoggedInMiddleware)
  async updateEvents(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const validEvent = await Event.findById({ _id: eventId });
      if(!validEvent){
        res.status(statusCode.NOT_FOUND.code).json({
            details:statusCode.NOT_FOUND.message,
            response:responseStatus.FAILED,
            error:"No such event Exists"
        })
      }
      const event = await Event.findByIdAndUpdate(eventId, req.body);
      res.status(statusCode.CREATED.code).json({
        response: responseStatus.SUCCESS,
        details: statusCode.CREATED.message,
        data: event,
      });
    } catch (error: any) {
      const message = error.message || "Internal Server Error";
      res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: statusCode.INTERNAL_SERVER_ERROR.message,
        response: responseStatus.FAILED,
        details: message,
      });
    }
  }

  @httpDelete("/deleteEvent/:eventId", isLoggedInMiddleware)
  async deleteEvents(req: Request, res: Response): Promise<void> { 
    try {
        const {eventId} = req.params
        const validEvent = await Event.findById({ _id: eventId });
      if(!validEvent){
        res.status(statusCode.NOT_FOUND.code).json({
            details:statusCode.NOT_FOUND.message,
            response:responseStatus.FAILED,
            error:"No such event Exists"
        })
      }

      const event = await Event.findByIdAndDelete({_id: eventId})
      res.status(statusCode.CREATED.code).json({
        response: responseStatus.SUCCESS,
        details: statusCode.CREATED.message,
        data: event,
      });
    } catch (error:any) {
        const message = error.message || "Internal Server Error";
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: statusCode.INTERNAL_SERVER_ERROR.message,
          response: responseStatus.FAILED,
          details: message,
        });
    }
  }


  @httpGet("/getEvent/:eventId", isLoggedInMiddleware)
  async getEventsById(req: Request, res: Response): Promise<void> {
    try {
      
      const {eventId} = req.params
      const event = await Event.findById({_id: eventId})
      if(!event){
        res.status(statusCode.NOT_FOUND.code).json({
          details:statusCode.NOT_FOUND.message,
          response:responseStatus.FAILED,
          error:"No such event Exists"
      })
      return
      }
      res.status(statusCode.CREATED.code).json({
        response: responseStatus.SUCCESS,
        details: statusCode.CREATED.message,
        data: event,
      });
    } catch (error:any) {
      const message = error.message || "Internal Server Error";
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: statusCode.INTERNAL_SERVER_ERROR.message,
          response: responseStatus.FAILED,
          details: message,
        }); 
    }
  }
}
