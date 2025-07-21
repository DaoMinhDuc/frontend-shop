export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  isActive: boolean;
}


export interface CategoryFilter {
  search?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  // Pagination
  page?: number;
  limit?: number;
  // Sorting
  sortBy?: string;
}

// API response with pagination
export interface CategoryResponse {
  status: string;
  results: number;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Category[];
}