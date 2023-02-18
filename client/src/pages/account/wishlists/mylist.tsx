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
} from '@/util/constant';
import { FaTruck } from 'react-icons/fa';
import {
  Product,
  ProductCardData,
  ProductDetail,
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
}
const MyListModalContent = (props: MyListModalParameter) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useSessionStorage('token', '');
  const [refresh, setRefresh] = useState(false);

  // const [wishtlists, setWishlists] = useState<>([])

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  const handlePublicPrivacyChange = () => {
    props.handleNewListPrivacyChange('Public');
  };

  const handlePrivatePrivacyChange = () => {
    props.handleNewListPrivacyChange('Private');
  };

  useEffect(() => {}, []);

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

  // const [id, setId] = useState('');
  const [token, setToken] = useSessionStorage('token', '');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListPrivacy, setNewListPrivacy] = useState('Public');

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleNewListNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewListName(event.target.value);
  };

  const handleNewListPrivacyChange = (value: string) => {
    setNewListPrivacy(value);
  };

  return (
    <Layout>
      <WishlistNav />
      <div className={styles.mylistoutercontainer}>
        <div className={styles.listbuttoncontainer}>
          <button
            className={styles.lightbutton}
            onClick={handleOpenCreateModal}
          >
            CREATE A LIST
          </button>
          <button className={styles.lightbutton}>MANAGE LISTS</button>
        </div>
      </div>
      <div className={styles.mylistcontainer}>
        <WishlistCard productId="Aaa" wishlistId="aaa" />
        <WishlistCard productId="Aaa" wishlistId="aaa" />
        <WishlistCard productId="Aaa" wishlistId="aaa" />
      </div>
      {openCreateModal && (
        <Modal closeModal={handleCloseCreateModal} width={35} height={45}>
          <MyListModalContent
            handleCloseModal={handleCloseCreateModal}
            newListPrivacy={newListPrivacy}
            handleNewListPrivacyChange={handleNewListPrivacyChange}
            handleNewListNameChange={handleNewListNameChange}
            newListName={newListName}
          />
        </Modal>
      )}
    </Layout>
  );
};

export default Mylist;
