import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-criarpedidos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './criarpedidos.component.html',
  styleUrls: ['./criarpedidos.component.scss']
})
export class CriarPedidosComponent implements OnInit {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      available: [true]
    });
  }

  ngOnInit(): void {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const newProduct: Product = {
      id: '',
      name: this.form.value.name,
      description: this.form.value.description,
      price: this.form.value.price,
      available: this.form.value.available,
      category: 'Outros',
      imageUrl: ''
    };

    this.productService.createProduct(newProduct).subscribe({
      next: () => {
        this.loading = false;

        this.form.reset({
          name: '',
          description: '',
          price: 0,
          available: true
        });

        this.router.navigate(['/home']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
