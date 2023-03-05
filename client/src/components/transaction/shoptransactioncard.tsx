import styles from '@/styles/componentstyles/transactioncard.module.scss';
import {
  GRAPHQLAPI,
  UPDATE_TRANSACTION_HEADER_MUTATION,
  USER_ADD_CART_MUTATION,
} from '@/util/constant';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { TransactionHeader } from '../interfaces/interfaces';

interface Parameter {
  refrehComponent: Function;
  transaction: TransactionHeader;
}

export function ShopTransactionCard(props: Parameter) {
  const [date, setDate] = useState<Date | null>(null);
  const [token, setToken] = useSessionStorage('token', '');

  useEffect(() => {
    console.log(date);
  }, [date]);

  useEffect(() => {
    setDate(new Date(props.transaction.transactionDate));
  }, []);

  const handleConfirmOrderClick = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: UPDATE_TRANSACTION_HEADER_MUTATION,
          variables: {
            transactionHeaderID: props.transaction.id,
            status: 'Confirmed',
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        props.refrehComponent();
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancelOrderClick = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: UPDATE_TRANSACTION_HEADER_MUTATION,
          variables: {
            transactionHeaderID: props.transaction.id,
            status: 'Cancelled',
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        props.refrehComponent();
      })

      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.cardcontainer}>
      <div className={styles.leftcardside}>
        <div className={styles.titlecontainer}>
          <div className={styles.titlelabel}>{date?.toDateString()}</div>
          <div className={styles.titlelabel}>
            Invoice: <b>{props.transaction.invoice}</b>
          </div>
          <div className={styles.titlelabel}>{props.transaction.status}</div>
        </div>
        <div className={styles.titlecontainer}>
          <div className={styles.titlelabel}>
            {' '}
            Order ID: <b>{props.transaction.id}</b>
          </div>
        </div>
        <div className={styles.productcontainer}>
          {props.transaction.transactionDetails.slice(0, 10).map((x) => {
            return (
              <div className={styles.imagecontainer}>
                <img src={x.product.image} alt="" className={styles.image} />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.verticalline}></div>
      <div className={styles.rightcardside}>
        <div className={styles.rightcardsidecontainer}>
          {props.transaction.status == 'Open' && (
            <div className={styles.shopactionbuttoncontainer}>
              <button
                className={styles.confirmbutton}
                onClick={handleConfirmOrderClick}
              >
                Confirm Order
              </button>
              <button
                className={styles.cancelbutton}
                onClick={handleCancelOrderClick}
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
