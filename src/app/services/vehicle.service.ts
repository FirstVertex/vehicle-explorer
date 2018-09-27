import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle } from 'src/app/models/vehicle';
import { apiConfig } from 'src/app/dynatron-api/api.config';
import { IListRequest, IVehicleListResponse } from 'src/app/dynatron-api/api-list';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  // source of truth for currently displayed list of vehicles
  public vehicles: Subject<Vehicle[]>;
  // source of truth for currently selected vehicle
  public currentVehicle: BehaviorSubject<Vehicle | undefined>;

  constructor(private http: HttpClient) {
    // initialize list of vehicles to be empty
    this.vehicles = new Subject<Vehicle[]>();
    // initialize current vehicle to be undefined
    this.currentVehicle = new BehaviorSubject<Vehicle | undefined>(undefined);
  }

  public fetch(params?: IListRequest) {
    let httpParams: HttpParams = new HttpParams();
    if (params) {
      // convert IListRequest to HttpParams
      httpParams = new HttpParams({ fromObject: {...params}});
    }
    this.http.get<IVehicleListResponse>(apiConfig.host, { params: httpParams })
      .pipe(
        // API gives us keys for each object, but we care only about the values
        map(response => Object.values(response)),
        // do not create a new subscription on each fetch (i.e. don't use subscribe())
      ).toPromise()
      // update the source of truth for list of vehicles
      .then((items: Vehicle[]) => this.vehicles.next(items));
  }

  public selectVehicle(vehicle: Vehicle | undefined) {
    // update the source of truth for selected vehicle
    this.currentVehicle.next(vehicle);
  }
}
