import { controller, httpGet, httpPost, httpPut, request, response } from "inversify-express-utils";
import { ErrorHandling } from "../utils/errorHelper";
import { inject } from "inversify";
import { Request, Response } from "express";
import { moduleType, responseStatus, statusCode } from "../utils";
import { TYPES } from "../types/TYPES";
import { Role, User } from "../model";
import { IUser } from "../interface";
import { userService } from "../service";
import { isLoggedInMiddleware } from "../middleware/authorization.middleware";
import { upload } from "../middleware/multer.middleware";
import { handleCloudinaryUpload } from "../middleware/cloudinary.middleware";
import bcrypt from 'bcrypt'
import config from 'config'
import jwt from 'jsonwebtoken'

const errorObj = new ErrorHandling()
@controller('/auth/user', moduleType("User"))
export class userController {
    constructor(@inject<userService>(TYPES.userService) private user: userService) { }
    @httpPost('/register')
    async registerUser(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { username, email, contactNumber, password } = req.body;
            const requiredFields = ['username', 'email', 'contactNumber', 'password'];
            const missingFields = requiredFields.filter(field => !req.body[field]);
    
            if (missingFields.length > 0) {
                res.status(400).json({ error: `Please enter the missing fields: ${missingFields.join(', ')}` });
                return;
            }
            const roleName = "User"
    const role = await Role.findOne({role:roleName })
            let userData: IUser = {
                username,
                email,
                contactNumber,
                password,
                role: role?._id
            };
            const userCreated = await this.user.registerUser(userData);
    
    
            res.status(statusCode.CREATED.code).json({
                response: responseStatus.SUCCESS,
                details: statusCode.CREATED.message,
                data: userCreated
            });
        } catch (error: any) {
            console.error('Error registering user:', error);
            const message = error.message || 'Internal server error';
            res.status(500).json({
                message: 'Failed to register user',
                response: 'FAILED',
                details: message
            });
        }
    }

    @httpPost('/uploadImage/:userId', isLoggedInMiddleware, upload.single('content'))
    async uploadProfileImage(@request() req: any, @response() res: Response): Promise<void> {
        try {   
            const { userId } = req.params
        const authenticatedUserId = req.user._id;

        if (userId !== authenticatedUserId.toString()) {
            res.status(statusCode.UNAUTHORIZED.code).json({
                message: 'Unauthorized',
                response: responseStatus.FAILED,
                details: 'You are not authorized to update this Content'
            });
            return
        }
        if (req.file) {
            req.body.contentPath = await handleCloudinaryUpload(req.file);
            req.body.filename = req.file.originalname;
        }
        console.log(req.body.contentPath);
        const updatedUser = await User.findByIdAndUpdate({_id: userId}, {profilePic: req.body.contentPath} )
        res.status(statusCode.SUCCESS.code).json({
            message: statusCode.SUCCESS.message,
            details: updatedUser,
            response: responseStatus.SUCCESS
        });
        } catch (error:any) {
            console.error('Error registering user:', error);
            const message = error.message || 'Internal server error';
            res.status(500).json({
                message: 'Failed to register user',
                response: 'FAILED',
                details: message
            });
        }
    }

    @httpPost('/login')
    async loginUser(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json("Please provide Email and Password to login");
                return;
            }

            const user: IUser | null = await User.findOne({ email });

            if (!user) {
                res.status(401).json({ message: "User Does not Exist" });
                return;
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                res.status(400).json("Invalid Credentials");
                return;
            }

            if (user.token && user.token.length > 0) {
                await User.findOneAndUpdate(
                    { email },
                    { $set: { token: '' } }
                );
                console.log(`Reset token for user: ${user.email}`);
            }

            let roleName = await Role.findById({_id: user.role})
            

            

            const token = jwt.sign({ _id: user._id , role: user.role, roleName: roleName?.role}, config.get("SecretKey"));

            const loggedInUser = await User.findOneAndUpdate(
                { email },
                { $set: { token } },
                { new: true }
            );
            res.status(statusCode.CREATED.code).json({
                response: responseStatus.SUCCESS,
                details: statusCode.CREATED.message,
                data: loggedInUser
            });
        } catch (error: any) {
            console.log("error => ", error);
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: statusCode.INTERNAL_SERVER_ERROR.message,
                response: responseStatus.FAILED,
                details: message
            });
        }
    }

    @httpPost('/logout/:id', isLoggedInMiddleware)
    async logoutUser(@request() req: Request, @response() res: Response) {
        try {
            const { id } = req.params

            const userExists = await User.findById(id)
            if (!userExists) {
                res.status(404).json({ message: "User not Found" })
            }
            if (userExists?.token === '') {
                res.status(401).json({ message: "User Already Logged out" })
            }
            const user = await User.findByIdAndUpdate(id, {
                $set: { token: '' }
            })
            res.status(statusCode.SUCCESS.code).json({
                message: statusCode.SUCCESS.message,
                details: user,
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
    @httpPut('/updateUserProfile/:userId', isLoggedInMiddleware, TYPES.PermissionMiddleware)
    async updateUserProfile(@request() req: any, @response() res: Response): Promise<void> {
        try {

               
            const { userId } = req.params
            const authenticatedUserId = req.user._id;
    
            if (userId !== authenticatedUserId.toString()) {
                res.status(statusCode.UNAUTHORIZED.code).json({
                    message: 'Unauthorized',
                    response: responseStatus.FAILED,
                    details: 'You are not authorized to update this Content'
                });
                return
            }
                const dataToUpdate = req.body
                const updatedUser = await this.user.updateUser(userId, dataToUpdate)
                res.status(statusCode.SUCCESS.code).json({
                    message: statusCode.SUCCESS.message,
                    details: updatedUser,
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

    @httpGet("/getUser/:userId")
    async getUserProfile(@request() req: any, @response() res: Response): Promise<void> {
        try {
            const {userId} = req.params

            const user = await User.findById({_id: userId})
            res.status(statusCode.SUCCESS.code).json({
                message: statusCode.SUCCESS.message,
                details: user,
                response: responseStatus.SUCCESS
            });
        } catch (error:any) {
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: statusCode.INTERNAL_SERVER_ERROR.message,
                response: responseStatus.FAILED,
                details: message
            });
        }
    }
}