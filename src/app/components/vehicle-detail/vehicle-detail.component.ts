import { Component } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss']
})
export class VehicleDetailComponent {
  // currently selected vehicle
  public vehicle: Vehicle | undefined;

  constructor(private vehicleService: VehicleService) {
    // request notification when the source of truth for currently selected vehicle changes
    this.vehicleService.currentVehicle.subscribe((currentVehicle: Vehicle) => this.vehicle = currentVehicle);
  }

  // modal visibility is binded to this
  public get isOpen(): boolean {
    return !!this.vehicle;
  }
  public set isOpen(value: boolean) {
    if (!value) {
      // request that the service Singleton handle selection state
      this.vehicleService.selectVehicle(undefined);
    }
  }
}
