import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {  // ← Certifique-se que está exportando a classe
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);

  constructor() {
    this.startPolling();
  }

  createOrder(order: Order): Observable<Order> {
    // Mock para desenvolvimento
    const mockOrder: Order = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      status: OrderStatus.RECEIVED,
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 45 * 60000)
    };
    
    return new Observable(observer => {
      setTimeout(() => {
        // Salva no localStorage para demonstração
        this.saveToLocalStorage(mockOrder);
        observer.next(mockOrder);
        observer.complete();
      }, 1000);
    });
  }

  getOrder(id: string): Observable<Order> {
    // Mock - busca do localStorage
    return new Observable(observer => {
      setTimeout(() => {
        const orders = this.getOrdersFromLocalStorage();
        const order = orders.find(o => o.id === id);
        observer.next(order || this.createMockOrder(id));
        observer.complete();
      }, 500);
    });
  }

  getAllOrders(): Observable<Order[]> {
    // Mock - busca do localStorage
    return new Observable(observer => {
      setTimeout(() => {
        const orders = this.getOrdersFromLocalStorage();
        observer.next(orders);
        observer.complete();
      }, 500);
    });
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    return new Observable(observer => {
      setTimeout(() => {
        const orders = this.getOrdersFromLocalStorage();
        const orderIndex = orders.findIndex(o => o.id === id);
        
        if (orderIndex !== -1) {
          orders[orderIndex].status = status;
          localStorage.setItem('orders', JSON.stringify(orders));
          observer.next(orders[orderIndex]);
        } else {
          observer.next(this.createMockOrder(id, status));
        }
        observer.complete();
      }, 500);
    });
  }

  private startPolling(): void {
    interval(5000).pipe(
      switchMap(() => this.getAllOrders())
    ).subscribe(orders => {
      this.ordersSubject.next(orders);
    });
  }

  getOrdersObservable(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  private saveToLocalStorage(order: Order): void {
    const orders = this.getOrdersFromLocalStorage();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Também salva nos pedidos recentes
    let recentOrders: Order[] = JSON.parse(localStorage.getItem('recentOrders') || '[]');
    recentOrders.unshift(order);
    recentOrders = recentOrders.slice(0, 5);
    localStorage.setItem('recentOrders', JSON.stringify(recentOrders));
  }

  private getOrdersFromLocalStorage(): Order[] {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }

  private createMockOrder(id: string, status: OrderStatus = OrderStatus.RECEIVED): Order {
    return {
      id: id,
      customerName: 'Cliente Teste',
      phone: '11999999999',
      address: 'Rua Teste, 123',
      items: [
        {
          productId: '1',
          productName: 'Pizza Margherita',
          quantity: 1,
          price: 35.90
        }
      ],
      total: 35.90,
      status: status,
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 45 * 60000)
    };
  }
}