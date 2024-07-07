import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { switchMap, take, filter } from 'rxjs/operators';
import { TokenretiriverService } from './tokenretiriver.service';
import { IEvent } from 'src/_interface/ievent';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private BASE_URL = 'http://localhost:3333';
  private userId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private getUserId: TokenretiriverService) {
    this.getUserId.getUserId().subscribe(userId => {
      this.userId$.next(userId);
    });
  }

  registerIntoEvent(eventId: any, userData: IEvent): Observable<any> {
    return this.userId$.pipe(
      filter(userId => !!userId), // Wait until userId is available
      take(1), // Take the first emitted userId and complete
      switchMap(userId => {
        const API_URL = `${this.BASE_URL}/regEvent/registerInEvent/${userId}/${eventId}`;
        return this.http.post(API_URL, userData);
      })
    );
  }
}
