import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Layout from '@/components/layout';
import ShopHeader from '@/components/shop/shopheader';
import styles from '@/styles/pagesstyles/shop/myshop/home.module.scss';
import styles2 from '@/styles/pagesstyles/account/profile.module.scss';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import emailjs from '@emailjs/browser';
import {
  Brand,
  Category,
  CustomerServiceReview,
  Product,
  Promo,
  Shop,
  TransactionHeader,
  User,
} from '@/components/interfaces/interfaces';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import {
  ADD_VOUCHER_MUTATION,
  BRANDS_QUERY,
  CATEGORIES_QUERY,
  CREATE_NEW_PRODUCT_MUTATION,
  CREATE_PROMO_MUTATION,
  CREATE_SHOP_MUTATION,
  CUSTOMER_SERVICE_REVIEWS_QUERY,
  DELETE_PROMO_MUTATION,
  GET_CURRENT_USER_SHOP,
  GRAPHQLAPI,
  PROMOS_QUERY,
  SHOPS_QUERY,
  SHOP_PRODUCTS_QUERY,
  SHOP_TOTAL_SALES_QUERY,
  SUBSCRIBED_USERS_QUERY,
  TRANSACTION_HEADERS_QUERY,
  UPDATE_SHOP_STATUS,
  UPDATE_USER_INFORMATION,
  USER_EXCEPT_SELF_QUERY,
  USER_NO_SHOP_QUERY,
  USER_QUERY,
} from '@/util/constant';
import ProductCard from '@/components/productcard';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';
import { ShopSideBar } from '@/components/sidebar/shopsidebar';
import Modal from '@/components/modal/modal';
import { AdminSideBar } from '@/components/sidebar/adminsidebar';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, LinearScale } from 'chart.js';
import { CategoryScale } from 'chart.js';
import {
  BarElement,
  BarController,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';

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

  const [shops, setShops] = useState<Shop[]>();
  const [filterBy, setFilterBy] = useState('All');
  const [shopLimit, setShopLimit] = useState(3);
  const [shopOffset, setShopOffset] = useState(0);

  const [shopCurrentPage, setShopCurrentPage] = useState(1);
  const [shopTotalPage, setShopTotalPage] = useState(0);

  const [openAddShopModal, setOpenAddShopModal] = useState(false);

  const [refresh, setRefresh] = useState(false);

  //Add Voucher
  const [openAddVoucherModal, setOpenAddVoucherModal] = useState(false);

  //Newsletter
  const [openAddNewsLetterModal, setOpenAddNewsLetterModal] = useState(false);

  //Promos
  const [promos, setPromos] = useState<Promo[]>();
  const [openAddPromoModal, setOpenAddPromoModal] = useState(false);

  const closeAddPromoModal = () => {
    setOpenAddPromoModal(false);
  };

  const closeAddNewsLetterModal = () => {
    setOpenAddNewsLetterModal(false);
  };

  const closeOpenAddVoucherModal = () => {
    setOpenAddVoucherModal(false);
  };

  const closeAddShopModal = () => {
    setOpenAddShopModal(false);
  };

  useEffect(() => {
    console.log(token);
  }, []);

  interface UserParameter {
    user: User;
  }
  const UserCard = (props: UserParameter) => {
    const handleBanUserClick = () => {
      console.log('masuk');
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
          console.log(res);
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
        <div className={styles.cardimagecontainer}>
          <img
            src="https://res.cloudinary.com/dmpbgjnrc/image/upload/v1678103779/userplaceholder_bloytq.webp"
            alt=""
            className={styles.cardimage}
          />
        </div>
        <div className={styles.cardidcontainer}>
          <div className={styles.cardid}>{props.user.id}</div>
        </div>
        <div className={styles.cardinformationcontainer}>
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
  interface PromoParameter {
    promo: Promo;
  }
  const PromoCard = (props: PromoParameter) => {
    const handleDeletePromoClick = () => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: DELETE_PROMO_MUTATION,
            variables: {
              promoID: props.promo.id,
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
          refreshComponent();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return (
      <div
        className={`${styles.usercard}
        }`}
      >
        <div className={styles.cardimagecontainer}>
          <img src={props.promo.image} alt="" className={styles.cardimage} />
        </div>
        <div className={styles.cardidcontainer}>
          <div className={styles.cardid}>{props.promo.id}</div>
        </div>
        <div className={styles.cardinformationcontainer}>
          <div className={styles.username}>{props.promo.name}</div>
          <div className={styles.useremail}>{props.promo.description}</div>
        </div>
        <div className={styles.actioncontainer}>
          <button className={styles.banbutton} onClick={handleDeletePromoClick}>
            DELETE
          </button>
        </div>
      </div>
    );
  };

  interface ShopParameter {
    shop: Shop;
  }
  const ShopCard = (props: ShopParameter) => {
    const handleBanUserClick = () => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: UPDATE_SHOP_STATUS,
            variables: {
              shopID: props.shop.id,
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
            query: UPDATE_SHOP_STATUS,
            variables: {
              shopID: props.shop.id,
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
        className={`${styles.shopcard} ${
          props.shop.banned == true ? styles.bannedcard : styles.normalcard
        }`}
      >
        <div className={styles.cardimagecontainer}>
          <img src={props.shop.image} alt="" className={styles.cardimage} />
        </div>
        <div className={styles.cardidcontainer}>
          <div className={styles.cardid}>{props.shop.id}</div>
        </div>
        <div className={styles.cardinformationcontainer}>
          <div className={styles.username}>{props.shop.name}</div>
          <div className={styles.useremail}>{props.shop.description}</div>
        </div>
        <div className={styles.actioncontainer}>
          {props.shop.banned == true && (
            <button
              className={styles.unbanbutton}
              onClick={handleUnbanUserClick}
            >
              UNBAN
            </button>
          )}
          {props.shop.banned == false && (
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
  }, [token, limit, orderBy, filterBy, shopLimit]);

  const handleAddShopClick = () => {
    setOpenAddShopModal(true);
  };

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: SHOPS_QUERY,
          variables: {
            limit: shopLimit,
            offset: shopOffset,
            banned:
              filterBy != 'All' ? (filterBy == 'Banned' ? true : false) : null,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setShops(res.data.data.shops);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [shopTotalPage, shopOffset, refresh]);
  useEffect(() => {
    if (token) {
      console.log(token);
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
          setTotalPage(Math.ceil(res.data.data.users.length / limit));
          setCurrentPage(1);
          setOffset(0);
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .post(
          GRAPHQLAPI,
          {
            query: SHOPS_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          console.log(res);
          setShopTotalPage(Math.ceil(res.data.data.shops.length / limit));
          setShopCurrentPage(1);
          setShopOffset(0);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .post(
          GRAPHQLAPI,
          {
            query: PROMOS_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setPromos(res.data.data.promos);
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
    setShopOffset((shopCurrentPage - 1) * shopLimit);
  }, [shopCurrentPage]);

  const handleShopPrevPageClick = () => {
    if (shopCurrentPage > 1) {
      setShopCurrentPage(shopCurrentPage - 1);
    }
  };
  const handleShopNextPageClick = () => {
    if (shopCurrentPage < shopTotalPage) {
      setShopCurrentPage(shopCurrentPage + 1);
    }
  };

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

  const AddShopModalContent = () => {
    const [shopName, setShopName] = useState('');
    const [shopDescription, setShopDescription] = useState('');
    const [shopImage, setShopImage] = useState('');
    const [shopAboutUs, setShopAboutUs] = useState('');
    const [shopBanner, setShopBanner] = useState('');
    const [selectedUserID, setSelectedUserID] = useState('');
    const [selectedUser, setSelectedUser] = useState<User>();
    const [noShopUsers, setNoShopUsers] = useState<User[]>();

    const [error, setError] = useState('');

    const form = useRef<HTMLFormElement>(null);

    useEffect(() => {
      if (selectedUserID) {
        axios
          .post(
            GRAPHQLAPI,
            {
              query: USER_QUERY,
              variables: {
                id: selectedUserID,
              },
            },
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            },
          )
          .then((res) => {
            setSelectedUser(res.data.data.user);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, [selectedUserID]);

    const handleSubmitAddProductClick = (
      e: React.FormEvent<HTMLFormElement>,
    ) => {
      e.preventDefault();

      if (
        shopName == '' ||
        shopDescription == '' ||
        shopImage == '' ||
        shopAboutUs == '' ||
        shopBanner == '' ||
        selectedUserID == ''
      ) {
        setError('All Fields must be Filled!');
      } else {
        axios
          .post(
            GRAPHQLAPI,
            {
              query: CREATE_SHOP_MUTATION,
              variables: {
                name: shopName,
                description: shopDescription,
                image: shopImage,
                aboutus: shopAboutUs,
                banner: shopBanner,
                userID: selectedUserID,
              },
            },
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            },
          )
          .then((res) => {
            emailjs
              .sendForm(
                'service_dsn89wa',
                'template_0bl2oge',
                form.current!,
                'gM8J9ZjItBS3Hw4je',
              )
              .then(
                (result) => {
                  console.log(result);
                  router.reload();
                },
                (error) => {
                  console.log(error.text);
                },
              );
          })

          .catch((err) => {
            console.log(err);
          });
      }
    };

    useEffect(() => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_NO_SHOP_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setNoShopUsers(res.data.data.noShopUsers);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);

    return (
      <div className={styles.addproductcontainer}>
        <h2>Add New Shop</h2>
        <form
          style={{
            width: '100%',
            paddingBottom: '15px',
          }}
          onSubmit={handleSubmitAddProductClick}
          ref={form}
        >
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              Shop Name
            </span>
            <input
              type="text"
              className={styles.forminputcontainer}
              placeholder="Good Shop"
              value={shopName}
              onChange={(event) => {
                setShopName(event.target.value);
              }}
            />
          </div>
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              Shop Description
            </span>
            <input
              type="text"
              className={styles.forminputcontainer}
              placeholder="Good Quality Shop"
              value={shopDescription}
              onChange={(event) => {
                setShopDescription(event.target.value);
              }}
            />
          </div>
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              {' '}
              Shop Image
            </span>
            <input
              type="text"
              className={styles.forminputcontainer}
              placeholder="https://sampleimage.org"
              value={shopImage}
              onChange={(event) => {
                setShopImage(event.target.value);
              }}
            />
          </div>
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              {' '}
              Shop Banner
            </span>
            <input
              type="text"
              className={styles.forminputcontainer}
              placeholder="https://sampleimage.org"
              value={shopBanner}
              onChange={(event) => {
                setShopBanner(event.target.value);
              }}
            />
          </div>
          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              {' '}
              Shop About Us
            </span>
            <input
              type="text"
              className={styles.forminputcontainer}
              placeholder="About Us"
              value={shopAboutUs}
              onChange={(event) => {
                setShopAboutUs(event.target.value);
              }}
            />
          </div>
          <div className={styles.dropdowncontainer}>
            {' '}
            <select
              style={{
                width: '50%',
                padding: '5px',
                marginTop: '10px',
              }}
              value={selectedUserID}
              className={styles.forminputselection}
              onChange={(event) => {
                setSelectedUserID(event.target.value);
              }}
            >
              {noShopUsers?.map((x) => {
                return <option value={x.id}>{x.name}</option>;
              })}
            </select>
          </div>
          <input
            type="email"
            style={{
              marginBottom: '15px',
              display: 'none',
            }}
            className={styles.formtextinput}
            id="email"
            name="email"
            required
            placeholder="Email Address"
            value={selectedUser?.email}
            formNoValidate
          />
          <input
            type="text"
            style={{
              marginBottom: '15px',
              display: 'none',
            }}
            className={styles.formtextinput}
            id="content"
            name="content"
            required
            placeholder="Email Address"
            value={'You have successfully opened a new shop !'}
            formNoValidate
          />

          <div className={styles.gapcontainer}>
            <span style={{ color: 'red' }}>{error}</span>
            <button className={styles.addbutton}>Add Shop</button>
          </div>
        </form>
      </div>
    );
  };

  const AddVoucherModalContent = () => {
    const [voucherBalance, setVoucherBalance] = useState(0);
    const [error, setError] = useState('');

    const handleSubmitAddVoucherClick = () => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: ADD_VOUCHER_MUTATION,
            variables: {
              balance: voucherBalance,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          if (res.data.data.createVoucher.id != null) {
            alert(
              'Voucher Successfully Created with ID: ' +
                res.data.data.createVoucher.id,
            );
            router.reload();
          } else {
            setError('Unable to create voucher !');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return (
      <div className={styles.addproductcontainer}>
        <h2>Add New Voucher</h2>

        <div className={styles.rowcontainer}>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: '17px',
            }}
          >
            Voucher Balance
          </span>
          <input
            type="number"
            className={styles.forminputcontainer}
            placeholder="Good Shop"
            value={voucherBalance}
            onChange={(event) => {
              setVoucherBalance(Number(event.target.value));
            }}
          />
        </div>

        <div className={styles.gapcontainer}>
          <span style={{ color: 'red' }}>{error != '' ? error : ''}</span>
          <button
            className={styles.addbutton}
            onClick={handleSubmitAddVoucherClick}
          >
            Add Voucher
          </button>
        </div>
      </div>
    );
  };

  const AddNewsLetterModalContent = () => {
    const [subscribedUsers, setSubscribedUsers] = useState<User[]>();

    const [newsLetterContent, setNewsLetterContent] = useState('');
    const [error, setError] = useState('');

    const form = useRef<HTMLFormElement>(null);

    useEffect(() => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: SUBSCRIBED_USERS_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setSubscribedUsers(res.data.data.getSubscribedUsers);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);

    const handleSendNewsLetterClick = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (subscribedUsers) {
        subscribedUsers.map(
          (x) => {
            setTimeout(() => {
              var templateParams = {
                email: x.email,
                content: newsLetterContent,
              };
              emailjs
                .send(
                  'service_dsn89wa',
                  'template_0bl2oge',
                  templateParams,
                  'gM8J9ZjItBS3Hw4je',
                )
                .then(
                  (result) => {
                    console.log(result);
                  },
                  (error) => {
                    console.log(error.text);
                  },
                );
            });
          },
          [1000],
        );
        router.reload();
      }
    };
    return (
      <form
        style={{
          width: '100%',
          paddingBottom: '15px',
        }}
        onSubmit={handleSendNewsLetterClick}
        ref={form}
      >
        <div className={styles.addproductcontainer}>
          <h2>Send Newsletter</h2>

          <div className={styles.rowcontainer}>
            <span
              style={{
                display: 'block',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              News Content
            </span>
            <input
              type="text"
              name="content"
              id="content"
              className={styles.forminputcontainer}
              placeholder="Discount 50 %Only available this wednesday !"
              value={newsLetterContent}
              onChange={(event) => {
                setNewsLetterContent(event.target.value);
              }}
            />
          </div>

          <div className={styles.gapcontainer}>
            <span style={{ color: 'red' }}>{error != '' ? error : ''}</span>
            <button className={styles.addbutton}>Send News</button>
          </div>
        </div>
      </form>
    );
  };

  const AddPromoModalContent = () => {
    const [promoName, setPromoName] = useState('');
    const [promoDescription, setPromoDescription] = useState('');
    const [promoImage, setPromoImage] = useState('');

    const [error, setError] = useState('');

    const handleAddPromoClick = () => {
      setError('');
      if (promoName == '' || promoImage == '' || promoDescription == '') {
        setError('All Fields Must be Filled !');
        return;
      }

      axios
        .post(
          GRAPHQLAPI,
          {
            query: CREATE_PROMO_MUTATION,
            variables: {
              name: promoName,
              description: promoDescription,
              image: promoImage,
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
          refreshComponent();
          closeAddPromoModal();
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return (
      <div className={styles.addproductcontainer}>
        <h2>Add New Promo</h2>

        <div className={styles.rowcontainer}>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: '17px',
            }}
          >
            Promo Name
          </span>
          <input
            type="text"
            className={styles.forminputcontainer}
            placeholder="Buy 1 get 1"
            value={promoName}
            onChange={(event) => {
              setPromoName(event.target.value);
            }}
          />
        </div>
        <div className={styles.rowcontainer}>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: '17px',
            }}
          >
            Promo Description
          </span>
          <input
            type="text"
            className={styles.forminputcontainer}
            placeholder="All Items Buy 1 Get 1!"
            value={promoDescription}
            onChange={(event) => {
              setPromoDescription(event.target.value);
            }}
          />
        </div>
        <div className={styles.rowcontainer}>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: '17px',
            }}
          >
            {' '}
            Promo Image
          </span>
          <input
            type="text"
            className={styles.forminputcontainer}
            placeholder="https://sampleimage.org"
            value={promoImage}
            onChange={(event) => {
              setPromoImage(event.target.value);
            }}
          />
        </div>

        <div className={styles.gapcontainer}>
          <span style={{ color: 'red' }}>{error}</span>
          <button className={styles.addbutton} onClick={handleAddPromoClick}>
            Add Promo
          </button>
        </div>
      </div>
    );
  };

  const [totalConfirmedTransactions, setTotalConfirmedTransactions] =
    useState(0);
  const [totalOpenTransactions, setTotalOpenTransactions] = useState(0);
  const [totalCancelledTransactions, setTotalCancelledTransactions] =
    useState(0);

  const [allTransactions, setAllTransactions] = useState<TransactionHeader[]>(
    [],
  );
  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: TRANSACTION_HEADERS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setAllTransactions(res.data.data.transactionHeaders);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh, token]);

  useEffect(() => {
    if (allTransactions) {
      var confirmed = 0;
      var open = 0;
      var cancelled = 0;
      allTransactions.map((x) => {
        if (x.status == 'Open') {
          open += 1;
        } else if (x.status == 'Cancelled') {
          cancelled += 1;
        } else if (x.status == 'Confirmed') {
          confirmed += 1;
        }
      });
      setTotalConfirmedTransactions(confirmed);
      setTotalCancelledTransactions(cancelled);
      setTotalOpenTransactions(open);
    }
  }, [allTransactions]);

  const [bannedShops, setBannedShops] = useState(0);
  const [bannedUsers, setBannedUsers] = useState(0);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
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
        setAllUsers(res.data.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  useEffect(() => {
    if (shops) {
      var total = 0;
      shops.map((x) => {
        if (x.banned == true) {
          total += 1;
        }
      });

      setBannedShops(total);
    }
  }, [shops]);

  useEffect(() => {
    if (allUsers) {
      var total = 0;
      allUsers.map((x) => {
        if (x.banned == true) {
          total += 1;
        }
      });

      setBannedUsers(total);
    }
  }, [allUsers]);

  //Data visualization
  //Doughnut Chart
  Chart.register(ArcElement);
  Chart.register(ChartDataLabels);
  const doughnutData = {
    labels: [
      'Open Transactions',
      'Confirmed Transactions',
      'Cancelled Transaction',
    ],
    datasets: [
      {
        label: 'Transactions',

        data: [
          totalOpenTransactions,
          totalConfirmedTransactions,
          totalCancelledTransactions,
        ],
        backgroundColor: ['blue', 'green', 'red'],
        hoverOffset: 4,
      },
    ],
  };

  //Barchart
  Chart.register(CategoryScale, LinearScale, BarElement);
  const labels = ['Banned Users', 'Banned Shops'];
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total',

        data: [bannedUsers, bannedShops],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)'],
        borderWidth: 1,
      },
    ],
  };

  //Customer Review
  const [customerServiceReviews, setCustomerServiceReviews] =
    useState<CustomerServiceReview[]>();

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: CUSTOMER_SERVICE_REVIEWS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setCustomerServiceReviews(res.data.data.customerServiceReviews);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  interface CustomerServiceCardParameter {
    customerServiceReview: CustomerServiceReview;
  }
  const CustomerServiceReviewCard = (props: CustomerServiceCardParameter) => {
    return (
      <div className={styles2.cardcontainer}>
        <div className={styles2.infocontainer}>
          <div className={styles2.namecontainer}>
            Customer Name: {props.customerServiceReview.user.name}
          </div>
        </div>
        <div className={styles2.ratingcontainer}>
          <span className={styles2.ratinglabel}>
            {props.customerServiceReview.rating}
          </span>{' '}
          / 5 Eggs
        </div>

        <div className={styles2.commentcontainer}>
          <div
            style={{
              fontSize: '15px',
            }}
          >
            Comments:{' '}
          </div>
          <div>{props.customerServiceReview.title}</div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className={styles.maincontainer}>
        <div className={styles.pagedivider}>
          <AdminSideBar />
          <div className={styles.rightsection}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                height: 'fit-content',
                rowGap: '100px',
                marginBottom: '50px',
              }}
            >
              <div
                style={{
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  rowGap: '20px',
                }}
              >
                <Doughnut
                  data={doughnutData}
                  options={{
                    plugins: {
                      datalabels: {
                        labels: {
                          value: {},
                          title: {
                            color: 'white',
                          },
                        },
                      },
                    },
                  }}
                />
                Blue: Pending | Green: Confirmed | Red: Cancelled - Transactions
              </div>

              <div
                style={{
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {' '}
                <Bar data={data} />
              </div>
            </div>

            <div className={styles.flexbetween}>
              <h2>Admin Utility</h2>
            </div>
            <div className={styles.productcardcontainer}>
              <button
                onClick={() => {
                  setOpenAddVoucherModal(true);
                }}
                style={{
                  height: '100px',
                  fontSize: '20px',
                }}
              >
                Add New Voucher
              </button>

              <button
                onClick={() => {
                  setOpenAddNewsLetterModal(true);
                }}
                style={{
                  height: '100px',
                  fontSize: '20px',
                }}
              >
                Send Newsletter
              </button>
            </div>
            <div className={styles.flexbetween}>
              <h2>Manage Promo Carousel</h2>
              <button
                className={styles.addbutton}
                onClick={() => {
                  setOpenAddPromoModal(true);
                }}
              >
                Add Promos
              </button>
            </div>
            <div className={styles.productcardcontainer}>
              {promos?.map((promo) => {
                return <PromoCard promo={promo} key={promo.id} />;
              })}
            </div>
            <div className={styles.productcardcontainer}></div>
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
                  return <UserCard user={user} key={user.id} />;
                })}
            </div>
            <div>
              <h2>Manage Shops</h2>
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
                      <b>Page</b> {shopCurrentPage + '/' + shopTotalPage}{' '}
                    </div>
                    {shopTotalPage > 1 && (
                      <div>
                        {' '}
                        <button
                          onClick={handleShopPrevPageClick}
                          style={{
                            display: 'inline',
                          }}
                          className={styles.changepagebutton}
                        >
                          <FaAngleLeft />
                        </button>
                        <button
                          onClick={handleShopNextPageClick}
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
              <div className={styles.filtercontainer}>
                <div className={styles.filtersubcontainer}>
                  <div className={styles.orderBycontainer}>
                    <b>Filter By:</b>
                    <select
                      value={filterBy}
                      className={styles.forminputselection}
                      onChange={(event) => {
                        setFilterBy(event.target.value);
                      }}
                    >
                      <option value="All">All</option>
                      <option value="Banned">Banned</option>
                      <option value="Unbanned">Unbanned</option>
                    </select>
                  </div>
                </div>
                <div className={styles.filtersubcontainer}>
                  <button onClick={handleAddShopClick}>Add New Shop</button>
                </div>
              </div>

              <div className={styles.productcardcontainer}>
                {shops?.map((shop) => {
                  return <ShopCard shop={shop} key={shop.id} />;
                })}
              </div>
            </div>
            <div
              style={{
                marginTop: ' 20px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h2>Customer Service Reviews</h2>
              {customerServiceReviews?.map((x) => {
                return (
                  <CustomerServiceReviewCard
                    customerServiceReview={x}
                    key={x.id}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {openAddShopModal && (
        <Modal closeModal={closeAddShopModal} height={50} width={50}>
          <AddShopModalContent />
        </Modal>
      )}
      {openAddVoucherModal && (
        <Modal closeModal={closeOpenAddVoucherModal} height={50} width={50}>
          <AddVoucherModalContent />
        </Modal>
      )}
      {openAddNewsLetterModal && (
        <Modal closeModal={closeAddNewsLetterModal} height={50} width={50}>
          <AddNewsLetterModalContent />
        </Modal>
      )}
      {openAddPromoModal && (
        <Modal closeModal={closeAddPromoModal} height={50} width={50}>
          <AddPromoModalContent />
        </Modal>
      )}
    </Layout>
  );
}
