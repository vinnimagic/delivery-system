import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'novo-pedido',
    loadComponent: () => import('./pages/new-order/new-order.component').then(m => m.NewOrderComponent)
  },
  {
    path: 'acompanhar-pedido/:id',
    loadComponent: () => import('./pages/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent)
  },
  {
    path: 'restaurante',
    loadComponent: () => import('./pages/restaurant-dashboard/restaurant-dashboard.component').then(m => m.RestaurantDashboardComponent)
  },
  {
<<<<<<< HEAD
    path: 'criarpratos',
    loadComponent: () => import('./pages/criarpedidos/criarpedidos.component').then(m => m.CriarPratosComponent)
=======
    path: 'criarpedidos',
    loadComponent: () => import('./pages/criarpedidos/criarpedidos.component').then(m => m.CriarpedidosComponent)
>>>>>>> fd4334cea9ff87863b5ebad1162764cda55febf3
  },
  {
    path: '**',
    redirectTo: ''
  }
];