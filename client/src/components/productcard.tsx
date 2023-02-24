import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useEffect } from 'react';
import { links } from '../util/route';
import styles from '@/styles/home.module.scss';

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  style: string;
  discount: number;
}

const ProductCard = (props: Product) => {
  if (props.style == 'compact') {
    return (
      <div className={styles.productcardcompact}>
        <Link href={links.productDetail(props.id)} passHref>
          <img src={props.image} alt="" className={styles.productcardimage} />
        </Link>

        <div className={styles.productdescriptioncontainer}>
          <Link href={links.productDetail(props.id)} passHref>
            <p className={styles.productcarddetailname}>
              <b>{props.name}</b>
            </p>
          </Link>
          {props.discount == 0 && (
            <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
              $ {props.price}
            </p>
          )}

          {props.discount != 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '1.2em',
                    display: 'inline ',
                    fontWeight: 'bold',
                  }}
                >
                  ${' '}
                  {(props.price - (props.price * props.discount) / 100).toFixed(
                    2,
                  )}
                </p>
                <p
                  style={{
                    display: 'inline',
                    textDecoration: 'line-through',
                    fontSize: '0.8em',
                    color: 'gray',
                    marginLeft: '5px',
                  }}
                >
                  ${props.price}
                </p>
              </div>
              <div>
                <p
                  style={{
                    display: 'inline',
                    fontWeight: 'bold',
                    fontSize: '0.8em',
                    color: 'white',
                    backgroundColor: 'red',
                    padding: '0.5em',
                    marginLeft: '5px',
                  }}
                >
                  SAVE {props.discount}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
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

          {props.discount == 0 && (
            <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
              $ {props.price}
            </p>
          )}

          {props.discount != 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '1.2em',
                    display: 'inline ',
                    fontWeight: 'bold',
                  }}
                >
                  ${' '}
                  {(props.price - (props.price * props.discount) / 100).toFixed(
                    2,
                  )}
                </p>
                <p
                  style={{
                    display: 'inline',
                    textDecoration: 'line-through',
                    fontSize: '0.8em',
                    color: 'gray',
                    marginLeft: '5px',
                  }}
                >
                  ${props.price}
                </p>
              </div>
              <div>
                <p
                  style={{
                    display: 'inline',
                    fontWeight: 'bold',
                    fontSize: '0.8em',
                    color: 'white',
                    backgroundColor: 'red',
                    padding: '0.5em',
                    marginLeft: '5px',
                  }}
                >
                  SAVE {props.discount}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default ProductCard;
