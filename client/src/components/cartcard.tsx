import styles from '@/styles/pagesstyles/cart/cart.module.scss';
import styles2 from '@/styles/pagesstyles/productdetail.module.scss';
import {
  AddToWishlistModalParameter,
  Cart,
  Wishlist,
} from './interfaces/interfaces';
import { useEffect, useState, SyntheticEvent } from 'react';
import {
  CREATE_SAVED_FOR_LATER_MUTATION,
  CREATE_WISHLIST_DETAIL_MUTATION,
  DELETE_CART_MUTATION,
  DELETE_PRODUCT_FROM_WISHLIST_DETAILS,
  DELETE_SAVED_FOR_LATER_MUTATION,
  GRAPHQLAPI,
  PRODUCT_USER_WISHLISTS_QUERY,
  UPDATE_CART_MUTATION,
  USER_WISHLISTS_QUERY,
} from '@/util/constant';
import axios from 'axios';
import { useSessionStorage } from 'usehooks-ts';
import { FaHeart, FaTrashAlt, FaBookmark } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import Modal from './modal/modal';
import { LAPTOP_NAME_CONVERTER } from './converter/converter';

interface Parameter {
  cart: Cart;
  reloadComponent: Function;
  reload: boolean;
  mode: string;
}

const CartCard = (props: Parameter) => {
  const [token, setToken] = useSessionStorage('token', '');
  const [cartQuantity, setCartQuantity] = useState(0);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [openAddToWishlistModal, setOpenAddToWishlistModal] = useState(false);

  const [reload, setReload] = useState(false);

  const reloadComponent = () => {
    setReload(!reload);
  };
  const closeAddToWishlistModal = () => {
    setOpenAddToWishlistModal(false);
  };

  const handleAddToWishlistClick = () => {
    setOpenAddToWishlistModal(true);
  };

  useEffect(() => {
    // console.log(props.cart.quantity);
    setCartQuantity(props.cart.quantity);
  }, []);

  useEffect(() => {
    if (cartQuantity != 0) {
      setTotalPrice(cartQuantity * props.cart.product.price);
      props.reloadComponent();
    }
  }, [reload, cartQuantity]);

  // useEffect(() => {

  // }, [reload])

  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [checkedWishlists, setCheckedWishlists] = useState<Wishlist[]>([]);
  const [loadChecked, setLoadChecked] = useState(false);

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_WISHLISTS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setWishlists(res.data.data.userwishlists);
      })
      .catch((error) => {
        // setError(true);
      });
  }, []);

  useEffect(() => {
    if (wishlists) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: PRODUCT_USER_WISHLISTS_QUERY,
            variables: {
              productId: props.cart.product.id,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setCheckedWishlists(res.data.data.productUserWishlists);
        })
        .catch((error) => {
          // setError(true);
        });
    }
  }, [wishlists, loadChecked]);

  const AddToWishlistModalContent = (param: AddToWishlistModalParameter) => {
    const [addingToWishlist, setAddingToWishlist] = useState(false);
    const handleWishlistSave = () => {
      if (checkedWishlists.length != 0) {
        setAddingToWishlist(true);
        axios
          .post(
            GRAPHQLAPI,
            {
              query: DELETE_PRODUCT_FROM_WISHLIST_DETAILS,
              variables: {
                productId: param.productId,
              },
            },

            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then((res) => {
            checkedWishlists.map((c) => {
              axios
                .post(
                  GRAPHQLAPI,
                  {
                    query: CREATE_WISHLIST_DETAIL_MUTATION,
                    variables: {
                      wishlistId: c.id,
                      productId: param.productId,
                      quantity: cartQuantity,
                    },
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                )
                .then((res) => {})
                .catch(() => {});
            });

            setTimeout(() => {
              param.handleCloseModal();
              setLoadChecked(!loadChecked);
              setAddingToWishlist(false);

              axios
                .post(
                  GRAPHQLAPI,
                  {
                    query: DELETE_CART_MUTATION,
                    variables: {
                      productID: param.productId,
                    },
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                )
                .then((res) => {
                  props.reloadComponent();
                })
                .catch(() => {});

              axios
                .post(
                  GRAPHQLAPI,
                  {
                    query: DELETE_SAVED_FOR_LATER_MUTATION,
                    variables: {
                      productID: param.productId,
                    },
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                )
                .then((res) => {
                  props.reloadComponent();
                })
                .catch(() => {});
            }, 3000);
          })
          .catch(() => {
            console.log('ERROR');
          });
      }
    };

    const handleCheckboxChange = (
      event: SyntheticEvent,
      wishlist: Wishlist,
    ) => {
      var exist = false;
      const target = event.target as HTMLInputElement;
      checkedWishlists.map((c) => {
        if (c.id == wishlist.id) {
          setCheckedWishlists(
            checkedWishlists.filter((item) => {
              return item.id !== wishlist.id;
            }),
          );
          target.checked = false;

          exist = true;
        }
      });

      if (exist) {
        return;
      }

      var temp = checkedWishlists;

      temp.push(wishlist);

      target.checked = true;
      setCheckedWishlists(temp);
    };

    return (
      <div className={styles2.addtowishlistmodalcontent}>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          Manage Wish Lists{' '}
        </div>
        {wishlists.map((e) => {
          return (
            <div key={e.id}>
              <input
                type="checkbox"
                defaultChecked={
                  checkedWishlists.find((x) => e.id === x.id) != undefined
                    ? true
                    : false
                }
                value={e.id}
                id={e.id}
                title={e.name}
                onChange={(event: SyntheticEvent) => {
                  handleCheckboxChange(event, e);
                }}
              ></input>
              <label
                htmlFor={e.id}
                style={{
                  // display: 'block',
                  marginLeft: '5px',
                  fontSize: '15px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {e.name}
              </label>
            </div>
          );
        })}
        <hr style={{ width: '100%' }} />
        <button
          className={styles2.savewishlistbutton}
          style={{
            maxWidth: '20%',
            alignSelf: 'end',
          }}
          onClick={handleWishlistSave}
        >
          {addingToWishlist ? <ClipLoader size={15} /> : 'Save'}
        </button>
      </div>
    );
  };

  const handleQuantityChange = (event: any) => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: UPDATE_CART_MUTATION,
          variables: {
            productID: props.cart.product.id,
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
        setCartQuantity(res.data.data.updateCart.quantity);
        reloadComponent();
      })
      .catch((err) => {
        setError('Invalid Product Amount !');
      });
  };

  const handleIncreaseQuantity = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: UPDATE_CART_MUTATION,
          variables: {
            productID: props.cart.product.id,
            quantity: cartQuantity + 1,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setCartQuantity(res.data.data.updateCart.quantity);
        reloadComponent();
      })
      .catch((err) => {
        setError('Invalid Product Amount !');
      });
  };

  const handleDecreaseQuantity = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: UPDATE_CART_MUTATION,
          variables: {
            productID: props.cart.product.id,
            quantity: cartQuantity - 1,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setCartQuantity(res.data.data.updateCart.quantity);
        reloadComponent();
      })
      .catch((err) => {
        setError('Invalid Product Amount !');
      });
  };

  const handleRemoveClick = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: DELETE_CART_MUTATION,
          variables: {
            productID: props.cart.product.id,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then(() => {
        axios
          .post(
            GRAPHQLAPI,
            {
              query: DELETE_SAVED_FOR_LATER_MUTATION,
              variables: {
                productID: props.cart.product.id,
              },
            },
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            },
          )
          .then(() => {
            props.reloadComponent();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSaveForLaterClick = () => {
    console.log(cartQuantity);
    axios
      .post(
        GRAPHQLAPI,
        {
          query: CREATE_SAVED_FOR_LATER_MUTATION,
          variables: {
            productId: props.cart.product.id,
            quantity: cartQuantity,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then(() => {
        axios
          .post(
            GRAPHQLAPI,
            {
              query: DELETE_CART_MUTATION,
              variables: {
                productID: props.cart.product.id,
              },
            },
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            },
          )
          .then(() => {
            props.reloadComponent();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log('kesini');
        console.log(err);
      });
  };

  return (
    <div className={styles.cartproductcontainer}>
      <div className={styles.cartproductcontainerleftside}>
        <div className={styles.cartproductimagecontainer}>
          <img
            src={props.cart.product.image}
            alt="ProductImage"
            className={styles.cartproductimage}
          />
        </div>
      </div>
      <div className={styles.cartproductcontainerrightside}>
        <div className={styles.upperpart}>
          <div className={styles.cartproductinformationcontainer}>
            <div className={styles.iteminfo}>
              <div className={styles.itemname}>
                {LAPTOP_NAME_CONVERTER(props.cart.product.name)}
              </div>
              <div className={styles.itemshop}>
                Sold by{' '}
                <span
                  style={{
                    textDecoration: 'underline',
                  }}
                >
                  {props.cart.product.shop.name}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.cartquantityformcontainer}>
            {props.mode == 'cart' && (
              <div className={styles2.quantitycontainer}>
                <input
                  style={{
                    userSelect: 'none',
                  }}
                  type="number"
                  className={styles2.quantityfield}
                  value={cartQuantity}
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

            {props.mode == 'savedforlater' && (
              <span>Quantity: {cartQuantity}</span>
            )}
          </div>
          <div className={styles.producttotalpricecontainer}>${totalPrice}</div>
        </div>
        <div className={styles.middlepart}>
          <div
            className={styles.cartactioncontainer}
            style={{
              columnGap: '10px',
            }}
          >
            <button onClick={handleAddToWishlistClick}>
              {' '}
              <FaHeart fontSize={13} />
            </button>
            {props.mode == 'cart' && (
              <button onClick={handleSaveForLaterClick}>
                {' '}
                <FaBookmark fontSize={13} />
              </button>
            )}
            <button onClick={handleRemoveClick}>
              {' '}
              <FaTrashAlt fontSize={13} />
            </button>
          </div>
        </div>
      </div>
      {openAddToWishlistModal && (
        <Modal closeModal={closeAddToWishlistModal} height={35} width={40}>
          <AddToWishlistModalContent
            handleCloseModal={closeAddToWishlistModal}
            productId={props.cart.product.id}
          />
        </Modal>
      )}
    </div>
  );
};

export default CartCard;
