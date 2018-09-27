import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AboutComponent } from '../components/about/about.component';
import { VehicleListComponent } from '../components/vehicle-list/vehicle-list.component';

// define top-level app routes
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'vehicles',
    component: VehicleListComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  // fallback route
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }