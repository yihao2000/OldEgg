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
