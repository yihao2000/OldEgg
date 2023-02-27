import styles from '@/styles/pagesstyles/account/profile.module.scss';
import { useSessionStorage } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { User } from '../interfaces/interfaces';
import { NAME_SPLITTER } from '../converter/converter';
import axios from 'axios';
import { CURRENT_USER_QUERY, GRAPHQLAPI } from '@/util/constant';
import { useRouter } from 'next/router';

export function AccountSidebar() {
  const [token, setToken] = useSessionStorage('token', '');

  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      var arr = NAME_SPLITTER(user.name);
      if (arr != null) {
        setFirstName(arr[0]);
        setLastName(arr[1]);
      }
    }
  }, [user]);

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
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          setUser(res.data.data.getCurrentUser);
        })
        .catch(() => {
          router.push('/login');
        });
    } else {
      router.push('/login');
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
          HI, {firstName} {lastName}
        </h2>
        <p
          style={{
            color: 'grey',
          }}
        >
          Thanks for being a Newegg customer !
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
        <h3>Manage Account</h3>
        <h5 className={styles.listitems}>Account Settings</h5>
        <h5 className={styles.listitems}>Address Book</h5>
        <h5 className={styles.listitems}>Payment Options</h5>
        <h5 className={styles.listitems}>EggPoints</h5>
        <h5 className={styles.listitems}>Academic Info</h5>
        <h5 className={styles.listitems}>Manage Reviews</h5>
        <h5 className={styles.listitems}>Tax Exemption Application</h5>
      </div>
    </div>
  );
}
