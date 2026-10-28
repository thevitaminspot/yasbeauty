export type ProductCategory = "lip-pigments" | "brow-pigments" | "aftercare";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  volume: string;
  /** Units left in stock for admin inventory. */
  stock: number;
  tagline: string;
  description: string;
  image: string;
  images: string[];
  featured?: boolean;
  bestseller?: boolean;
  shade?: string;
  ingredients: string;
  usage: string;
  cautions: string[];
};
