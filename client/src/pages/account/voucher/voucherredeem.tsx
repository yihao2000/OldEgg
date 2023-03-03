import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Layout from '@/components/layout';
import ShopHeader from '@/components/shop/shopheader';
import styles from '@/styles/pagesstyles/account/voucher/voucherredeem.module.scss';

import { Product, Shop, User } from '@/components/interfaces/interfaces';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import {
  CURRENT_USER_QUERY,
  GRAPHQLAPI,
  REDEEM_VOUCHER_MUTATION,
  SHOP_PRODUCTS_QUERY,
  SHOP_QUERY,
  SHOP_TOTAL_SALES_QUERY,
  USER_UPDATE_BALANCE_MUTATION,
} from '@/util/constant';
import ProductCard from '@/components/productcard';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';

interface Voucher {
  id: string;
  balance: number;
  dateCreated: string;
  dateUsed: string;
}
export default function VoucherRedeem() {
  const router = useRouter();

  const [token, setToken] = useSessionStorage('token', '');

  const [refresh, setRefresh] = useState(false);
  const [inputtedCode, setInputtedCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [voucher, setVoucher] = useState<Voucher>();

  const [currUser, setCurrUser] = useState<User>();

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  const handleRedeemClick = () => {
    setSuccess(false);
    setError('');

    if (inputtedCode == '') {
      setError('Please fill voucher code !');
    } else {
      axios
        .post(GRAPHQLAPI, {
          query: REDEEM_VOUCHER_MUTATION,
          variables: {
            voucherID: inputtedCode,
          },
        })
        .then((res) => {
          res.data.data.updateVoucher.id;
          console.log(res);
          setVoucher(res.data.data.updateVoucher);
        })
        .catch((err) => {
          setError(
            'Invalid Voucher Code ! Please make sure voucher has not been used !',
          );
        });
    }
  };

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: CURRENT_USER_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setCurrUser(res.data.data.getCurrentUser);
      })

      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (voucher && currUser) {
      var newBalance = currUser?.currency + voucher?.balance;
      console.log(newBalance);
      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_UPDATE_BALANCE_MUTATION,
            variables: {
              balance: newBalance,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setSuccess(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [voucher]);

  const ReviewCard = () => {
    return <div className={styles.cardcontainer}></div>;
  };

  useEffect(() => {}, [refresh]);

  return (
    <Layout>
      <div className={styles.maincontainer}>
        <ShopHeader />
        <div className={styles.contentsection}>
          <h2>Input Voucher Code: </h2>
          <div className={styles.inputcontainer}>
            <input
              type="text"
              className={styles.inputfield}
              value={inputtedCode}
              onChange={(event) => {
                setInputtedCode(event?.target.value);
              }}
            />
            <button onClick={handleRedeemClick}>Redeem</button>
          </div>
          {error != '' && <h3 className={styles.errorlabel}>{error}</h3>}
          {success && (
            <h3
              style={{
                color: 'green',
              }}
            >
              Success ! Your Account Balance has been updated !
            </h3>
          )}
        </div>
      </div>
    </Layout>
  );
}
