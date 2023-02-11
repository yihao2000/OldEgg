import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { GRAPHQLAPI, PRODUCTS_QUERY, PROMOS_QUERY } from '@/util/constant';
import styles from '@/styles/home.module.css';
import { Product } from '@/components/interfaces/interfaces';
import { useIsFirstRender } from 'usehooks-ts';

const ProductRecommendations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [noData, setNoData] = useState(false);

  const loadProducts = () => {
    console.log(offset);
    axios
      .post(GRAPHQLAPI, {
        query: PRODUCTS_QUERY,
        variables: {
          limit: 1,
          offset: offset,
        },
      })
      .then((res) => {
        setOffset(offset + 1);
        // console.log(res.data.data.products);
        if (res.data.data.products.length == 0) {
          console.log('Masuk ke data kosong');
          setNoData(true);
        } else {
          const newProducts = products.concat(res.data.data.products);
          setProducts(newProducts);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const scrollHandler = () => {
    // console.log('Masuk ke scrollhandler');

    // console.log('Innerheight: ' + window.innerHeight);
    // console.log('ScrollTop: ' + document.documentElement.scrollTop);
    // console.log('Offsetheight: ' + document.documentElement.offsetHeight);
    if (
      window.innerHeight + Math.floor(document.documentElement.scrollTop) >=
      document.documentElement.offsetHeight
    ) {
      // console.log('Masuk ke dalam if 1');
      if (!noData) {
        // console.log('masuk ke dalam if 2 (ada data)');
        loadProducts();
      }
    }
  };

  const isFirst = useIsFirstRender();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Adding listener');
      window.addEventListener('scroll', scrollHandler);
    }
  }, [isFirst]);

  return (
    <div className={styles.productscardcontainer}>
      {products.map((product) => {
        return (
          <div>
            <img src={product.image} alt="" style={{ maxHeight: '60vh' }} />
            <p>{product.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProductRecommendations;
