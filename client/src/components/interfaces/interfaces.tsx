export interface Product {
  id: string;
  productgroup: ProductGroup;
  brand: Brand;
  category: string;
  shop: Shop;
  name: string;
  description: string[];
  price: number;
  image: string;
  quantity: number;
  discount: number;
}

export interface ProductGroup {
  id: string;
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
  discount: number;
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
  discount: number;
}

export interface Wishlist {
  id: string;
  name: string;
  privacy: string;
  dateCreated: string;
}

export interface AddToWishlistModalParameter {
  productId: string | undefined;
  handleCloseModal: Function;
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  shop: CartShop;
  quantity: number;
  discount: number;
}

export interface CartShop {
  id: string;
  name: string;
}

export interface Cart {
  product: CartProduct;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  detail: string;
  region: string;
  city: string;
  zipCode: string;
  phone: string;
  isPrimary: boolean;
}

export interface Shipping {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface PaymentType {
  id: string;
  name: string;
}
