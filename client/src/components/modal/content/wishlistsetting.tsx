import { Wishlist } from '@/components/interfaces/interfaces';
import {
  GRAPHQLAPI,
  UPDATE_WISHLIST_MUTATION,
  WISHLIST_QUERY,
} from '@/util/constant';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import styles2 from '@/styles/pagesstyles/account/wishlists/mylist.module.scss';
import { ClipLoader } from 'react-spinners';

interface ModalParameter {
  closeModal: Function;
  wishlistId: string;
  refreshComponent: Function;
}

export default function WishlistSettingModalContent(props: ModalParameter) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListPrivacy, setNewListPrivacy] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useSessionStorage('token', '');

  const handleNewListNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewListName(event.target.value);
  };

  const handleSaveButtonClick = () => {
    if (newListName == '') {
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
            query: UPDATE_WISHLIST_MUTATION,
            variables: {
              wishlistId: props.wishlistId,
              wishlistName: newListName,
              wishlistPrivacy: newListPrivacy,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          props.refreshComponent();
          props.closeModal();
        })

        .catch((err) => console.log(err));
    }, 3000);
  };
  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: WISHLIST_QUERY,
          variables: {
            wishlistId: props.wishlistId,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setWishlist(res.data.data.wishlist);
      })

      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (wishlist) {
      setNewListName(wishlist.name);
      setNewListPrivacy(wishlist.privacy);
    }
  }, [wishlist]);
  return (
    <div className={styles2.mylistmodalcontent}>
      <div className={styles2.mylistcreatelistlabel}>List Settings</div>
      <div className={styles2.mylistnamecontainer}>
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
          className={styles2.inputfield}
          type="text"
          value={newListName}
          onChange={handleNewListNameChange}
        />
      </div>
      <div className={styles2.mylistprivacycontainer}>
        <h5
          style={{
            margin: '0',
            padding: '0',
          }}
        >
          Privacy
        </h5>
        <div className={styles2.buttoncontainer}>
          <button
            className={`${styles2.selectionbutton} ${
              newListPrivacy == 'Public' ? styles2.selectedbutton : ''
            }`}
            onClick={() => {
              setNewListPrivacy('Public');
            }}
          >
            Public
          </button>
          <button
            className={`${styles2.selectionbutton} ${
              newListPrivacy == 'Private' ? styles2.selectedbutton : ''
            }`}
            onClick={() => {
              setNewListPrivacy('Private');
            }}
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
      <div className={styles2.submitcontainer}>
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
          className={styles2.submitbutton}
          onClick={handleSaveButtonClick}
        >
          {loading ? <ClipLoader size={10} /> : 'SAVE'}
        </button>
      </div>
    </div>
  );
}
