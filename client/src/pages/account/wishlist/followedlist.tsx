import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/pagesstyles/account/wishlists/mylist.module.scss';
import Layout from '@/components/layout';
import Link from 'next/link';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  CREATE_WISHLIST_MUTATION,
  GRAPHQLAPI,
  PRODUCT_CATEGORY_QUERY,
  PRODUCT_PRODUCTSGROUP_QUERY,
  PRODUCT_QUERY,
  USER_ADD_CART_MUTATION,
  USER_FOLLOWED_WISHLISTS_QUERY,
  USER_WISHLISTS_QUERY,
} from '@/util/constant';
import { FaTruck } from 'react-icons/fa';
import {
  Product,
  ProductCardData,
  ProductDetail,
  Wishlist,
} from '@/components/interfaces/interfaces';

import { useSessionStorage } from 'usehooks-ts';
import { ClipLoader } from 'react-spinners';

import WishlistNav from '@/components/wishlistnav';
import Modal from '@/components/modal/modal';
import WishlistCard from '@/components/wishlistcard';

interface MyListModalParameter {
  newListName: string;
  handleNewListNameChange: ChangeEventHandler<HTMLInputElement>;
  newListPrivacy: string;
  handleNewListPrivacyChange: Function;
  handleCloseModal: Function;
  refreshComponent: Function;
}
const MyListModalContent = (props: MyListModalParameter) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useSessionStorage('token', '');

  const handlePublicPrivacyChange = () => {
    props.handleNewListPrivacyChange('Public');
  };

  const handlePrivatePrivacyChange = () => {
    props.handleNewListPrivacyChange('Private');
  };

  const handleCreateButtonClick = () => {
    console.log(props.newListName);
    if (props.newListName == '') {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      axios
        .post(
          GRAPHQLAPI,
          {
            query: CREATE_WISHLIST_MUTATION,
            variables: {
              name: props.newListName,
              privacy: props.newListPrivacy,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          props.handleCloseModal();
          props.refreshComponent();
        })
        .catch((error) => {
          setError(true);
        });
    }, 3000);
  };

  return (
    <div className={styles.mylistmodalcontent}>
      <div className={styles.mylistcreatelistlabel}>Create a List</div>
      <div className={styles.mylistnamecontainer}>
        <h5
          style={{
            margin: '0',
            padding: '0',
          }}
        >
          Name
        </h5>
        <input
          required
          className={styles.inputfield}
          type="text"
          value={props.newListName}
          onChange={props.handleNewListNameChange}
        />
      </div>
      <div className={styles.mylistprivacycontainer}>
        <h5
          style={{
            margin: '0',
            padding: '0',
          }}
        >
          Privacy
        </h5>
        <div className={styles.buttoncontainer}>
          <button
            className={`${styles.selectionbutton} ${
              props.newListPrivacy == 'Public' ? styles.selectedbutton : ''
            }`}
            onClick={handlePublicPrivacyChange}
          >
            Public
          </button>
          <button
            className={`${styles.selectionbutton} ${
              props.newListPrivacy == 'Private' ? styles.selectedbutton : ''
            }`}
            onClick={handlePrivatePrivacyChange}
          >
            Private
          </button>
        </div>
      </div>
      <hr
        style={{
          width: '100%',
          marginTop: '10px',
        }}
      />
      <div className={styles.submitcontainer}>
        <div
          style={{
            color: 'red',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <b>{error ? 'Please fill all fields !' : ''}</b>
        </div>
        <button
          className={styles.submitbutton}
          onClick={handleCreateButtonClick}
        >
          {loading ? <ClipLoader size={10} /> : 'CREATE'}
        </button>
      </div>
    </div>
  );
};

const Mylist: NextPage = () => {
  const router = useRouter();

  interface WishlistFollower {
    wishlist: Wishlist;
  }

  // const [id, setId] = useState('');
  const [token, setToken] = useSessionStorage('token', '');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListPrivacy, setNewListPrivacy] = useState('Public');
  const [refresh, setRefresh] = useState(false);

  const [wishlistFollowers, setWishlistFollowers] = useState<
    WishlistFollower[]
  >([]);

  const refreshComponent = () => {
    // location.reload();
    setRefresh(!refresh);
  };

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_FOLLOWED_WISHLISTS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setWishlistFollowers(res.data.data.userFollowedWishlists);
      })

      .catch((err) => console.log(err));
  }, [refresh]);

  return (
    <Layout>
      <WishlistNav />
      <div className={styles.mylistoutercontainer}></div>
      <div className={styles.mylistcontainer}>
        {wishlistFollowers.map((res) => {
          console.log('Mapping');
          return (
            <WishlistCard
              key={res.wishlist.id}
              style="half"
              wishlistName={res.wishlist.name}
              wishlistPrivacy={res.wishlist.privacy}
              refreshComponent={refreshComponent}
              wishlistId={res.wishlist.id}
            />
          );
        })}
      </div>
    </Layout>
  );
};

export default Mylist;
