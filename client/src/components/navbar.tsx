import styles from '@/styles/componentstyles/navbar.module.css';
import {
  CURRENT_USER_QUERY,
  GRAPHQLAPI,
  USER_CART_QUERY,
} from '@/util/constant';
import { links } from '@/util/route';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { NAME_SPLITTER } from './converter/converter';
import { Cart, User } from './interfaces/interfaces';
import LocationCard from './navbar/locationcard';

export default function Navbar() {
  const [token, setToken] = useSessionStorage('token', '');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInformation, setUserInformation] = useState('');
  const [search, setSearch] = useState('');
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [carts, setCarts] = useState<Cart[]>();
  const [user, setUser] = useState<User>();

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
  return (
    <nav>
      <div className={styles.navbarcontainer}>
        <div className={styles.hamburgercontainer}>
          <div className={styles.hamburgercomponent}></div>
          <div className={styles.hamburgercomponent}></div>
          <div className={styles.hamburgercomponent}></div>
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
