import { NgStyle } from "@angular/common";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}
export interface Dish extends Product {
  name: string;
  description: string;
  price: number;

}