import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEvent } from 'src/_interface/ievent';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http:HttpClient) { }

  private BASE_URL = "http://localhost:3333"

  registerEvent(eventData:IEvent):Observable<any>{
    const API_URL = `${this.BASE_URL}/event/postEvent`
    return this.http.post(API_URL, eventData)
  }
}
