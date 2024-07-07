import { Request, Response, NextFunction } from 'express';
import { sendEmail } from '../service/email.service';


export async function sendRegistrationEmailMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // Extract necessary data from request or response
        const { email, eventData } = res.locals; // Assuming eventData contains necessary email and event details

        // Email content
        const mailOptions = {
            from: 'nandanvarbharat@gmail.com',
            to: email,
            subject: 'Event Registration Details',
            html: `
                <p>Hello,</p>
                <p>You have successfully registered for the event. Here are your registration details:</p>
                <ul>
                    <li>Event ID: ${eventData.eventId}</li>
                    <li>Username: ${eventData.username}</li>
                    <li>Email: ${eventData.email}</li>
                    <li>Phone Number: ${eventData.phoneNumber}</li>
                    <li>Registration Date: ${eventData.registrationDate}</li>
                    <li>Ticket Price: ${eventData.ticketPrice}</li>
                </ul>
            `
        };

        // Send email
        await sendEmail(mailOptions);

        // Call next middleware or send response as needed
        next();
    } catch (error) {
        console.error('Error in sendRegistrationEmailMiddleware:', error);
        // Handle the error appropriately (e.g., send response to client or log it)
        res.status(500).json({ error: 'Failed to send registration email' });
    }
}
