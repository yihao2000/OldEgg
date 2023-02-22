import Layout from '@/components/layout';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/pagesstyles/cart/cart.module.scss';

import { FaHeart, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GRAPHQLAPI, USER_CART_QUERY } from '@/util/constant';
import { Cart } from '@/components/interfaces/interfaces';
import { useSessionStorage } from 'usehooks-ts';
import CartCard from '@/components/cartcard';

const Cart: NextPage = () => {
  const [token, setToken] = useSessionStorage('token', '');
  const [carts, setCarts] = useState<Cart[]>([]);
  const [reload, setReload] = useState(false);

  const reloadComponent = () => {
    setReload(!reload);
  };

  useEffect(() => {
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
  }, [reload]);

  return (
    <Layout>
      <div className={styles.main}>
        <div className={styles.pagedivider}>
          <div className={styles.leftsection}>
            <div className={styles.headercontainer}>
              <div className={styles.titlelabelcontainer}>
                <h2>Shopping Cart</h2>
              </div>
              <div className={styles.cartactioncontainer}>
                <button className={styles.noborderbutton}>
                  <FaHeart fontSize={13} />
                  <span className={styles.buttonlabel}>
                    MOVE ALL TO WISH LIST
                  </span>
                </button>
                <button className={styles.noborderbutton}>
                  <FaTrashAlt fontSize={13} />
                  <span className={styles.buttonlabel}>REMOVE ALL</span>
                </button>
              </div>
            </div>
            {carts.map((cart) => {
              return (
                <CartCard
                  key={cart.product.id}
                  cart={cart}
                  reloadComponent={reloadComponent}
                  reload={reload}
                />
              );
            })}
          </div>
          <div className={styles.rightsection}>aa</div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
