// import gql from `graphql-tag`

export const GRAPHQLAPI = 'http://localhost:8080/query';

export const REGISTER_QUERY = `mutation($name:String!, $email:String!, $phone:String!, $password:String!, $banned:Boolean!, $role:String!){
  auth{
    register(input:{
      name: $name,
      email:$email
      phone:$phone
      password:$password
      banned:$banned
      role:$role
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

export const PRODUCTS_QUERY = `query($shopId:String, $brandId:String, $categoryId:String, $limit:Int, $offset:Int){
  products(shopId:$shopId, brandId:$brandId, categoryId:$categoryId, limit:$limit, offset:$offset){
    id
    name
    image
    price
  }
}`;

export const PRODUCT_QUERY = `query($id:ID, $name:String){
  product(id:$id, name:$name){
   name
    description
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
  userUpdatePhone(phone:$phone){
    phone
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
  }
}`;

export const USER_WISHLISTS_QUERY = `query{
  userwishlists{
    id
    name
    privacy
  }
}`;

export const WISHLIST_QUERY = `query{
  wishlist(wishlistId:"206a375c-73ae-432c-92bf-e7e1ae5ec4a6"){
    id
    name
    privacy
    dateCreated
  }
}`;
