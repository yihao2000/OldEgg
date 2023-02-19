import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useEffect, useState } from 'react';
import { links } from '../util/route';
import styles from '@/styles/componentstyles/wishlist.module.scss';
import axios from 'axios';
import {
  GRAPHQLAPI,
  WISHLISTDETAILS_QUERY,
  WISHLIST_QUERY,
} from '@/util/constant';
import { useSessionStorage } from 'usehooks-ts';
import ProductCard from './productcard';
import WishlistProductCard from './wishlistproductcard';
import Modal from './modal/modal';
import { Wishlist } from './interfaces/interfaces';

interface Parameter {
  wishlistId: string;
  wishlistName: string;
  wishlistPrivacy: string;
  refreshComponent: Function;
}

interface DeleteParameter {
  closeModal: Function;
  wishlistId: string;
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
    setOpenDeleteModal(true);
  };

  const DeleteModalContent = (props: DeleteParameter) => {
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    useEffect(() => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: WISHLIST_QUERY,
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

    const handleDeleteClick = () => {};
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
          <button className={styles.deletebutton} onClick={handleDeleteClick}>
            Delete
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
            <span className={styles.managelink}>Duplicate</span>
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
            wishlistId={props.wishlistId}
            closeModal={closeDeleteModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default WishlistCard;
