import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order, OrderStatus } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="tracking-container">
      <div class="header">
        <h2>📱 Acompanhamento do Pedido</h2>
        <button routerLink="/" class="btn-back">← Voltar para Início</button>
      </div>

      <div class="order-info-card" *ngIf="order">
        <div class="order-header">
        <h3>Pedido #{{getOrderId(order.id)}}</h3>
          <span class="status-badge" [class]="getStatusClass(order.status)">
            {{order.status}}
          </span>
        </div>
        
        <div class="order-details">
          <div class="detail-item">
            <strong>Cliente:</strong> {{order.customerName}}
          </div>
          <div class="detail-item">
            <strong>Telefone:</strong> {{order.phone}}
          </div>
          <div class="detail-item">
            <strong>Endereço:</strong> {{order.address}}
          </div>
          <div class="detail-item">
            <strong>Data:</strong> {{formatDate(order.createdAt)}}
          </div>
          <div class="detail-item">
            <strong>Previsão de entrega:</strong> {{getEstimatedTime()}}
          </div>
          <div class="detail-item">
            <strong>Total:</strong> R$ {{order.total?.toFixed(2)}}
          </div>
        </div>
      </div>

      <!-- Progresso do Pedido -->
      <div class="tracking-progress" *ngIf="order">
        <h3>Status do Pedido</h3>
        <div class="progress-steps">
          <div *ngFor="let step of statusSteps; let i = index" 
               class="step" 
               [class.active]="i <= currentStepIndex"
               [class.completed]="i < currentStepIndex">
            <div class="step-icon">{{i < currentStepIndex ? '✅' : step.icon}}</div>
            <div class="step-label">{{step.label}}</div>
            <div class="step-time" *ngIf="i < currentStepIndex">
              {{getStepTime(step.status)}}
            </div>
          </div>
        </div>
      </div>

      <!-- Itens do Pedido -->
      <div class="order-items" *ngIf="order">
        <h3>Itens do Pedido</h3>
        <div class="items-list">
          <div *ngFor="let item of order.items" class="item-card">
            <div class="item-info">
              <h4>{{item.productName}}</h4>
              <p>Quantidade: {{item.quantity}}</p>
            </div>
            <div class="item-price">
              R$ {{(item.price * item.quantity).toFixed(2)}}
            </div>
          </div>
        </div>
        <div class="order-total">
          <strong>Total: R$ {{order.total?.toFixed(2)}}</strong>
        </div>
      </div>

      <!-- Mapa Simulado -->
      <div class="delivery-map" *ngIf="order && order.status !== 'ENTREGUE'">
        <h3>📍 Rota de Entrega</h3>
        <div class="map-container">
          <div class="map-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="deliveryProgress"></div>
            </div>
            <div class="map-points">
              <div class="point restaurant" [class.active]="deliveryProgress < 70">
                <span>🏪 Restaurante</span>
              </div>
              <div class="point delivery" [class.active]="deliveryProgress >= 30 && deliveryProgress < 100">
                <span>🚚 Entregador</span>
              </div>
              <div class="point customer" [class.active]="deliveryProgress >= 70">
                <span>🏠 Sua Casa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pedido Entregue -->
      <div class="delivery-completed" *ngIf="order?.status === 'ENTREGUE'">
        <div class="completed-card">
          <div class="completed-icon">🎉</div>
          <h3>Pedido Entregue!</h3>
          <p>Seu pedido foi entregue com sucesso. Aproveite sua refeição!</p>
          <button routerLink="/novo-pedido" class="btn-primary">
            🍕 Fazer Novo Pedido
          </button>
        </div>
      </div>

      <div *ngIf="!order" class="loading">
        <p>Carregando informações do pedido...</p>
      </div>
    </div>
  `,
  styles: [`
    .tracking-container {
      max-width: 800px;
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
      text-decoration: none;
    }

    .order-info-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .order-header h3 {
      margin: 0;
      color: #333;
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
      gap: 10px;
    }
    .detail-item {
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .tracking-progress {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    .tracking-progress h3 {
      margin-bottom: 20px;
      color: #333;
    }
    .progress-steps {
      display: flex;
      justify-content: space-between;
      position: relative;
    }
    .progress-steps::before {
      content: '';
      position: absolute;
      top: 30px;
      left: 10%;
      right: 10%;
      height: 4px;
      background: #e0e0e0;
      z-index: 1;
    }
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
      flex: 1;
    }
    .step.completed .step-icon {
      background: #4caf50;
      color: white;
    }
    .step.active .step-icon {
      background: #2196f3;
      color: white;
      animation: pulse 2s infinite;
    }
    .step-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 10px;
      transition: all 0.3s ease;
    }
    .step-label {
      font-weight: 600;
      text-align: center;
      margin-bottom: 5px;
    }
    .step-time {
      font-size: 0.8rem;
      color: #666;
      text-align: center;
    }

    .order-items {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    .order-items h3 {
      margin-bottom: 20px;
      color: #333;
    }
    .items-list {
      margin-bottom: 20px;
    }
    .item-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .item-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }
    .item-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
    .item-price {
      font-weight: 600;
      color: #e91e63;
    }
    .order-total {
      text-align: right;
      padding-top: 15px;
      border-top: 2px solid #e0e0e0;
      font-size: 1.2rem;
      color: #333;
    }

    .delivery-map {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    .delivery-map h3 {
      margin-bottom: 20px;
      color: #333;
    }
    .map-container {
      padding: 20px;
    }
    .progress-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      margin: 40px 0;
      position: relative;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4caf50, #8bc34a);
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    .map-points {
      display: flex;
      justify-content: space-between;
      position: relative;
    }
    .point {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #999;
    }
    .point.active {
      color: #333;
    }
    .point span {
      margin-top: 10px;
      font-weight: 600;
    }

    .delivery-completed {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      margin-bottom: 30px;
    }
    .completed-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    .completed-card h3 {
      color: #4caf50;
      margin-bottom: 15px;
    }
    .completed-card p {
      color: #666;
      margin-bottom: 25px;
      font-size: 1.1rem;
    }

    .loading {
      text-align: center;
      padding: 60px;
      color: #666;
    }

    .btn-primary {
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `]
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  orderId: string = '';
  order: Order | null = null;
  deliveryProgress: number = 0;
  private subscription: Subscription = new Subscription();

  statusSteps = [
    { status: 'RECEBIDO', label: 'Pedido Recebido', icon: '📋' },
    { status: 'EM_PREPARO', label: 'Em Preparação', icon: '👨‍🍳' },
    { status: 'EM_ROTA', label: 'Saiu para Entrega', icon: '🚚' },
    { status: 'ENTREGUE', label: 'Entregue', icon: '🏠' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    this.loadOrder();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadOrder(): void {
    this.orderService.getOrder(this.orderId).subscribe(order => {
      this.order = order;
      this.updateDeliveryProgress();
    });
  }

  startPolling(): void {
    this.subscription.add(
      this.orderService.getOrdersObservable().subscribe(orders => {
        const updatedOrder = orders.find(o => o.id === this.orderId);
        if (updatedOrder) {
          this.order = updatedOrder;
          this.updateDeliveryProgress();
        }
      })
    );
  }

  updateDeliveryProgress(): void {
    if (!this.order) return;

    const progressMap: {[key: string]: number} = {
      'RECEBIDO': 10,
      'EM_PREPARO': 40,
      'EM_ROTA': 70,
      'ENTREGUE': 100
    };

    this.deliveryProgress = progressMap[this.order.status] || 0;
  }

  get currentStepIndex(): number {
    if (!this.order) return 0;
    return this.statusSteps.findIndex(step => step.status === this.order!.status);
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

  getEstimatedTime(): string {
    if (!this.order?.estimatedDelivery) return 'Calculando...';
    
    const now = new Date();
    const delivery = new Date(this.order.estimatedDelivery);
    const diff = delivery.getTime() - now.getTime();
    const minutes = Math.max(0, Math.round(diff / 60000));
    
    if (minutes <= 0) return 'Chegando agora';
    return `${minutes} min`;
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('pt-BR');
  }

  getStepTime(status: string): string {
    // Simula horários para cada etapa
    const times: {[key: string]: string} = {
      'RECEBIDO': '15:30',
      'EM_PREPARO': '15:45',
      'EM_ROTA': '16:10',
      'ENTREGUE': '16:35'
    };
    return times[status] || '';
  }
  getOrderId(id: string | undefined): string {
    return id ? id.substring(0, 8).toUpperCase() : 'N/A';
  }
}