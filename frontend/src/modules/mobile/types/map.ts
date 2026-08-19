export type POICategory = "Restaurant" | "Bar" | "Parc" | "Musée" | "Boutique" | "Autre";

export type IncidentLevel = "1" | "2" | "3";

export interface Incident {
  id : string;
  statusId: string;
  level: IncidentLevel;
  title: string;
  time: string;
}

export interface POI {
  id: string;
  name: string;
  type: POICategory;
  description: string;
  latitude: number;
  longitude: number;
  incident: Incident | null; 
}

export interface DraftPOI {
  latitude: number;
  longitude: number;
}