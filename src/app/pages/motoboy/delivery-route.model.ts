export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface DeliveryRoute {
  id: string;
  motoboy: {
    name: string;
    phone: string;
    vehicle: string;
    photo?: string;
  };
  startLocation: Location;
  currentLocation: Location;
  endLocation: Location;
  distance: number; // em km
  estimatedTime: number; // em minutos
  status: 'preparing' | 'on_route' | 'arriving' | 'delivered';
  waypoints: Location[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteStep {
  icon: string;
  label: string;
  time: string;
  completed: boolean;
}
