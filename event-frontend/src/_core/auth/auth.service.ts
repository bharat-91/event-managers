import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, throwError } from 'rxjs';
import { ILoginData, IUser } from 'src/_interface/iuser';
const jwtHelper = new JwtHelperService()

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  withCredentials: true
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private handleError(error: HttpErrorResponse){
    if(error.status === 0){
      console.error("An Error Occurred ", error.error);
    }else{
      console.error(`Backend returned code ${error.status}, body was: `, error.error.text);
    }
    console.log(error);
    return throwError(() => new Error(error.error.text))
    
  }
  private BASE_URL = "http://localhost:3333"
  private jwtHelper = new JwtHelperService();
  constructor(private http:HttpClient) { }

  signUp(data:IUser):Observable<any>{
    let API_URL = `${this.BASE_URL}/auth/user/register`
    return this.http.post<any>(API_URL,data,httpOptions).pipe(catchError(this.handleError))
  }

  login(data:any):Observable<any>{
    const API_URL = `${this.BASE_URL}/auth/user/login`
    return this.http.post(API_URL, data)
  }
}
