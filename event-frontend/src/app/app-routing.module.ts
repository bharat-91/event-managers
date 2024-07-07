import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"", loadChildren:() => import('../_authorization/authorization.module').then((m) => m.AuthorizationModule)
  },
  {
    path:"user/auth", loadChildren:() => import('./pages/pages.module').then((m) => m.PagesModule)
  },
  {
    path:"admin/auth", loadChildren:() => import('./pages/admin/admin.module').then((m) => m.AdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
