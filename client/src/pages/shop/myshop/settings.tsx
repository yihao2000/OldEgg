import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Layout from '@/components/layout';
import ShopHeader from '@/components/shop/shopheader';
import styles from '@/styles/pagesstyles/shop/myshop/home.module.scss';

import { Product, Shop } from '@/components/interfaces/interfaces';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import {
  GET_CURRENT_USER_SHOP,
  GRAPHQLAPI,
  SHOP_PRODUCTS_QUERY,
  SHOP_TOTAL_SALES_QUERY,
} from '@/util/constant';
import ProductCard from '@/components/productcard';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';
import { ShopSideBar } from '@/components/sidebar/shopsidebar';

export default function ShopSettings() {
  const router = useRouter();
  const [token, setToken] = useSessionStorage('token', '');
  const [shop, setShop] = useState<Shop>();

  const [refresh, setRefresh] = useState(false);

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

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
  }, [refresh]);

  return (
    <Layout>
      {shop && shop.banned == false && (
        <div className={styles.maincontainer}>
          <div className={styles.pagedivider}>
            <ShopSideBar />
            <div className={styles.rightsection}>
              <h2>Shop Settings</h2>
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
                        <div className={styles.shopprofile}>
                          <img
                            src={shop?.image}
                            alt=""
                            className={styles.profileimage}
                          />
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className={styles.flexwrap}>
                            <span>
                              <b>{shop.name}</b>
                            </span>
                            <button
                              onClick={() => {
                                router.push('/shop/myshop/updateinformation');
                              }}
                            >
                              EDIT
                            </button>
                          </div>
                          <div className={styles.verticalcontainer}>
                            <div className={styles.paragraphwrap}>
                              {shop.aboutus}
                            </div>
                            <div className={styles.paragraphwrap}>
                              {shop.description}
                            </div>
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
      {shop && shop.banned == true && (
        <div className={styles.bannedcontainer}>
          <h2
            style={{
              fontWeight: 'bold',
              color: 'red',
            }}
          >
            This shop is Banned !
          </h2>
        </div>
      )}
    </Layout>
  );
}
