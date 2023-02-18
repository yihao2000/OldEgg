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

interface MyListModalParameter {
  newListName: string;
  handleNewListNameChange: ChangeEventHandler<HTMLInputElement>;
  newListPrivacy: string;
  handleNewListPrivacyChange: Function;
}
const MyListModalContent = (props: MyListModalParameter) => {
  const handlePublicPrivacyChange = () => {
    props.handleNewListPrivacyChange('Public');
  };

  const handlePrivatePrivacyChange = () => {
    props.handleNewListPrivacyChange('Private');
  };

  return (
    <div className={styles.mylistmodalcontent}>
      <div className={styles.mylistcreatelistlabel}>Create a List</div>
      <div className={styles.mylistnamecontainer}>
        <h5>Name</h5>
        <input
          type="text"
          value={props.newListName}
          onChange={props.handleNewListNameChange}
        />
      </div>
      <div className={styles.mylistprivacycontainer}>
        <h5>Privacy</h5>
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
  const [loading, setLoading] = useState(false);

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
      {openCreateModal && (
        <Modal closeModal={handleCloseCreateModal} width={35} height={50}>
          <MyListModalContent
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
