import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeliveryRoute } from './delivery-route.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryRouteService {
  private routeSubject = new BehaviorSubject<DeliveryRoute | null>(null);
  route$ = this.routeSubject.asObservable();

  constructor() {
    this.initializeDefaultRoute();
  }

  private initializeDefaultRoute(): void {
    const defaultRoute: DeliveryRoute = {
      id: '1',
      motoboy: {
        name: 'João Silva',
        phone: '(11) 98765-4321',
        vehicle: 'Honda XRE 300 - Placa: ABC1234',
        photo: 'https://via.placeholder.com/100'
      },
      startLocation: {
        latitude: -23.5505,
        longitude: -46.6333,
        address: 'Restaurante Pizza House - Av. Paulista, 1000'
      },
      currentLocation: {
        latitude: -23.5515,
        longitude: -46.6340,
        address: 'Rua Augusta, 500'
      },
      endLocation: {
        latitude: -23.5525,
        longitude: -46.6350,
        address: 'Casa do Cliente - Rua Oscar Freire, 200'
      },
      distance: 2.5,
      estimatedTime: 12,
      status: 'on_route',
      waypoints: [
        {
          latitude: -23.5505,
          longitude: -46.6333,
          address: 'Restaurante Pizza House'
        },
        {
          latitude: -23.5510,
          longitude: -46.6337,
          address: 'Ponto intermediário 1'
        },
        {
          latitude: -23.5518,
          longitude: -46.6345,
          address: 'Ponto intermediário 2'
        },
        {
          latitude: -23.5525,
          longitude: -46.6350,
          address: 'Casa do Cliente'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.routeSubject.next(defaultRoute);
  }

  getRoute(): Observable<DeliveryRoute | null> {
    return this.route$;
  }

  updateRoute(route: DeliveryRoute): void {
    this.routeSubject.next(route);
  }

  simulateMovement(): void {
    const route = this.routeSubject.value;
    if (!route) return;

    // Simula movimento gradual
    const interval = setInterval(() => {
      const updatedRoute = this.routeSubject.value!;
      
      if (updatedRoute.status === 'delivered') {
        clearInterval(interval);
        return;
      }

      // Atualiza a localização atual gradualmente
      updatedRoute.currentLocation.latitude += 0.0005;
      updatedRoute.currentLocation.longitude += 0.0002;

      // Reduz o tempo estimado
      updatedRoute.estimatedTime = Math.max(0, updatedRoute.estimatedTime - 0.5);

      // Verifica se chegou
      if (updatedRoute.estimatedTime <= 0) {
        updatedRoute.status = 'delivered';
        updatedRoute.currentLocation = updatedRoute.endLocation;
        clearInterval(interval);
      }

      // Atualiza o status baseado no tempo estimado
      if (updatedRoute.estimatedTime <= 2) {
        updatedRoute.status = 'arriving';
      }

      this.routeSubject.next({ ...updatedRoute });
    }, 3000); // Atualiza a cada 3 segundos
  }
}
