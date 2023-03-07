import {
  User,
  Wishlist,
  WishlistDetail,
  WishlistReview,
} from '@/components/interfaces/interfaces';
import Layout from '@/components/layout';
import {
  GRAPHQLAPI,
  WISHLISTDETAILS_QUERY,
  WISHLIST_DETAILS_QUERY,
  WISHLIST_QUERY,
  USER_ADD_CART_MUTATION,
  DELETE_WISHLIST_DETAIL,
  CURRENT_USER_QUERY,
  CREATE_WISHLIST_REVIEW_MUTATION,
  WISHLIST_REVIEW_QUERY,
} from '@/util/constant';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';

import styles from '@/styles/pagesstyles/wishlist/wishlistdetail.module.scss';
import Modal from '@/components/modal/modal';
import WishlistSettingModalContent from '@/components/modal/content/wishlistsetting';
import AddWishlistNotesModalContent from '@/components/modal/content/addwishlistnotes';
import WishlistDetailCard from '@/components/wishlistdetailcard';
import WishlistReviewCard from '@/components/wishlistreviewcard';

export default function WishlistDetailPage() {
  //MainVariables
  const router = useRouter();
  const { id } = router.query;
  const [wishlistDetails, setWishlistDetails] = useState<WishlistDetail[]>([]);
  const [wishlist, setWishlist] = useState<Wishlist>();
  const [token, setToken] = useSessionStorage('token', '');
  const [totalPrice, setTotalPrice] = useState(0);
  const [currUser, setCurrUser] = useState<User | null>(null);

  //Wishlist Reviews
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCustomUsername, setReviewCustomUsername] = useState('');
  const [reviewCommentType, setReviewCommentType] = useState('Custom');
  const [wishlistReviews, setWishlistReviews] = useState<WishlistReview[]>([]);

  const [reviewError, setReviewError] = useState('');

  //Refresh
  const [refresh, setRefresh] = useState(false);

  //Modal
  const [openWishlistSettingModal, setOpenWishlistSettingModal] =
    useState(false);

  const [openAddNotesModal, setOpenAddNotesModal] = useState(false);

  //Get Current User
  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: CURRENT_USER_QUERY,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setCurrUser(res.data.data.getCurrentUser);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: WISHLIST_REVIEW_QUERY,
            variables: {
              wishlistID: id,
            },
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          setWishlistReviews(res.data.data.wishlistReviews);
        })
        .catch(() => {});
    }
  }, [id, refresh]);

  const handleAddNotesClick = () => {
    setOpenAddNotesModal(true);
  };

  const closeAddNotesModal = () => {
    setOpenAddNotesModal(false);
  };
  const closeWishlistSettingModal = () => {
    setOpenWishlistSettingModal(false);
  };

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  const handleReviewRatingChange = (event: any) => {
    if (event.target.value < 0) {
      setReviewRating(0);
    } else if (event.target.value > 5) {
      setReviewRating(5);
    } else {
      setReviewRating(event.target.value);
    }
  };

  const handleSubmitReviewClick = () => {
    setReviewError('');
    axios
      .post(
        GRAPHQLAPI,
        {
          query: CREATE_WISHLIST_REVIEW_MUTATION,
          variables: {
            wishlistID: id,
            customName:
              reviewCommentType == 'Anonymous'
                ? 'Anonymous'
                : reviewCustomUsername,
            rating: reviewRating,
            title: reviewTitle,
            comment: reviewComment,
          },
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res.data.data.createWishlistReview.comment);
        refreshComponent();
      })
      .catch(() => {
        setReviewError('All Fields must be Filled !');
      });
  };

  const handleChangeSelectedReviewCommentType = (event: any) => {
    setReviewCommentType(event.target.value);
  };

  useEffect(() => {
    refreshComponent();
  }, [id]);

  useEffect(() => {
    var totalPrice = 0;
    wishlistDetails.map((w) => {
      totalPrice +=
        (w.product.price - (w.product.price * w.product.discount) / 100) *
        w.quantity;
    });
    setTotalPrice(totalPrice);
  }, [wishlistDetails]);

  const queryWishlist = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: WISHLIST_QUERY,
          variables: {
            wishlistId: id,
          },
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setWishlist(res.data.data.wishlist);
      })
      .catch(() => {});
  };
  const queryWishlistDetails = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: WISHLIST_DETAILS_QUERY,
          variables: {
            wishlistID: id,
          },
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setWishlistDetails(res.data.data.wishlistDetails);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (id) {
      queryWishlist();
      queryWishlistDetails();
    }
  }, [refresh]);

  const handleSettingButtonClick = () => {
    setOpenWishlistSettingModal(true);
  };

  const handleAddAllToCartClick = () => {
    wishlistDetails.map((e) => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_ADD_CART_MUTATION,
            variables: {
              productID: e.product.id,
              quantity: e.quantity,
            },
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          console.log(res);
        })
        .catch(() => {});
    });
  };
  return (
    <Layout>
      <div className={styles.pagedivider}>
        <div className={styles.leftsection}>
          <div className={styles.wishlistinfocontainer}>
            <div className={styles.wishlistcontainertitle}>
              {wishlist?.name}
            </div>
            {currUser && currUser?.id == wishlist?.user.id && (
              <div className={styles.wishlistsettingcontainer}>
                <button
                  className={styles.secondarybutton}
                  style={{
                    backgroundColor: 'grey',
                  }}
                >
                  {wishlist?.privacy}
                </button>
                <button
                  className={styles.secondarybutton}
                  onClick={handleSettingButtonClick}
                >
                  SETTINGS
                </button>
              </div>
            )}

            <hr className={styles.horizontalline} />

            <div className={styles.subtotalcontainer}>
              <div className={styles.subtotallabel}>
                Subtotal (item):
                <span style={{ fontWeight: 'bold' }}>${totalPrice}</span>{' '}
              </div>
              <div className={styles.flexendcontainer}>
                <button
                  onClick={handleAddAllToCartClick}
                  className={styles.primarybutton}
                  style={{
                    width: 'fit-content',

                    justifySelf: 'flex-end',
                  }}
                >
                  ADD ALL TO CART
                </button>
              </div>
            </div>
            {wishlist?.notes != '' && (
              <div className={styles.wishlistnotecontainer}>
                {wishlist?.notes}
              </div>
            )}

            <div className={styles.flexendcontainer}>
              {currUser && currUser.id == wishlist?.user.id && (
                <button
                  className={styles.secondarybutton}
                  onClick={handleAddNotesClick}
                >
                  {wishlist?.notes == '' ? 'ADD NOTES' : 'EDIT NOTES'}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={styles.rightsection}>
          <div className={styles.filtercontainer}></div>
          <div className={styles.wishlistdetailcontainer}>
            {wishlistDetails.map((e) => {
              return (
                <WishlistDetailCard
                  refreshComponent={refreshComponent}
                  wishlistdetail={e}
                  key={e.product.id}
                />
              );
            })}
          </div>
          <div className={styles.commentdivider}>
            <div className={styles.commentsection}>
              <div>Comments</div>
              <div className={styles.commentcontainer}>
                {wishlistReviews.map((x) => {
                  return <WishlistReviewCard wishlistReview={x} key={x.id} />;
                })}
              </div>
            </div>
            {wishlist?.user.id != currUser?.id && (
              <div className={styles.commentsection}>
                <div className={styles.ratecontainer}>
                  <span className={styles.ratelabel}>Rate this wishlist</span>
                </div>
                <input
                  type="number"
                  className={styles.halfinput}
                  value={reviewRating}
                  onChange={handleReviewRatingChange}
                />
                <div className={styles.inputcontainer}>
                  <input
                    type="text"
                    className={styles.textinput}
                    placeholder="Add title about this wishlist."
                    value={reviewTitle}
                    onChange={(e) => {
                      setReviewTitle(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputcontainer}>
                  <input
                    type="text"
                    className={`${styles.textinput}`}
                    value={reviewComment}
                    onChange={(e) => {
                      setReviewComment(e.target.value);
                    }}
                    placeholder="Add your comment about this wishlist."
                  />
                </div>
                <div className={styles.inputcontainer}>
                  <input
                    type="checkbox"
                    checked={reviewCommentType == 'Custom'}
                    value="Custom"
                    onChange={handleChangeSelectedReviewCommentType}
                  />{' '}
                  <span
                    style={{
                      marginRight: '10px',
                    }}
                  >
                    Display as:{' '}
                  </span>
                  <input
                    type="text"
                    className={styles.halfinput}
                    value={reviewCustomUsername}
                    onChange={(e) => {
                      setReviewCustomUsername(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.inputcontainer}>
                  <input
                    type="checkbox"
                    value="Anonymous"
                    checked={reviewCommentType == 'Anonymous'}
                    onChange={handleChangeSelectedReviewCommentType}
                  />
                  <span
                    style={{
                      marginLeft: '5px',
                    }}
                  >
                    Anonymous
                  </span>
                </div>
                <div
                  className={`${styles.inputcontainer} ${styles.containerend}`}
                >
                  <div className={styles.errorlabel}>{reviewError}</div>
                  <button
                    className={styles.submitreviewbutton}
                    onClick={handleSubmitReviewClick}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {openWishlistSettingModal && wishlist && (
          <Modal
            closeModal={closeWishlistSettingModal}
            height={50}
            width={50}
            key={wishlist.id}
          >
            <WishlistSettingModalContent
              closeModal={closeWishlistSettingModal}
              refreshComponent={refreshComponent}
              wishlistId={wishlist.id}
            />
          </Modal>
        )}

        {openAddNotesModal && wishlist && (
          <Modal
            closeModal={closeAddNotesModal}
            height={50}
            width={50}
            key={wishlist.id}
          >
            <AddWishlistNotesModalContent
              closeModal={closeAddNotesModal}
              refreshComponent={refreshComponent}
              wishlistId={wishlist.id}
              key={wishlist.id}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
}
