import axios from 'axios';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';

import styles from '@/styles/pagesstyles/shop/myshop/home.module.scss';

import {
  Brand,
  Category,
  Product,
  ProductGroup,
  Shop,
} from '@/components/interfaces/interfaces';

import {
  BRANDS_QUERY,
  CATEGORIES_QUERY,
  CREATE_NEW_PRODUCT_MUTATION,
  GET_CURRENT_USER_SHOP,
  GRAPHQLAPI,
  PRODUCT_QUERY,
  UPDATE_PRODUCT_MUTATION,
} from '@/util/constant';

interface Parameter {
  productID: string;
}

interface TempProduct {
  id: string;
  productgroup: ProductGroup;
  brand: Brand;
  category: Category;
  shop: Shop;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  discount: number;
}
export default function UpdateProductModalContent(props: Parameter) {
  const [token, setToken] = useSessionStorage('token', '');

  const [productCategoryList, setProductCategoryList] = useState<Category[]>(
    [],
  );
  const [productBrandList, setProductBrandList] = useState<Brand[]>([]);

  const [product, setProduct] = useState<TempProduct>();
  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: CATEGORIES_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setProductCategoryList(res.data.data.categories);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post(
        GRAPHQLAPI,
        {
          query: BRANDS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setProductBrandList(res.data.data.brands);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: PRODUCT_QUERY,
          variables: {
            id: props.productID,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setProduct(res.data.data.product);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setProductDescription(product.description);
      setProductPrice(product.price);
      setProductImage(product.image);
      setProductQuantity(product.quantity);
      setProductDiscount(product.discount);
      setProductBrand(product.brand.id);
      setProductCategory(product.category.id);
    }
  }, [product]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productImage, setProductImage] = useState('');
  const [productQuantity, setProductQuantity] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);
  const [productBrand, setProductBrand] = useState(
    'b3c07dd5-ff10-49c7-a7eb-101fbb790e38',
  );
  const [productCategory, setProductCategory] = useState(
    '60273be6-1379-40c3-9926-977533f54f39',
  );

  const [error, setError] = useState('');

  const handleEditProductClick = () => {
    if (productName == '' || productDescription == '' || productImage == '') {
      setError('All Fields must be Filled!');
    } else if (
      productPrice <= 0 ||
      productQuantity < 0 ||
      productDiscount < 0
    ) {
      setError("Number can't be below zero!");
    } else {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: UPDATE_PRODUCT_MUTATION,
            variables: {
              productID: product?.id,
              brandID: productBrand,
              categoryID: productCategory,
              shopID: product?.shop.id,
              name: productName,
              description: productDescription,
              price: productPrice,
              image: productImage,
              quantity: productQuantity,
              discount: productDiscount,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          Router.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className={styles.addproductcontainer}>
      {product && (
        <>
          <h2>Add New Product</h2>
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              Product Name
            </span>
            <input
              type="text"
              className={styles.forminputcontainer}
              placeholder="Gaming Laptop"
              value={productName}
              onChange={(event) => {
                setProductName(event.target.value);
              }}
            />
          </div>
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              Product Description
            </span>
            <input
              type="text"
              className={styles.forminputcontainer}
              placeholder="Good Gaming Laptop"
              value={productDescription}
              onChange={(event) => {
                setProductDescription(event.target.value);
              }}
            />
          </div>
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              {' '}
              Product Image
            </span>
            <input
              type="text"
              className={styles.forminputcontainer}
              placeholder="https://sampleimage.org"
              value={productImage}
              onChange={(event) => {
                setProductImage(event.target.value);
              }}
            />
          </div>
          <div className={styles.dropdowncontainer}>
            {' '}
            <select
              style={{
                width: '50%',
                padding: '5px',
              }}
              value={productCategory}
              className={styles.forminputselection}
              onChange={(event) => {
                setProductCategory(event.target.value);
              }}
            >
              {productCategoryList.map((x) => {
                return <option value={x.id}>{x.name}</option>;
              })}
            </select>
            <select
              style={{
                width: '50%',
                padding: '5px',
              }}
              value={productBrand}
              className={styles.forminputselection}
              onChange={(event) => {
                setProductBrand(event.target.value);
                console.log(productBrand);
              }}
            >
              {productBrandList.map((x) => {
                return <option value={x.id}>{x.name}</option>;
              })}
            </select>
          </div>
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              {' '}
              Product Price ($)
            </span>
            <input
              type="number"
              className={styles.forminputcontainer}
              placeholder="Product Price"
              value={productPrice}
              onChange={(event) => {
                setProductPrice(Number(event.target.value));
              }}
            />
          </div>
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              {' '}
              Product Quantity
            </span>
            <input
              type="number"
              className={styles.forminputcontainer}
              placeholder="Product Quantity"
              value={productQuantity}
              onChange={(event) => {
                setProductQuantity(Number(event.target.value));
              }}
            />
          </div>
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              {' '}
              Product Discount
            </span>
            <input
              type="number"
              className={styles.forminputcontainer}
              placeholder="Product Discount (0 For no Discount)"
              value={productDiscount}
              onChange={(event) => {
                setProductDiscount(Number(event.target.value));
              }}
            />
          </div>

          <div className={styles.gapcontainer}>
            <span style={{ color: 'red' }}>{error}</span>
            <button
              className={styles.addbutton}
              onClick={handleEditProductClick}
            >
              Edit Product
            </button>
          </div>
        </>
      )}
    </div>
  );
}
