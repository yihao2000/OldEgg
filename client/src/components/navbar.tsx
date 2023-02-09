import styles from '@/styles/componentstyles/navbar.module.css';
import { links } from '@/util/route';
import Image from 'next/image';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';

export default function Navbar() {
  const [token, setToken] = useSessionStorage('token', '');
  const [loggedIn, setLoggedIn] = useState(false);
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
    <nav className={styles.navbarcontainer}>
      <div className={styles.hamburgercontainer}>
        <div className={styles.hamburgercomponent}></div>
        <div className={styles.hamburgercomponent}></div>
        <div className={styles.hamburgercomponent}></div>
      </div>
      <Image
        alt="Logo"
        src="/asset/logo.svg"
        width={120}
        height={40}
        onClick={showToken}
      />
      <i
        className="fas fa-map-marker-alt"
        style={{
          fontSize: '30px',
          color: 'wheat',
        }}
      ></i>

      <form
        action="/action_page.php"
        style={{
          width: '30%',
          display: 'flex',
        }}
      >
        <input
          type="text"
          placeholder="Search.."
          name="search"
          className={styles.navbarsearch}
        />
        <button type="submit">
          <i className="fa fa-search"></i>
        </button>
      </form>

      <i
        className="fa fa-bell"
        style={{
          fontSize: '30px',
          color: 'wheat',
        }}
      ></i>

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
            <b>{token == '' ? 'Sign In / Register' : ''}</b>
          </div>
        </div>
      </div>

      <div className={styles.returnsandordercontainer}>
        <div style={{ color: 'gray' }}>Returns</div>
        <div style={{}}>
          <b>& Orders</b>
        </div>
      </div>

      <div className={styles.cartcontainer}>
        <i
          className="fa fa-shopping-cart"
          style={{
            fontSize: '1.7em',
          }}
        ></i>
      </div>
    </nav>
  );
}
