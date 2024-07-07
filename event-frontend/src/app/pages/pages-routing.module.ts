import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SingleEventComponent } from './single-event/single-event.component';

const routes: Routes = [
  {
    path:"Dashboard", component:DashboardComponent
  },
  { path: 'event-info/:eventId', component: SingleEventComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
