import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-delivery-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="delivery-map">
      <h3>📍 Rota de Entrega</h3>
      <div class="map-container">
        <div class="map-progress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="deliveryProgress"></div>
          </div>
          <div class="map-points">
            <div class="point restaurant" [class.active]="deliveryProgress < 70">
              <div class="point-marker">🏪</div>
              <span>Restaurante</span>
            </div>
            <div class="point delivery" [class.active]="deliveryProgress >= 30 && deliveryProgress < 100">
              <div class="point-marker">🚚</div>
              <span>Entregador</span>
            </div>
            <div class="point customer" [class.active]="deliveryProgress >= 70">
              <div class="point-marker">🏠</div>
              <span>Sua Casa</span>
            </div>
          </div>
        </div>
      </div>
      <div class="delivery-info">
        <p><strong>Progresso da entrega:</strong> {{deliveryProgress}}%</p>
        <p *ngIf="deliveryProgress < 100">Seu pedido está a caminho...</p>
        <p *ngIf="deliveryProgress === 100">🎉 Pedido entregue!</p>
      </div>
    </div>
  `,
  styles: [`
    .delivery-map {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .delivery-map h3 {
      margin-bottom: 20px;
      color: #333;
      text-align: center;
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
      overflow: hidden;
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
      transition: color 0.3s ease;
    }
    .point.active {
      color: #333;
    }
    .point-marker {
      font-size: 2rem;
      margin-bottom: 8px;
    }
    .point span {
      font-weight: 600;
      font-size: 0.9rem;
    }
    .delivery-info {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
    .delivery-info p {
      margin: 5px 0;
      color: #666;
    }
  `]
})
export class DeliveryMapComponent implements OnInit {
  @Input() order!: Order;
  deliveryProgress: number = 0;

  ngOnInit(): void {
    this.simulateDelivery();
  }

  simulateDelivery(): void {
    const progressMap: {[key: string]: number} = {
      'RECEBIDO': 10,
      'EM_PREPARO': 30,
      'EM_ROTA': 70,
      'ENTREGUE': 100
    };

    this.deliveryProgress = progressMap[this.order.status] || 0;
    
    // Anima o progresso
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress >= this.deliveryProgress) {
        clearInterval(interval);
        return;
      }
      currentProgress += 2;
      this.deliveryProgress = currentProgress;
    }, 100);
  }
}