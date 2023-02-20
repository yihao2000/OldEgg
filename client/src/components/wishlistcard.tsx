import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useEffect, useState } from 'react';
import { links } from '../util/route';
import styles from '@/styles/componentstyles/wishlist.module.scss';
import styles2 from '@/styles/pagesstyles/account/wishlists/mylist.module.scss';
import axios from 'axios';
import {
  DELETE_WISHLIST_MUTATION,
  DELETE_WISHLIST_WISHLISTDETAIL_MUTATION,
  GRAPHQLAPI,
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
}

interface ModalParameter {
  closeModal: Function;
  wishlistId: string;
  refreshComponent: Function;
}

const WishlistCard = (props: Parameter) => {
  interface Product {
    id: string;
    image: string;
    name: string;
  }
  interface WishlistDetail {
    product: Product;
  }

  const [token, setToken] = useSessionStorage('token', '');
  const [loading, setLoading] = useState(false);
  const [wishlistDetails, setWishlistDetails] = useState<WishlistDetail[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

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
        console.log(res.data.data.wishlistDetails);
        setWishlistDetails(res.data.data.wishlistDetails);
      })

      .catch((err) => console.log(err));
  }, []);

  const handleDeleteClick = () => {
    // document.body.style.overflow = 'hidden';
    setOpenDeleteModal(true);
  };

  const handleUpdateClick = () => {
    setOpenDuplicateModal(true);
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

              .catch((err) => console.log(err));
          })

          .catch((err) => console.log(err));

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

    useEffect(() => {}, []);
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
            // value={props.newListName}
            // onChange={props.handleNewListNameChange}
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
            // className={`${styles.selectionbutton} ${
            //   props.newListPrivacy == 'Public' ? styles.selectedbutton : ''
            // }`}
            // onClick={handlePublicPrivacyChange}
            >
              Public
            </button>
            <button
            // className={`${styles.selectionbutton} ${
            //   props.newListPrivacy == 'Private' ? styles.selectedbutton : ''
            // }`}
            // onClick={handlePrivatePrivacyChange}
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
            {/* <b>{error ? 'Please fill all fields !' : ''}</b> */}
          </div>
          <button
            className={styles2.submitbutton}
            // onClick={handleCreateButtonClick}
          >
            {loading ? <ClipLoader size={10} /> : 'CREATE'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wishlistcontainer}>
      <div className={styles.wishlistcontent}>
        <div className={styles.wishlisttitle}>
          <h3 className={styles.titlelabel}>{props.wishlistName}</h3>
          <div className={styles.wishlistactioncontainer}>
            <span className={styles.managelink} onClick={handleDeleteClick}>
              Delete
            </span>
            <div className={styles.verticalseparator}></div>
            <span className={styles.managelink} onClick={handleUpdateClick}>
              Duplicate
            </span>
            <div className={styles.verticalseparator}></div>
            <span className={styles.managelink}>Settings</span>
          </div>
        </div>
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
    </div>
  );
};

export default WishlistCard;
