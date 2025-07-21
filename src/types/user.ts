// User interface definitions
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
}

export type UserProfile = User

export interface Address {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
}

export interface AddressInput {
  name: string;
  phone: string;
  address: string;
  city: string;
  isDefault?: boolean;
}

import type { Product } from './product';

export type WishlistItem = Pick<Product, '_id' | 'name' | 'price' | 'imageUrl' | 'inStock' | 'description' | 'category' | 'quantity'>;
