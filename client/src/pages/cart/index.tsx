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
  CHECKOUT_USER_CART_MUTATION,
  CREATE_WISHLIST_DETAIL_MUTATION,
  CURRENT_USER_QUERY,
  DELETE_ALL_CART,
  DELETE_ALL_SAVED_FOR_LATER,
  GRAPHQLAPI,
  PAYMENT_TYPES_QUERY,
  SHIPPINGS_QUERY,
  USER_ADDRESSES_QUERY,
  USER_CART_QUERY,
  USER_SAVED_FOR_LATERS_QUERY,
  USER_UPDATE_BALANCE_MUTATION,
  USER_UPDATE_PHONE_MUTATION,
  USER_WISHLISTS_QUERY,
} from '@/util/constant';
import {
  Address,
  AddToWishlistModalParameter,
  Cart,
  PaymentType,
  Shipping,
  Wishlist,
} from '@/components/interfaces/interfaces';
import { useSessionStorage } from 'usehooks-ts';
import CartCard from '@/components/cartcard';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';
import { FaRegBuilding } from 'react-icons/fa';
import Modal from '@/components/modal/modal';
import AddUserAddress from '@/components/modal/content/addaddress';

import AddressCard from '@/components/addresscard';

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

  const [addresses, setAddresses] = useState<Address[]>([]);

  const [openCartComponent, setOpenCartComponent] = useState(true);

  const [openAddAddressModal, setOpenAddAddressModal] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [shippings, setShippings] = useState<Shipping[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<Shipping>();

  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>();

  const [checkoutError, setCheckoutError] = useState('');
  const closeAddAddressModal = () => {
    setOpenAddAddressModal(false);
  };

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

  const handleSecureCheckoutButtonClick = () => {
    if (carts.length != 0) {
      setOpenCartComponent(false);
    }
  };

  const handleConfirmCheckoutButtonClick = () => {
    if (!selectedAddress || !selectedPaymentType || !selectedShipping) {
      console.log('Fail');
      return;
    }

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
        if (selectedPaymentType.id == '92e71291-fee7-4700-a202-c1f823587f2f') {
          if (res.data.data.getCurrentUser.currency < totalPrice) {
            setCheckoutError('Insufficient Account Balance !');
          } else {
            axios
              .post(
                GRAPHQLAPI,
                {
                  query: CHECKOUT_USER_CART_MUTATION,
                  variables: {
                    shippingID: selectedShipping?.id,
                    paymentTypeID: selectedPaymentType?.id,
                    addressID: selectedAddress?.id,
                  },
                },
                {
                  headers: {
                    Authorization: 'Bearer ' + token,
                  },
                },
              )
              .then((e) => {
                axios
                  .post(
                    GRAPHQLAPI,
                    {
                      query: USER_UPDATE_BALANCE_MUTATION,
                      variables: {
                        balance:
                          res.data.data.getCurrentUser.currency - totalPrice,
                      },
                    },
                    {
                      headers: {
                        Authorization: 'Bearer ' + token,
                      },
                    },
                  )
                  .then((x) => {
                    reloadComponent();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
                setCheckoutError('Unable to checkout product ! ');
              });
          }
        } else {
          axios
            .post(
              GRAPHQLAPI,
              {
                query: CHECKOUT_USER_CART_MUTATION,
                variables: {
                  shippingID: selectedShipping?.id,
                  paymentTypeID: selectedPaymentType?.id,
                  addressID: selectedAddress?.id,
                },
              },
              {
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              },
            )
            .then((res) => {
              reloadComponent();
              setCheckoutError('');
            })
            .catch((error) => {
              setCheckoutError('Unable to checkout product ! ');
            });
        }
      })
      .catch((error) => {
        setCheckoutError('Unable to checkout product ! ');
      });
  };

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
    carts.map((c) => {
      if (c.product.discount != 0) {
        console.log(c.product.discount);
        c.product.price =
          c.product.price - (c.product.price * c.product.discount) / 100;
      }
    });
  }, [carts]);

  const loadCarts = () => {
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
        setCarts(res.data.data.carts);
      });
  };

  const loadSavedForLaters = () => {
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
        setSavedForLaters(res.data.data.savedForLaters);
      });
  };

  const handleAddressChange = (param: Address) => {
    setSelectedAddress(param);
  };

  useEffect(() => {
    reloadComponent();
  }, [selectedAddress]);

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_ADDRESSES_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {});
  }, []);

  const loadUserAddresses = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_ADDRESSES_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setAddresses(res.data.data.userAddresses);
      });
  };

  const loadShippings = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: SHIPPINGS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setShippings(res.data.data.shippings);
      });
  };

  const loadPaymentTypes = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: PAYMENT_TYPES_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setPaymentTypes(res.data.data.paymentTypes);
      });
  };
  useEffect(() => {
    if (token) {
      loadCarts();
      loadSavedForLaters();
      loadUserAddresses();
      loadShippings();
      loadPaymentTypes();
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
      if (selectedShipping) {
        setTotalPrice(total + selectedShipping.price);
      } else {
        setTotalPrice(total);
      }
    }
  }, [carts, selectedShipping]);

  const handleMoveAllToWishlistClick = (type: string) => {
    setOpenAddToWishlistModal(true);
    setAddToWishlistMode(type);
  };

  const handleEditShoppingCartClick = () => {
    setOpenCartComponent(true);
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
          {openCartComponent && (
            <div className={styles.cartsection}>
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
              {carts.length == 0 && (
                <div>Uh oh no item added to cart yet !</div>
              )}

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
                  <div
                    className={`${styles.cartactioncontainer} ${styles.halfwidth}`}
                  >
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
          )}

          {!openCartComponent && (
            <div className={styles.checkoutcontainer}>
              <div className={styles.headercontainer}>
                <div className={styles.titlelabelcontainer}>
                  <h2>Checkout(Item)</h2>
                </div>
              </div>
              <div className={styles.shippingoutercontainer}>
                <div className={styles.headercontainer}>
                  <h3 className={styles.containertitle}> Shipping</h3>
                </div>
                <div className={styles.locationselectioncontainer}>
                  <div>
                    <h3>How would you like to get your order ?</h3>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                    }}
                  >
                    <button className={styles.shipbutton}>
                      Ship to
                      <span className={styles.highlightaccent}>
                        Your Location
                      </span>
                      <FaRegBuilding size={40} />
                    </button>
                  </div>
                </div>
                <div className={styles.shippinginnercontainer}>
                  <div>
                    <b>Ship to Your Location</b>
                  </div>
                  <div>
                    Have your order delivered to your home, office or anywhere.
                    <br />
                    We work with a number of different carriers & will ship via
                    the one who can best meet your delivery needs.
                  </div>
                  <button
                    className={styles.addnewaddressbutton}
                    onClick={() => {
                      setOpenAddAddressModal(true);
                    }}
                  >
                    + ADD NEW ADDRESS
                  </button>
                </div>
                <div className={styles.addresscardcontainer}>
                  {addresses.map((a) => {
                    return (
                      <AddressCard
                        selectedAddress={selectedAddress}
                        setSelectedAddress={handleAddressChange}
                        address={a}
                        refreshComponent={reloadComponent}
                      />
                    );
                  })}
                </div>
              </div>
              <div
                className={styles.shippingoutercontainer}
                style={{
                  marginTop: '50px',
                }}
              >
                <div className={styles.headercontainer}>
                  <h3 className={styles.containertitle}>DELIVERY</h3>
                </div>
                <div className={styles.locationselectioncontainer}>
                  <div>
                    <h3>Newegg Standard Shipping Service</h3>
                  </div>
                  <hr style={{ marginTop: '30px' }} />
                  <h4>How soon you would like to receive the products?</h4>
                  <div
                    className={styles.deliveryselectioncontainer}
                    style={{
                      display: 'flex',
                      columnGap: '2%',
                    }}
                  >
                    {shippings.map((e) => {
                      return (
                        <button
                          className={`${styles.deliveryselection} ${
                            selectedShipping?.id == e.id
                              ? styles.deliveryselected
                              : ''
                          }`}
                          onClick={() => {
                            setSelectedShipping(e);
                          }}
                        >
                          <div>
                            <span
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                              }}
                            >
                              {e.name}
                            </span>
                            <span
                              className={styles.highlightaccent}
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                              }}
                            >
                              {e.description}
                            </span>
                          </div>
                          <h2>${e.price}</h2>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div
                className={styles.shippingoutercontainer}
                style={{
                  marginTop: '50px',
                }}
              >
                <div className={styles.headercontainer}>
                  <h3 className={styles.containertitle}>PAYMENT</h3>
                </div>
                <div className={styles.locationselectioncontainer}>
                  <div>
                    <h3>How do you want to pay ? </h3>
                  </div>
                  <hr style={{ marginTop: '30px', marginBottom: '30px' }} />

                  <div
                    style={{
                      display: 'flex',
                      columnGap: '2%',
                    }}
                  >
                    {paymentTypes.map((e) => {
                      return (
                        <button
                          className={`${styles.deliveryselection} ${
                            selectedPaymentType?.id == e.id
                              ? styles.deliveryselected
                              : ''
                          }`}
                          onClick={() => {
                            setSelectedPaymentType(e);
                          }}
                        >
                          <div>
                            <span
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                              }}
                            >
                              {e.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.rightsection}>
            <hr className={styles.partitioningline} />
            <div className={styles.headercontainer}>
              {' '}
              <div className={styles.titlelabelcontainer}>
                <h2>Order Summary</h2>
                {!openCartComponent && (
                  <button
                    className={styles.editshoppingcartbutton}
                    onClick={handleEditShoppingCartClick}
                  >
                    EDIT CART
                  </button>
                )}
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
                <h5 className={styles.labelnopadding}>
                  ${selectedShipping?.price}
                </h5>
              </div>
              <hr className={styles.horizontalline} />
              <div className={styles.estimatedtotalcontainer}>
                <h4 className={styles.labelnopadding}>Est.Total: </h4>
                <h4 className={styles.labelnopadding}>
                  {' '}
                  ${totalPrice.toFixed(2)}
                </h4>
              </div>
              {openCartComponent && (
                <button
                  className={styles.checkoutbutton}
                  onClick={handleSecureCheckoutButtonClick}
                >
                  SECURE CHECKOUT
                </button>
              )}
              {!openCartComponent && (
                <button
                  className={styles.checkoutbutton}
                  onClick={handleConfirmCheckoutButtonClick}
                >
                  SECURE CHECKOUT
                </button>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  color: 'red',
                }}
              >
                {checkoutError}
              </div>
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
        {openAddAddressModal && (
          <Modal closeModal={closeAddAddressModal} height={30} width={50}>
            <AddUserAddress
              refreshComponent={reloadComponent}
              handleCloseModal={closeAddAddressModal}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
