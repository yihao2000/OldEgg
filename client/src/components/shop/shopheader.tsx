import styles from '@/styles/pagesstyles/shop/shopdetail.module.scss';
import {
  GRAPHQLAPI,
  SHOP_QUERY,
  SHOP_REVIEWS_QUERY,
  SHOP_TOTAL_SALES_QUERY,
} from '@/util/constant';
import { links } from '@/util/route';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Shop, ShopReview } from '../interfaces/interfaces';

export default function ShopHeader() {
  const [shop, setShop] = useState<Shop>();
  const router = useRouter();
  const { id } = router.query;
  const [shopReviews, setShopReviews] = useState<ShopReview[]>();
  const [shopAverageRating, setShopAverageRating] = useState(0);
  const [shopTotalSales, setShopTotalSales] = useState(0);

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

      axios
        .post(GRAPHQLAPI, {
          query: SHOP_REVIEWS_QUERY,
          variables: {
            shopID: id,
          },
        })
        .then((res) => {
          setShopReviews(res.data.data.shopReviews);
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
          setShopTotalSales(res.data.data.shopTotalSales);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  useEffect(() => {
    if (shopReviews) {
      calculateShopAverageRating();
    }
  }, [shopReviews]);

  const calculateShopAverageRating = () => {
    if (shopReviews) {
      var totalRating = 0;
      shopReviews?.map((x) => {
        totalRating += x.rating;
      });

      totalRating = totalRating / shopReviews?.length;
      setShopAverageRating(totalRating);
    }
  };

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
              <div className={styles.detailcontainer}>
                <span>
                  <b>{shopTotalSales}</b> Sales |{' '}
                  <span className={styles.accentlabel}>
                    {shopReviews?.length != 0 ? shopAverageRating : '0'}/5{' '}
                  </span>
                  ({shopReviews?.length} Total Reviews)
                </span>
              </div>
            </div>
          </div>
          <div className={styles.pagecontainer}>
            <a href={links.shopDetail(shop.id)} className={styles.hpstyle}>
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
            <a href={links.shopReviews(shop.id)} className={styles.hpstyle}>
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
