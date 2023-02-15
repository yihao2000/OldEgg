import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/pagesstyles/productdetail.module.css';
import Layout from '@/components/layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  GRAPHQLAPI,
  PRODUCT_PRODUCTSGROUP_QUERY,
  PRODUCT_QUERY,
} from '@/util/constant';
import { Product, ProductDetail } from '@/components/interfaces/interfaces';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';

const ProductDetail: NextPage = () => {
  interface ProductVariant {
    id: string;
    name: string;
  }

  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  // const [id, setId] = useState('');
  const [available, setAvailable] = useState(false);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [descriptions, setDescriptions] = useState([]);
  const [productName, setProductName] = useState('');

  const [productsVariant, setProductsVariant] = useState<
    ProductDetail[] | null
  >(null);

  useEffect(() => {
    // var items = window.location.pathname.split('/');
    // setId(items[2]);
    if (id) {
      axios
        .post(GRAPHQLAPI, {
          query: PRODUCT_QUERY,
          variables: {
            id: id,
          },
        })
        .then((res) => {
          setProduct(res.data.data.product);
          setProductName(LAPTOP_NAME_CONVERTER(res.data.data.product.name));

          var temp = res.data.data.product.description.split(';');
          setDescriptions(temp);
          if (res.data.data.product.quantity > 0) {
            setAvailable(true);
          }

          console.log(res.data.data.product.productgroup.id);
          axios
            .post(GRAPHQLAPI, {
              query: PRODUCT_PRODUCTSGROUP_QUERY,
              variables: {
                id: res.data.data.product.productgroup.id,
              },
            })
            .then((res) => {
              setProductsVariant(res.data.data.products);
            });
        })

        .catch((err) => console.log(err));
    }
  }, [id]);
  return (
    <Layout>
      <div className={styles.pagedivider}>
        <div className={styles.sectionone}>
          <div className={styles.productimagebrandcontainer}>
            <div className={styles.productbrandcontainer}>
              <span className={styles.productid}>Item#: {id}</span>
              <img
                src={product?.brand.image}
                className={styles.productbrandimage}
              ></img>
            </div>
            <div className={styles.productimagecontainer}>
              <img
                className={styles.productimage}
                src={product?.image}
                alt=""
                style={{
                  margin: 'auto',
                }}
              />
            </div>
          </div>
          <div className={styles.sectiontwo}>
            <div>
              <h3 className={styles.visitshop}>Visit {product?.shop.name}</h3>
            </div>
            <div style={{ marginTop: '10px', fontSize: '28px' }}>
              {productName}
            </div>
            <hr style={{ color: 'grey', margin: '30px 0 30px 0' }} />
            <div className={styles.productinventory}>
              <b> {available ? 'In stock.' : ''} </b>
            </div>
            <hr style={{ color: 'grey', margin: '30px 0 30px 0' }} />
            <div className=""></div>
            <hr style={{ color: 'grey', margin: '30px 0 30px 0' }} />
            <div className={styles.productdescriptionscontainer}>
              <ul
                style={{ margin: 0, padding: 0, listStylePosition: 'inside' }}
              >
                {descriptions.map((e) => {
                  return (
                    <li style={{ fontSize: '0.9em', marginTop: '10px' }}>
                      {e}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div style={{ width: '25%' }}>Bag 3</div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
