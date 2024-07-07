import mongoose from "mongoose"

export interface IUser{
    _id?:mongoose.Schema.Types.ObjectId,
 username:string,
 email:string,
 password:string,
 profilePic?:any,
 contactNumber:string,
 token?:string
 role?:mongoose.Types.ObjectId
}