import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

/**
 * Componente para criar pedidos de restaurante.
 * Arquivo: /home/vinicius/delivery-system/src/app/pages/criarpedidos/criarpedidos.component.ts
 *
 * Observações:
 * - Usa Reactive Forms.
 * - Envia POST para /api/orders (ajuste conforme sua API).
 * - Adicione templates/styles correspondentes em criarpedidos.component.html/.scss
 */

interface OrderItem {
    menuItemId?: number | string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
}

interface Order {
    customerName?: string;
    tableNumber?: string | number;
    items: OrderItem[];
    delivery?: boolean;
    address?: string;
    total: number;
    createdAt?: string;
}

@Component({
    selector: 'app-criar-pratos',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './criarpedidos.component.html',
    styleUrls: ['./criarpedidos.component.scss']
})
export class CriarPratosComponent implements OnInit {
    form: FormGroup;
    loading = false;

    constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            price: [0, [Validators.required, Validators.min(0)]],
            available: [true]
        });
    }

    ngOnInit(): void {
        // nada especial por enquanto
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const dish = this.form.value;
        this.loading = true;

        this.http.post('/api/dishes', dish)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (res: any) => {
                    console.log('Prato criado', res);
                    // reset form
                    this.form.reset({ name: '', description: '', price: 0, available: true });
                    // Navega para nova ordem — passamos o prato criado no state para uso opcional
                    try {
                        this.router.navigate(['/novo-pedido'], { state: { createdDish: res } });
                    } catch (e) {
                        // fallback sem state
                        this.router.navigate(['/novo-pedido']);
                    }
                },
                error: err => {
                    console.error('Erro ao criar prato', err);
                }
            });
    }
}
=======
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
	selector: 'app-criarpedidos',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './criarpedidos.component.html',
	styleUrls: ['./criarpedidos.component.scss']
})
export class CriarpedidosComponent implements OnInit {
	productForm: FormGroup;
	submitting = false;
	successMessage = '';
	errorMessage = '';
	categories: string[] = [];

	constructor(
		private fb: FormBuilder,
		private productService: ProductService
	) {
		this.productForm = this.fb.group({
			name: ['', [Validators.required, Validators.maxLength(100)]],
			description: ['', [Validators.required, Validators.maxLength(500)]],
			price: [null, [Validators.required, Validators.min(0)]],
			category: ['', [Validators.required]],
			imageUrl: ['', [Validators.maxLength(500)]],
			available: [true]
		});
	}

	ngOnInit(): void {
		this.productService.getCategories().subscribe(cats => this.categories = cats);
	}

	get f() { return this.productForm.controls; }

	onSubmit(): void {
		this.successMessage = '';
		this.errorMessage = '';

		if (this.productForm.invalid) {
			this.productForm.markAllAsTouched();
			return;
		}

		this.submitting = true;

			const newProduct: Product = {
				id: '',
				name: this.productForm.get('name')?.value,
				description: this.productForm.get('description')?.value,
				price: Number(this.productForm.get('price')?.value),
				category: this.productForm.get('category')?.value,
				imageUrl: this.productForm.get('imageUrl')?.value || '/assets/images/default.jpg',
				available: !!this.productForm.get('available')?.value
			};

		this.productService.createProduct(newProduct).subscribe({
			next: (p) => {
				this.successMessage = `Prato "${p.name}" criado com sucesso.`;
				this.productForm.reset({ available: true });
				// Atualiza categorias caso a nova seja diferente
				this.productService.getCategories().subscribe(cats => this.categories = cats);
				this.submitting = false;
			},
			error: (err) => {
				console.error('Erro ao criar produto', err);
				this.errorMessage = 'Ocorreu um erro ao criar o prato. Tente novamente.';
				this.submitting = false;
			}
		});
	}
}
>>>>>>> fd4334cea9ff87863b5ebad1162764cda55febf3
