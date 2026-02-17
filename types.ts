
export enum Category {
  PROTEIN = 'Proteins',
  VITAMINS = 'Vitamins',
  SUPPLEMENTS = 'Supplements',
  GEAR = 'Athletic Gear'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  rating: number;
  stockStatus?: 'In Stock' | 'Limited' | 'Out of Stock';
  badge?: 'Best Seller' | 'New' | 'Elite Choice';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface HealthTip {
  title: string;
  content: string;
  tags: string[];
}
