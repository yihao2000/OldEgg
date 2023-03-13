import { ProductReview, User, WishlistDetail } from './interfaces/interfaces';
import styles from '@/styles/pagesstyles/wishlist/wishlistdetail.module.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles2 from '@/styles/pagesstyles/productdetail.module.scss';
import {
  CURRENT_USER_QUERY,
  DELETE_WISHLIST_DETAIL,
  DELETE_WISHLIST_WISHLISTDETAIL_MUTATION,
  GRAPHQLAPI,
  PRODUCT_QUERY,
  PRODUCT_REVIEWS_QUERY,
  UPDATE_WISHLIST_DETAIL,
  USER_ADD_CART_MUTATION,
} from '@/util/constant';
import { useSessionStorage } from 'usehooks-ts';
import { LAPTOP_NAME_CONVERTER } from './converter/converter';

interface Parameter {
  wishlistdetail: WishlistDetail;
  refreshComponent: Function;
}
export default function WishlistDetailCard(props: Parameter) {
  const [wishlistDetailQuantity, setWishlistDetailQuantity] = useState(0);
  const [token, setToken] = useSessionStorage('token', '');
  const [user, setUser] = useState<User>();
  const [productReviews, setProductReviews] = useState<ProductReview[]>();
  const [productAvgRating, setProductAvgRating] = useState(0);

  useEffect(() => {
    if (productReviews) {
      var total = 0;
      productReviews.map((x) => {
        total += x.rating;
      });
      setProductAvgRating(total / productReviews.length);
    }
  }, [productReviews]);
  useEffect(() => {
    console.log(props.wishlistdetail);
    if (token) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: CURRENT_USER_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setUser(res.data.data.getCurrentUser);
        });

      axios
        .post(
          GRAPHQLAPI,
          {
            query: PRODUCT_REVIEWS_QUERY,
            variables: {
              productID: props.wishlistdetail.product.id,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setProductReviews(res.data.data.productReviews);
        });
    }
  }, [token]);
  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: PRODUCT_QUERY,
          variables: {
            id: props.wishlistdetail.product.id,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        if (props.wishlistdetail.quantity > res.data.data.product.quantity) {
          axios
            .post(
              GRAPHQLAPI,
              {
                query: UPDATE_WISHLIST_DETAIL,
                variables: {
                  productID: props.wishlistdetail.product.id,
                  wishlistID: props.wishlistdetail.wishlist.id,
                  quantity: 0,
                },
              },
              {
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              },
            )
            .then((res) => {
              props.refreshComponent();
            });
        }
      })
      .catch((err) => {
        // setError('Invalid Product Amount !');
      });
    setWishlistDetailQuantity(props.wishlistdetail.quantity);
  }, []);

  const handleQuantityChange = (event: any) => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: UPDATE_WISHLIST_DETAIL,
          variables: {
            productID: props.wishlistdetail.product.id,
            wishlistID: props.wishlistdetail.wishlist.id,
            quantity: event.target.value,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        // console.log(res);
        setWishlistDetailQuantity(res.data.data.updateWishlistDetail.quantity);
        props.refreshComponent();
      })
      .catch((err) => {
        // setError('Invalid Product Amount !');
      });
  };

  const handleIncreaseQuantity = () => {
    var currQty = props.wishlistdetail.quantity + 1;
    axios
      .post(
        GRAPHQLAPI,
        {
          query: UPDATE_WISHLIST_DETAIL,
          variables: {
            productID: props.wishlistdetail.product.id,
            wishlistID: props.wishlistdetail.wishlist.id,
            quantity: currQty,
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
        setWishlistDetailQuantity(res.data.data.updateWishlistDetail.quantity);
        props.refreshComponent();
      })
      .catch((err) => {
        // setError('Invalid Product Amount !');
      });
  };

  const handleDecreaseQuantity = () => {
    var currQty = props.wishlistdetail.quantity - 1;
    axios
      .post(
        GRAPHQLAPI,
        {
          query: UPDATE_WISHLIST_DETAIL,
          variables: {
            productID: props.wishlistdetail.product.id,
            wishlistID: props.wishlistdetail.wishlist.id,
            quantity: currQty,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setWishlistDetailQuantity(res.data.data.updateWishlistDetail.quantity);
        props.refreshComponent();
      })
      .catch((err) => {
        // setError('Invalid Product Amount !');
      });
  };

  const handleAddToCartClick = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_ADD_CART_MUTATION,
          variables: {
            productID: props.wishlistdetail.product.id,
            quantity: wishlistDetailQuantity,
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
      })
      .catch((err) => {
        // setError('Invalid Product Amount !');
      });
  };

  const handleRemoveButtonClick = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: DELETE_WISHLIST_DETAIL,
          variables: {
            productID: props.wishlistdetail.product.id,
            wishlistId: props.wishlistdetail.wishlist.id,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        props.refreshComponent();
      })
      .catch((err) => {
        // setError('Invalid Product Amount !');
      });
  };

  return (
    <div className={styles.wishlistdetailcardcontainer}>
      <div className={styles.cardimagecontainer}>
        <img
          src={props.wishlistdetail.product.image}
          alt=""
          className={styles.cardimage}
        />
      </div>
      <div className={styles.descriptioncontainer}>
        <div className={styles.fullgapcontainer}>
          {productReviews?.length != 0 && (
            <span>
              <span
                style={{
                  color: 'yellow',
                }}
              >
                {productAvgRating}
              </span>
              /5 Eggs ({productReviews?.length} Reviews)
            </span>
          )}
        </div>
        <div className={styles.titlecontainer}>
          {LAPTOP_NAME_CONVERTER(props.wishlistdetail.product.name)}
        </div>
      </div>
      <div className={styles.actioncontainer}>
        <div className={styles.pricecontainer}>
          $
          {(props.wishlistdetail.product.price -
            (props.wishlistdetail.product.price *
              props.wishlistdetail.product.discount) /
              100) *
            props.wishlistdetail.quantity}
        </div>
        <div className={styles.qtyaddcontainer}>
          <div className={styles2.quantitycontainer}>
            {props.wishlistdetail.wishlist.user.id == user?.id && (
              <div
                className={`${styles2.quantitycontainer}`}
                style={{ marginRight: '5px' }}
              >
                <input
                  style={{
                    userSelect: 'none',
                  }}
                  type="number"
                  className={styles2.quantityfield}
                  value={wishlistDetailQuantity}
                  onChange={handleQuantityChange}
                />

                <button
                  className={`${styles2.quantityarrow} ${styles2.uparrow}`}
                  onClick={handleIncreaseQuantity}
                >
                  +
                </button>
                <button
                  className={`${styles2.quantityarrow} ${styles2.downarrow}`}
                  onClick={handleDecreaseQuantity}
                >
                  -
                </button>
              </div>
            )}

            {props.wishlistdetail.wishlist.user.id != user?.id && (
              <div style={{ paddingRight: '20px' }}>
                {props.wishlistdetail.quantity}
              </div>
            )}
          </div>
          <button
            className={styles.addtocartbutton}
            onClick={handleAddToCartClick}
          >
            ADD TO CART
          </button>
        </div>
        <div className={styles.removecontainer}>
          {props.wishlistdetail.wishlist.user.id == user?.id && (
            <button
              className={styles.removebutton}
              onClick={handleRemoveButtonClick}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
