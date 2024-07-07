import { PipelineStage } from 'mongoose';

interface Filters {
    eventDate?: string; 
    startDate?: string;
    endDate?: string; 
    venue?: string;
    title?: string;
    eventType?: string;
    minPrice?: number;
    maxPrice?: number;
    availableTickets?: 'yes' | 'no';
}

interface PaginationParams {
    pageNumber: number;
    pageLimit?: number;
}

const addPaginationStages = ({ pageNumber, pageLimit }: PaginationParams): PipelineStage[] => {
    const stages: PipelineStage[] = [
        { $skip: (pageNumber - 1) * (pageLimit || 0) } 
    ];
    
    if (pageLimit) {
        stages.push({ $limit: pageLimit });
    }
    
    return stages;
};

export const getEventsPipeline = ({ eventDate, startDate, endDate, venue, title, eventType, minPrice, maxPrice, availableTickets, pageNumber, pageLimit }: Filters & PaginationParams): PipelineStage[] => {
    const pipeline: PipelineStage[] = [];

    const matchStage: any = {};

    if (eventDate) {
        matchStage.eventDate = { $eq: new Date(eventDate) };
    } else if (startDate && endDate) {
        matchStage.eventDate = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }
    
    if (venue) {
        matchStage.venue = { $regex: new RegExp(venue, 'i') };
    }
    if (title) {
        matchStage.title = { $regex: new RegExp(title, 'i') };
    }
    if (eventType) {
        matchStage.eventType = eventType;
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
        matchStage.pricePerTicket = {
            $gte: minPrice,
            $lte: maxPrice
        };
    } else if (minPrice !== undefined) {
        matchStage.pricePerTicket = { $gte: minPrice };
    } else if (maxPrice !== undefined) {
        matchStage.pricePerTicket = { $lte: maxPrice };
    }
    if (availableTickets === 'yes') {
        matchStage.remainingTickets = { $gt: 0 };
    } else if (availableTickets === 'no') {
        matchStage.remainingTickets = { $eq: 0 };
    }

    if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
    }

    pipeline.push({ $sort: { eventDate: 1 } });
    pipeline.push(...addPaginationStages({ pageNumber, pageLimit }));

    return pipeline;
};