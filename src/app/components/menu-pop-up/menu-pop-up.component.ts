import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn-open" (click)="open()" aria-haspopup="dialog">
      Ver pratos
    </button>

    <div class="overlay" *ngIf="isOpen" (click)="close()" role="dialog" aria-modal="true">
      <div class="popup" (click)="$event.stopPropagation()">
        <header class="popup-header">
          <h3>Pratos cadastrados</h3>
          <button class="close-x" (click)="close()" aria-label="Fechar">×</button>
        </header>

        <div class="popup-body">
          <!-- usa async as para evitar múltiplas subscriptions -->
          <ng-container *ngIf="products$ | async as products">
            <div *ngIf="!products?.length" class="center muted">Nenhum prato cadastrado.</div>

            <ul *ngIf="products?.length" class="dishes-list">
              <li *ngFor="let p of products" class="dish-item">
                <div class="dish-row">
                  <div>
                    <div class="dish-name">{{ p.name }}</div>
                    <div class="dish-desc" *ngIf="p.description">{{ p.description }}</div>
                  </div>
                  <div class="dish-price" *ngIf="p.price">R$ {{ p.price }}</div>
                </div>
              </li>
            </ul>
          </ng-container>

          <!-- caso products$ ainda não emitiu, pode mostrar loading opcional -->
        </div>

        <footer class="popup-footer">
          <button class="close-btn" (click)="close()">Fechar</button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host { display:inline-block; }
    .btn-open { padding:6px 10px; border-radius:8px; border:1px solid rgba(255,255,255,0.18); background: transparent; color: inherit; cursor:pointer; font-weight:600; margin-left:8px; }
    .overlay { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.45); z-index:2000; padding:16px; }
    .popup { background:#fff; width:100%; max-width:720px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.2); overflow:auto; max-height:80vh; padding:16px; }
    .popup-header { display:flex; align-items:center; justify-content:space-between; }
    .close-x { background:transparent; border:none; font-size:20px; cursor:pointer; }
    .popup-body { padding:12px 0; }
    .center { text-align:center; padding:16px 0; color:#666; }
    .muted { color:#6b7280; margin-top:6px; font-size:0.95rem; }
    .dishes-list { list-style:none; padding:0; margin:0; display:grid; gap:10px; }
    .dish-item { padding:10px; border-radius:8px; background:#f7f7f8; }
    .dish-row { display:flex; justify-content:space-between; gap:12px; align-items:center; }
    .dish-name { font-weight:600; }
    .dish-desc { color:#374151; font-size:0.95rem; margin-top:6px; }
    .dish-price { font-weight:600; color:#111827; }
    .popup-footer { display:flex; justify-content:flex-end; margin-top:12px; }
    .close-btn { background:#dc2626; color:#fff; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; }
  `]
})
export class MenuPopupComponent {
  products$: Observable<Product[]>;
  isOpen = false;

  constructor(private productService: ProductService) {
    this.products$ = this.productService.products$;
  }

  open() { this.isOpen = true; }
  close() { this.isOpen = false; }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) { if (e.key === 'Escape') this.close(); }
}
