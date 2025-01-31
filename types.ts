import { OptionalId } from "mongodb";

export type RestaurantModel = OptionalId<{
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
}>;
export type Restaurant = {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  temperatura: number;
  hora: string;
};

export type APIPhone = {
  is_valid: boolean;
  timezones: string[];
};

export type APICity = {
  latitude: number;
  longitude: number;
};

export type APIWeather = {
  temp: number;
};

export type APITime = {
  datetime: string;
};
