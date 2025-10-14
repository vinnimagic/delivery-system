import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Pizza Margherita',
      description: 'Molho de tomate, muçarela e manjericão fresco',
      price: 35.90,
      category: 'Pizzas',
      imageUrl: '/assets/images/pizza-margherita.jpg',
      available: true
    },
    {
      id: '2',
      name: 'Hambúrguer Clássico',
      description: 'Pão, hambúrguer 180g, queijo, alface e tomate',
      price: 22.50,
      category: 'Lanches',
      imageUrl: '/assets/images/hamburguer.jpg',
      available: true
    },
    {
      id: '3',
      name: 'Coca-Cola 2L',
      description: 'Refrigerante Coca-Cola 2 litros',
      price: 10.00,
      category: 'Bebidas',
      imageUrl: '/assets/images/coca-cola.jpg',
      available: true
    },
    {
      id: '4',
      name: 'Batata Frita',
      description: 'Porção de batata frita crocante',
      price: 12.00,
      category: 'Acompanhamentos',
      imageUrl: '/assets/images/fries.jpg',
      available: true
    },
    {
      id: '5',
      name: 'Pizza Calabresa',
      description: 'Molho de tomate, muçarela e calabresa fatiada',
      price: 38.90,
      category: 'Pizzas',
      imageUrl: '/assets/images/pizza-calabresa.jpg',
      available: true
    },
    {
      id: '6',
      name: 'X-Bacon',
      description: 'Hambúrguer, queijo, bacon e maionese',
      price: 25.90,
      category: 'Lanches',
      imageUrl: '/assets/images/x-bacon.jpg',
      available: true
    },
    {
      id: '7',
      name: 'Guaraná Antarctica 2L',
      description: 'Refrigerante Guaraná Antarctica 2 litros',
      price: 9.50,
      category: 'Bebidas',
      imageUrl: '/assets/images/guarana.jpg',
      available: true
    },
    {
      id: '8',
      name: 'Onion Rings',
      description: 'Porção de anéis de cebola empanados',
      price: 14.00,
      category: 'Acompanhamentos',
      imageUrl: '/assets/images/onion-rings.jpg',
      available: true
    }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts);
  }

  getProduct(id: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const products = this.mockProducts.filter(p => p.category === category);
    return of(products);
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.mockProducts.map(p => p.category))];
    return of(categories);
  }
}