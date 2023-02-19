import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useEffect, useState } from 'react';
import { links } from '../util/route';
import styles from '@/styles/componentstyles/wishlist.module.scss';
import axios from 'axios';
import { GRAPHQLAPI, WISHLISTDETAILS_QUERY } from '@/util/constant';
import { useSessionStorage } from 'usehooks-ts';

interface Parameter {
  wishlistId: string;
  wishlistName: string;
  wishlistPrivacy: string;
  refreshComponent: Function;
}

const WishlistCard = (props: Parameter) => {
  interface WishlistDetail {
    productId: string;
    productName: string;
    productImage: string;
  }

  const [token, setToken] = useSessionStorage('token', '');
  const [wishlistDetails, setWishlistDetails] = useState<WishlistDetail[]>([]);

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
        console.log(res);
        setWishlistDetails(res.data.data.userwishlists);
      })

      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.wishlistcontainer}>
      <div className={styles.wishlistcontent}>
        <div className={styles.wishlisttitle}>
          <h3 className={styles.titlelabel}>{props.wishlistName}</h3>
          <div className={styles.wishlistactioncontainer}>
            <span className={styles.managelink}>Delete</span>
            <span className={styles.managelink}>Duplicate</span>
            <span className={styles.managelink}>Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
