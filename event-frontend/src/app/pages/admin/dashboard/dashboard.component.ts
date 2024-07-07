import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/_core/service/admin.service';
import { DashboardService } from 'src/_core/service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  submitted: boolean = false;
  eventForm: FormGroup;
  events: any[] = [];
  eventTypes: string[] = [];
  newEventType: string = '';

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private eventService: DashboardService
  ) {
    this.eventForm = this.fb.group({
      eventDate: ['', Validators.required],
      venue: ['', Validators.required],
      eventType: ['', Validators.required],
      title: ['', Validators.required],
      totalCapacity: ['', Validators.required],
      pricePerTicket: ['', Validators.required],
      remainingTickets: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe(
      (response: any) => {
        this.events = response.data;
        console.log('Events retrieved:', response);
        this.eventTypes = Array.from(new Set(this.events.map(event => event.eventType)));
      },
      error => {
        console.error('Failed to retrieve events', error);
      }
    );
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.submitted = true;
      const eventData = this.eventForm.value;

      // Check if the entered eventType is not already in eventTypes
      const newType = this.newEventType.trim();
      if (newType && !this.eventTypes.includes(newType)) {
        this.eventTypes.push(newType);
        this.eventForm.patchValue({ eventType: newType }); // Set new event type in form
      }

      this.admin.registerEvent(eventData).subscribe(
        (response: any) => {
          console.log('Event created successfully', response);
          setTimeout(() => {
            this.submitted = false;
          }, 3000);
        },
        error => {
          console.error('Failed to create event', error);
          this.submitted = false;
        }
      );

      // Reset the form after submission
      this.eventForm.reset();
      this.newEventType = ''; // Clear new event type input
    } else {
      console.error('Form is invalid');
    }
  }

  // Method to add a new event type to eventTypes array
  addEventType(type: string) {
    if (type && !this.eventTypes.includes(type)) {
      this.eventTypes.push(type);
      this.newEventType = ''; // Clear new event type input
    }
  }
}
