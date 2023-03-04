import styles from '@/styles/pagesstyles/account/profile.module.scss';
import { useSessionStorage } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { Shop, User } from '../interfaces/interfaces';
import { NAME_SPLITTER } from '../converter/converter';
import axios from 'axios';
import {
  CURRENT_USER_QUERY,
  GET_CURRENT_USER_SHOP,
  GRAPHQLAPI,
} from '@/util/constant';
import { useRouter } from 'next/router';
import { links } from '@/util/route';

export function ShopSideBar() {
  const [token, setToken] = useSessionStorage('token', '');

  const [shop, setShop] = useState<Shop>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (token) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: GET_CURRENT_USER_SHOP,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setShop(res.data.data.getUserShop);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);

  return (
    <div className={styles.leftside}>
      <div className={styles.greetingcontainer}>
        <h2
          style={{
            padding: 0,
          }}
        >
          {shop?.name}
        </h2>
        <p
          style={{
            color: 'grey',
          }}
        >
          Shop Menus
        </p>
      </div>
      <hr />
      <div className={styles.ordercontainer}>
        <h3>Orders</h3>
        <h5 className={styles.listitems}>Order History</h5>
        <h5 className={styles.listitems}>Digital Orders</h5>
        <h5 className={styles.listitems}>Subscription Orders</h5>
        <h5 className={styles.listitems}>Return Status / History</h5>
        <h5 className={styles.listitems}>Marketplace Claim History</h5>
      </div>

      <div className={styles.manageaccountcontainer}>
        <h3>My Shop</h3>
        <h5 className={styles.listitems}>
          <a href={links.shopInformation}>Shop Information</a>{' '}
        </h5>
      </div>
    </div>
  );
}
