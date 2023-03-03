import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Layout from '@/components/layout';
import ShopHeader from '@/components/shop/shopheader';
import styles from '@/styles/pagesstyles/shop/products/shoppages.module.scss';

import { Product, Shop } from '@/components/interfaces/interfaces';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import {
  GRAPHQLAPI,
  SHOP_PRODUCTS_QUERY,
  SHOP_QUERY,
  SHOP_TOTAL_SALES_QUERY,
} from '@/util/constant';
import ProductCard from '@/components/productcard';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';

export default function ShopAboutUs() {
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useSessionStorage('token', '');
  const [shop, setShop] = useState<Shop>();
  const [totalSales, setTotalSales] = useState(0);

  const [refresh, setRefresh] = useState(false);

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (id) {
      axios
        .post(GRAPHQLAPI, {
          query: SHOP_QUERY,
          variables: {
            shopID: id,
          },
        })
        .then((res) => {
          setShop(res.data.data.shop);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .post(GRAPHQLAPI, {
          query: SHOP_TOTAL_SALES_QUERY,
          variables: {
            shopID: id,
          },
        })
        .then((res) => {
          setTotalSales(res.data.data.shopTotalSales);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [refresh]);

  return (
    <Layout>
      <div className={styles.maincontainer}>
        <ShopHeader />
        <div className={styles.contentsection}>
          <div className={styles.contentcontainer}>
            <div className={styles.shopinformationcontainer}>
              <h1>About Us</h1>
              <h3>{shop?.name}</h3>
              <h5>{totalSales} Sales</h5>
              <p>{shop?.description}</p>
              <p>{shop?.aboutus}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
