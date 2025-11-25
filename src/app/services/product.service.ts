import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    // ... seus produtos mockados existentes
  ];

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts);
  }

  getProduct(id: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product);
  }


  createProduct(product: Product): Observable<Product> {
    console.log('🛒 Adicionando produto ao array mock:', product);
    
    // Garante que o produto tem todos os campos necessários
    const completeProduct: Product = {
      id: product.id || Date.now().toString(),
      name: product.name,
      description: product.description,
      price: product.price,
     
    };

    this.mockProducts.push(completeProduct);
    console.log('📋 Produtos agora:', this.mockProducts);
    
    return of(completeProduct);
  }
}