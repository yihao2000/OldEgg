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
  GRAPHQLAPI,
  LOGIN_QUERY,
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

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useSessionStorage('token', '');

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  const [error, setError] = useState(false);

  const [phoneCode, setPhoneCode] = useState('62');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: CURRENT_USER_QUERY,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          console.log(res.data.data.getCurrentUser);
        })
        .catch(() => {
          Router.push('/login');
        });
    } else {
      Router.push('/login');
    }
  }, [token]);

  const validatePhoneValid = (param: string) => {
    return phone(param).isValid;
  };

  const handleCurrentPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewPassword(event.target.value);
  };

  const validatePasswordValid = () => {
    var regexp = new RegExp(
      /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/,
    );

    if (newPassword.match(regexp)) {
      return true;
    }

    return false;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (currentPassword == '' && newPasswordError == '') {
      setCurrentPasswordError('This field is required.');
      setNewPasswordError('This field is required.');
      return;
    }

    if (!validatePasswordValid()) {
      setNewPasswordError('Invalid password format !');
    }

    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_UPDATE_PASSWORD_MUTATION,
          variables: {
            currentPassword: currentPassword,
            newPassword: newPassword,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setLoading(true);
        setTimeout(() => {
          setCurrentPassword('');
          setNewPassword('');
          setLoading(false);
          console.log(res.data.data.userUpdateInformation.id);

          setError(false);
          alert('Successfully update password !');
          Router.push('/account/settings');
        }, 3000);
      })
      .catch((error) => {
        setError(true);
      });
  };

  return (
    <>
      <Head>
        <title>Update Password</title>
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
              Change Your Password
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
                <input
                  type="password"
                  className={styles.formtextinput}
                  style={{
                    width: '100%',
                  }}
                  placeholder="Current Password"
                  id="currentpassword"
                  name="currentpassword"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                />
                {currentPasswordError != '' && (
                  <div
                    className={`${styles.itemendcontainer} ${styles.errorMessage}`}
                  >
                    {currentPasswordError}
                  </div>
                )}

                <input
                  type="password"
                  className={styles.formtextinput}
                  style={{
                    width: '100%',
                  }}
                  placeholder="New Password"
                  id="newpassword"
                  name="newpassword"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />

                {newPasswordError != '' && (
                  <div
                    className={`${styles.itemendcontainer} ${styles.errorMessage}`}
                  >
                    {newPasswordError}
                  </div>
                )}
              </div>

              {error && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '15px',
                    color: 'red',
                  }}
                >
                  Invalid Current Password !
                </div>
              )}

              <button
                className={`${styles.formbutton} ${styles.themeaccent} ${styles.buttonpaddingvertical}`}
                onClick={handleSubmit}
              >
                {loading ? <ClipLoader size={20} /> : 'SAVE CHANGES'}
              </button>

              <h4
                style={{
                  fontWeight: 'normal',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                Need Help?
                <a
                  href=""
                  style={{
                    paddingLeft: '5px',
                  }}
                >
                  <u>
                    <b> Contact Customer Service</b>{' '}
                  </u>
                </a>
              </h4>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
