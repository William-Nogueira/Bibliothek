export interface Book {
  id?: string;
  title: string;
  genre: string;
  author: string;
  publisher: string;
  stock: number;
  availableStock: number;
  coverImage: string;
  description: string;
  featured: boolean;
}
