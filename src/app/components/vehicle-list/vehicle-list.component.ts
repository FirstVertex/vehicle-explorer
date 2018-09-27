import { Component, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { IListRequest } from '../../dynatron-api/api-list';
import { Vehicle } from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  // array of models for binding to the grid
  public vehicles: Vehicle[] = [];
  // since the API doesn't return metadata about number of records, arbitrarily restrict to this number of results
  public total: number = 1000;
  // remember state so it can be applied when page size changes
  public lastState: ClrDatagridStateInterface = {};
  // property that is binded to the loading indicator
  public isLoading: boolean = true;
  // property that is binded to the details modal
  public currentVehicle: Vehicle | undefined = undefined;;
  // default page size, a backing field for pageSize() getter/setter
  private pageSizeValue: number = 25;

  // inject VehicleService and Router
  constructor(private vehicleService: VehicleService, private router: Router) {
  }

  ngOnInit(): void {
    // request notification when the source of truth for vehicle list changes
    this.vehicleService.vehicles.subscribe(
      (vehicles: Vehicle[]) => {
        this.vehicles = vehicles;
        this.isLoading = false;
      });
    // request notification when the source of truth for currently selected vehicle changes
    this.vehicleService.currentVehicle.subscribe((currentVehicle: Vehicle) => this.currentVehicle = currentVehicle);
  }

  // binded to the dropdown for changing page size
  public get pageSize(): number {
    return this.pageSizeValue;
  }
  public set pageSize(value: number) {
    // received value from Clarity could actually be a string.  use + to coerce to number
    this.pageSizeValue = +value;
    // trigger a fetch
    this.refresh(this.lastState);
  }

  // Clarity will call this when user changes grid options
  public refresh(state: ClrDatagridStateInterface) {
    // convert the Clarity structure to a IListRequest
    let params: IListRequest = {};
    // all Http parameters need to be string
    params.pageSize = this.pageSize + '';
    if (state.page && state.page.from) {
      params.pageNum = state.page.from + '';
    }
    if (state.sort && state.sort.by) {
      // state.sort.by supports complex type but we only use string
      params.orderBy = <string>state.sort.by;
      if (state.sort.reverse) {
        params.orderDir = 'desc';
      }
    }
    // need to do this async to avoid ExpressionChangedAfterItHasBeenCheckedError
    timer(0).subscribe(() => {
      // trigger the loading spinner
      this.isLoading = true;
    });
    // during dev, use this to keep an eye on double-requests
    // console.log('fetch data');
    // ask service to fetch data with these params
    this.vehicleService.fetch(params);
    // take a snapshot of state
    this.lastState = state;
  }

  // pop the modal for detail
  public openDetail(vehicle: Vehicle) {
    // request that the service Singleton handle selection state
    this.vehicleService.selectVehicle(vehicle);
  }
}
