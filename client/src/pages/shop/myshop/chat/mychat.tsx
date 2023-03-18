import {
  Shop,
  TransactionHeader,
  User,
} from '@/components/interfaces/interfaces';
import Layout from '@/components/layout';
import { useEffect, useState } from 'react';
import styles from '@/styles/pagesstyles/account/chat/mychat.module.scss';
import axios from 'axios';
import {
  GRAPHQLAPI,
  SHOP_ONGOING_ORDER_USERS_QUERY,
  SHOP_ONGOING_USER_ORDERS,
  USER_ONGOING_ORDER_SHOPS,
  USER_ONGOING_SHOP_ORDERS_QUERY,
} from '@/util/constant';
import { useSessionStorage } from 'usehooks-ts';

interface UserCardParameter {
  // shop: Shop;
  user: User;
}

export default function MyChat() {
  function UserCard(props: UserCardParameter) {
    const [orders, setOrders] = useState<TransactionHeader[]>();
    useEffect(() => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_ONGOING_SHOP_ORDERS_QUERY,
            variables: {
              userID: props.user.id,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          // console.log(res);
          setOrders(res.data.data.userOngoingShopOrders);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    return (
      <div className={styles.shopcard}>
        <div className={styles.shopcardimagecontainer}>
          <img
            src="https://res.cloudinary.com/dmpbgjnrc/image/upload/v1678103779/userplaceholder_bloytq.webp"
            alt=""
            className={styles.shopcardimage}
          />
        </div>
        <div className={styles.shopcardinformationcontainer}>
          <div className={styles.shopname}>{props.user.name}</div>
          <div className={styles.orderid}>
            Ongoing Order ID(s):
            {orders?.map((x) => {
              return x.id + '   ';
            })}
          </div>
        </div>
      </div>
    );
  }

  // const [shops, setShops] = useState<Shop[]>();
  const [users, setUsers] = useState<User[]>();
  const [token, setToken] = useSessionStorage('token', '');
  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: SHOP_ONGOING_ORDER_USERS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setUsers(res.data.data.shopOngoingOrderUsers);
      });
  }, []);
  return (
    <Layout>
      <div className={styles.maincontainer}>
        <div className={styles.pagedivider}>
          <div className={styles.halfsection}>
            <div className={styles.shopcontainer}>
              {users?.map((x) => {
                return <UserCard user={x} />;
              })}
            </div>
          </div>
          <div className={styles.verticalline}></div>
          <div className={styles.halfsection}>asdsa</div>
        </div>
      </div>
    </Layout>
  );
}
