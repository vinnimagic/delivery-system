import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

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

  constructor(
    private fb: FormBuilder,
    private productService: ProductService, // ✅ USA APENAS PRODUCT SERVICE
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

    const productData: Product = {
      id: '', // ✅ BACKEND VAI GERAR O ID
      name: this.form.value.name,
      description: this.form.value.description,
      price: this.form.value.price,
    };

    console.log('📤 Enviando produto para backend:', productData);

    // ✅ SALVA DIRETAMENTE NO BACKEND VIA PRODUCT SERVICE
    this.productService.createProduct(productData).subscribe({
      next: (createdProduct) => {
        console.log('✅ Produto salvo no backend:', createdProduct);
        
        // ✅ REDIRECIONA PARA O PEDIDO
        this.router.navigate(['/novo-pedido'], {
          state: { createdDish: createdProduct }
        });
        
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('❌ Erro ao salvar produto no backend:', error);
        
        if (error.status === 0) {
          this.errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
        } else if (error.status === 400) {
          this.errorMessage = 'Dados inválidos enviados para o servidor.';
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