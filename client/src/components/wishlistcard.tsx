import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { links } from '../util/route';
import styles from '@/styles/componentstyles/wishlist.module.scss';

interface Parameter {
  wishlistId: string;
  productId: string;
  refreshComponent: Function;
}

const WishlistCard = (props: Parameter) => {
  return <div className={styles.wishlistcontainer}></div>;
};

export default WishlistCard;
