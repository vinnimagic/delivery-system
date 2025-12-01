import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <header class="hero-section">
        <div class="hero-content">
          <h1>Delivery Rápido e Saboroso</h1>
          <p>Peça sua comida favorita e receba em casa</p>
          <button routerLink="/novo-pedido" class="btn-primary">
            🍕 FAZER PEDIDO
          </button>
        </div>
      </header>

      <section class="features-section">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>Entrega Rápida</h3>
            <p>Entregamos em até 45 minutos</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🍕</div>
            <h3>Comida Quality</h3>
            <p>Ingredientes selecionados</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Acompanhe seu Pedido</h3>
            <p>Saiba onde está seu pedido em tempo real</p>
          </div>
        </div>
      </section>

      <section class="recent-orders-section" *ngIf="recentOrders.length > 0">
        <h2>Seus Pedidos Recentes</h2>
        <div class="orders-grid">
          <div *ngFor="let order of recentOrders" class="order-card">
            <h3>Pedido #{{getOrderId(order.id)}}</h3>
            <p><strong>Status:</strong> <span [class]="getStatusClass(order.status)">{{order.status}}</span></p>
            <p><strong>Total:</strong> R$ {{order.total?.toFixed(2)}}</p>
            <p><strong>Data:</strong> {{formatDate(order.createdAt)}}</p>
            <button [routerLink]="['/acompanhar-pedido', order.id]" class="btn-secondary">
              📱 Acompanhar
            </button>
          </div>
        </div>
      </section>

      <div *ngIf="recentOrders.length === 0" class="no-orders">
        <h3>Bem-vindo ao Delivery System!</h3>
        <p>Faça seu primeiro pedido e aproveite nossa comida deliciosa!</p>
        <button routerLink="/novo-pedido" class="btn-primary">
          🍔 FAZER MEU PRIMEIRO PEDIDO
        </button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 0;
      text-align: center;
      border-radius: 12px;
      margin-bottom: 60px;
    }
    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    .hero-content p {
      font-size: 1.3rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    .btn-primary {
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
    }
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
    }
    .btn-secondary {
      background: #4ecdc4;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 10px;
      transition: background 0.3s ease;
    }
    .btn-secondary:hover {
      background: #45b7af;
    }
    
    .features-section {
      margin-bottom: 60px;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }
    .feature-card {
      text-align: center;
      padding: 30px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    .feature-card:hover {
      transform: translateY(-5px);
    }
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }
    .feature-card h3 {
      margin-bottom: 10px;
      color: #333;
    }
    
    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 25px;
      margin-top: 30px;
    }
    .order-card {
      border: 1px solid #e0e0e0;
      padding: 25px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
    }
    .order-card:hover {
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    .order-card h3 {
      color: #333;
      margin-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
    }
    .order-card p {
      margin-bottom: 8px;
      color: #666;
    }
    
    .no-orders {
      text-align: center;
      padding: 60px 40px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border-radius: 12px;
      margin-top: 40px;
    }
    .no-orders h3 {
      font-size: 2rem;
      margin-bottom: 15px;
    }
    .no-orders p {
      font-size: 1.2rem;
      margin-bottom: 25px;
      opacity: 0.9;
    }
    
    .status-recebido { color: #2196F3; font-weight: 600; }
    .status-preparo { color: #FF9800; font-weight: 600; }
    .status-rota { color: #9C27B0; font-weight: 600; }
    .status-entregue { color: #4CAF50; font-weight: 600; }
  `]
})
export class HomeComponent implements OnInit {
  recentOrders: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadRecentOrders();
  }

  loadRecentOrders(): void {
    const storedOrders = localStorage.getItem('recentOrders');
    if (storedOrders) {
      this.recentOrders = JSON.parse(storedOrders);
    }
  }

  getOrderId(id: string): string {
    return id ? id.substring(0, 8).toUpperCase() : 'N/A';
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

  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}