import styles from '@/styles/componentstyles/navbar.module.css';
import {
  CATEGORIES_QUERY,
  CURRENT_USER_QUERY,
  GRAPHQLAPI,
  SEARCH_PRODUCTS_QUERY,
  USER_CART_QUERY,
  USER_NOTIFICATIONS_QUERY,
} from '@/util/constant';
import { links } from '@/util/route';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { NAME_SPLITTER } from './converter/converter';
import {
  Cart,
  Category,
  Notification,
  Product,
  User,
} from './interfaces/interfaces';
import LocationCard from './navbar/locationcard';

import { FaBell } from 'react-icons/fa';

export default function Navbar() {
  const [token, setToken] = useSessionStorage('token', '');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInformation, setUserInformation] = useState('');
  const [search, setSearch] = useState('');
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [carts, setCarts] = useState<Cart[]>();
  const [user, setUser] = useState<User>();

  const [searchResult, setSearchResult] = useState<Product[]>();

  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);

  const [categories, setCategories] = useState<Category[]>();

  useEffect(() => {
    if (token == '') {
      setUserInformation('Sign In / Register');
    } else {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: CURRENT_USER_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          if (res.data.data.getCurrentUser.name != null) {
            // if(NAME_SPLITTER(res.data.data.getCurrentUser.name) != null){
            //   var name = NAME_SPLITTER(res.data.data.getCurrentUser.name)
            //   setUserInformation(name[0])
            // }
            setUserInformation(res.data.data.getCurrentUser.name);
            setUser(res.data.data.getCurrentUser);
          }
        })

        .catch((err) => console.log(err));

      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_CART_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setCarts(res.data.data.carts);
        })

        .catch((err) => console.log(err));

      axios
        .post(
          GRAPHQLAPI,
          {
            query: CATEGORIES_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setCategories(res.data.data.categories);
        })

        .catch((err) => console.log(err));
    }
  }, [token]);

  useEffect(() => {
    var total: number = 0;
    if (carts) {
      carts.map((x) => {
        total +=
          (x.product.price - (x.product.price * x.product.discount) / 100) *
          x.quantity;
      });
      setCartTotalPrice(total);
    }
  }, [carts]);

  useEffect(() => {
    if (search != '') {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: SEARCH_PRODUCTS_QUERY,
            variables: {
              limit: 5,
              keyword: search,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setSearchResult(res.data.data.products);
        })

        .catch((err) => console.log(err));
    } else {
      setSearchResult([]);
    }
  }, [search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    console.log(event.target.value);
  };

  const showToken = () => {
    console.log(token);
  };

  useEffect(() => {
    if (token == '') {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [token]);

  const handleUserClick = () => {
    if (loggedIn) {
    } else {
      Router.push('/login');
    }
  };

  //Notification
  const [openNotificationDropdown, setOpenNotificationDropdown] =
    useState(false);

  const [userNotifications, setUserNotifications] = useState<Notification[]>(
    [],
  );

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_NOTIFICATIONS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setUserNotifications(res.data.data.userNotifications);
      })

      .catch((err) => console.log(err));
  }, []);
  return (
    <nav>
      <div className={styles.navbarcontainer}>
        <div
          className={styles.hamburgercontainer}
          onClick={() => {
            setOpenCategoryDropdown(!openCategoryDropdown);
          }}
        >
          <div className={styles.hamburgercomponent}></div>
          <div className={styles.hamburgercomponent}></div>
          <div className={styles.hamburgercomponent}></div>
          {openCategoryDropdown && (
            <div className={styles.categorydropdown}>
              <h2>Categories</h2>

              {categories?.map((x) => {
                return (
                  <div style={{ marginTop: '15px', zIndex: '1000' }}>
                    {x.name}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className={styles.hamburgerresponsivecontainer}>
          <div className={styles.hamburgerresponsivecomponent}></div>
          <div className={styles.hamburgercomponent}></div>
          <div className={styles.hamburgercomponent}></div>
        </div>
        <Link href={links.home}>
          <Image
            alt="Logo"
            src="/asset/logo.svg"
            width={120}
            height={40}
            onClick={showToken}
          />
        </Link>
        <i
          className={`${styles.locationcontainer} "fas fa-map-marker-alt" `}
          style={{
            fontSize: '30px',
            color: 'wheat',
          }}
        ></i>

        <form
          action={links.search()}
          style={{
            width: '40%',
            display: 'flex',
          }}
        >
          <div className={styles.searchbarcontainer}>
            <input
              type="text"
              placeholder="Search.."
              name="search"
              defaultValue={search ? search : ''}
              id="search"
              className={styles.navbarsearch}
              value={search}
              onChange={handleSearchChange}
            />
            <button type="submit" className={styles.navbarsearchbutton}>
              <i className="fa fa-search" style={{ fontSize: '20px' }}></i>
            </button>
            <div className={styles.searchresultcontainer}>
              {searchResult?.map((x) => {
                return (
                  <Link href={links.productDetail(x.id)} passHref>
                    <div
                      className={styles.searchresultcard}
                      onClick={() => {
                        links.productDetail(x.id);
                      }}
                    >
                      <div className={styles.searchresultimagecontainer}>
                        <img
                          src={x.image}
                          alt=""
                          className={styles.searchresultimage}
                        />
                      </div>
                      <div className={styles.searchresultinfocontainer}>
                        <div
                          style={{
                            fontWeight: 'bold',
                          }}
                        >
                          {x.name}
                        </div>
                        <div>{x.brand.name}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </form>

        <i
          className={`${styles.locationcontainer} "fa fa-bell" `}
          style={{
            fontSize: '30px',
            color: 'wheat',
          }}
        >
          {user && <LocationCard />}
        </i>
        <div className={styles.iconcontainer}>
          <FaBell
            fontSize={25}
            className={styles.bellicon}
            onClick={() => {
              setOpenNotificationDropdown(!openNotificationDropdown);
            }}
          />
          {openNotificationDropdown && (
            <div className={styles.notificationcontainer}>
              {userNotifications.map((x) => {
                return (
                  <div className={styles.notificationitem}>
                    <div className={styles.notificationtitle}>{x.title}</div>
                    <div className={styles.notificationcontent}>
                      {x.content}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className={styles.usercontainer}
          onClick={() => {
            handleUserClick();
          }}
        >
          <div className={styles.usericon}>
            <i className="fa fa-user"></i>
          </div>
          <div className={styles.userinformation}>
            <div style={{ color: 'gray' }}>Welcome</div>
            <div>
              <b>{userInformation}</b>
            </div>
          </div>
        </div>

        <div className={styles.returnsandordercontainer}>
          <div style={{ color: 'gray' }}>Returns</div>
          <div style={{}}>{/* <b>& Orders</b> */}</div>
        </div>
        <Link href={links.cart}>
          <div className={styles.cartcontainer}>
            <i
              className="fa fa-shopping-cart"
              style={{
                fontSize: '1.7em',
              }}
            ></i>
            <span>${cartTotalPrice}</span>
          </div>
        </Link>
      </div>
      <div className={styles.navbarsecondarycontainer}>
        <form
          action="/action_page.php"
          style={{
            width: '100%',
            display: 'flex',
          }}
        >
          <div className={styles.secondarysearchbarcontainer}>
            <input
              type="text"
              placeholder="Search.."
              name="search"
              className={styles.secondarynavbarsearch}
              value={search}
              onChange={handleSearchChange}
            />
            {/* <button type="submit" className={styles.secondarynavbarsearchbutton}>
              <i className="fa fa-search" style={{ fontSize: '20px' }}></i>
            </button> */}
          </div>
        </form>
      </div>
    </nav>
  );
}
