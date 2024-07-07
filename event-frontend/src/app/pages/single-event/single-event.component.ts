import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/_core/service/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationFormComponent } from '../registration-form/registration-form.component';

@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.scss']
})
export class SingleEventComponent {
  event: any;
  constructor(private dashboard: DashboardService, private route: ActivatedRoute, private dialog: MatDialog) { }
  ngOnInit() {
    this.fetchEventsDeatil()
  }

  fetchEventsDeatil() {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    this.dashboard.getSingleEvent(eventId).subscribe(
      (res: any) => {
        if (res.response) {
          this.event = res.data;
        }
      }
    )
  }

  openRegistrationModal(): void {
    const dialogRef = this.dialog.open(RegistrationFormComponent, {
      width: '400px',
      data: { eventId: this.event._id, eventName: this.event.title, ticketPrice: this.event.pricePerTicket }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The registration dialog was closed');
    });
  }
}
