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
};
