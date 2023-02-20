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
  USER_WISHLISTS_QUERY,
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
  interface Wishlist {
    id: string;
    name: string;
    privacy: string;
  }

  const router = useRouter();

  // const [id, setId] = useState('');
  const [token, setToken] = useSessionStorage('token', '');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListPrivacy, setNewListPrivacy] = useState('Public');
  const [refresh, setRefresh] = useState(false);

  const [wishlists, setWishlists] = useState<Wishlist[]>([]);

  const refreshComponent = () => {
    // location.reload();
    setRefresh(!refresh);
  };

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_WISHLISTS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setWishlists(res.data.data.userwishlists);
      })

      .catch((err) => console.log(err));
  }, [refresh]);

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
    setNewListName('');
    setNewListPrivacy('Public');
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
        {wishlists.map((res) => {
          console.log('Mapping');
          return (
            <WishlistCard
              wishlistName={res.name}
              wishlistPrivacy={res.privacy}
              refreshComponent={refreshComponent}
              wishlistId={res.id}
            />
          );
        })}
      </div>
      {openCreateModal && (
        <Modal closeModal={handleCloseCreateModal} width={35} height={45}>
          <MyListModalContent
            refreshComponent={refreshComponent}
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
