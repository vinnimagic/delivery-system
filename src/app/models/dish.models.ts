export interface Dish {
  id?: number; // ✅ OPCIONAL - backend gera
  name: string;
  description: string;
  price: number;
  category?: string;
  imageUrl?: string;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
}