import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) { }

  private BASE_URL = "http://localhost:3333"

  getEvents():Observable<any>{
    const API_URL = `${this.BASE_URL}/event/getEvents`
    return this.http.get(API_URL)
  }

  getEventsByQuery(query: any):Observable<any>{
    const API_URL = `${this.BASE_URL}/event/getEvents`
    return this.http.get(API_URL, { params: query })
  }
  getSingleEvent(eventId:any):Observable<any>{
    const API_URL = `${this.BASE_URL}/event/getEvent/${eventId}`
    return this.http.get(API_URL)
  }
}
