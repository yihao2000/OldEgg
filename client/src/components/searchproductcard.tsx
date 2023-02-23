import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { links } from '../util/route';
import styles from '@/styles/componentstyles/searchproductcard.module.scss';

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
}

const SearchProductcard = (props: Product) => {
  return (
    <div className={styles.productcard}>
      <Link href={links.productDetail(props.id)} passHref>
        <img src={props.image} alt="" className={styles.productcardimage} />
      </Link>

      <div className={styles.productdescriptioncontainer}>
        <Link href={links.productDetail(props.id)} passHref>
          <p className={styles.productcarddetailname}>
            <b>{props.name}</b>
          </p>
        </Link>
        <p style={{ fontSize: '1.2em' }}>$ {props.price}</p>
      </div>
    </div>
  );
};

export default SearchProductcard;
