import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useEffect, useState } from 'react';

import styles from '@/styles/home.module.scss';
import { Product } from '@/components/interfaces/interfaces';
import axios from 'axios';
import { GRAPHQLAPI, PRODUCT_QUERY } from '@/util/constant';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';

interface Parameter {
  productID: string;
}
const ProductDetailModalContent = (props: Parameter) => {
  const [product, setProduct] = useState<Product>();
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [descriptions, setDescriptions] = useState([]);

  useEffect(() => {
    axios
      .post(GRAPHQLAPI, {
        query: PRODUCT_QUERY,
        variables: {
          id: props.productID,
        },
      })
      .then((res) => {
        setProduct(res.data.data.product);
        console.log(res.data.data.product);

        var productCategory = res.data.data.product.category.name;
        setProductCategory(productCategory);

        if (productCategory == 'Laptop') {
          setProductName(LAPTOP_NAME_CONVERTER(res.data.data.product.name));
        }

        var temp = res.data.data.product.description.split(';');
        setDescriptions(temp);
      });
  }, []);

  return (
    <div className={styles.productdetailcontainer}>
      {product && (
        <div className={styles.productdetailimagecontainer}>
          <img
            src={product?.image}
            alt=""
            className={styles.productdetailimage}
          />
          <div
            className={styles.productdetailinfocontainer}
            style={{
              fontSize: '25px',
            }}
          >
            {product?.name}
          </div>
          <div className={styles.productdetailinfocontainer}>
            Specifications
          </div>{' '}
          <div className={styles.productdetailinfocontainer}>
            <ul
              style={{
                margin: '0px',
                padding: '0px',
              }}
            >
              {descriptions.map((x) => {
                return <li>{x}</li>;
              })}
            </ul>
          </div>
          <div className={styles.flexbetween}>
            <p
              style={{
                fontSize: '1.2em',
                display: 'inline ',
                fontWeight: 'bold',
              }}
            >
              ${' '}
              {(
                product.price -
                (product.price * product.discount) / 100
              ).toFixed(2)}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <span
              style={{
                display: 'inline',
                fontWeight: 'bold',
                fontSize: '0.8em',
                color: 'white',
                backgroundColor: 'red',
                padding: '0.5em',
                // marginLeft: '5px',
              }}
            >
              SAVE {product.discount}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductDetailModalContent;
