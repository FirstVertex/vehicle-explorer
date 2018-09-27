import { Vehicle } from "../models/vehicle";

// describes the available parameters of the Dynatron api
export interface IListRequest {
  pageSize?: string,
  pageNum?: string,
  orderBy?: string,
  orderDir?: string
}

// container to receive api response
export interface IVehicleListResponse {
  // api gives us keys that we don't care about
  [key: string]: Vehicle
}
