import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { Order, OrderItem } from '../../models/order.model';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../models/dish.models';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="new-order-container">
      <div class="header">
        <h2>🍔 Novo Pedido</h2>
        <div class="header-buttons">
          <button (click)="toggleDishesModal()" class="btn-view-dishes">👀 Ver Todos os Pratos</button>
          <button routerLink="/" class="btn-back">← Voltar para Início</button>
        </div>
      </div>

      <!-- Modal de Todos os Pratos -->
      <div class="dishes-modal-overlay" *ngIf="showDishesModal" (click)="closeDishesModal()">
        <div class="dishes-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>📋 Todos os Pratos Cadastrados</h3>
            <button class="btn-close" (click)="closeDishesModal()">✕</button>
          </div>
          <div class="modal-content">
            <div *ngIf="allDishes.length > 0" class="dishes-list">
              <div *ngFor="let dish of allDishes" class="dish-item">
                <div class="dish-info">
                  <h4>{{dish.name}}</h4>
                  <p class="dish-description">{{dish.description}}</p>
                  <p class="dish-price"><strong>R$ {{dish.price ? dish.price.toFixed(2) : '0.00'}}</strong></p>
                </div>
                <button (click)="addDishToCart(dish)" class="btn-add-dish">+ Adicionar</button>
              </div>
            </div>
            <div *ngIf="allDishes.length === 0" class="no-dishes">
              <p>Nenhum prato cadastrado</p>
            </div>
          </div>
        </div>
      </div>

      <div class="order-steps">
        <div class="step active">1. Produtos</div>
        <div class="step">2. Dados Pessoais</div>
        <div class="step">3. Confirmação</div>
      </div>

      <!-- Seleção de Produtos -->
      <div class="products-section" *ngIf="currentStep === 1">
        <h3>Selecione seus produtos</h3>
        
        <div class="products-grid">
          <div *ngFor="let product of products" 
               class="product-card" 
               [class.selected]="isProductInCart(product)"
               (click)="toggleProduct(product)">
            <div class="product-image">
              <span class="image-placeholder">🍕</span>
            </div>
            <div class="product-info">
              <h4>{{product.name}}</h4>
              <p class="description">{{product.description}}</p>
              <p class="price">R$ {{product.price.toFixed(2)}}</p>
            </div>
            <div class="quantity-controls" *ngIf="isProductInCart(product)">
              <button (click)="decreaseQuantity(product, $event)" class="qty-btn">−</button>
              <span class="quantity">{{getProductQuantity(product)}}</span>
              <button (click)="increaseQuantity(product, $event)" class="qty-btn">+</button>
            </div>
          </div>
        </div>

        <div class="cart-summary" *ngIf="cartItems.length > 0">
          <h4>Seu Pedido</h4>
          <div *ngFor="let item of cartItems" class="cart-item">
            <span>{{item.productName}} x {{item.quantity}}</span>
            <span>R$ {{(item.price * item.quantity).toFixed(2)}}</span>
          </div>
          <div class="cart-total">
            <strong>Total: R$ {{getTotal().toFixed(2)}}</strong>
          </div>
          <button (click)="nextStep()" class="btn-primary btn-continue">
            Continuar para Dados Pessoais →
          </button>
        </div>

        <div *ngIf="cartItems.length === 0" class="empty-cart">
          <p>Selecione alguns produtos para continuar</p>
        </div>
      </div>

      <!-- Dados Pessoais -->
      <div class="customer-section" *ngIf="currentStep === 2">
        <h3>Seus dados</h3>
        
        <form [formGroup]="customerForm" class="customer-form">
          <div class="form-group">
            <label for="customerName">Nome completo *</label>
            <input type="text" id="customerName" formControlName="customerName" 
                   placeholder="Digite seu nome completo">
          </div>

          <div class="form-group">
            <label for="phone">Telefone *</label>
            <input type="tel" id="phone" formControlName="phone" 
                   placeholder="(11) 99999-9999">
          </div>

          <div class="form-group">
            <label for="address">Endereço de entrega *</label>
            <textarea id="address" formControlName="address" 
                      placeholder="Rua, número, bairro, complemento..."
                      rows="3"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" (click)="prevStep()" class="btn-back">
              ← Voltar
            </button>
            <button type="button" (click)="nextStep()" 
                    [disabled]="!customerForm.valid" 
                    class="btn-primary">
              Continuar para Confirmação →
            </button>
          </div>
        </form>
      </div>

      <!-- Confirmação  oidweadwadw-->
      <div class="confirmation-section" *ngIf="currentStep === 3">
        <h3>Confirmação do Pedido</h3>
        
        <div class="order-review">
          <div class="review-section">
            <h4>Dados Pessoais</h4>
            <p><strong>Nome:</strong> {{customerForm.value.customerName}}</p>
            <p><strong>Telefone:</strong> {{customerForm.value.phone}}</p>
            <p><strong>Endereço:</strong> {{customerForm.value.address}}</p>
          </div>

          <div class="review-section">
            <h4>Itens do Pedido</h4>
            <div *ngFor="let item of cartItems" class="review-item">
              <span>{{item.productName}} x {{item.quantity}}</span>
              <span>R$ {{(item.price * item.quantity).toFixed(2)}}</span>
            </div>
            <div class="review-total">
              <strong>Total: R$ {{getTotal().toFixed(2)}}</strong>
            </div>
          </div>
        </div>

        <div class="confirmation-actions">
          <button (click)="prevStep()" class="btn-back">
            ← Voltar
          </button>
          <button (click)="submitOrder()" 
                  [disabled]="isSubmitting" 
                  class="btn-primary btn-confirm">
            {{isSubmitting ? 'Enviando...' : '✅ Confirmar Pedido'}}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .new-order-container {
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
      text-decoration: none;
      display: inline-block;
    }
    
    .order-steps {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
    }
    .step {
      padding: 10px 20px;
      margin: 0 10px;
      border: 2px solid #e0e0e0;
      border-radius: 20px;
      color: #999;
    }
    .step.active {
      background: #3f51b5;
      color: white;
      border-color: #3f51b5;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .product-card {
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    .product-card:hover {
      border-color: #3f51b5;
      transform: translateY(-2px);
    }
    .product-card.selected {
      border-color: #4caf50;
      background: #f8fff8;
    }
    .product-image {
      text-align: center;
      font-size: 3rem;
      margin-bottom: 15px;
    }
    .product-info h4 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .description {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 10px;
      flex-grow: 1;
    }
    .price {
      font-weight: bold;
      color: #e91e63;
      font-size: 1.2rem;
      margin: 0;
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 10px;
    }
    .qty-btn {
      background: #3f51b5;
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
    }
    .quantity {
      font-weight: bold;
      min-width: 30px;
      text-align: center;
    }
    
    .cart-summary {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 12px;
      border: 2px solid #e9ecef;
    }
    .cart-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #dee2e6;
    }
    .cart-total {
      display: flex;
      justify-content: space-between;
      padding: 15px 0 0 0;
      border-top: 2px solid #dee2e6;
      margin-top: 15px;
      font-size: 1.2rem;
    }
    .btn-continue {
      width: 100%;
      margin-top: 20px;
    }
    
    .empty-cart {
      text-align: center;
      padding: 40px;
      color: #666;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .customer-form {
      max-width: 600px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: #333;
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
    }
    .form-group input:focus, .form-group textarea:focus {
      border-color: #3f51b5;
      outline: none;
    }
    
    .form-actions, .confirmation-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }
    
    .order-review {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    .review-section {
      margin-bottom: 25px;
    }
    .review-section h4 {
      color: #333;
      margin-bottom: 15px;
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 8px;
    }
    .review-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
    }
    .review-total {
      display: flex;
      justify-content: space-between;
      padding: 15px 0 0 0;
      border-top: 2px solid #dee2e6;
      margin-top: 15px;
      font-size: 1.2rem;
    }
    
    .btn-primary {
      background: #4caf50;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .btn-primary:hover:not(:disabled) {
      background: #45a049;
    }
    .btn-primary:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
    
    .btn-confirm {
      background: #ff6b6b;
      font-size: 1.1rem;
      padding: 15px 30px;
    }
    .btn-confirm:hover:not(:disabled) {
      background: #ff5252;
    }
    
    .header-buttons {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .btn-view-dishes {
      background: #2196f3;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s ease;
      font-size: 0.95rem;
    }
    
    .btn-view-dishes:hover {
      background: #1976d2;
    }
    
    /* Modal Styles */
    .dishes-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .dishes-modal {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .modal-header h3 {
      margin: 0;
      color: #333;
    }
    
    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s ease;
    }
    
    .btn-close:hover {
      background: #f0f0f0;
    }
    
    .modal-content {
      overflow-y: auto;
      flex: 1;
      padding: 20px;
    }
    
    .dishes-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .dish-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #f9f9f9;
      transition: all 0.2s ease;
    }
    
    .dish-item:hover {
      background: #f0f7ff;
      border-color: #2196f3;
    }
    
    .dish-info {
      flex: 1;
      margin-right: 15px;
    }
    
    .dish-item h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 1.1rem;
    }
    
    .dish-description {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .dish-price {
      margin: 0;
      color: #e91e63;
      font-size: 1rem;
    }
    
    .btn-add-dish {
      background: #4caf50;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.3s ease;
      font-weight: 600;
    }
    
    .btn-add-dish:hover {
      background: #45a049;
    }
    
    .no-dishes {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }
  `]
})
export class NewOrderComponent implements OnInit {
  currentStep = 1;
  products: Product[] = [];
  cartItems: OrderItem[] = [];
  customerForm: FormGroup;
  isSubmitting = false;
  // If navigated from CriarPratos, we'll receive the created dish in history.state
  pendingCreatedDish: any = null;
  
  // Modal properties
  showDishesModal = false;
  allDishes: Dish[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private dishService: DishService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.customerForm = this.createForm();
  }

  ngOnInit(): void {
    // check navigation state for a created dish
    const st: any = window.history.state;
    if (st && st.createdDish) {
      this.pendingCreatedDish = st.createdDish;
    }

    this.loadProducts();
  }

  createForm(): FormGroup {
    return this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      // if we have a created dish from the previous page, inject it into the product list and add to cart
      if (this.pendingCreatedDish) {
        const d = this.pendingCreatedDish;
        const generatedId = d.id ? String(d.id) : `new-${Date.now()}`;
        const product: Product = {
          id: generatedId,
          name: d.name || 'Novo Prato',
          description: d.description || '',
          price: Number(d.price) || 0,

        };
        // Avoid duplicates
        const exists = this.products.some(p => p.id === product.id || p.name === product.name);
        if (!exists) {
          this.products.unshift(product);
        }
        // add to cart directly
        this.cartItems.push({
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price: product.price
        });
        // clear pending
        this.pendingCreatedDish = null;
      }
    });
  }

  toggleProduct(product: Product): void {
    const existingItem = this.cartItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Remove o produto se já estiver no carrinho
      this.cartItems = this.cartItems.filter(item => item.productId !== product.id);
    } else {
      // Adiciona o produto ao carrinho
      this.cartItems.push({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price
      });
    }
  }

  isProductInCart(product: Product): boolean {
    return this.cartItems.some(item => item.productId === product.id);
  }

  getProductQuantity(product: Product): number {
    const item = this.cartItems.find(i => i.productId === product.id);
    return item ? item.quantity : 0;
  }

increaseQuantity(product: Product, event: Event): void {
  event.stopPropagation(); // Impede que o clique chegue ao product-card
  const item = this.cartItems.find(i => i.productId === product.id);
  if (item) {
    item.quantity++;
  }
}

  decreaseQuantity(product: Product, event: Event): void {
    event.stopPropagation(); // Impede que o clique chegue ao product-card
    const item = this.cartItems.find(i => i.productId === product.id);
    if (item && item.quantity > 1) {
      item.quantity--;
    }
  }

  toggleDishesModal(): void {
    if (!this.showDishesModal) {
      this.loadAllDishes();
    }
    this.showDishesModal = !this.showDishesModal;
  }

  closeDishesModal(): void {
    this.showDishesModal = false;
  }

  loadAllDishes(): void {
    this.dishService.findAll().subscribe({
      next: (dishes: Dish[]) => {
        this.allDishes = dishes;
      },
      error: (error: any) => {
        console.error('Erro ao carregar pratos:', error);
        this.allDishes = [];
      }
    });
  }

  addDishToCart(dish: Dish): void {
    // Convertendo Dish para Product/OrderItem
    const productId = dish.id ? String(dish.id) : `dish-${Date.now()}`;
    const existingItem = this.cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({
        productId: productId,
        productName: dish.name,
        quantity: 1,
        price: dish.price || 0
      });
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitOrder(): void {
    if (this.customerForm.valid && this.cartItems.length > 0) {
      this.isSubmitting = true;
  
      const order: Order = {
        ...this.customerForm.value,
        items: this.cartItems,
        total: this.getTotal(),
        status: 'RECEBIDO' as any
      };
  
      this.orderService.createOrder(order).subscribe({
        next: (createdOrder: Order) => {
          this.isSubmitting = false;
          this.router.navigate(['/acompanhar-pedido', createdOrder.id]);
        },
        error: (error: any) => {
          console.error('Erro ao criar pedido:', error);
          this.isSubmitting = false;
          alert('Erro ao criar pedido. Tente novamente.');
        }
      });
    }
  }
}