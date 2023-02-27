import { Wishlist, WishlistDetail } from '@/components/interfaces/interfaces';
import Layout from '@/components/layout';
import {
  GRAPHQLAPI,
  WISHLISTDETAILS_QUERY,
  WISHLIST_DETAILS_QUERY,
  WISHLIST_QUERY,
  USER_ADD_CART_MUTATION,
  DELETE_WISHLIST_DETAIL,
} from '@/util/constant';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';

import styles from '@/styles/pagesstyles/wishlist/wishlistdetail.module.scss';
import Modal from '@/components/modal/modal';
import WishlistSettingModalContent from '@/components/modal/content/wishlistsetting';
import AddWishlistNotesModalContent from '@/components/modal/content/addwishlistnotes';
import WishlistDetailCard from '@/components/wishlistdetailcard';

export default function WishlistDetailPage() {
  //MainVariables
  const router = useRouter();
  const { id } = router.query;
  const [wishlistDetails, setWishlistDetails] = useState<WishlistDetail[]>([]);
  const [wishlist, setWishlist] = useState<Wishlist>();
  const [token, setToken] = useSessionStorage('token', '');
  const [totalPrice, setTotalPrice] = useState(0);

  //Refresh
  const [refresh, setRefresh] = useState(false);

  //Modal
  const [openWishlistSettingModal, setOpenWishlistSettingModal] =
    useState(false);

  const [openAddNotesModal, setOpenAddNotesModal] = useState(false);

  const handleAddNotesClick = () => {
    setOpenAddNotesModal(true);
  };

  const closeAddNotesModal = () => {
    setOpenAddNotesModal(false);
  };
  const closeWishlistSettingModal = () => {
    setOpenWishlistSettingModal(false);
  };

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    refreshComponent();
  }, [id]);

  useEffect(() => {
    var totalPrice = 0;
    wishlistDetails.map((w) => {
      totalPrice += w.quantity * w.product.price;
    });
    setTotalPrice(totalPrice);
  }, [wishlistDetails]);

  const queryWishlist = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: WISHLIST_QUERY,
          variables: {
            wishlistId: id,
          },
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setWishlist(res.data.data.wishlist);
      })
      .catch(() => {});
  };
  const queryWishlistDetails = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: WISHLIST_DETAILS_QUERY,
          variables: {
            wishlistID: id,
          },
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setWishlistDetails(res.data.data.wishlistDetails);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (id) {
      queryWishlist();
      queryWishlistDetails();
    }
  }, [refresh]);

  const handleSettingButtonClick = () => {
    setOpenWishlistSettingModal(true);
  };

  const handleAddAllToCartClick = () => {
    wishlistDetails.map((e) => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_ADD_CART_MUTATION,
            variables: {
              productID: e.product.id,
              quantity: e.quantity,
            },
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          axios
            .post(
              GRAPHQLAPI,
              {
                query: DELETE_WISHLIST_DETAIL,
                variables: {
                  productID: e.product.id,
                  wishlistId: e.wishlist.id,
                },
              },
              {
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              },
            )
            .then((res) => {
              refreshComponent();
            })
            .catch((err) => {
              // setError('Invalid Product Amount !');
            });
        })
        .catch(() => {});
    });
  };
  return (
    <Layout>
      <div className={styles.pagedivider}>
        <div className={styles.leftsection}>
          <div className={styles.wishlistinfocontainer}>
            <div className={styles.wishlistcontainertitle}>
              {wishlist?.name}
            </div>
            <div className={styles.wishlistsettingcontainer}>
              <button
                className={styles.secondarybutton}
                style={{
                  backgroundColor: 'grey',
                }}
              >
                {wishlist?.privacy}
              </button>
              <button
                className={styles.secondarybutton}
                onClick={handleSettingButtonClick}
              >
                SETTINGS
              </button>
            </div>
            <hr className={styles.horizontalline} />

            <div className={styles.subtotalcontainer}>
              <div className={styles.subtotallabel}>
                Subtotal (item): $
                <span style={{ fontWeight: 'bold' }}>{totalPrice}</span>{' '}
              </div>
              <div className={styles.flexendcontainer}>
                <button
                  onClick={handleAddAllToCartClick}
                  className={styles.primarybutton}
                  style={{
                    width: 'fit-content',

                    justifySelf: 'flex-end',
                  }}
                >
                  ADD ALL TO CART
                </button>
              </div>
            </div>
            {wishlist?.notes != '' && (
              <div className={styles.wishlistnotecontainer}>
                {wishlist?.notes}
              </div>
            )}

            <div className={styles.flexendcontainer}>
              <button
                className={styles.secondarybutton}
                onClick={handleAddNotesClick}
              >
                {wishlist?.notes == '' ? 'ADD NOTES' : 'EDIT NOTES'}
              </button>
            </div>
          </div>
        </div>
        <div className={styles.rightsection}>
          <div className={styles.filtercontainer}>aa</div>
          <div className={styles.wishlistdetailcontainer}>
            {wishlistDetails.map((e) => {
              return (
                <WishlistDetailCard
                  refreshComponent={refreshComponent}
                  wishlistdetail={e}
                  key={e.product.id}
                />
              );
            })}
          </div>
        </div>

        {openWishlistSettingModal && wishlist && (
          <Modal
            closeModal={closeWishlistSettingModal}
            height={50}
            width={50}
            key={wishlist.id}
          >
            <WishlistSettingModalContent
              closeModal={closeWishlistSettingModal}
              refreshComponent={refreshComponent}
              wishlistId={wishlist.id}
            />
          </Modal>
        )}

        {openAddNotesModal && wishlist && (
          <Modal
            closeModal={closeAddNotesModal}
            height={50}
            width={50}
            key={wishlist.id}
          >
            <AddWishlistNotesModalContent
              closeModal={closeAddNotesModal}
              refreshComponent={refreshComponent}
              wishlistId={wishlist.id}
              key={wishlist.id}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
}
