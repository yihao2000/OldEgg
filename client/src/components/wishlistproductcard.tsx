import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { links } from '../util/route';
import styles from '@/styles/componentstyles/wishlist.module.scss';

interface Product {
  id: string;
  image: string;
  name: string;
}

const WishlistProductCard = (props: Product) => {
  // console.log(props);
  return (
    <div className={styles.wishlistproductcardcontainer}>
      <div className={styles.wishlistproductcardimagecontainer}>
        <Link href={links.productDetail(props.id)} passHref>
          <img
            src={props.image}
            alt=""
            className={styles.wishlistproductcardimage}
          />
        </Link>
      </div>

      <div className={styles.wishlistproductcarddescriptioncontainer}>
        {props.name}
      </div>
    </div>
  );
};

export default WishlistProductCard;
