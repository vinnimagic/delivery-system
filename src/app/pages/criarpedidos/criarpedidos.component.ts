import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
