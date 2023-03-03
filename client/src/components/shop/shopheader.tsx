import styles from '@/styles/pagesstyles/shop/shopdetail.module.scss';
import { GRAPHQLAPI, SHOP_QUERY } from '@/util/constant';
import { links } from '@/util/route';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Shop } from '../interfaces/interfaces';

export default function ShopHeader() {
  const [shop, setShop] = useState<Shop>();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log(id);
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
    }
  }, [id]);

  return (
    <div>
      {shop && (
        <div>
          <div className={styles.shopinfocontainer}>
            <div className={styles.shopprofile}>
              <img src={shop?.image} alt="" className={styles.profileimage} />
            </div>
            <div className={styles.shopdetail}>
              <div className={styles.shoptitle}>{shop?.name}</div>
              <div className={styles.detailcontainer}>Shop detail</div>
            </div>
          </div>
          <div className={styles.pagecontainer}>
            <a href="" className={styles.hpstyle}>
              Store Home
            </a>
            <div className={styles.verticalseparator}></div>
            <a
              href={links.shopProductslist(shop.id)}
              className={styles.hpstyle}
            >
              All Products
            </a>
            <div className={styles.verticalseparator}></div>
            <a href="" className={styles.hpstyle}>
              Reviews
            </a>
            <div className={styles.verticalseparator}></div>
            <a href={links.shopAboutUs(shop.id)} className={styles.hpstyle}>
              About Us
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
