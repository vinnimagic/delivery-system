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
  successMessage: string = '';
  
  // Variáveis para o modal de exclusão
  showDeleteDialog = false;
  products: Product[] = [];
  selectedProductId: string | null = null;
  loadingProducts = false;

  constructor(
    private fb: FormBuilder,
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

  // Abrir modal para selecionar prato a excluir
  openDeleteDialog(): void {
    this.showDeleteDialog = true;
    this.selectedProductId = null;
    this.loadProductsForDeletion();
  }

  // Fechar modal
  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.selectedProductId = null;
  }

  // Carregar produtos para a lista de exclusão
  loadProductsForDeletion(): void {
    this.loadingProducts = true;
    // Você precisa criar um método getAllProducts() no seu service
    // Ou usar um método que já existe para buscar todos os produtos
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loadingProducts = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loadingProducts = false;
        this.errorMessage = 'Erro ao carregar lista de pratos.';
      }
    });
  }

  // Se você não tem getAllProducts(), pode criar um array de exemplo:
  loadProductsForDeletionExample(): void {
    this.loadingProducts = true;
    // Exemplo com dados mockados (remova quando tiver API)
    setTimeout(() => {
      this.products = [
        { id: '1', name: 'Pizza Margherita', description: 'Pizza tradicional com queijo', price: 45.90 },
        { id: '2', name: 'Hambúrguer', description: 'Hambúrguer artesanal', price: 32.50 },
        { id: '3', name: 'Salada Caesar', description: 'Salada com frango e molho caesar', price: 28.75 }
      ];
      this.loadingProducts = false;
    }, 500);
  }

  // Selecionar produto na lista
  selectProduct(productId: string): void {
    this.selectedProductId = productId;
  }

  // Confirmar exclusão do produto selecionado
  confirmDelete(): void {
    if (!this.selectedProductId) return;
    
    const selectedProduct = this.products.find(p => p.id === this.selectedProductId);
    const productName = selectedProduct?.name || 'este prato';
    
    if (confirm(`Tem certeza que deseja excluir o prato "${productName}"? Esta ação não pode ser desfeita.`)) {
      this.loading = true;
      this.productService.deleteProduct(this.selectedProductId).subscribe({
        next: () => {
          this.successMessage = `Prato "${productName}" excluído com sucesso!`;
          this.loading = false;
          this.closeDeleteDialog();
          
          // Recarregar a lista após exclusão
          this.loadProductsForDeletion();
        },
        error: (error) => {
          console.error('Erro ao excluir prato:', error);
          this.errorMessage = 'Erro ao excluir prato. Tente novamente.';
          this.loading = false;
        }
      });
    }
  }

  // Métodos existentes (mantenha como estão)
  save(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const productData: Product = {
      id: '',
      name: this.form.value.name,
      description: this.form.value.description,
      price: this.form.value.price,
    };

    this.productService.createProduct(productData).subscribe({
      next: (createdProduct) => {
        this.successMessage = `Prato "${createdProduct.name}" cadastrado com sucesso!`;
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/novo-pedido'], {
            state: { createdDish: createdProduct }
          });
        }, 2000);
      },
      error: (error) => {
        this.handleError(error, 'criar');
      }
    });
  }

  private handleError(error: any, action: string): void {
    this.loading = false;
    console.error(`❌ Erro ao ${action} produto:`, error);
    
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
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/pratos']);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }
}