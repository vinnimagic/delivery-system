import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DishService } from '../../services/dish.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Dish } from '../../models/dish.models'; 

@Component({
  selector: 'app-criarpedidos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './criarpedidos.component.html',
  styleUrls: ['./criarpedidos.component.scss']
})
export class CreateDishComponent implements OnInit {
  
  form!: FormGroup;
  loading = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private dishService: DishService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500)
      ]],
      price: [0, [
        Validators.required, 
        Validators.min(0.01),
        Validators.max(1000)
      ]],
      category: ['Pratos', [Validators.required]]
    });
  }

  get name() { return this.form.get('name'); }
  get description() { return this.form.get('description'); }
  get price() { return this.form.get('price'); }
  get category() { return this.form.get('category'); }

  save(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage

    const dishData: Dish = {
      name: this.form.value.name,
      description: this.form.value.description,
      price: this.form.value.price,
      category: this.form.value.category
    };

    console.log('📤 Enviando para o backend:', dishData);

    // ✅ SALVA NO BACKEND REAL
    this.dishService.create(dishData).subscribe({
      next: (createdDish) => {
        console.log('✅ Prato salvo no backend:', createdDish);
        
        // ✅ ADICIONA AO MOCK LOCAL (para aparecer no pedido atual)
        this.addToProductService(createdDish);
        
        // ✅ REDIRECIONA PARA O PEDIDO
        this.router.navigate(['/novo-pedido'], {
          state: { createdDish: createdDish }
        });
        alert('Prato criado com sucesso!');
        this.successMessage = 'Prato criado com sucesso!';
        
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('❌ Erro ao salvar no backend:', error);
        
        if (error.status === 0) {
          this.errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
        } else if (error.status === 400) {
          this.errorMessage = 'Dados inválidos enviados para o servidor.';
          console.error('Detalhes do erro 400:', error.error);
        } else if (error.status === 404) {
          this.errorMessage = 'Endpoint não encontrado. Verifique a URL da API.';
        } else if (error.status === 500) {
          this.errorMessage = 'Erro interno do servidor.';
        } else {
          this.errorMessage = `Erro ${error.status}: ${error.message}`;
        }
      
        
        alert(this.errorMessage);
      }
    });
  }

  // ✅ CONVERTE DISH (BACKEND) PARA PRODUCT (MOCK LOCAL)
  private addToProductService(dish: Dish): void {
    const product: Product = {
      id: dish.id?.toString() || `dish-${Date.now()}`,
      name: dish.name,
      description: dish.description,
      price: dish.price,
    };

    console.log('🛒 Adicionando ao mock local:', product);
    this.productService.createProduct(product).subscribe();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  resetForm(): void {
    this.form.reset({
      category: 'Pratos',
      price: 0
    });
    this.errorMessage = '';
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }
}