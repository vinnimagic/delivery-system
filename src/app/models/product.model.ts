export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  ingredients?: string[];
  preparationTime?: number; // em minutos
  spicyLevel?: 'NONE' | 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';
  tags?: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}