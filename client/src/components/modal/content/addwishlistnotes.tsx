import { Wishlist } from '@/components/interfaces/interfaces';
import {
  GRAPHQLAPI,
  UPDATE_WISHLIST_MUTATION,
  EDIT_WISHLIST_NOTES,
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

export default function AddWishlistNotesModalContent(props: ModalParameter) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(false);
  const [token, setToken] = useSessionStorage('token', '');

  const handleSaveButtonClick = () => {
    if (notes == '') {
      setError(true);
      return;
    }

    axios
      .post(
        GRAPHQLAPI,
        {
          query: EDIT_WISHLIST_NOTES,
          variables: {
            wishlistID: props.wishlistId,
            notes: notes,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        props.closeModal();
        props.refreshComponent();
      })

      .catch((err) => console.log(err));
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
      // setWishlist()
      if (wishlist.notes != '') setNotes(wishlist.notes);
    }
  }, [wishlist]);

  const handleNewNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };
  return (
    <div className={styles2.mylistmodalcontent}>
      <div className={styles2.mylistcreatelistlabel}>Wishlist Notes</div>
      <div className={styles2.mylistnamecontainer}>
        <h5
          style={{
            margin: '0',
            padding: '0',
          }}
        >
          Notes:
        </h5>
        <input
          required
          className={styles2.inputfield}
          type="text"
          value={notes}
          onChange={handleNewNotesChange}
        />
      </div>

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
          SAVE
        </button>
      </div>
    </div>
  );
}
