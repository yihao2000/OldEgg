import { links } from '@/util/route';
import Image from 'next/image';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import styles from '@/styles/pagesstyles/account/wishlists/mylist.module.scss';
import { useRouter } from 'next/router';

export default function WishlistNav() {
  const [firstActive, setFirstActive] = useState(false);
  const [secondActive, setSecondActive] = useState(false);
  const [thirdActive, setThirdActive] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (router.pathname.endsWith('mylist')) {
      setFirstActive(true);
    } else if (router.pathname.endsWith('publiclist')) {
      setThirdActive(true);
    } else if (router.pathname.endsWith('followedlist')) {
      setSecondActive(true);
    }
  }, []);

  return (
    <div className={styles.appcontainer}>
      <div className={styles.appnavcontainer}>
        <div className={styles.listcontainer}>
          <div className={styles.wishlistlabelcontainer}>
            <h1 className={styles.wishlistlabel}>WISH LIST</h1>
          </div>
          <div className={styles.listnavcontainer}>
            <a
              href={links.mylist}
              className={`${styles.navtabcell} ${
                firstActive ? styles.activetabcell : ''
              }`}
            >
              My Lists
            </a>
            <a
              href={links.followedlist}
              className={`${styles.navtabcell} ${
                secondActive ? styles.activetabcell : ''
              }`}
            >
              Followed Lists
            </a>
            <a
              href={links.publiclist}
              className={`${styles.navtabcell} ${
                thirdActive ? styles.activetabcell : ''
              }`}
            >
              Public Lists
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
