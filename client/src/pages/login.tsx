import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import React, { useState } from 'react';
import styles from '@/styles/home.module.scss';
import Link from 'next/link';
import { links } from '@/util/route';
import axios from 'axios';
import { GRAPHQLAPI, LOGIN_QUERY, USER_QUERY } from '@/util/constant';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useSessionStorage } from 'usehooks-ts';
import Router, { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailExist, setIsEmailExist] = useState(false);
  const [nextPrompt, setNextPrompt] = useState(false);
  const [loginInvalid, setLoginInvalid] = useState(false);
  const [token, setToken] = useSessionStorage('token', '');

  const handleEmailContainerClick = () => {
    setNextPrompt(false);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!nextPrompt) {
      axios
        .post(GRAPHQLAPI, {
          query: USER_QUERY,
          variables: {
            email: email,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.data.user == null) {
            setIsEmailExist(true);
            return;
          } else {
            setIsEmailExist(false);
            setNextPrompt(true);
          }
        })
        .catch(() => {
          console.log('Error');
        });
    } else {
      axios
        .post(GRAPHQLAPI, {
          query: LOGIN_QUERY,
          variables: {
            email: email,
            password: password,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.data.auth == null) {
            setLoginInvalid(true);
            return;
          } else {
            setLoginInvalid(false);
            setToken(res.data.data.auth.login.token);
            Router.push('/');
          }
        })
        .catch(() => {
          console.log('Error');
        });
    }
  };
  return (
    <>
      <Head>
        <title>OldEgg Sign In</title>
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
            <h3 className="centered-text">Sign In</h3>

            <form
              action=""
              style={{
                width: '100%',
                paddingBottom: '15px',
              }}
              onSubmit={handleSubmit}
            >
              {!nextPrompt && (
                <input
                  type="email"
                  style={{
                    marginBottom: '15px',
                  }}
                  className={styles.formtextinput}
                  id="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                />
              )}
              {nextPrompt && (
                <div className={styles.formcontainer}>
                  <div
                    className={styles.loginemailcontainer}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      columnGap: '0.6em',
                    }}
                    onClick={handleEmailContainerClick}
                  >
                    <div>
                      <FaArrowCircleLeft />
                    </div>
                    <div
                      style={{
                        paddingBottom: '1em',
                      }}
                    >
                      {email}
                    </div>
                  </div>
                  <input
                    type="password"
                    className={styles.formtextinput}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    style={{ marginBottom: '0.5em' }}
                    onChange={handlePasswordChange}
                  />
                  {loginInvalid && (
                    <div
                      className={styles.errorMessage}
                      style={{ paddingBottom: '1em' }}
                    >
                      The email and password do not match, please try again or
                      click here to reset.
                    </div>
                  )}
                </div>
              )}

              {isEmailExist && (
                <h4
                  className={styles.errorMessage}
                  style={{
                    textAlign: 'center',
                    paddingBottom: '1em',
                  }}
                >
                  We didn't find an account for this email address
                </h4>
              )}

              <button
                className={`${styles.formbutton} ${styles.themeaccent}`}
                onClick={handleSubmit}
              >
                SIGN IN
              </button>
            </form>

            <button className={styles.formbutton}>
              GET ONE-TIME SIGN IN CODE
            </button>
            <h4 className={`${styles.nopadding} ${styles.nomargin}`}>
              <u>What's the One-Time Code?</u>
            </h4>
            <h4 className={`${styles.nopadding} ${styles.nomargin}`}>
              New to Newegg?{' '}
              <Link href={links.signup}>
                <u>Sign Up</u>
              </Link>
            </h4>

            <button className={styles.formbutton}>SIGN IN WITH GOOGLE</button>
            <button className={styles.formbutton}>SIGN IN WITH APPLE</button>
          </div>
        </div>
      </main>
    </>
  );
}
