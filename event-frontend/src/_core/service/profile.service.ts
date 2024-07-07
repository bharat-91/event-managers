import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenretiriverService } from './tokenretiriver.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http:HttpClient, private getUserId:TokenretiriverService) { }
   private BASE_URL = "http://localhost:3333"
   private userId!:string

   getProfileData():Observable<any>{
    this.getUserId.getUserId().subscribe(userId =>{
      this.userId = userId
    }) 
    const API_URL = `${this.BASE_URL}/auth/user/getUser/${this.userId}`
    return this.http.get(API_URL)
   }
}
