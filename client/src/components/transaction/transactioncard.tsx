import styles from '@/styles/componentstyles/transactioncard.module.scss';
import { GRAPHQLAPI, USER_ADD_CART_MUTATION } from '@/util/constant';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { TransactionHeader } from '../interfaces/interfaces';

interface Parameter {
  refrehComponent: Function;
  transaction: TransactionHeader;
}

export function TransactionCard(props: Parameter) {
  const [date, setDate] = useState<Date | null>(null);
  const [token, setToken] = useSessionStorage('token', '');

  useEffect(() => {
    console.log(date);
  }, [date]);

  useEffect(() => {
    setDate(new Date(props.transaction.transactionDate));
  }, []);

  const handleReorderClick = () => {
    props.transaction.transactionDetails.map((x) => {
      console.log(x);
      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_ADD_CART_MUTATION,
            variables: {
              productID: x.product.id,
              quantity: x.quantity,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          res.data.data.createCart.product;
        })

        .catch((err) => {
          alert(
            'Some items are not able to be purchased due to lack of stock !',
          );
        });
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
          {props.transaction.transactionDetails.slice(0, 3).map((x) => {
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
          <button className={styles.reorderbutton} onClick={handleReorderClick}>
            Reorder
          </button>
        </div>
      </div>
    </div>
  );
}
