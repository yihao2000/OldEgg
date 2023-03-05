import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Layout from '@/components/layout';
import ShopHeader from '@/components/shop/shopheader';
import styles from '@/styles/pagesstyles/shop/myshop/orders.module.scss';

import {
  Product,
  Shop,
  TransactionHeader,
} from '@/components/interfaces/interfaces';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import {
  GET_CURRENT_USER_SHOP,
  GRAPHQLAPI,
  SHOP_ORDERS_QUERY,
  SHOP_PRODUCTS_QUERY,
  SHOP_TOTAL_SALES_QUERY,
} from '@/util/constant';
import ProductCard from '@/components/productcard';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';
import { ShopSideBar } from '@/components/sidebar/shopsidebar';
import { ShopTransactionCard } from '@/components/transaction/shoptransactioncard';

export default function ShopSettings() {
  const router = useRouter();
  const [token, setToken] = useSessionStorage('token', '');
  const [shop, setShop] = useState<Shop>();
  const [shopOrders, setShopOrders] = useState<TransactionHeader[]>();
  const [filterStatus, setFilterStatus] = useState('All');

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

  useEffect(() => {
    if (shop) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: SHOP_ORDERS_QUERY,
            variables: {
              shopID: shop.id,
              filter: filterStatus,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setShopOrders(res.data.data.shopOrders);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [shop, refresh, filterStatus]);

  return (
    <Layout>
      {shop && shop.banned == false && (
        <div className={styles.maincontainer}>
          <div className={styles.pagedivider}>
            <ShopSideBar />
            <div className={styles.rightsection}>
              <h1 className={styles.titlelabel}>Orders</h1>
              <div className={styles.filtercontainer}>
                <span>Filter Order: </span>
                <select
                  value={filterStatus}
                  onChange={(event) => {
                    setFilterStatus(event.target.value);
                  }}
                  className={styles.selectstyle}
                >
                  <option value="All">All</option>
                  <option value="Open">Open</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className={styles.transactionscontainer}>
                asdsa
                {shopOrders?.length == 0 && <div>No Orders Yet !</div>}
                {shopOrders?.length != 0 &&
                  shopOrders?.map((shopOrder) => {
                    return (
                      <ShopTransactionCard
                        refrehComponent={refreshComponent}
                        transaction={shopOrder}
                      />
                    );
                  })}
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
