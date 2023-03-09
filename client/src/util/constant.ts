// import gql from `graphql-tag`

export const GRAPHQLAPI = 'http://localhost:8080/query';

export const REGISTER_QUERY = `mutation($name:String!, $email:String!, $phone:String!, $password:String!, $banned:Boolean!, $role:String!, $newslettersubscribe:Boolean!){
  auth{
    register(input:{
      name: $name,
      email:$email
      phone:$phone
      password:$password
      banned:$banned
      role:$role
      newslettersubscribe:$newslettersubscribe
    })
  }
}`;

export const LOGIN_QUERY = `mutation($email:String!, $password:String!){
	auth{
    login(email:$email, password:$password)
  }
}`;

export const USER_QUERY = `query($id:ID, $email:String){
  user(id:$id, email:$email){
    id
    email
  }
}`;

export const CURRENT_USER_QUERY = `query{
  getCurrentUser{
    id
    name
    email
    phone
    banned
    role
    currency
  }
}`;

export const PROMOS_QUERY = `query{
  promos {
    id
    name
    description
    image
  }
}`;

export const PRODUCTS_QUERY = `query($shopId:String, $brandId:String, $categoryId:String, $limit:Int, $offset:Int, $search:SearchProduct){
  products(shopId:$shopId, brandId:$brandId, categoryId:$categoryId, limit:$limit, offset:$offset, search:$search){
    id
    name
    image
    price
    discount
  }
}`;

export const SEARCH_PRODUCTS_QUERY = `query($keyword:String, $minPrice: Float, $maxPrice: Float, $orderBy: String, $categoryID: String, $createdAtRange: Int, $highRating: Boolean, $limit: Int, $offset: Int){
  products(limit:$limit, offset:$offset,search:{
    keyword:$keyword
    minPrice:$minPrice
    maxPrice:$maxPrice
    orderBy:$orderBy
    categoryID:$categoryID
    createdAtRange:$createdAtRange
    highRating:$highRating
  }){
    id
    name
    image
    price
    quantity
    description
    discount
    productgroup{
      id
    }
    brand{
      id
      name
      image
      description
    }
    category{
      id
      name
      description
    }
    shop{
      id
      name
      image
      aboutus
      description
    }

  }
}`;

export const PRODUCT_QUERY = `query($id:ID, $name:String){
  product(id:$id, name:$name){
    id
   name
    description
    discount
    brand{
      id
      name
      image
      description

    }
    category{
      name
      id
      description
    }
    price
    productgroup{
      id
    }
    image
    quantity
    shop{
      id
      name
      image
      aboutus
      description
    }
  }
}`;

export const PRODUCT_PRODUCTSGROUP_QUERY = `query($id:ID){
  products(productGroupId:$id){
    id
    name
  }
}`;

export const USER_UPDATE_PHONE_MUTATION = `mutation($phone:String!){
  userUpdateInformation(phone:$phone){
	id
  }
}`;

export const USER_UPDATE_PASSWORD_MUTATION = `mutation($currentPassword:String!, $newPassword:String!){
  userUpdateInformation(currentPassword:$currentPassword, newPassword:$newPassword){
    id
  }
}`;

export const USER_UPDATE_FORGOTTEN_PASSWORD_MUTATION = `mutation($newPassword:String!){
  userUpdateInformation( newPassword:$newPassword){
    id
  }
}`;

export const USER_ADD_CART_MUTATION = `mutation($productID:ID!, $quantity:Int!){
  createCart(productID:$productID, quantity:$quantity){
   user{
    id
  }
    product{
      id
    }
  }
}`;

export const PRODUCT_CATEGORY_QUERY = `query($categoryId:String!, $limit:Int!){
  products(limit:$limit, categoryId:$categoryId){
    id
    name
    image
    price
    discount
  }
}`;

export const CREATE_WISHLIST_MUTATION = `mutation($name:String!, $privacy:String!){
  createWishlist(input:{
    name:$name,
    privacy:$privacy
  }){
id
  }
}`;

export const WISHLISTDETAILS_QUERY = `query($wishlistId: ID!){
  wishlistDetails(wishlistId:$wishlistId){
    product{
      id
      name
      image
      price
      discount
    }
    quantity
    dateAdded

  }
}`;

export const USER_WISHLISTS_QUERY = `query{
  userwishlists{
    id
    name
    privacy
  }
}`;

export const WISHLIST_QUERY = `query($wishlistId: ID!){
  wishlist(wishlistId:$wishlistId){
    id
    name
    privacy
    dateCreated
    notes
    user{
      id
      name
      phone
      role
      banned
      email
    }
  }
}`;

export const DELETE_WISHLIST_WISHLISTDETAIL_MUTATION = `mutation($wishlistId:ID!){
  deleteAllWishlistWishlistDetail(wishlistId:$wishlistId)
}`;

export const DELETE_WISHLIST_MUTATION = `mutation($wishlistId:ID!){
  deleteWishlist(wishlistId:$wishlistId)
}`;

export const CREATE_WISHLIST_DETAIL_MUTATION = `mutation($wishlistId:ID!, $productId:ID!, $quantity:Int!){
  createWishlistDetail(wishlistId:$wishlistId, productId:$productId, quantity:$quantity){
    dateAdded
  }
}`;

export const UPDATE_WISHLIST_MUTATION = `mutation($wishlistId:ID!, $wishlistName:String!, $wishlistPrivacy:String!){
  updateWishlist(wishlistID:$wishlistId, input:{
name:$wishlistName,
    privacy:$wishlistPrivacy
  }){
    id
  }
}`;

export const PRODUCT_USER_WISHLISTS_QUERY = `query($productId:ID!){
  productUserWishlists(productId:$productId){
    id
    name
    privacy
  }
} `;

export const DELETE_PRODUCT_FROM_WISHLIST_DETAILS = `mutation($productId:ID!){
  deleteProductFromWishlistDetails(productId:$productId)
}`;

export const INSERT_USER_VERIFICATION_CODE = `mutation($email:String!, $verificationcode:String!){
  userInputVerificationCode(email:$email, verificationcode:$verificationcode){
id
  }
}`;

export const VALIDATE_USER_VERIFICATION_CODE = `mutation($email:String!, $verificationcode:String!){
  validateUserVerificationCode(email:$email, verificationcode:$verificationcode)
}`;

export const USER_CART_QUERY = `query{
  carts{
   product{
    id
    name
    discount
    shop{
      id
      name
    }
    price
    image
    description
  }
    quantity
  }
}`;

export const UPDATE_CART_MUTATION = `mutation($productID:ID!, $quantity:Int!){
  updateCart(productID:$productID, quantity:$quantity){
    product{
      id
    }
    user{
      id
    }
    quantity
  }
}`;

export const DELETE_CART_MUTATION = `mutation($productID:ID!){
  deleteCart(productID:$productID)
}`;

export const CREATE_SAVED_FOR_LATER_MUTATION = `mutation($productId:ID!, $quantity:Int!){
  createSavedForLater(productId:$productId, quantity:$quantity){
    user{
      id
    }
    product{
      id
    }
    quantity
  }
}`;

export const USER_SAVED_FOR_LATERS_QUERY = `query{
  savedForLaters{
    product{
      id
      name
      price
      image
      description
      quantity
      shop{
        id
        name
      }

    }
    quantity
  }
}`;

export const DELETE_SAVED_FOR_LATER_MUTATION = `mutation($productID:ID!){
  deleteSavedForLater(productId:$productID)
}`;

export const DELETE_ALL_SAVED_FOR_LATER = `mutation{
  deleteAllSavedForLater
}`;

export const DELETE_ALL_CART = `mutation{
  deleteAllCart
}`;

export const CREATE_NEW_ADDRESS_MUTATION = `mutation($name:String!, $isPrimary:Boolean!, $region:String!, $city:String!, $zipCode:String!, $phone:String!, $detail:String!){
  createAddress(name:$name, detail:$detail, isPrimary:$isPrimary, region:$region, city:$city, zipCode:$zipCode, phone:$phone){
    id
  }
}`;

export const USER_ADDRESSES_QUERY = `query{
  userAddresses{
    id
    name
    detail
    region
    city
    zipCode
    phone
    isPrimary
  }
}`;

export const SHIPPINGS_QUERY = `query{
  shippings{
    id
    name
    description
    price
  }
}`;

export const PAYMENT_TYPES_QUERY = `query{
  paymentTypes{
    id
    name
  }
}`;

export const CHECKOUT_USER_CART_MUTATION = `mutation($shippingID:ID!, $paymentTypeID:ID!, $addressID:ID!){
  checkout(shippingID:$shippingID, paymentTypeID:$paymentTypeID, addressID:$addressID){
    id
  }
}`;

export const DELETE_USER_ADDRESS = `mutation($addressID:ID!){
  deleteAddress(id:$addressID)
}`;

export const WISHLIST_DETAILS_QUERY = `query($wishlistID:ID!){
  wishlistDetails(wishlistId:$wishlistID){
    wishlist{
      id
      user{
        id
      }
    }
    product{
      id
      name
      discount
      quantity
      image
      price
      description
      brand{
        id
        name
        image
      }
      category{
        id
        name
        description
      }
    }
    dateAdded
    quantity

  }
}`;

export const EDIT_WISHLIST_NOTES = `mutation($wishlistID:ID!, $notes:String!){
  editWishlistNote(wishlistID:$wishlistID, notes:$notes){
    id
  }
}`;

export const UPDATE_WISHLIST_DETAIL = `mutation($wishlistID:ID!, $productID:ID!, $quantity:Int!){
  updateWishlistDetail(wishlistID:$wishlistID, productID:$productID quantity:$quantity){
    quantity
  }
}`;

export const DELETE_WISHLIST_DETAIL = `mutation($wishlistId:ID!, $productID:ID!){
  deleteWishlistDetail(wishlistId:$wishlistId, productId:$productID)
}`;

export const USER_UPDATE_BALANCE_MUTATION = `mutation($balance:Float!){
  userUpdateInformation(balance:$balance){
	  id
  }
}`;

export const USER_TRANSACTIONS = `query($ordersWithin:Int, $ordersType:String, $search:String){
  userTransactionHeaders(ordersWithin:$ordersWithin, ordersType:$ordersType, search:$search){
    id
    transactionDate
    shipping{
      name
      price
    }
    paymentType{
      name
    }
    status
    address{
      detail
      name
      region
      city
      zipCode
      phone
    }
    invoice
    transactionDetails{
      product{
        id
        name
        description
        price
        image
        discount
      }
      quantity
    }
  }
}`;

export const PUBLIC_WISHLISTS_QUERY = `query($filter:String, $sortBy:String, $limit:Int, $offset: Int){
  wishlists(filter:$filter, sortBy:$sortBy, limit:$limit, offset:$offset){
    id
    name
    privacy
}
}`;

export const CHECK_USER_FOLLOWED = `query($wishlistID:ID!){
  wishlistFollower(wishlistID:$wishlistID){
   	dateAdded
  }
}`;

export const DELETE_WISHLIST_FOLLOWER_MUTATION = `mutation($wishlistID:ID!){
  deleteWishlistFollower(wishlistID:$wishlistID)
}`;

export const CREATE_WISHLIST_FOLLOWER_MUTATION = `mutation($wishlistID:ID!){
  createWishlistFollower(wishlistID:$wishlistID){
    dateAdded
  }
}`;

export const CREATE_WISHLIST_REVIEW_MUTATION = `mutation($wishlistID:ID!, $customName:String!, $rating:Float!, $title:String!, $comment:String!){
  createWishlistReview(wishlistID:$wishlistID, customName:$customName, rating:$rating, title:$title, comment:$comment){
    comment
    title
    rating
    customName

  }
}`;

export const WISHLIST_REVIEW_QUERY = `query($wishlistID:ID!){
  wishlistReviews(wishlistID:$wishlistID){
    id
    title
		comment
    rating
    customName
    user{
      id
    }
    wishlist{
      id
    }
  }
}`;

export const USER_FOLLOWED_WISHLISTS_QUERY = `query{
  userFollowedWishlists{
    wishlist{
      id
      name
      privacy
      user{
        id
        name
      }
      wishlistDetails{
        product{
          id
          image
          name
          price
          discount
        }
      }
    }
  }
}`;

export const SHOP_QUERY = `query($shopID:ID!){
  shop(id:$shopID){
    id
    name
    description
    image
    aboutus
    banner
    banned
    products{
      id
      image
      name
      category{
        id
        name
      }
      discount
      reviews{
        id
        rating
      }
    }
  }
}`;

export const SHOP_PRODUCTS_QUERY = `query($shopID:ID!, $sortBy:String, $limit:Int, $offset:Int, $categoryID:ID){
  shopProducts(sortBy:$sortBy, shopID:$shopID, limit:$limit, offset:$offset, categoryID:$categoryID){
    id
    rating
    name
    description
    price
    discount
    quantity
    image
    category{
      id
      name
    }
    reviews{
      id
      rating
    }
  }
}`;

export const SHOP_TOTAL_SALES_QUERY = `query($shopID:ID!){
  shopTotalSales(shopID:$shopID)
}`;

export const REDEEM_VOUCHER_MUTATION = `mutation($voucherID:ID!){
  updateVoucher(voucherID:$voucherID){
    id
    balance
    dateCreated
    dateUsed
  }
}`;

export const GET_CURRENT_USER_SHOP = `query{
  getUserShop{
    id
    name
    description
    image
    aboutus
    banner
    banned
    products{
      id
      name
      description
      image
      discount
      price
      rating
    }
  }
}`;

export const UPDATE_SHOP_INFORMATION = `mutation($shopID:ID!, $aboutUs:String!, $description:String!, $image:String!, $name:String!){
  updateShop(shopID:$shopID, aboutus:$aboutUs, description:$description, image:$image, name:$name){
    id
  }
}`;

export const CATEGORIES_QUERY = `query{
  categories{
    id
    name
    description
  }
}`;

export const BRANDS_QUERY = `query{
  brands{
    id
    name
    description
    image
  }
}`;

export const CREATE_NEW_PRODUCT_MUTATION = `mutation($brandID:ID!, $categoryID:ID!, $shopID:ID!, $name:String!, $description:String!, $price:Float!, $image:String!, $quantity:Int!, $discount:Float!){
  createProduct(input:{
    brandId:$brandID,
    categoryId:$categoryID,
    shopId:$shopID,
    name:$name,
    description:$description,
    price:$price,
    image:$image,
    quantity:$quantity,
    discount:$discount
  }){
	id
  }
}`;

export const UPDATE_PRODUCT_MUTATION = `mutation($productID:ID! ,$brandID:ID!, $categoryID:ID!, $shopID:ID!, $name:String!, $description:String!, $price:Float!, $image:String!, $quantity:Int!, $discount:Float!){
  updateProduct(productID:$productID ,input:{
    brandId:$brandID,
    categoryId:$categoryID,
    shopId:$shopID,
    name:$name,
    description:$description,
    price:$price,
    image:$image,
    quantity:$quantity,
    discount:$discount
  }){
	id
  }
}`;

export const SHOP_REVIEWS_QUERY = `query($shopID: ID!, $filter:String, $search: String){
  shopReviews(shopID:$shopID, filter:$filter, search:$search){
    id
    user{
      name
    }
    rating
    tag
    dateCreated
    comment
		onTimeDelivery
    productAccurate
    satisfiedService
    transactionHeader{
      id
      transactionDate
    }
  }
}`;

export const SHOP_ORDERS_QUERY = `query($shopID:ID!, $filter:String){
  shopOrders(shopID:$shopID filter:$filter){
    	id
    	transactionDate
    shipping{
      id
      name
      description
      price
    }
    paymentType{
      name
      id
    }
    status
    address{
      detail
      zipCode
      city
    }
    invoice
    transactionDetails{
      quantity
      product{
        id
        name
        image
        price
        discount

      }
    }
  }
}`;

export const UPDATE_TRANSACTION_HEADER_MUTATION = `mutation($transactionHeaderID:ID!, $status:String!){
  updateTransactionHeader(transactionHeaderID:$transactionHeaderID, status:$status){
    id
  }
}`;

export const POPULAR_BRANDS_QUERY = `query{
  popularBrands{
    id
    name
    description
    image
  }
}`;

export const TOP_SHOPS_QUERY = `query{
  topShops{
    id
    name
    image
  }
}`;

export const USER_EXCEPT_SELF_QUERY = `query($limit:Int, $offset:Int){
  users(limit:$limit, offset:$offset){
    id
    name
    email
    phone
    password
    banned
    role
    currency
    newslettersubscribe
  }
}`;

export const UPDATE_USER_INFORMATION = `mutation($userID:ID!, $banned:Boolean){
  updateUserInformation(userID:$userID, banned:$banned){
    id
  }
}`;

export const SHOPS_QUERY = `query($banned:Boolean){
  shops(banned:$banned){
    id
    name
    description
    image
    aboutus
    banner
    banned
  }
}`;

export const UPDATE_SHOP_STATUS = `mutation($shopID:ID!, $banned:Boolean){
  updateShopStatus(shopID:$shopID, banned:$banned){
    id
  }
}`;

export const CREATE_SHOP_MUTATION = `mutation($name:String!, $description:String!, $image:String!, $aboutus:String!, $banner:String!, $userID:ID!){
  createShop(input:{
    name:$name,
    description:$description,
    image:$image,
    aboutus:$aboutus,
    banner:$banner,
    userID:$userID
  }){
    id
  }
}`;

export const USER_NO_SHOP_QUERY = `query{
  noShopUsers{
    id
    name
  }
}`;

export const ADD_VOUCHER_MUTATION = `mutation($balance:Float!){
  createVoucher(balance:$balance){
    id
    balance
  }
}`;

export const SUBSCRIBED_USERS_QUERY = `query{
  getSubscribedUsers{
    id
    name
    email
  }
}`;

export const CREATE_PROMO_MUTATION = `mutation($name:String!, $description:String!, $image:String!){
  createPromo(input:{
    name:$name
    description:$description
    image:$image
  }){
    id
    name
    description
    image
  }
}`;

export const DELETE_PROMO_MUTATION = `mutation($promoID:ID!){
  deletePromo(promoID:$promoID)
}`;
