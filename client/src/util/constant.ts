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
