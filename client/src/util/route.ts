export const links = {
  login: '/login',
  home: '/',
  signup: '/register',
  productDetail: (productID: string) => {
    return '/product/' + productID;
  },

  profile: '/account/settings',
  profilePhone: '/account/mobilephone',
  search: (query: string = '') => {
    return '/search' + query;
  },

  wishlistDetail: (wishlistID: string) => {
    return '/account/wishlist/' + wishlistID;
  },

  cart: '/cart',
  order: '/account/order/order',
  shopDetail: (shopID: string) => {
    return '/shop/' + shopID;
  },
  mylist: '/account/wishlist/mylist',
  followedlist: '/account/wishlist/followedlist',
  publiclist: '/account/wishlist/publiclist',
  shopProductslist: (shopID: string) => {
    return '/shop/products/' + shopID;
  },

  shopProductslistCategory: (shopID: string, query: string = '') => {
    return '/shop/products/' + shopID + query;
  },

  shopAboutUs: (shopID: string) => {
    return '/shop/aboutus/' + shopID;
  },
  shopInformation: '/shop/myshop/settings',
  shopReviews: (shopID: string) => {
    return '/shop/reviews/' + shopID;
  },

  orderHistory: '/account/order/orderhistory',
};
