import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/pagesstyles/account/profile.module.css';
import Layout from '@/components/layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import axios from 'axios';
import {
  CURRENT_USER_QUERY,
  GRAPHQLAPI,
  PRODUCT_PRODUCTSGROUP_QUERY,
  PRODUCT_QUERY,
} from '@/util/constant';
import {
  Product,
  ProductDetail,
  User,
} from '@/components/interfaces/interfaces';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';
import { useSessionStorage } from 'usehooks-ts';

const Profile: NextPage = () => {
  const router = useRouter();

  const [token, setToken] = useSessionStorage('token', '');

  const [user, setUser] = useState<User | null>(null);

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
          console.log(res.data.data);
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
    <Layout>
      {user && (
        <div className={styles.maincontainer}>
          <div className={styles.divider}>
            <div className={styles.leftside}>
              <div className={styles.greetingcontainer}>
                <h2
                  style={{
                    padding: 0,
                  }}
                >
                  HI, {user.name}
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
            <div className={styles.verticalline}></div>
            <div className={styles.rightside}>
              <div className={styles.titlecontainer}>
                <h2>
                  <i>ACCOUNT SETTINGS</i>
                </h2>
                <span
                  style={{
                    color: 'grey',
                  }}
                >
                  Control, protect, and secure your account.
                </span>
              </div>

              <div className={styles.userinformationcontainer}>
                <table className={styles.userinformationtable}>
                  <colgroup>
                    <col style={{ width: '160px' }}></col>
                  </colgroup>

                  <tbody>
                    <tr
                      className={`${styles.verticaltop} ${styles.rowcontainer}`}
                    >
                      <td>
                        <span>Account information</span>
                      </td>
                      <td>
                        <div>
                          <div className={styles.flexwrap}>
                            <span>
                              <b>{user.name}</b>
                            </span>
                            <button>EDIT</button>
                          </div>
                          <div>
                            <p>{user.email}</p>
                            <p>Display as Anonymous</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className={`${styles.rowcontainer}`}>
                      <td>
                        <span>Mobile Number</span>
                      </td>
                      <td>
                        <div className={styles.marginvertical}>
                          <div className={styles.flexwrap}>
                            <span>
                              <b>
                                {user.phone == ''
                                  ? 'To enhance your account security, add your mobile number.'
                                  : user.phone}
                              </b>
                            </span>
                            <button>
                              {user.phone == '' ? 'Add' : 'Update'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className={`${styles.rowcontainer}`}>
                      <td>
                        <span>Password</span>
                      </td>
                      <td>
                        <div className={styles.marginvertical}>
                          <div className={styles.flexwrap}>
                            <span>
                              <b>********</b>
                            </span>
                            <button>EDIT</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {!user && <>Loading...</>}
    </Layout>
  );
};

export default Profile;
