import {cTenantData} from '@database/models/various-registration-information-data/cTenantData';

export interface Room {
  code: string;
  name: string;
  buildingName: string;
  floorName?: string;
  unit?: string;
  tenants: cTenantData[];
}

export interface FloorUnitModel {
  id: string;
  title: string;
  count: number;
  rooms: Room[];
}

export interface RoomReservation {
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
}

export interface FloorAndUnitSectionData {
  title: string;
  data: FloorUnitModel[];
}
