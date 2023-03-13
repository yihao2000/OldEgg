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
  CREATE_SHOP_REVIEW_TAG_MUTATION,
  GRAPHQLAPI,
  SHOP_PRODUCTS_QUERY,
  SHOP_QUERY,
  SHOP_REVIEWS_QUERY,
  SHOP_REVIEW_TAG_QUERY,
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

  const [oneEggReview, setOneEggReview] = useState(0);
  const [twoEggReview, setTwoEggReview] = useState(0);
  const [threeEggReview, setThreeEggReview] = useState(0);
  const [fourEggReview, setFourEggReview] = useState(0);
  const [fiveEggReview, setFiveEggReview] = useState(0);

  const [onTimeDelivery, setOnTimeDelivery] = useState(0);
  const [accurateProduct, setAccurateProduct] = useState(0);
  const [satisfiedService, setSatisfiedService] = useState(0);

  const [shopAllReviews, setShopAllReviews] = useState<ShopReview[]>();
  const [shopReviews, setShopReviews] = useState<ShopReview[]>();

  const [filterTime, setFilterTime] = useState('overall');
  const [search, setSearch] = useState('');

  const [averageRating, setAverageRating] = useState(0);

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  interface Paramater {
    shopReview: ShopReview;
  }

  const ReviewCard = (props: Paramater) => {
    interface ShopReviewTag {
      tag: string;
    }

    const [orderDate, setOrderDate] = useState<Date>();
    const [reviewDate, setReviewDate] = useState<Date>();
    const [shopReviewTag, setShopReviewTag] = useState<ShopReviewTag>();
    useEffect(() => {
      setOrderDate(
        new Date(props.shopReview.transactionHeader.transactionDate),
      );
      setReviewDate(new Date(props.shopReview.dateCreated));

      axios
        .post(
          GRAPHQLAPI,
          {
            query: SHOP_REVIEW_TAG_QUERY,
            variables: {
              shopReviewID: props.shopReview.id,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          console.log(res);
          setShopReviewTag(res.data.data.shopReviewTag);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);

    const handleHelpfulReviewClick = () => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: CREATE_SHOP_REVIEW_TAG_MUTATION,
            variables: {
              shopReviewID: props.shopReview.id,
              tag: 'Helpful',
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          refreshComponent();
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const handleUnhelpfulReviewClick = () => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: CREATE_SHOP_REVIEW_TAG_MUTATION,
            variables: {
              shopReviewID: props.shopReview.id,
              tag: 'Unhelpful',
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          refreshComponent();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return (
      <div className={styles.reviewcard}>
        <div className={styles.reviewfirstsection}>
          <h4>{props.shopReview.user.name}</h4>
          <h5>Ordered On: {orderDate?.toDateString()}</h5>
        </div>
        <div className={styles.reviewsecondsection}>
          <div className={styles.cardratingcontainer}>
            <h4>
              {' '}
              <span className={styles.accentlabel}>
                {' '}
                {props.shopReview.rating}{' '}
              </span>
              / 5
            </h4>
          </div>
          <div className={styles.commentcontainer}>
            {props.shopReview.comment}
          </div>
        </div>
        <div className={styles.reviewthirdsection}>
          <h5>{reviewDate?.toDateString()}</h5>
          {shopReviewTag?.tag == '' && (
            <div
              style={{
                display: 'flex',
                columnGap: '10px',
              }}
            >
              <button
                style={{
                  background: 'green',
                  color: 'white',
                }}
                onClick={handleHelpfulReviewClick}
              >
                Helpful
              </button>
              <button
                style={{
                  background: 'red',
                  color: 'white',
                }}
                onClick={handleUnhelpfulReviewClick}
              >
                Unfelpful
              </button>
            </div>
          )}
          {shopReviewTag?.tag != '' && (
            <div
              style={{
                fontSize: '10px',
              }}
            >
              You have tagged this review as : {shopReviewTag?.tag}
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (shopAllReviews) {
      var allRating = 0;
      var oneEgg = 0;
      var twoEgg = 0;
      var threeEgg = 0;
      var fourEgg = 0;
      var fiveEgg = 0;

      var otd = 0;
      var ap = 0;
      var ss = 0;
      shopAllReviews.map((x) => {
        allRating += x.rating;

        if (x.rating == 1) {
          oneEgg += 1;
        } else if (x.rating == 2) {
          twoEgg += 1;
        } else if (x.rating == 3) {
          threeEgg += 1;
        } else if (x.rating == 4) {
          fourEgg += 1;
        } else if (x.rating == 5) {
          fiveEgg += 1;
        }

        if (x.onTimeDelivery == true) {
          otd += 1;
        }
        if (x.productAccurate == true) {
          ap += 1;
        }
        if (x.satisfiedService == true) {
          ss += 1;
        }
      });
      allRating /= shopAllReviews.length;
      setAverageRating(allRating);
      setOneEggReview(oneEgg);
      setTwoEggReview(twoEgg);
      setThreeEggReview(threeEgg);
      setFourEggReview(fourEgg);
      setFiveEggReview(fiveEgg);

      setAccurateProduct(ap);
      setOnTimeDelivery(otd);
      setSatisfiedService(ss);
    }
  }, [shopAllReviews]);

  const loadAllReviews = () => {
    axios
      .post(GRAPHQLAPI, {
        query: SHOP_REVIEWS_QUERY,
        variables: {
          shopID: id,
        },
      })
      .then((res) => {
        setShopAllReviews(res.data.data.shopReviews);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadShowReviews = () => {
    axios
      .post(GRAPHQLAPI, {
        query: SHOP_REVIEWS_QUERY,
        variables: {
          shopID: id,
          filter: filterTime,
          search: search,
        },
      })
      .then((res) => {
        setShopReviews(res.data.data.shopReviews);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadShowReviews();
  }, [filterTime]);

  const handleSearchButtonClick = () => {
    loadShowReviews();
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

      loadShowReviews();
      loadAllReviews();
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
              <div className={styles.firstsection}>
                <span>Overall Rating: </span>
                <span className={styles.accentlabel}>
                  {shopAllReviews?.length == 0 ? '0' : averageRating}{' '}
                </span>
                /<span> 5 ({shopAllReviews?.length} Reviews)</span>
              </div>
              {shopAllReviews && (
                <div className={styles.secondsection}>
                  <div className={styles.rowsection}>
                    <span className={styles.accentlabel}>5 </span>Eggs:{' '}
                    {fiveEggReview} Reviews (
                    {shopAllReviews.length != 0
                      ? (fiveEggReview * 100) / shopAllReviews?.length
                      : '0'}
                    %)
                  </div>
                  <div className={styles.rowsection}>
                    <span className={styles.accentlabel}>4 </span>Eggs:{' '}
                    {fourEggReview} Reviews (
                    {shopAllReviews.length != 0
                      ? (fourEggReview * 100) / shopAllReviews?.length
                      : '0'}
                    %)
                  </div>
                  <div className={styles.rowsection}>
                    <span className={styles.accentlabel}>3 </span>Eggs:{' '}
                    {threeEggReview} Reviews (
                    {shopAllReviews.length != 0
                      ? (threeEggReview * 100) / shopAllReviews?.length
                      : '0'}
                    %)
                  </div>
                  <div className={styles.rowsection}>
                    <span className={styles.accentlabel}>2 </span>Eggs:{' '}
                    {twoEggReview} Reviews (
                    {shopAllReviews.length != 0
                      ? (twoEggReview * 100) / shopAllReviews?.length
                      : '0'}
                    %)
                  </div>
                  <div className={styles.rowsection}>
                    <span className={styles.accentlabel}>1 </span>Eggs:{' '}
                    {oneEggReview} Reviews (
                    {shopAllReviews.length != 0
                      ? (oneEggReview * 100) / shopAllReviews?.length
                      : '0'}
                    %)
                  </div>
                </div>
              )}
              {shopAllReviews && (
                <div className={styles.thirdsection}>
                  <div className={styles.circularchart}>
                    <div>
                      {shopAllReviews.length != 0
                        ? (onTimeDelivery * 100) / shopAllReviews?.length
                        : '0'}{' '}
                      %{' '}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        flexWrap: 'wrap',
                      }}
                    >
                      {' '}
                      OnTime
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        flexWrap: 'wrap',
                      }}
                    >
                      {' '}
                      Delivery
                    </div>
                  </div>
                  <div className={styles.circularchart}>
                    <div>
                      {shopAllReviews.length != 0
                        ? (accurateProduct * 100) / shopAllReviews?.length
                        : '0'}{' '}
                      %{' '}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        flexWrap: 'wrap',
                      }}
                    >
                      {' '}
                      Product
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        flexWrap: 'wrap',
                      }}
                    >
                      {' '}
                      Accuracy
                    </div>
                  </div>
                  <div className={styles.circularchart}>
                    <div>
                      {shopAllReviews.length != 0
                        ? (satisfiedService * 100) / shopAllReviews?.length
                        : '0'}{' '}
                      %{' '}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        flexWrap: 'wrap',
                      }}
                    >
                      {' '}
                      Service
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        flexWrap: 'wrap',
                      }}
                    >
                      {' '}
                      Satisfaction
                    </div>
                  </div>
                </div>
              )}
            </div>

            {shopReviews && (
              <div className={styles.reviewcontainer}>
                <div className={styles.reviewheadercontainer}>
                  <div className={styles.subcontainer}>
                    <span className={styles.searchlabel}>Search Reviews: </span>
                    <input
                      type="text"
                      className={styles.inputfield}
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                      }}
                    />
                    <button
                      className={styles.buttongo}
                      onClick={handleSearchButtonClick}
                    >
                      Go
                    </button>
                  </div>
                  <div className={styles.subcontainer}>
                    <span>Filter By: </span>
                    <select
                      value={filterTime}
                      onChange={(event) => {
                        setFilterTime(event.target.value);
                      }}
                      className={styles.selectstyle}
                    >
                      <option value="overall">Overall</option>
                      <option value="30days">30 Days</option>
                      <option value="60days">60 Days</option>
                      <option value="12months">12 Months</option>
                      {/* <option value="featureditems">Featured Items</option> */}
                    </select>
                  </div>
                </div>
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
