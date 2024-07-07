export interface IUser{
    _id?:string,
 username:string,
 email:string,
 password:string,
 profilePic?:any,
 contactNumber:string,
 token?:string
 role?:string
}

export interface ILoginData{
    email?: string;
    password?: string;
}