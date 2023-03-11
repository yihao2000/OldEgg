import styles from '@/styles/home.module.scss';
import {
  CURRENT_USER_QUERY,
  GRAPHQLAPI,
  UPDATE_USER_SUBSCRIPTION_MUTATION,
} from '@/util/constant';
import axios from 'axios';
import { Router, useRouter } from 'next/router';
import { useEffect, useState, useTransition } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { User } from './interfaces/interfaces';
export default function NewsLetter() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useSessionStorage('token', '');
  const router = useRouter();

  const [refresh, setRefresh] = useState(false);

  const handleSubscribeButtonClick = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: UPDATE_USER_SUBSCRIPTION_MUTATION,
          variables: {
            userID: user?.id,
            subscribed: true,
          },
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setRefresh(!refresh);
      })
      .catch(() => {});
  };

  const handleUnsubscribeButtonClick = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: UPDATE_USER_SUBSCRIPTION_MUTATION,
          variables: {
            userID: user?.id,
            subscribed: false,
          },
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setRefresh(!refresh);
      })
      .catch(() => {});
  };
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
          console.log(res);
          setUser(res.data.data.getCurrentUser);
        })
        .catch(() => {});
    }
  }, [token, refresh]);
  return (
    <div className={styles.newslettercontainer}>
      {token && user && (
        <div className={styles.newslettercontent}>
          {' '}
          <h2>Hello, {user?.name}!</h2>
          <div>
            {' '}
            {user?.newslettersubscribe == false && (
              <h4>Would You like to Subscribe to Newsletter ? </h4>
            )}
            {user?.newslettersubscribe == true && (
              <h4>Would You like to Unsubscribe ? </h4>
            )}
          </div>
          <div>
            {user?.newslettersubscribe == false && (
              <button
                className={styles.subscribebutton}
                onClick={handleSubscribeButtonClick}
              >
                Subscribe Now !
              </button>
            )}
            {user?.newslettersubscribe == true && (
              <button
                className={styles.unsubscribebutton}
                onClick={handleUnsubscribeButtonClick}
              >
                Unsubscribe !
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
