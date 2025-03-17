export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imagePaths: string[];
  quantity?: number;
  stock: number;
}