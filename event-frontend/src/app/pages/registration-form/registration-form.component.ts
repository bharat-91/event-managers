import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EventsService } from 'src/_core/service/events.service';
import { ProfileService } from 'src/_core/service/profile.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ],
  providers: [DatePipe]
})
export class RegistrationFormComponent {
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profile: ProfileService,
    private event: EventsService,
    private toast: ToastrService,
    private datePipe: DatePipe
  ) {
    this.createForm();
  }

  createForm(): void {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      registrationDate: [new Date()],
      ticketPrice: [{ value: this.data.ticketPrice, disabled: true }]
    });
  }

  ngOnInit() {
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    this.profile.getProfileData().subscribe(
      (res: any) => {
        if (res.response) {
          this.registrationForm.patchValue({
            username: res.details.username,
            email: res.details.email,
            phoneNumber: res.details.contactNumber
          });
        }
      }
    );
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formattedRegistrationDate = this.datePipe.transform(this.registrationForm.value.registrationDate, 'MM/dd/yyyy');
      this.event.registerIntoEvent(
        this.data.eventId,
        {
          ...this.registrationForm.value,
          registrationDate: formattedRegistrationDate,
          ticketPrice: this.data.ticketPrice 
        }
      ).subscribe(
        (res: any) => {
          if (res.response) {
            this.toast.success("Successfully Registered into Event")
          } else {
            console.log("Error Registering for Event");
          }
        },
        (err: any) => {
          console.error("Error", err);
          const errorMessage = err.error.message || err.error.error || err.statusText || err.error.details || err.status || "An unknown error occurred. Please try again.";
          this.toast.error(errorMessage);
        }
      );
    } else {
      this.toast.error('Form is invalid');
    }
  }
}
