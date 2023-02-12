import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { GRAPHQLAPI, PRODUCTS_QUERY, PROMOS_QUERY } from '@/util/constant';
import styles from '@/styles/home.module.css';
import { Product } from '@/components/interfaces/interfaces';
import { useIsFirstRender } from 'usehooks-ts';

const ProductRecommendations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [noData, setNoData] = useState(false);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (loading == false) {
      setLoading(true);
      console.log('Kepanggil');
      axios
        .post(GRAPHQLAPI, {
          query: PRODUCTS_QUERY,
          variables: {
            limit: 5,
            offset: offset,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.data.products.length == 0) {
            setNoData(true);
          } else {
            var temp = offset;
            temp = temp + 5;
            console.log(temp);
            setOffset(temp);
            const newProducts = products.concat(res.data.data.products);

            setProducts(newProducts);
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
          setLoadData(false);
        });
    }
  }, [loadData]);

  useEffect(() => {
    setLoadData(true);
  }, []);

  const scrollHandler = () => {
    if (
      window.innerHeight + Math.floor(document.documentElement.scrollTop) >=
      document.documentElement.offsetHeight
    ) {
      if (noData == false) {
        setLoadData(true);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', scrollHandler);
    }
  }, []);

  return (
    <div className={styles.productcardcontainer}>
      {products.map((product) => {
        return (
          <div className={styles.productcard}>
            <div className={styles.productcardimagecontainer}>
              <img
                src={product.image}
                alt=""
                className={styles.productcardimage}
              />
            </div>
            <div className={styles.productdescriptioncontainer}>
              <p>{product.name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductRecommendations;
