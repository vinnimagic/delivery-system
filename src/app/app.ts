import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-content">
        <span class="logo">🍕 Delivery System</span>
        <div class="nav-links">
          <a routerLink="/" class="nav-link">Início</a>
          <a routerLink="/novo-pedido" class="nav-link">Fazer Pedido</a>
          <a routerLink="/restaurante" class="nav-link">Restaurante</a>
          <a routerLink="/criarpratos" class="nav-link">Criar pratos</a>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: #3f51b5;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .nav-links {
      display: flex;
      gap: 20px;
    }
    .nav-link {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .nav-link:hover {
      background: rgba(255,255,255,0.1);
    }
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: calc(100vh - 80px);
    }
  `]
})
export class App {
  title = 'delivery-system';
}