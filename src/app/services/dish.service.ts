import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish } from '../models/dish.models';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  
  // ✅ URL CORRETA DO SEU BACKEND
  private apiUrl = 'http://localhost:8080/dishes';

  constructor(private http: HttpClient) {
    console.log('🔧 DishService inicializado com URL:', this.apiUrl);
  }

  // ✅ Buscar todos os pratos
  findAll(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.apiUrl);
  }

  // ✅ Buscar prato por ID
  findById(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/${id}`);
  }

  // ✅ Criar novo prato
  create(dish: Dish): Observable<Dish> {
    console.log('🚀 Enviando POST para:', this.apiUrl);
    console.log('📦 Dados do prato:', dish);
    return this.http.post<Dish>(this.apiUrl, dish);
  }

  // ✅ Atualizar prato
  update(id: number, dish: Dish): Observable<Dish> {
    return this.http.put<Dish>(`${this.apiUrl}/${id}`, dish);
  }

  // ✅ Apagar prato
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}