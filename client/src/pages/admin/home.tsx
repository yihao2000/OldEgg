import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Layout from '@/components/layout';
import ShopHeader from '@/components/shop/shopheader';
import styles from '@/styles/pagesstyles/shop/myshop/home.module.scss';

import {
  Brand,
  Category,
  Product,
  Shop,
  User,
} from '@/components/interfaces/interfaces';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import {
  BRANDS_QUERY,
  CATEGORIES_QUERY,
  CREATE_NEW_PRODUCT_MUTATION,
  GET_CURRENT_USER_SHOP,
  GRAPHQLAPI,
  SHOP_PRODUCTS_QUERY,
  SHOP_TOTAL_SALES_QUERY,
  UPDATE_USER_INFORMATION,
  USER_EXCEPT_SELF_QUERY,
} from '@/util/constant';
import ProductCard from '@/components/productcard';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';
import { ShopSideBar } from '@/components/sidebar/shopsidebar';
import Modal from '@/components/modal/modal';
import { AdminSideBar } from '@/components/sidebar/adminsidebar';

export default function MyShop() {
  const router = useRouter();
  const [token, setToken] = useSessionStorage('token', '');

  const [limit, setLimit] = useState(3);
  const [offset, setOffset] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [orderBy, setorderBy] = useState('');
  const [sortBy, setSortBy] = useState('featureditems');
  const [users, setUsers] = useState<User[]>();

  const [openAddModal, setOpenAddModal] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const closeAddModal = () => {
    setOpenAddModal(false);
  };

  useEffect(() => {
    console.log(token);
  }, []);

  interface UserParameter {
    user: User;
  }
  const UserCard = (props: UserParameter) => {
    const handleBanUserClick = () => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: UPDATE_USER_INFORMATION,
            variables: {
              userID: props.user.id,
              banned: true,
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
          console.log(err);
        });
    };

    const handleUnbanUserClick = () => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: UPDATE_USER_INFORMATION,
            variables: {
              userID: props.user.id,
              banned: false,
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
          console.log(err);
        });
    };
    return (
      <div
        className={`${styles.usercard} ${
          props.user.banned == true ? styles.bannedcard : styles.normalcard
        }`}
      >
        <div className={styles.userimagecontainer}>
          <img
            src="https://res.cloudinary.com/dmpbgjnrc/image/upload/v1678103779/userplaceholder_bloytq.webp"
            alt=""
            className={styles.userimage}
          />
        </div>
        <div className={styles.useridcontainer}>
          <div className={styles.userid}>{props.user.id}</div>
        </div>
        <div className={styles.userinformationcontainer}>
          <div className={styles.username}>{props.user.name}</div>
          <div className={styles.useremail}>{props.user.email}</div>
        </div>
        <div className={styles.actioncontainer}>
          {props.user.banned == true && (
            <button
              className={styles.unbanbutton}
              onClick={handleUnbanUserClick}
            >
              UNBAN
            </button>
          )}
          {props.user.banned == false && (
            <button className={styles.banbutton} onClick={handleBanUserClick}>
              BAN
            </button>
          )}
          {/* <button>Send Newsletter</button> */}
        </div>
      </div>
    );
  };

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    refreshComponent();
    console.log(orderBy);
  }, [token, limit, orderBy]);

  const handleAddProductClick = () => {
    setOpenAddModal(true);
  };

  useEffect(() => {
    if (token) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_EXCEPT_SELF_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          console.log(res);
          setTotalPage(Math.ceil(res.data.data.users.length / limit));
          setCurrentPage(1);
          setOffset(0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [refresh]);

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_EXCEPT_SELF_QUERY,
          variables: {
            limit: limit,
            offset: offset,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        console.log(res);
        setUsers(res.data.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [totalPage, offset, sortBy, refresh]);

  useEffect(() => {
    setOffset((currentPage - 1) * limit);
  }, [currentPage]);

  const handlePrevPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPageClick = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Layout>
      <div className={styles.maincontainer}>
        <div className={styles.pagedivider}>
          <AdminSideBar />
          <div className={styles.rightsection}>
            <div className={styles.flexbetween}>
              <h2>Manage Users</h2>
              {/* <button
                className={styles.addbutton}
                onClick={handleAddProductClick}
              >
                Add Product
              </button> */}
            </div>

            <div className={styles.filtercontainer}>
              <div className={styles.filtersubcontainer}>
                <div className={styles.orderBycontainer}></div>
              </div>
              <div
                className={styles.filtersubcontainer}
                style={{
                  display: 'flex',
                  columnGap: '10px',
                }}
              >
                <div className={styles.changepagecontainer}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <b>Page</b> {currentPage + '/' + totalPage}{' '}
                  </div>
                  {totalPage > 1 && (
                    <div>
                      {' '}
                      <button
                        onClick={handlePrevPageClick}
                        style={{
                          display: 'inline',
                        }}
                        className={styles.changepagebutton}
                      >
                        <FaAngleLeft />
                      </button>
                      <button
                        onClick={handleNextPageClick}
                        style={{
                          display: 'inline',
                        }}
                        className={styles.changepagebutton}
                      >
                        <FaAngleRight />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.productcardcontainer}>
              {users &&
                users.map((user) => {
                  return (
                    <UserCard user={user} key={user.id} />
                    // <ProductCard
                    //   style="original"
                    //   id={product.id}
                    //   image={product.image}
                    //   name={LAPTOP_NAME_CONVERTER(product.name)}
                    //   price={product.price}
                    //   key={product.id}
                    //   discount={product.discount}
                    // />
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* {openAddModal && (
        <Modal closeModal={closeAddModal} height={50} width={50}>
          <AddProductModalContent />
        </Modal>
      )} */}
    </Layout>
  );
}
