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

export function AdminSideBar() {
  const [token, setToken] = useSessionStorage('token', '');

  const [user, setUser] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: CURRENT_USER_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setUser(res.data.data.getCurrentUser);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      if (user.role != 'Admin') {
        router.push('/');
      }
    }
  }, [user]);

  return (
    <div className={styles.leftside}>
      <div className={styles.greetingcontainer}>
        <h2
          style={{
            padding: 0,
          }}
        >
          Admin
        </h2>
        <p
          style={{
            color: 'grey',
          }}
        >
          Admin Menus
        </p>
      </div>
      <hr />
      <div className={styles.ordercontainer}>
        <h3>Shop</h3>
        <h5
          className={styles.listitems}
          onClick={() => {
            router.push('shop/myshop/home');
          }}
        >
          Home
        </h5>
        <h5 className={styles.listitems} onClick={() => {}}>
          Reviews
        </h5>
        {/* <h5 className={styles.listitems}>Subscription Orders</h5>
        <h5 className={styles.listitems}>Return Status / History</h5>
        <h5 className={styles.listitems}>Marketplace Claim History</h5> */}
      </div>

      <div className={styles.manageaccountcontainer}>
        <h3>Additional Information</h3>
        <h5 className={styles.listitems}>
          <a href={links.shopInformation}>Shop Information</a>{' '}
        </h5>
      </div>
    </div>
  );
}
