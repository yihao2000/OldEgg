import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Layout from '@/components/layout';
import ShopHeader from '@/components/shop/shopheader';
import styles from '@/styles/pagesstyles/shop/reviews/shopreviews.module.scss';

import { Product, Shop, ShopReview } from '@/components/interfaces/interfaces';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import {
  GRAPHQLAPI,
  SHOP_PRODUCTS_QUERY,
  SHOP_QUERY,
  SHOP_REVIEWS_QUERY,
  SHOP_TOTAL_SALES_QUERY,
} from '@/util/constant';
import ProductCard from '@/components/productcard';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';

import NextNProgress from 'nextjs-progressbar';
import { PieChart } from 'react-minimal-pie-chart';
import NextProgress from 'next-progress';

export default function ShopAboutUs() {
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useSessionStorage('token', '');
  const [shop, setShop] = useState<Shop>();
  const [totalSales, setTotalSales] = useState(0);

  const [refresh, setRefresh] = useState(false);

  const [shopReviews, setShopReviews] = useState<ShopReview[]>();

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  interface Paramater {
    shopReview: ShopReview;
  }
  const ReviewCard = (props: Paramater) => {
    const [date, setDate] = useState<Date>();

    useEffect(() => {
      setDate(new Date(props.shopReview.transactionHeader.transactionDate));
    }, []);
    return (
      <div className={styles.reviewcard}>
        <div className={styles.reviewfirstsection}>
          <h4>{props.shopReview.user.name}</h4>
          <h5>Ordered On: {date?.toDateString()}</h5>
        </div>
        <div className={styles.reviewsecondsection}>
          <div className={styles.cardratingcontainer}>
            <h4>
              {' '}
              <span className={styles.accentlabel}>
                {' '}
                {props.shopReview.rating}
              </span>
              /<span className={styles.accentlabel}>5</span>
            </h4>
          </div>
          <div className={styles.commentcontainer}>
            {props.shopReview.comment}
          </div>
        </div>
        <div className={styles.reviewthirdsection}>
          <h5>{props.shopReview.dateCreated}</h5>
        </div>
      </div>
    );
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
    }
  }, [refresh, id]);

  return (
    <Layout>
      <div className={styles.maincontainer}>
        <ShopHeader />
        <div className={styles.contentsection}>
          <div className={styles.contentcontainer}>
            <h1>Feedback</h1>
            <div className={styles.summarycontainer}>
              <div className={styles.firstsection}>asdsa</div>
              <div className={styles.secondsection}>asdsa</div>
              <div className={styles.thirdsection}>;</div>
            </div>

            {shopReviews && (
              <div className={styles.reviewcontainer}>
                <div className={styles.reviewheadercontainer}>a</div>
                <div className={styles.reviewcardcontainer}>
                  {shopReviews?.map((x) => {
                    return <ReviewCard shopReview={x} />;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
