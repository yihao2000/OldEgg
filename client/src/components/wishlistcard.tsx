import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useEffect, useState } from 'react';
import { links } from '../util/route';
import styles from '@/styles/componentstyles/wishlist.module.scss';
import styles2 from '@/styles/pagesstyles/account/wishlists/mylist.module.scss';
import axios from 'axios';
import {
  CHECK_USER_FOLLOWED,
  CREATE_WISHLIST_DETAIL_MUTATION,
  CREATE_WISHLIST_FOLLOWER_MUTATION,
  CREATE_WISHLIST_MUTATION,
  DELETE_WISHLIST_FOLLOWER_MUTATION,
  DELETE_WISHLIST_MUTATION,
  DELETE_WISHLIST_WISHLISTDETAIL_MUTATION,
  GRAPHQLAPI,
  UPDATE_WISHLIST_MUTATION,
  WISHLISTDETAILS_QUERY,
  WISHLIST_QUERY,
} from '@/util/constant';
import { useSessionStorage } from 'usehooks-ts';
import ProductCard from './productcard';
import WishlistProductCard from './wishlistproductcard';
import Modal from './modal/modal';
import { Wishlist } from './interfaces/interfaces';
import { ClipLoader } from 'react-spinners';

interface Parameter {
  wishlistId: string;
  wishlistName: string;
  wishlistPrivacy: string;
  refreshComponent: Function;
  style: string;
}

interface ModalParameter {
  closeModal: Function;
  wishlistId: string;
  refreshComponent: Function;
}

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  discount: number;
}
interface WishlistDetail {
  product: Product;
  quantity: number;
  dateAdded: string;
}

const WishlistCard = (props: Parameter) => {
  const [token, setToken] = useSessionStorage('token', '');
  const [loading, setLoading] = useState(false);
  const [wishlistDetails, setWishlistDetails] = useState<WishlistDetail[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [followed, setFollowed] = useState(false);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPromotion, setTotalPromotion] = useState(0);

  useEffect(() => {
    checkUserFollowed();
  }, []);

  const checkUserFollowed = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: CHECK_USER_FOLLOWED,
          variables: {
            wishlistID: props.wishlistId,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        if (res.data.data.wishlistFollower.dateAdded) {
          setFollowed(true);
        }
      })

      .catch((err) => setFollowed(false));
  };

  const closeDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const closeDuplicateModal = () => {
    setOpenDuplicateModal(false);
  };

  const closeSettingsModal = () => {
    setOpenSettingsModal(false);
  };

  useEffect(() => {
    setTotalPrice(0);

    axios
      .post(
        GRAPHQLAPI,
        {
          query: WISHLISTDETAILS_QUERY,
          variables: {
            wishlistId: props.wishlistId,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setWishlistDetails(res.data.data.wishlistDetails);
      })

      .catch((err) => console.log(err));
  }, [props.refreshComponent]);

  useEffect(() => {
    if (wishlistDetails) {
      var tempTotal = 0;
      var tempTotalDisc = 0;
      wishlistDetails.map((w) => {
        tempTotal +=
          w.quantity *
          (w.product.price - (w.product.price * w.product.discount) / 100);

        if (w.product.discount != 0) {
          tempTotalDisc = tempTotalDisc + 1;
        }
      });
      setTotalPrice(tempTotal);
      setTotalPromotion(tempTotalDisc);
    }
  }, [wishlistDetails]);

  const handleDeleteClick = () => {
    // document.body.style.overflow = 'hidden';
    setOpenDeleteModal(true);
  };

  const handleDuplicateClick = () => {
    setOpenDuplicateModal(true);
  };

  const handleSettingsClick = () => {
    setOpenSettingsModal(true);
  };

  const handleFollowClick = () => {
    if (followed) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: DELETE_WISHLIST_FOLLOWER_MUTATION,
            variables: {
              wishlistID: props.wishlistId,
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
          setFollowed(false);
        })

        .catch((err) => console.log(err));
    } else {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: CREATE_WISHLIST_FOLLOWER_MUTATION,
            variables: {
              wishlistID: props.wishlistId,
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
          setFollowed(true);
        })

        .catch((err) => console.log(err));
    }
  };

  const SettingsModalContent = (props: ModalParameter) => {
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [newListName, setNewListName] = useState('');
    const [newListPrivacy, setNewListPrivacy] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleNewListNameChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setNewListName(event.target.value);
    };

    const handleSaveButtonClick = () => {
      if (newListName == '') {
        setError(true);
        return;
      }
      setError(false);
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        axios
          .post(
            GRAPHQLAPI,
            {
              query: UPDATE_WISHLIST_MUTATION,
              variables: {
                wishlistId: props.wishlistId,
                wishlistName: newListName,
                wishlistPrivacy: newListPrivacy,
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
            props.closeModal();
          })

          .catch((err) => console.log(err));
      }, 3000);
    };
    useEffect(() => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: WISHLIST_QUERY,
            variables: {
              wishlistId: props.wishlistId,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setWishlist(res.data.data.wishlist);
        })

        .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
      if (wishlist) {
        setNewListName(wishlist.name);
        setNewListPrivacy(wishlist.privacy);
      }
    }, [wishlist]);
    return (
      <div className={styles2.mylistmodalcontent}>
        <div className={styles2.mylistcreatelistlabel}>List Settings</div>
        <div className={styles2.mylistnamecontainer}>
          <h5
            style={{
              margin: '0',
              padding: '0',
            }}
          >
            Name
          </h5>
          <input
            required
            className={styles2.inputfield}
            type="text"
            value={newListName}
            onChange={handleNewListNameChange}
          />
        </div>
        <div className={styles2.mylistprivacycontainer}>
          <h5
            style={{
              margin: '0',
              padding: '0',
            }}
          >
            Privacy
          </h5>
          <div className={styles2.buttoncontainer}>
            <button
              className={`${styles2.selectionbutton} ${
                newListPrivacy == 'Public' ? styles2.selectedbutton : ''
              }`}
              onClick={() => {
                setNewListPrivacy('Public');
              }}
            >
              Public
            </button>
            <button
              className={`${styles2.selectionbutton} ${
                newListPrivacy == 'Private' ? styles2.selectedbutton : ''
              }`}
              onClick={() => {
                setNewListPrivacy('Private');
              }}
            >
              Private
            </button>
          </div>
        </div>
        <hr
          style={{
            width: '100%',
            marginTop: '10px',
          }}
        />
        <div className={styles2.submitcontainer}>
          <div
            style={{
              color: 'red',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <b>{error ? 'Please fill all fields !' : ''}</b>
          </div>
          <button
            className={styles2.submitbutton}
            onClick={handleSaveButtonClick}
          >
            {loading ? <ClipLoader size={10} /> : 'SAVE'}
          </button>
        </div>
      </div>
    );
  };

  const DeleteModalContent = (props: ModalParameter) => {
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    useEffect(() => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: WISHLIST_QUERY,
            variables: {
              wishlistId: props.wishlistId,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setWishlist(res.data.data.wishlist);
          console.log(res.data.data.wishlist);
        })

        .catch((err) => console.log(err));
    }, []);

    const handleCancelClick = () => {
      closeDeleteModal();
    };

    const handleConfirmDeleteClick = () => {
      setLoading(true);
      setTimeout(() => {
        axios
          .post(
            GRAPHQLAPI,
            {
              query: DELETE_WISHLIST_WISHLISTDETAIL_MUTATION,
              variables: {
                wishlistId: props.wishlistId,
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
                  query: DELETE_WISHLIST_MUTATION,
                  variables: {
                    wishlistId: props.wishlistId,
                  },
                },

                {
                  headers: {
                    Authorization: 'Bearer ' + token,
                  },
                },
              )
              .then((res) => {
                props.closeModal();
                props.refreshComponent();
              })

              .catch((err) => console.log('Masuk Error'));
          })

          .catch((err) => console.log('mASSUK ERROR'));

        setLoading(false);
      }, 2000);
    };
    return (
      <div className={styles.modalcontentcontainer}>
        <div className={styles.modalcontenttitle}>
          Are you sure to delete the list "
          <span className={styles.focusedlabel}>{wishlist?.name}</span>
          "?
        </div>
        <hr
          style={{
            marginTop: '20px',
            marginBottom: '20px',
          }}
        />
        <div className={styles.deletebuttoncontainer}>
          <button className={styles.cancelbutton} onClick={handleCancelClick}>
            Cancel
          </button>
          <button
            className={styles.deletebutton}
            onClick={handleConfirmDeleteClick}
          >
            {loading ? <ClipLoader size={20} /> : 'Delete'}
          </button>
        </div>
      </div>
    );
  };

  const DuplicateModalContent = (props: ModalParameter) => {
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [newListName, setNewListName] = useState('');
    const [newListPrivacy, setNewListPrivacy] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleNewListNameChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setNewListName(event.target.value);
    };

    const handleNewListPrivacyChange = (value: string) => {
      setNewListPrivacy(value);
    };

    const handleDuplicateButtonClick = () => {
      if (newListName == '') {
        setError(true);
        return;
      }
      setError(false);
      setLoading(true);

      axios
        .post(
          GRAPHQLAPI,
          {
            query: CREATE_WISHLIST_MUTATION,
            variables: {
              name: newListName,
              privacy: newListPrivacy,
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
                query: WISHLISTDETAILS_QUERY,
                variables: {
                  wishlistId: props.wishlistId,
                },
              },
              {
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              },
            )
            .then((details) => {
              var data: WishlistDetail[] = details.data.data.wishlistDetails;
              data.map((e) => {
                axios
                  .post(
                    GRAPHQLAPI,
                    {
                      query: CREATE_WISHLIST_DETAIL_MUTATION,
                      variables: {
                        wishlistId: res.data.data.createWishlist.id,
                        productId: e.product.id,
                        quantity: e.quantity,
                      },
                    },
                    {
                      headers: {
                        Authorization: 'Bearer ' + token,
                      },
                    },
                  )
                  .then((res) => {});
              });
              setTimeout(() => {
                setLoading(false);
                props.refreshComponent();
                props.closeModal();
              }, 3000);
            })
            .catch((err) => console.log(err));
        })

        .catch((err) => console.log(err));
    };
    useEffect(() => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: WISHLIST_QUERY,
            variables: {
              wishlistId: props.wishlistId,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setWishlist(res.data.data.wishlist);
        })

        .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
      if (wishlist) {
        setNewListName(wishlist.name);
        setNewListPrivacy(wishlist.privacy);
      }
    }, [wishlist]);
    return (
      <div className={styles2.mylistmodalcontent}>
        <div className={styles2.mylistcreatelistlabel}>Duplicate List</div>
        <div className={styles2.mylistnamecontainer}>
          <h5
            style={{
              margin: '0',
              padding: '0',
            }}
          >
            Name
          </h5>
          <input
            required
            className={styles2.inputfield}
            type="text"
            value={newListName}
            onChange={handleNewListNameChange}
          />
        </div>
        <div className={styles2.mylistprivacycontainer}>
          <h5
            style={{
              margin: '0',
              padding: '0',
            }}
          >
            Privacy
          </h5>
          <div className={styles2.buttoncontainer}>
            <button
              className={`${styles2.selectionbutton} ${
                newListPrivacy == 'Public' ? styles2.selectedbutton : ''
              }`}
              onClick={() => {
                setNewListPrivacy('Public');
              }}
            >
              Public
            </button>
            <button
              className={`${styles2.selectionbutton} ${
                newListPrivacy == 'Private' ? styles2.selectedbutton : ''
              }`}
              onClick={() => {
                setNewListPrivacy('Private');
              }}
            >
              Private
            </button>
          </div>
        </div>
        <hr
          style={{
            width: '100%',
            marginTop: '10px',
          }}
        />
        <div className={styles2.submitcontainer}>
          <div
            style={{
              color: 'red',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <b>{error ? 'Please fill all fields !' : ''}</b>
          </div>
          <button
            className={styles2.submitbutton}
            onClick={handleDuplicateButtonClick}
          >
            {loading ? <ClipLoader size={10} /> : 'DUPLICATE'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${
        props.style == 'half'
          ? styles.wishlisthalfcontainer
          : styles.wishlistfullcontainer
      }`}
    >
      <div className={styles.wishlistcontent}>
        <div className={styles.wishlisttitle}>
          <h3 className={styles.titlelabel}>{props.wishlistName}</h3>
          {props.style == 'half' && (
            <div className={styles.wishlistactioncontainer}>
              <span className={styles.managelink} onClick={handleDeleteClick}>
                Delete
              </span>
              <div className={styles.verticalseparator}></div>
              <span
                className={styles.managelink}
                onClick={handleDuplicateClick}
              >
                Duplicate
              </span>
              <div className={styles.verticalseparator}></div>
              <span className={styles.managelink} onClick={handleSettingsClick}>
                Settings
              </span>
            </div>
          )}
          {props.style == 'full' && (
            <div className={styles.wishlistactioncontainer}>
              <span className={styles.managelink} onClick={handleFollowClick}>
                {followed ? 'Unfollow' : 'Follow'}
              </span>
              <div className={styles.verticalseparator}></div>
              <span
                className={styles.managelink}
                onClick={handleDuplicateClick}
              >
                Duplicate
              </span>
            </div>
          )}
        </div>
        <Link href={links.wishlistDetail(props.wishlistId)} passHref>
          <div className={styles.contentcontainer}>
            <div className={styles.productcontainer}>
              {wishlistDetails &&
                wishlistDetails.slice(0, 3).map((e) => {
                  return (
                    <WishlistProductCard
                      id={e.product.id}
                      image={e.product.image}
                      name={e.product.name}
                      // key={e.productId}
                    />
                  );
                })}
            </div>
            <div className={styles.informationcontainer}>
              {totalPrice != 0 && (
                <span className={styles.totalprice}>${totalPrice}</span>
              )}
              {totalPromotion != 0 && (
                <span className={styles.totaldiscount}>
                  {totalPromotion} Items on Discount
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
      {openDeleteModal && (
        <Modal closeModal={closeDeleteModal} height={15} width={30}>
          <DeleteModalContent
            refreshComponent={props.refreshComponent}
            wishlistId={props.wishlistId}
            closeModal={closeDeleteModal}
          />
        </Modal>
      )}
      {openDuplicateModal && (
        <Modal closeModal={closeDuplicateModal} height={15} width={30}>
          <DuplicateModalContent
            closeModal={closeDuplicateModal}
            refreshComponent={props.refreshComponent}
            wishlistId={props.wishlistId}
          />
        </Modal>
      )}

      {openSettingsModal && (
        <Modal closeModal={closeSettingsModal} height={15} width={30}>
          <SettingsModalContent
            closeModal={closeSettingsModal}
            refreshComponent={props.refreshComponent}
            wishlistId={props.wishlistId}
          />
        </Modal>
      )}
    </div>
  );
};

export default WishlistCard;
