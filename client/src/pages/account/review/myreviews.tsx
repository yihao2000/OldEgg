import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Layout from '@/components/layout';
import ShopHeader from '@/components/shop/shopheader';
import styles from '@/styles/pagesstyles/account/profile.module.scss';

import {
  Product,
  ProductReview,
  Shop,
  WishlistReview,
} from '@/components/interfaces/interfaces';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import {
  DELETE_PRODUCT_REVIEW_MUTATION,
  DELETE_WISHLIST_REVIEW_MUTATION,
  GRAPHQLAPI,
  SHOP_PRODUCTS_QUERY,
  SHOP_QUERY,
  SHOP_TOTAL_SALES_QUERY,
  UPDATE_PRODUCT_REVIEW_MUTATION,
  UPDATE_WISHLIST_REVIEW_MUTATION,
  USER_PRODUCT_REVIEWS_QUERY,
  USER_WISHLIST_REVIEWS_QUERY,
} from '@/util/constant';
import ProductCard from '@/components/productcard';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';
import { AccountSidebar } from '@/components/sidebar/accountsidebar';
import Modal from '@/components/modal/modal';

export default function MyReviews() {
  const router = useRouter();

  const [token, setToken] = useSessionStorage('token', '');

  const [refresh, setRefresh] = useState(false);

  const [userProductReviews, setUserProductReviews] = useState<ProductReview[]>(
    [],
  );

  const [userWishlistReviews, setUserWishlistReviews] = useState<
    WishlistReview[]
  >([]);

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_PRODUCT_REVIEWS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setUserProductReviews(res.data.data.userProductReviews);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_WISHLIST_REVIEWS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setUserWishlistReviews(res.data.data.userWishlistReviews);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);
  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  interface ReviewCardParameter {
    rating: number;
    comment: string;
    title: string;
    id: string;
    name: string;
    mode: string;
  }

  const ReviewCard = (props: ReviewCardParameter) => {
    const [openUpdateReviewModal, setOpenUpdateReviewModal] = useState(false);
    const [openDetailReviewModal, setOpenDetailReviewModal] = useState(false);

    const closeDetailReviewModal = () => {
      setOpenDetailReviewModal(false);
    };

    const closeUpdateReviewModal = () => {
      setOpenUpdateReviewModal(false);
    };

    const DetailReviewContent = () => {
      return (
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '10px',
          }}
        >
          <div>ID: {props.id}</div>
          <div>
            {props.mode == 'productreview' ? 'Product ' : 'Wishlist '}Name:{' '}
            {props.name}
          </div>

          <div
            style={{
              marginTop: '15px',
            }}
          >
            Review
          </div>
          <div>
            {' '}
            <span className={styles.ratinglabel}>{props.rating}</span> / 5 Eggs{' '}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {props.title}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {props.comment}
          </div>
        </div>
      );
    };

    const UpdateReviewContent = () => {
      //Review Variables
      const [reviewRating, setReviewRating] = useState(props.rating);
      const [reviewTitle, setReviewTitle] = useState(props.title);
      const [reviewComment, setReviewComment] = useState(props.comment);
      const [error, setError] = useState('');

      const handleUpdateClick = () => {
        setError('');
        if (reviewTitle == '' || reviewComment == '') {
          setError('All Fields must be Filled !');
        } else {
          if (props.mode == 'productreview') {
            axios
              .post(
                GRAPHQLAPI,
                {
                  query: UPDATE_PRODUCT_REVIEW_MUTATION,
                  variables: {
                    productID: props.id,
                    title: reviewTitle,
                    comment: reviewComment,
                    rating: reviewRating,
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
                refreshComponent();
                closeUpdateReviewModal();
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (props.mode == 'wishlistreview') {
            axios
              .post(
                GRAPHQLAPI,
                {
                  query: UPDATE_WISHLIST_REVIEW_MUTATION,
                  variables: {
                    wishlistReviewID: props.id,
                    title: reviewTitle,
                    comment: reviewComment,
                    rating: reviewRating,
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
                refreshComponent();
                closeUpdateReviewModal();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      };
      return (
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '10px',
          }}
        >
          <div>ID: {props.id}</div>
          <div>
            {props.mode == 'productreview' ? 'Product ' : 'Wishlist '}Name:{' '}
            {props.name}
          </div>

          <div
            style={{
              marginTop: '15px',
            }}
          >
            Review
          </div>
          <div>
            <input
              className={styles.textinput}
              type="number"
              value={reviewRating}
              placeholder={'Rating'}
              onChange={(event) => {
                if (
                  Number(event.target.value) < 6 &&
                  Number(event.target.value) > 0
                ) {
                  setReviewRating(Number(event.target.value));
                }
              }}
            />
            <span> / 5 Eggs</span>
          </div>
          <div>
            <input
              className={styles.fulltextinput}
              type="text"
              value={reviewTitle}
              placeholder={'Title'}
              onChange={(event) => {
                setReviewTitle(event.target.value);
              }}
            />
          </div>
          <div>
            <input
              className={styles.fulltextinput}
              style={{
                width: '100%',
              }}
              type="text"
              value={reviewComment}
              placeholder={'Comment'}
              onChange={(event) => {
                setReviewComment(event.target.value);
              }}
            />
          </div>
          <div
            style={{
              color: 'red',
              fontWeight: 'bold',
            }}
          >
            {error}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px',
            }}
          >
            <button onClick={handleUpdateClick}>Update</button>
          </div>
        </div>
      );
    };

    const handleDeleteReviewClick = () => {
      if (props.mode == 'productreview') {
        console.log('Masuk');
        axios
          .post(
            GRAPHQLAPI,
            {
              query: DELETE_PRODUCT_REVIEW_MUTATION,
              variables: {
                productID: props.id,
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
            refreshComponent();
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (props.mode == 'wishlistreview') {
        axios
          .post(
            GRAPHQLAPI,
            {
              query: DELETE_WISHLIST_REVIEW_MUTATION,
              variables: {
                wishlistReviewID: props.id,
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
            refreshComponent();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    return (
      <div className={styles.cardcontainer}>
        <div className={styles.infocontainer}>
          {props.mode == 'productreview' && (
            <div className={styles.namecontainer}>
              Product Name: {props.name}
            </div>
          )}
        </div>
        <div className={styles.ratingcontainer}>
          <span className={styles.ratinglabel}>{props.rating}</span> / 5 Eggs
        </div>

        <div className={styles.commentcontainer}>
          <div
            style={{
              fontSize: '15px',
            }}
          >
            Comments:{' '}
          </div>
          <div>{props.comment}</div>
        </div>
        <div>
          <button
            onClick={() => {
              setOpenDetailReviewModal(true);
              console.log('Hai');
            }}
          >
            View Detail
          </button>
          <button
            onClick={() => {
              setOpenUpdateReviewModal(true);
            }}
          >
            Edit Review
          </button>
          <button onClick={handleDeleteReviewClick}>Delete Review</button>
        </div>

        {openUpdateReviewModal && (
          <Modal closeModal={closeUpdateReviewModal} height={50} width={30}>
            <UpdateReviewContent />
          </Modal>
        )}

        {openDetailReviewModal && (
          <Modal closeModal={closeDetailReviewModal} height={50} width={30}>
            <DetailReviewContent />
          </Modal>
        )}
      </div>
    );
  };

  useEffect(() => {}, [refresh]);

  return (
    <Layout>
      <div className={styles.maincontainer}>
        <div className={styles.divider}>
          <AccountSidebar />
          <div className={styles.verticalline}></div>
          <div className={styles.rightside}>
            <div className={styles.titlecontainer}>
              <h2>Product Reviews</h2>
            </div>

            <div className={styles.contentcontainer}>
              {userProductReviews.map((x) => {
                return (
                  <ReviewCard
                    mode={'productreview'}
                    comment={x.comment}
                    rating={x.rating}
                    title={x.title}
                    name={x.product.name}
                    id={x.product.id}
                    key={x.product.id}
                  />
                );
              })}
            </div>

            <div className={styles.titlecontainer}>
              <h2>Wishlist Reviews</h2>
            </div>
            <div className={styles.contentcontainer}>
              {userWishlistReviews.map((x) => {
                return (
                  <ReviewCard
                    mode={'wishlistreview'}
                    comment={x.comment}
                    rating={x.rating}
                    title={x.title}
                    name={x.wishlist.name}
                    id={x.id}
                    key={x.id}
                  />
                );
              })}
            </div>
            <div className={styles.titlecontainer}>
              <h2>Shop Reviews</h2>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
