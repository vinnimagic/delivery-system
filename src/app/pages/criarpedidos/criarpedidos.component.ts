import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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