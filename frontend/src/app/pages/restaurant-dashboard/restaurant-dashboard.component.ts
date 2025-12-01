import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order, OrderStatus } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h2>🏪 Painel do Restaurante</h2>
        <button routerLink="/" class="btn-back">← Voltar para Início</button>
      </div>

      <!-- Estatísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <h3>{{getOrdersCount('RECEBIDO')}}</h3>
            <p>Novos Pedidos</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👨‍🍳</div>
          <div class="stat-info">
            <h3>{{getOrdersCount('EM_PREPARO')}}</h3>
            <p>Em Preparação</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🚚</div>
          <div class="stat-info">
            <h3>{{getOrdersCount('EM_ROTA')}}</h3>
            <p>Em Entrega</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h3>{{getOrdersCount('ENTREGUE')}}</h3>
            <p>Entregues Hoje</p>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <h3>Filtrar por Status</h3>
        <div class="filter-buttons">
          <button *ngFor="let option of statusOptions" 
                  (click)="selectedStatus = option.value"
                  [class.active]="selectedStatus === option.value"
                  class="filter-btn">
            {{option.label}} ({{getOrdersCount(option.value)}})
          </button>
        </div>
      </div>

      <!-- Lista de Pedidos -->
      <div class="orders-section">
        <h3>Pedidos</h3>
        
        <div *ngIf="filteredOrders.length === 0" class="no-orders">
          <p>Nenhum pedido encontrado</p>
        </div>

        <div *ngFor="let order of filteredOrders" class="order-card">
          <div class="order-header">
            <div class="order-info">
            <h4>Pedido #{{getOrderId(order.id)}}</h4>
              <p class="order-time">{{formatDate(order.createdAt)}}</p>
            </div>
            <span class="status-badge" [class]="getStatusClass(order.status)">
              {{order.status}}
            </span>
          </div>

          <div class="order-details">
            <div class="customer-info">
              <p><strong>Cliente:</strong> {{order.customerName}}</p>
              <p><strong>Telefone:</strong> {{order.phone}}</p>
              <p><strong>Endereço:</strong> {{order.address}}</p>
            </div>
            
            <div class="order-items">
              <h5>Itens do Pedido:</h5>
              <div *ngFor="let item of order.items" class="item">
                {{item.quantity}}x {{item.productName}} - R$ {{(item.price * item.quantity).toFixed(2)}}
              </div>
              <div class="order-total">
                <strong>Total: R$ {{order.total?.toFixed(2)}}</strong>
              </div>
            </div>
          </div>

          <div class="order-actions">
            <button *ngIf="getNextStatus(order.status)" 
                    (click)="updateOrderStatus(order, getNextStatus(order.status)!)"
                    class="btn-next-status">
              Avançar para {{getNextStatusLabel(order.status)}}
            </button>
            <button *ngIf="order.status === 'ENTREGUE'" class="btn-completed" disabled>
              ✅ Pedido Finalizado
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    .header h2 {
      color: #333;
      margin: 0;
    }
    .btn-back {
      background: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .stat-icon {
      font-size: 2.5rem;
    }
    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }
    .stat-info p {
      margin: 5px 0 0 0;
      color: #666;
      font-weight: 600;
    }

    .filters {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    .filters h3 {
      margin-bottom: 15px;
      color: #333;
    }
    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .filter-btn {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .filter-btn.active {
      background: #3f51b5;
      color: white;
      border-color: #3f51b5;
    }
    .filter-btn:hover:not(.active) {
      background: #e9ecef;
    }

    .orders-section {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .orders-section h3 {
      margin-bottom: 20px;
      color: #333;
    }

    .no-orders {
      text-align: center;
      padding: 40px;
      color: #666;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .order-card {
      border: 2px solid #f0f0f0;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 20px;
      transition: all 0.3s ease;
    }
    .order-card:hover {
      border-color: #3f51b5;
      box-shadow: 0 4px 12px rgba(63, 81, 181, 0.1);
    }
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .order-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }
    .order-time {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .status-recebido { background: #e3f2fd; color: #1976d2; }
    .status-preparo { background: #fff3e0; color: #f57c00; }
    .status-rota { background: #f3e5f5; color: #7b1fa2; }
    .status-entregue { background: #e8f5e8; color: #388e3c; }

    .order-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 20px;
    }
    .customer-info p {
      margin: 0 0 8px 0;
      color: #666;
    }
    .order-items h5 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .item {
      padding: 5px 0;
      border-bottom: 1px solid #f0f0f0;
      color: #666;
    }
    .order-total {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid #e0e0e0;
      font-weight: 600;
      color: #333;
    }

    .order-actions {
      text-align: right;
    }
    .btn-next-status {
      background: #4caf50;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s ease;
    }
    .btn-next-status:hover {
      background: #45a049;
    }
    .btn-completed {
      background: #e0e0e0;
      color: #666;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .order-details {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .filter-buttons {
        flex-direction: column;
      }
      .header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
    }
  `]
})
export class RestaurantDashboardComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'ALL';
  private subscription: Subscription = new Subscription();

  statusOptions = [
    { value: 'ALL', label: 'Todos' },
    { value: 'RECEBIDO', label: 'Recebidos' },
    { value: 'EM_PREPARO', label: 'Em Preparo' },
    { value: 'EM_ROTA', label: 'Em Rota' },
    { value: 'ENTREGUE', label: 'Entregues' }
  ];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = this.sortOrders(orders);
      this.filterOrders();
    });
  }

  startPolling(): void {
    this.subscription.add(
      this.orderService.getOrdersObservable().subscribe(orders => {
        this.orders = this.sortOrders(orders);
        this.filterOrders();
      })
    );
  }

  sortOrders(orders: Order[]): Order[] {
    return orders.sort((a, b) => {
      const statusOrder = ['RECEBIDO', 'EM_PREPARO', 'EM_ROTA', 'ENTREGUE'];
      const statusA = statusOrder.indexOf(a.status);
      const statusB = statusOrder.indexOf(b.status);
      
      if (statusA !== statusB) {
        return statusA - statusB;
      }
      
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    });
  }

  filterOrders(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
  }

  getOrdersCount(status: string): number {
    if (status === 'ALL') return this.orders.length;
    return this.orders.filter(order => order.status === status).length;
  }

  getStatusClass(status: string): string {
    const statusMap: {[key: string]: string} = {
      'RECEBIDO': 'status-recebido',
      'EM_PREPARO': 'status-preparo',
      'EM_ROTA': 'status-rota',
      'ENTREGUE': 'status-entregue'
    };
    return statusMap[status] || '';
  }

  getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    const statusOrder: OrderStatus[] = [
      OrderStatus.RECEIVED, 
      OrderStatus.PREPARING, 
      OrderStatus.ON_ROUTE, 
      OrderStatus.DELIVERED
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;
  }

  getNextStatusLabel(currentStatus: OrderStatus): string {
    const nextStatus = this.getNextStatus(currentStatus);
    const labels: {[key: string]: string} = {
      'RECEBIDO': 'Em Preparo',
      'EM_PREPARO': 'Em Rota',
      'EM_ROTA': 'Entregue'
    };
    return labels[currentStatus] || '';
  }

  updateOrderStatus(order: Order, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id!, newStatus).subscribe({
      next: (updatedOrder) => {
        console.log('Status atualizado:', updatedOrder);
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status do pedido');
      }
    });
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('pt-BR');
  }
  getOrderId(id: string | undefined): string {
    return id ? id.substring(0, 8).toUpperCase() : 'N/A';
  }
}