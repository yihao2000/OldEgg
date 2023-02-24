import Layout from '@/components/layout';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/pagesstyles/cart/cart.module.scss';
import styles2 from '@/styles/pagesstyles/productdetail.module.scss';

import { FaHeart, FaTrashAlt } from 'react-icons/fa';
import { SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import {
  CREATE_WISHLIST_DETAIL_MUTATION,
  DELETE_ALL_CART,
  DELETE_ALL_SAVED_FOR_LATER,
  GRAPHQLAPI,
  USER_CART_QUERY,
  USER_SAVED_FOR_LATERS_QUERY,
  USER_WISHLISTS_QUERY,
} from '@/util/constant';
import {
  AddToWishlistModalParameter,
  Cart,
  Wishlist,
} from '@/components/interfaces/interfaces';
import { useSessionStorage } from 'usehooks-ts';
import CartCard from '@/components/cartcard';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';
import Modal from '@/components/modal/modal';

const Cart: NextPage = () => {
  const [token, setToken] = useSessionStorage('token', '');
  const [carts, setCarts] = useState<Cart[]>([]);
  const [reload, setReload] = useState(false);
  const [savedForLaters, setSavedForLaters] = useState<Cart[]>([]);
  const router = useRouter();
  const [openAddToWishlistModal, setOpenAddToWishlistModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const [addToWishlistMode, setAddToWishlistMode] = useState('');
  const [removeAllMode, setRemoveAllMode] = useState('');

  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [checkedWishlists, setCheckedWishlists] = useState<Wishlist[]>([]);

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
      .catch((error) => {});
  }, []);

  interface Parameter {
    handleCloseModal: Function;
  }

  const AddToWishlistModalContent = (param: Parameter) => {
    const handleWishlistSave = () => {
      if (checkedWishlists.length != 0) {
        checkedWishlists.map((c) => {
          if (addToWishlistMode == 'cart') {
            carts.map((cart) => {
              axios
                .post(
                  GRAPHQLAPI,
                  {
                    query: CREATE_WISHLIST_DETAIL_MUTATION,
                    variables: {
                      productId: cart.product.id,
                      quantity: cart.quantity,
                      wishlistId: c.id,
                    },
                  },
                  {
                    headers: {
                      Authorization: 'Bearer ' + token,
                    },
                  },
                )
                .then((res) => {
                  axios
                    .post(
                      GRAPHQLAPI,
                      {
                        query: DELETE_ALL_CART,
                      },
                      {
                        headers: {
                          Authorization: 'Bearer ' + token,
                        },
                      },
                    )
                    .then((res) => {
                      reloadComponent();
                      closeAddToWishlistModal();
                      setCheckedWishlists([]);
                    })
                    .catch((err) => {});
                })
                .catch((err) => {});
            });
          } else if (addToWishlistMode == 'savedforlater') {
            savedForLaters.map((cart) => {
              axios
                .post(
                  GRAPHQLAPI,
                  {
                    query: CREATE_WISHLIST_DETAIL_MUTATION,
                    variables: {
                      productId: cart.product.id,
                      quantity: cart.quantity,
                      wishlistId: c.id,
                    },
                  },
                  {
                    headers: {
                      Authorization: 'Bearer ' + token,
                    },
                  },
                )
                .then((res) => {
                  axios
                    .post(
                      GRAPHQLAPI,
                      {
                        query: DELETE_ALL_SAVED_FOR_LATER,
                      },
                      {
                        headers: {
                          Authorization: 'Bearer ' + token,
                        },
                      },
                    )
                    .then((res) => {
                      reloadComponent();
                      closeAddToWishlistModal();
                      setCheckedWishlists([]);
                    })
                    .catch((err) => {});
                })
                .catch((err) => {});
            });
          }
        });
      }
    };

    const handleCheckboxChange = (
      event: SyntheticEvent,
      wishlist: Wishlist,
    ) => {
      console.log('Waa');
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
                id={e.id}
                title={e.name}
                onChange={(event: SyntheticEvent) => {
                  handleCheckboxChange(event, e);
                }}
                defaultChecked={
                  checkedWishlists.find((x) => e.id === x.id) != undefined
                    ? true
                    : false
                }
              />
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
          Save
        </button>
      </div>
    );
  };

  const reloadComponent = () => {
    setReload(!reload);
  };

  useEffect(() => {
    if (token) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_CART_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          console.log(res);
          setCarts(res.data.data.carts);
        });

      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_SAVED_FOR_LATERS_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          console.log(res);
          setSavedForLaters(res.data.data.savedForLaters);
        });
    } else {
      router.push('/login');
    }
  }, [reload]);

  useEffect(() => {
    var total: number = 0;
    if (carts) {
      carts.map((x) => {
        total += x.product.price * x.quantity;
      });
      setTotalPrice(total);
    }
  }, [carts]);

  const handleMoveAllToWishlistClick = (type: string) => {
    setOpenAddToWishlistModal(true);
    setAddToWishlistMode(type);
  };

  const closeAddToWishlistModal = () => {
    setOpenAddToWishlistModal(false);
  };

  const handleRemoveAllClick = (type: string) => {
    if (type == 'cart') {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: DELETE_ALL_CART,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          reloadComponent();
        })
        .catch((err) => {});
    } else if (type == 'savedforlater') {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: DELETE_ALL_SAVED_FOR_LATER,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          reloadComponent();
        })
        .catch((err) => {});
    }
  };

  return (
    <Layout>
      <div className={styles.main}>
        <div className={styles.pagedivider}>
          <div className={styles.leftsection}>
            <div className={styles.headercontainer}>
              <div className={styles.titlelabelcontainer}>
                <h2>Shopping Cart</h2>
              </div>
              <div className={styles.cartactioncontainer}>
                <button className={styles.noborderbutton}>
                  <FaHeart fontSize={13} />
                  <span
                    className={styles.buttonlabel}
                    onClick={() => {
                      handleMoveAllToWishlistClick('cart');
                    }}
                  >
                    MOVE ALL TO WISH LIST
                  </span>
                </button>
                <button
                  className={styles.noborderbutton}
                  onClick={() => {
                    handleRemoveAllClick('cart');
                  }}
                >
                  <FaTrashAlt fontSize={13} />
                  <span className={styles.buttonlabel}>REMOVE ALL</span>
                </button>
              </div>
            </div>
            {carts.length != 0 &&
              carts.map((cart) => {
                return (
                  <CartCard
                    mode="cart"
                    key={cart.product.id}
                    cart={cart}
                    reloadComponent={reloadComponent}
                    reload={reload}
                  />
                );
              })}
            {carts.length == 0 && <div>Uh oh no item added to cart yet !</div>}

            {savedForLaters.length != 0 && (
              <div
                className={styles.headercontainer}
                style={{
                  marginTop: '100px',
                }}
              >
                <div className={styles.titlelabelcontainer}>
                  <h2>Saved For Later</h2>
                </div>
                <div className={styles.cartactioncontainer}>
                  <button
                    className={styles.noborderbutton}
                    onClick={() => {
                      handleMoveAllToWishlistClick('savedforlater');
                    }}
                  >
                    <FaHeart fontSize={13} />
                    <span className={styles.buttonlabel}>
                      MOVE ALL TO WISH LIST
                    </span>
                  </button>
                  <button
                    className={styles.noborderbutton}
                    onClick={() => {
                      handleRemoveAllClick('savedforlater');
                    }}
                  >
                    <FaTrashAlt fontSize={13} />
                    <span className={styles.buttonlabel}>REMOVE ALL</span>
                  </button>
                </div>
              </div>
            )}
            {savedForLaters.length != 0 &&
              savedForLaters.map((e) => {
                return (
                  <CartCard
                    mode="savedforlater"
                    key={e.product.id}
                    cart={e}
                    reloadComponent={reloadComponent}
                    reload={reload}
                  />
                );
              })}
          </div>
          <div className={styles.rightsection}>
            <div className={styles.headercontainer}>
              {' '}
              <div className={styles.titlelabelcontainer}>
                <h2>Checkout</h2>
              </div>
            </div>
            <div className={styles.cartsummarycontainer}>
              <div className={styles.titlelabelcontainer}>
                <h3>Summary</h3>
              </div>
              <div className={styles.totalitemcontainer}>
                <h5 className={styles.labelnopadding}>Item(s): </h5>
                <h5 className={styles.labelnopadding}>
                  ${totalPrice.toFixed(2)}
                </h5>
              </div>
              <div className={styles.estimateddeliverycontainer}>
                <h5 className={styles.labelnopadding}>Est. Delivery: </h5>
                <h5 className={styles.labelnopadding}>$0.00</h5>
              </div>
              <hr className={styles.horizontalline} />
              <div className={styles.estimatedtotalcontainer}>
                <h4 className={styles.labelnopadding}>Est.Total: </h4>
                <h4 className={styles.labelnopadding}>
                  {' '}
                  ${totalPrice.toFixed(2)}
                </h4>
              </div>
              <button className={styles.checkoutbutton}>SECURE CHECKOUT</button>
            </div>
          </div>
        </div>
        {openAddToWishlistModal && (
          <Modal closeModal={closeAddToWishlistModal} height={30} width={50}>
            <AddToWishlistModalContent
              handleCloseModal={closeAddToWishlistModal}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
