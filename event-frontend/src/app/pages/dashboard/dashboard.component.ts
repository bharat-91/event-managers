import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from 'src/_core/service/dashboard.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  eventTypes: string[] = [];
  venues: string[] = [];
  searchForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchDetails();
    this.setupSearchFormChanges();
  }

  initializeForm(): void {
    this.searchForm = this.formBuilder.group({
      title: [''],
      eventType: [''],
      venue: [''],
      availableTickets: ['']
    });
  }

  setupSearchFormChanges(): void {
    this.searchForm.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged() 
    ).subscribe(() => {
      this.searchEvents();
    });
  }

  fetchDetails(): void {
    this.dashboardService.getEvents().subscribe(
      (res: any) => {
        if (res.response) {
          this.events = res.data;
          this.filteredEvents = this.events; 
          this.eventTypes = Array.from(new Set(this.events.map(event => event.eventType)));
          this.venues = Array.from(new Set(this.events.map(event => event.venue)));
        }
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  searchEvents(): void {
    const { title, eventType, venue, availableTickets } = this.searchForm.value;
    const queryParams = {
      ...(title && { title }),
      ...(eventType && { eventType }),
      ...(venue && { venue }),
      ...(availableTickets && { availableTickets })
    };
  
    this.dashboardService.getEventsByQuery(queryParams).subscribe(
      (res: any) => {
        if (res.response) {
          this.filteredEvents = res.data;
        } else {
          this.filteredEvents = [];
        }
      },
      (error:any) => {
        console.error('Error searching events:', error);
      }
    );
  }

  viewDetails(eventId: string): void {
    this.router.navigate(['/user/auth/event-info', eventId]);
  }
}
