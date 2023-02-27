import Layout from '@/components/layout';
import { AccountSidebar } from '@/components/sidebar/accountsidebar';
import styles from '@/styles/pagesstyles/account/order/orderhistory.module.scss';

export default function OrderHistory() {
  return (
    <Layout>
      <div className={styles.maincontainer}>
        <div className={styles.divider}>
          <AccountSidebar />
          <div className={styles.verticalline}></div>
          <div className={styles.rightside}></div>
        </div>
      </div>
    </Layout>
  );
}
