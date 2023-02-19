export interface Product {
  id: string;
  productgroupId: string;
  brandId: string;
  categoryId: string;
  shopId: string;
  name: string;
  description: string[];
  price: number;
  image: string;
  quantity: number;
}

export interface Brand {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Shop {
  id: string;
  name: string;
  image: string;
  aboutus: string;
  description: string;
}

export interface ProductGroup {
  id: string;
}

export interface ProductDetail {
  id: string;
  productgroup: ProductGroup;
  brand: Brand;
  category: Category;
  shop: Shop;
  name: string;
  description: string[];
  price: number;
  image: string;
  quantity: number;
  components: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  banned: boolean;
  role: string;
}

export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Wishlist {
  id: string;
  name: string;
  privacy: string;
  dateCreated: string;
}
