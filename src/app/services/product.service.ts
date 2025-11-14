import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private storageKey = 'produtosHamburgueria';
  private products: Product[] = [];

  constructor() {
    this.loadFromStorage();
    // caso ainda não tenha nada salvo, popula com produtos iniciais
    if (this.products.length === 0) {
      this.products = this.getDefaultProducts();
      this.saveToStorage();
    }
  }

  private getDefaultProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Hambúrguer Clássico',
        description: 'Pão, hambúrguer 180g, queijo, alface e tomate',
        price: 22.50,
        category: 'Hambúrguer',
        imageUrl: '/assets/images/hamburguer.jpg',
        available: true
      },
      {
        id: '2',
        name: 'X-Bacon',
        description: 'Hambúrguer, queijo, bacon e maionese da casa',
        price: 25.90,
        category: 'Hambúrguer',
        imageUrl: '/assets/images/x-bacon.jpg',
        available: true
      },
      {
        id: '3',
        name: 'Batata Frita',
        description: 'Porção de batata frita crocante',
        price: 12.00,
        category: 'Acompanhamento',
        imageUrl: '/assets/images/fries.jpg',
        available: true
      },
      {
        id: '4',
        name: 'Onion Rings',
        description: 'Porção de anéis de cebola empanados',
        price: 14.00,
        category: 'Acompanhamento',
        imageUrl: '/assets/images/onion-rings.jpg',
        available: true
      },
      {
        id: '5',
        name: 'Coca-Cola 2L',
        description: 'Refrigerante Coca-Cola 2 litros',
        price: 10.00,
        category: 'Bebida',
        imageUrl: '/assets/images/coca-cola.jpg',
        available: true
      },
      {
        id: '6',
        name: 'Guaraná Antarctica 2L',
        description: 'Refrigerante Guaraná Antarctica 2 litros',
        price: 9.50,
        category: 'Bebida',
        imageUrl: '/assets/images/guarana.jpg',
        available: true
      },
      {
        id: '7',
        name: 'Combo Clássico',
        description: 'Hambúrguer clássico + Batata frita + Refrigerante 350ml',
        price: 34.90,
        category: 'Combo',
        imageUrl: '/assets/images/combo-classico.jpg',
        available: true
      },
      {
        id: '8',
        name: 'Milkshake Chocolate',
        description: 'Milkshake cremoso de chocolate com chantilly',
        price: 15.00,
        category: 'Sobremesa',
        imageUrl: '/assets/images/milkshake.jpg',
        available: true
      }
    ];
  }

  private loadFromStorage(): void {
    const data = localStorage.getItem(this.storageKey);
    this.products = data ? JSON.parse(data) : [];
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.products));
  }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProduct(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const products = this.products.filter(p => p.category === category);
    return of(products);
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.products.map(p => p.category))];
    return of(categories);
  }

  createProduct(product: Product): Observable<Product> {
    product.id = Date.now().toString();
    this.products.push(product);
    this.saveToStorage();
    return of(product);
  }

  deleteProduct(id: string): Observable<boolean> {
    this.products = this.products.filter(p => p.id !== id);
    this.saveToStorage();
    return of(true);
  }

  clearAll(): void {
    this.products = [];
    this.saveToStorage();
  }
}
