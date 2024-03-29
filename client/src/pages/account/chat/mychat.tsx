import {
  Shop,
  TransactionHeader,
  UserChat,
} from '@/components/interfaces/interfaces';
import Layout from '@/components/layout';
import { useEffect, useState } from 'react';
import styles from '@/styles/pagesstyles/account/chat/mychat.module.scss';
import axios from 'axios';
import {
  GRAPHQLAPI,
  SHOP_ONGOING_USER_ORDERS,
  USER_CHAT_QUERY,
  USER_ONGOING_ORDER_SHOPS,
} from '@/util/constant';
import { useSessionStorage } from 'usehooks-ts';

interface ShopCardParameter {
  shop: Shop;
}

export default function MyChat() {
  const [selectedUserChat, setSelectedUserChat] = useState<UserChat>();

  useEffect(() => {
    if (selectedUserChat?.id != '') {
      console.log(selectedUserChat);
    }
  }, [selectedUserChat]);

  function ShopCard(props: ShopCardParameter) {
    const [orders, setOrders] = useState<TransactionHeader[]>();

    const handleCardClick = () => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_CHAT_QUERY,
            variables: {
              sellerID: props.shop.user.id,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setSelectedUserChat(res.data.data.userChat);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    useEffect(() => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: SHOP_ONGOING_USER_ORDERS,
            variables: {
              shopID: props.shop.id,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setOrders(res.data.data.shopOnGoingUserOrders);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
    return (
      <div className={styles.shopcard} onClick={handleCardClick}>
        <div className={styles.shopcardimagecontainer}>
          <img src={props.shop.image} alt="" className={styles.shopcardimage} />
        </div>
        <div className={styles.shopcardinformationcontainer}>
          <div className={styles.shopname}>{props.shop.name}</div>
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

  const [shops, setShops] = useState<Shop[]>();
  const [token, setToken] = useSessionStorage('token', '');
  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_ONGOING_ORDER_SHOPS,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setShops(res.data.data.userOngoingOrderShops);
      });
  }, []);
  return (
    <Layout>
      <div className={styles.maincontainer}>
        <div className={styles.pagedivider}>
          <div className={styles.halfsection}>
            <div className={styles.shopcontainer}>
              {shops?.map((x) => {
                return <ShopCard shop={x} />;
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
