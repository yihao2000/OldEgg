export const links = {
  login: '/',
  home: '/home',
  signup: '/register',
  productDetail: (productID: string) => {
    return '/product/' + productID;
  },

  profile: '/account/settings',
  profilePhone: '/account/mobilephone',
};
