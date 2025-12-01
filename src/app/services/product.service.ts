import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Product } from '../models/product.model';
import { Dish } from '../models/dish.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/dishes';

  constructor(private http: HttpClient) {
    console.log('🔧 ProductService inicializado com backend:', this.apiUrl);
  }

  // ✅ BUSCA PRODUTOS DO BACKEND (converte Dish para Product)
  getProducts(): Observable<Product[]> {
    return this.http.get<Dish[]>(this.apiUrl).pipe(
      map(dishes => dishes.map(dish => this.dishToProduct(dish))),
      tap(products => console.log('📦 Produtos carregados do backend:', products.length))
    );
  }

  // ✅ BUSCA PRODUTO POR ID
  getProduct(id: string): Observable<Product | undefined> {
    return this.http.get<Dish>(`${this.apiUrl}/${id}`).pipe(
      map(dish => this.dishToProduct(dish))
    );
  }

  // ✅ BUSCA PRODUTOS POR CATEGORIA
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Dish[]>(this.apiUrl).pipe(
      map(dishes => dishes
        .filter(dish => dish.category === category)
        .map(dish => this.dishToProduct(dish))
      )
    );
  }

  // ✅ BUSCA CATEGORIAS
  getCategories(): Observable<string[]> {
    return this.http.get<Dish[]>(this.apiUrl).pipe(
      map(dishes => [...new Set(dishes.map(dish => dish.category || 'Pratos'))])
    );
  }

  // ✅ CRIA PRODUTO NO BACKEND
  createProduct(product: Product): Observable<Product> {
    const dish: Dish = this.productToDish(product);
    
    console.log('🚀 Criando produto no backend:', dish);
    
    return this.http.post<Dish>(this.apiUrl, dish).pipe(
      map(createdDish => this.dishToProduct(createdDish)),
      tap(createdProduct => console.log('✅ Produto criado no backend:', createdProduct))
    );
  }

  // ✅ ATUALIZA PRODUTO
  updateProduct(product: Product): Observable<Product> {
    const dish: Dish = this.productToDish(product);
    
    return this.http.put<Dish>(`${this.apiUrl}/${product.id}`, dish).pipe(
      map(updatedDish => this.dishToProduct(updatedDish))
    );
  }

  // ✅ DELETA PRODUTO
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅ CONVERTE DISH (BACKEND) PARA PRODUCT (FRONTEND)
  private dishToProduct(dish: Dish): Product {
    return {
      id: dish.id?.toString() || 'unknown',
      name: dish.name,
      description: dish.description,
      price: dish.price,
  
    };
  }

  

  // ✅ CONVERTE PRODUCT (FRONTEND) PARA DISH (BACKEND)
  private productToDish(product: Product): Dish {
    return {
      id: product.id ? parseInt(product.id) : undefined,
      name: product.name,
      description: product.description,
      price: product.price,

    };
  }
}