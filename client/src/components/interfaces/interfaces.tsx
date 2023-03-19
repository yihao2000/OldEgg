export interface Product {
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
  products: Product[];
  banned: boolean;
  banner: string;
  user: User;
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
  currency: number;
  newslettersubscribe: boolean;
  location: Location;
  twoFactorEnabled: boolean;
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
  notes: string;
  user: User;
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

export interface WishlistDetail {
  wishlist: Wishlist;
  product: Product;
  quantity: number;
  dateAdded: string;
}

export interface Address {
  id: string;
  name: string;
  detail: string;
  region: string;
  zip_code: string;
  phone: string;
  city: string;
  is_primary: boolean;
  user_id: string;
}

export interface TransactionDetail {
  product: Product;
  user: User;
  quantity: number;
}

export interface TransactionHeader {
  id: string;
  invoice: string;
  status: string;
  transactionDate: string;
  address: Address;
  paymentType: PaymentType;
  shipping: Shipping;
  transactionDetails: TransactionDetail[];
}

export interface WishlistReview {
  id: string;
  title: string;
  comment: string;
  rating: number;
  customName: string;
  user: User;
  wishlist: Wishlist;
}

export interface ShopReview {
  id: string;
  user: User;
  rating: number;
  tag: string;
  dateCreated: string;
  comment: string;
  onTimeDelivery: boolean;
  productAccurate: boolean;
  satisfiedService: boolean;
  transactionHeader: TransactionHeader;
  shop: Shop;
}

export interface Promo {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Location {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
}

export interface UserSavedSearch {
  id: string;
  keyword: string;
  userID: string;
}

export interface ProductReview {
  product: Product;
  user: User;
  rating: number;
  title: string;
  comment: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  read: boolean;
}

export interface CustomerServiceReview {
  id: string;
  title: string;
  comment: string;
  rating: number;
  user: User;
}

export interface UserChat {
  id: string;
  user: User;
  seller: User;
}
