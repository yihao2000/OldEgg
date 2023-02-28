import { TransactionHeader } from '@/components/interfaces/interfaces';
import Layout from '@/components/layout';
import { AccountSidebar } from '@/components/sidebar/accountsidebar';
import { TransactionCard } from '@/components/transaction/transactioncard';
import styles from '@/styles/pagesstyles/account/order/orderhistory.module.scss';
import { GRAPHQLAPI, USER_TRANSACTIONS } from '@/util/constant';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';

export default function OrderHistory() {
  const [token, setToken] = useSessionStorage('token', '');
  const [transactions, setTransactions] = useState<TransactionHeader[]>();
  const [refresh, setRefresh] = useState(false);
  const [ordersType, setordersType] = useState('All');
  const [ordersWithin, setOrdersWithin] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    refreshComponent();
  }, [ordersType, ordersWithin, search]);

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_TRANSACTIONS,
          variables: {
            ordersWithin: ordersWithin,
            ordersType: ordersType,
            search: search,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setTransactions(res.data.data.userTransactionHeaders);
      })

      .catch((err) => console.log(err));
  }, [refresh]);
  return (
    <Layout>
      <div className={styles.maincontainer}>
        <div className={styles.divider}>
          <AccountSidebar />
          <div className={styles.verticalline}></div>
          <div className={styles.rightside}>
            <div className={styles.titlecontainer}>
              <h2>
                <i>Order History</i>
              </h2>
              <span
                style={{
                  color: 'grey',
                }}
              >
                Control, protect, and secure your account.
              </span>
            </div>
            <div className={styles.filtercontainer}>
              <div className={styles.filterupper}>
                <div className={styles.sectioncontainer}>
                  <span style={{ fontWeight: 'bold' }}>
                    Find Orders Within:{' '}
                  </span>
                  <select
                    value={ordersWithin}
                    onChange={(event) => {
                      setOrdersWithin(Number(event.target.value));
                    }}
                  >
                    <option value="7">Recent Orders</option>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>
                <div className={styles.sectioncontainer}>
                  <span style={{ fontWeight: 'bold' }}>Orders Type:</span>
                  <select
                    value={ordersType}
                    onChange={(event) => {
                      setordersType(event.target.value);
                    }}
                  >
                    <option value="All">Orders</option>
                    <option value="Open">Open Orders</option>
                    <option value="Cancelled">Cancelled Orders</option>
                  </select>
                </div>
              </div>
              <div className={styles.filterlower}>
                <input
                  type="text"
                  className={styles.input}
                  value={search}
                  onChange={handleSearchChange}
                />
                <button className={styles.searchbutton}>Search Order</button>
              </div>
            </div>
            <div className={styles.transactionscontainer}>
              {transactions?.length == 0 && <div>No Orders Yet !</div>}

              {transactions?.length != 0 &&
                transactions?.map((transaction) => {
                  return (
                    <TransactionCard
                      refrehComponent={refreshComponent}
                      transaction={transaction}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
