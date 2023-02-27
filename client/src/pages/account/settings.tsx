import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/pagesstyles/account/profile.module.scss';
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
import {
  LAPTOP_NAME_CONVERTER,
  NAME_SPLITTER,
} from '@/components/converter/converter';
import { useSessionStorage } from 'usehooks-ts';
import { AccountSidebar } from '@/components/sidebar/accountsidebar';

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
            <AccountSidebar />
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
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <b>
                                {user.phone == ''
                                  ? 'To enhance your account security, add your mobile number.'
                                  : user.phone}
                              </b>
                            </span>
                            <button
                              className={styles.editbutton}
                              onClick={() => {
                                router.push('/account/mobilephone');
                              }}
                            >
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
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <b>********</b>
                            </span>
                            <button
                              className={styles.editbutton}
                              onClick={() => {
                                router.push('/account/password');
                              }}
                            >
                              EDIT
                            </button>
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
