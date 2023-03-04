import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import React, { useEffect, useState } from 'react';
// import styles from '@/styles/home.module.css';
import Link from 'next/link';
import { links } from '@/util/route';
import axios from 'axios';
import {
  CURRENT_USER_QUERY,
  GET_CURRENT_USER_SHOP,
  GRAPHQLAPI,
  LOGIN_QUERY,
  UPDATE_SHOP_INFORMATION,
  USER_QUERY,
  USER_UPDATE_PASSWORD_MUTATION,
  USER_UPDATE_PHONE_MUTATION,
} from '@/util/constant';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useSessionStorage } from 'usehooks-ts';
import Router, { useRouter } from 'next/router';
import styles from '@/styles/pagesstyles/account/mobilephone.module.scss';
import { phone } from 'phone';
import { ClipLoader } from 'react-spinners';
import { Shop } from '@/components/interfaces/interfaces';

export default function UpdatePassword() {
  const [token, setToken] = useSessionStorage('token', '');

  const [error, setError] = useState('');
  const [shop, setShop] = useState<Shop>();
  const [currentShopName, setCurrentShopName] = useState('');
  const [currentShopDescription, setCurrentShopDescription] = useState('');
  const [currentShopAboutUs, setCurrentShopAboutUs] = useState('');
  const [currentShopImage, setCurrentShopImage] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: GET_CURRENT_USER_SHOP,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setShop(res.data.data.getUserShop);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Router.push('/login');
    }
  }, [token]);

  useEffect(() => {
    if (shop) {
      setCurrentShopName(shop.name);
      setCurrentShopDescription(shop.description);
      setCurrentShopAboutUs(shop.aboutus);
      setCurrentShopImage(shop.image);
    }
  }, [shop]);

  const handleCurrentNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentShopName(event.target.value);
  };

  const handleCurrentDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentShopDescription(event.target.value);
  };
  const handleCurrentAboutUsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentShopAboutUs(event.target.value);
  };
  const handleCurrentImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentShopImage(event.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    if (
      currentShopImage == '' ||
      currentShopName == '' ||
      currentShopDescription == '' ||
      currentShopAboutUs == ''
    ) {
      setError('All Fields must be Filled !');
      return;
    } else {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: UPDATE_SHOP_INFORMATION,
            variables: {
              shopID: shop?.id,
              aboutUs: currentShopAboutUs,
              description: currentShopDescription,
              image: currentShopImage,
              name: currentShopName,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          res.data.data.updateShop.id;
          Router.reload();
        })
        .catch((err) => {
          setError(
            'Unable to update shop information ! Please try again later...',
          );
        });
    }
  };

  return (
    <>
      <Head>
        <title>Update Information</title>
        <meta
          name="description"
          content="TypeScript starter for Next.js that includes all you need to build amazing apps"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main} ${styles.centermain}`}>
        <div className={styles.pagecontainer}>
          <div className={styles.formcontainer}>
            <Image alt="Logo" src="/asset/logo.svg" width={170} height={70} />
            <h3
              style={{
                padding: 0,
                margin: 0,
              }}
            >
              Shop Information
            </h3>

            <form
              action=""
              style={{
                width: '100%',
                paddingBottom: '15px',
              }}
              onSubmit={handleSubmit}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '10px',
                }}
              >
                <div className={styles.shopprofile}>
                  <img
                    src={shop?.image}
                    alt=""
                    className={styles.profileimage}
                  />
                </div>

                <span>Shop Profile Picture</span>
                <input
                  type="text"
                  className={styles.formtextinput}
                  style={{
                    width: '100%',
                  }}
                  placeholder="https://sampleimage.com"
                  id="currentimage"
                  name="currentimage"
                  value={currentShopImage}
                  onChange={handleCurrentImageChange}
                />

                <span>Shop Name</span>
                <input
                  type="text"
                  className={styles.formtextinput}
                  style={{
                    width: '100%',
                  }}
                  placeholder="NewEggShop"
                  id="currentname"
                  name="currentname"
                  value={currentShopName}
                  onChange={handleCurrentNameChange}
                />

                <span>About Us</span>
                <input
                  type="text"
                  className={styles.formtextinput}
                  style={{
                    width: '100%',
                  }}
                  placeholder="About Us"
                  id="aboutus"
                  name="aboutus"
                  value={currentShopAboutUs}
                  onChange={handleCurrentAboutUsChange}
                />

                <span>Additional Shop Information</span>
                <input
                  type="text"
                  className={styles.formtextinput}
                  style={{
                    width: '100%',
                  }}
                  placeholder="About Us"
                  id="description"
                  name="description"
                  value={currentShopDescription}
                  onChange={handleCurrentDescriptionChange}
                />
              </div>

              {error != '' && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '15px',
                    color: 'red',
                  }}
                >
                  {error}
                </div>
              )}

              <button
                className={`${styles.formbutton} ${styles.themeaccent} ${styles.buttonpaddingvertical}`}
                onClick={handleSubmit}
              >
                {loading ? <ClipLoader size={20} /> : 'SAVE CHANGES'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
