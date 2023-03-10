import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { links } from '../util/route';
import styles from '@/styles/componentstyles/searchproductcard.module.scss';
import { useEffect, useState } from 'react';
import Modal from './modal/modal';
import ProductDetail from '@/pages/product/[id]';
import ProductDetailModalContent from './modal/content/productdetail';

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  discount: number;
}

const SearchProductcard = (props: Product) => {
  const [openQuickViewModal, setOpenQuickViewModal] = useState(false);
  const handleQuickViewClick = () => {
    setOpenQuickViewModal(true);
  };

  const closeQuickViewModal = () => {
    setOpenQuickViewModal(false);
  };
  return (
    <div className={styles.productcard}>
      <button className={styles.quickviewbutton} onClick={handleQuickViewClick}>
        Quick View
      </button>
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
            $ {props.price.toFixed(2)}
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
      {openQuickViewModal && (
        <Modal
          closeModal={closeQuickViewModal}
          height={50}
          width={30}
          key={props.id}
        >
          <ProductDetailModalContent productID={props.id} />
        </Modal>
      )}
    </div>
  );
};

export default SearchProductcard;
