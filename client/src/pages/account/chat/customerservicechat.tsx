import { Shop } from '@/components/interfaces/interfaces';
import Layout from '@/components/layout';
import styles from '@/styles/pagesstyles/account/chat/mychat.module.scss';
import { GRAPHQLAPI, USER_ONGOING_ORDER_SHOPS } from '@/util/constant';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function MyChat() {
  return (
    <Layout>
      <div className={styles.maincontainer}>
        <div className={styles.pagedivider}>
          <span
            style={{
              color: 'red',
            }}
          >
            Chat Features is not implemented yet !
          </span>
        </div>
      </div>
    </Layout>
  );
}
