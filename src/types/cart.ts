export interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  sku?: string;
  discount?: {
    isActive: boolean;
    percentage: number;
    startDate: string | null;
    endDate: string | null;
  };
}

export interface CartItem {
  _id: string;
  product: ProductInfo;
  quantity: number;
  price: number;
  name: string;
  imageUrl: string;
  discount?: {
    isActive: boolean;
    percentage: number;
    startDate: string | null;
    endDate: string | null;
  } | null;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}
