import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // ⬅️ ADICIONE RouterLink AQUI
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-pratos-list',
  standalone: true, // ⬅️ SE FOR STANDALONE
  imports: [
    CommonModule,
    RouterLink, // ⬅️ ADICIONE ESTA LINHA AQUI
  ],
  templateUrl: './pratos-list.component.html',
  styleUrls: ['./pratos-list.component.scss']
})
export class PratosListComponent implements OnInit {
  produtos: Product[] = [
    // Dados de exemplo
    { id: '1', name: 'Pizza Margherita', description: 'Pizza tradicional com queijo', price: 45.90 },
    { id: '2', name: 'Hambúrguer', description: 'Hambúrguer artesanal', price: 32.50 },
    { id: '3', name: 'Salada Caesar', description: 'Salada com frango e molho caesar', price: 28.75 }
  ];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carregar produtos da API (quando tiver)
    // this.carregarProdutos();
  }

  carregarProdutos(): void {
    // Método para carregar da API
    // this.productService.getAllProducts().subscribe(produtos => {
    //   this.produtos = produtos;
    // });
  }

  excluirProduto(id: string): void {
    if (confirm('Tem certeza que deseja excluir este prato?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        // Atualizar lista
        this.produtos = this.produtos.filter(p => p.id !== id);
      });
    }
  }
}