export interface Facility {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  facilities: string[];
}

export interface Amenity {
  id: number;
  name: string;
}
