import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import styles from '@/styles/home.module.scss';
import Link from 'next/link';
import { links } from '@/util/route';
import axios from 'axios';
import {
  CURRENT_USER_QUERY,
  GENERATE_TWOFACTOR_CODE,
  GRAPHQLAPI,
  INSERT_USER_VERIFICATION_CODE,
  LOGIN_QUERY,
  USER_QUERY,
  VALIDATE_TWOFACTOR_CODE,
  VALIDATE_USER_VERIFICATION_CODE,
} from '@/util/constant';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useSessionStorage } from 'usehooks-ts';
import Router, { useRouter } from 'next/router';
import emailjs from '@emailjs/browser';
import { v4 } from 'uuid';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailExist, setIsEmailExist] = useState(false);
  const [nextPrompt, setNextPrompt] = useState(false);
  const [loginInvalid, setLoginInvalid] = useState(false);
  const [token, setToken] = useSessionStorage('token', '');

  const [verificationCode, setVerificationCode] = useState('');
  const [emailRegistered, setEmailRegistered] = useState(false);
  const [generateVerificationCode, setGenerateVerificationCode] =
    useState(false);
  const [verificationCodePrompt, setVerificationCodePrompt] = useState(false);
  const [inputtedVerificationCode, setInputtedVerificationCode] = useState('');
  const [verificationCodeInvalid, setVerificationCodeInvalid] = useState(false);

  const [oneTimeCodeEnabled, setOneTimeCodeEnabled] = useState(true);
  const [verificationCodeError, setVerificationCodeError] = useState(false);

  const [bannedError, setBannedError] = useState(false);

  const [twoFactorAuthentication, setTwoFactorAuthentication] = useState(false);

  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [inputtedTwoFactorCode, setInputtedTwoFactorCode] = useState('');
  const [tempId, setTempId] = useState('');
  const [tempToken, setTempToken] = useState('');

  const form = useRef<HTMLFormElement>(null);
  const sendVerificationCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(GRAPHQLAPI, {
        query: USER_QUERY,
        variables: {
          email: email,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.data.user != null) {
          setEmailRegistered(true);

          axios
            .post(GRAPHQLAPI, {
              query: INSERT_USER_VERIFICATION_CODE,
              variables: {
                email: email,
                verificationcode: verificationCode,
                duration: 15,
              },
            })
            .then((res) => {
              res.data.data.userInputVerificationCode.id;
              setVerificationCodePrompt(true);
              setVerificationCodeError(false);
              emailjs
                .sendForm(
                  'service_dsn89wa',
                  'template_upusifi',
                  form.current!,
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
            })
            .catch((err) => {
              setVerificationCodeError(true);
            });
        }
      })
      .catch(() => {
        console.log('Error');
      });
  };

  const handleInputtedVerificationCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputtedVerificationCode(event.target.value);
  };

  const handleEmailContainerClick = () => {
    setNextPrompt(false);
    setVerificationCodePrompt(false);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    setVerificationCode(v4().slice(0, 6));
  }, [generateVerificationCode]);

  const generateTwoFactorAuthenticationCode = (email: string, id: string) => {
    var twoFactorCode = v4().slice(0, 6);
    setTwoFactorCode(twoFactorCode);
    var templateParams = {
      code: twoFactorCode,
      email: email,
    };
    emailjs
      .send(
        'service_dsn89wa',
        'template_upusifi',
        templateParams,
        'gM8J9ZjItBS3Hw4je',
      )
      .then(
        function (response) {
          console.log('SUCCESS!', response.status, response.text);
        },
        function (error) {
          console.log('FAILED...', error);
        },
      );

    axios
      .post(GRAPHQLAPI, {
        query: GENERATE_TWOFACTOR_CODE,
        variables: {
          userID: id,
          twoFactorCode: twoFactorCode,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch(() => {
        console.log('Error');
      });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setBannedError(false);

    if (!nextPrompt && !verificationCodePrompt) {
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
    } else if (nextPrompt) {
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
            logUser(res.data.data.auth.login.token);
          }
        })
        .catch(() => {
          console.log('Error');
        });
    } else {
      axios
        .post(GRAPHQLAPI, {
          query: VALIDATE_USER_VERIFICATION_CODE,
          variables: {
            email: email,
            verificationcode: inputtedVerificationCode,
          },
        })
        .then((res) => {
          if (res.data.data.validateUserVerificationCode.token) {
            setVerificationCodeInvalid(false);
            logUser(res.data.data.validateUserVerificationCode.token);
          } else {
            setVerificationCodeInvalid(true);
          }
        })
        .catch(() => {
          console.log('Error');
        });
    }
  };

  const validateTwoFactorCode = () => {
    axios
      .post(GRAPHQLAPI, {
        query: VALIDATE_TWOFACTOR_CODE,
        variables: {
          userID: tempId,
          twoFactorCode: inputtedTwoFactorCode,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.data.validateTwoFactorCode == true) {
          setToken(tempToken);
          Router.push('/');
        }
      })
      .catch(() => {
        console.log('Error');
      });
  };

  const logUser = (token: string) => {
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
        if (res.data.data.getCurrentUser.banned == false) {
          if (res.data.data.getCurrentUser.twoFactorEnabled == true) {
            setTwoFactorAuthentication(true);
            setTempId(res.data.data.getCurrentUser.id);
            setTempToken(token);
            generateTwoFactorAuthenticationCode(
              res.data.data.getCurrentUser.email,
              res.data.data.getCurrentUser.id,
            );
          } else {
            setToken(token);
            if (res.data.data.getCurrentUser.role == 'Admin') {
              Router.push('/admin/home');
            }

            Router.push('/');
          }
        } else {
          setBannedError(true);
        }
      });
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
              {!nextPrompt &&
                !verificationCodePrompt &&
                !twoFactorAuthentication && (
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
              {nextPrompt && !twoFactorAuthentication && (
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

              {verificationCodePrompt && !twoFactorAuthentication && (
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
                    type="text"
                    className={styles.formtextinput}
                    id="verificationcode"
                    name="verificationcode"
                    placeholder="Verification Code"
                    value={inputtedVerificationCode}
                    style={{ marginBottom: '0.5em' }}
                    onChange={handleInputtedVerificationCodeChange}
                  />
                  {verificationCodeInvalid && (
                    <div
                      className={styles.errorMessage}
                      style={{ paddingBottom: '1em' }}
                    >
                      Invalid Verification Code !
                    </div>
                  )}
                </div>
              )}

              {twoFactorAuthentication && (
                <div className={styles.formcontainer}>
                  <div
                    className={styles.loginemailcontainer}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      columnGap: '0.6em',
                    }}
                  ></div>
                  <input
                    type="text"
                    className={styles.formtextinput}
                    placeholder="Verification Code"
                    value={inputtedTwoFactorCode}
                    style={{ marginBottom: '0.5em' }}
                    onChange={(event) => {
                      setInputtedTwoFactorCode(event.target.value);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      validateTwoFactorCode();
                    }}
                  >
                    Log In
                  </button>
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
              {bannedError && (
                <h4
                  className={styles.errorMessage}
                  style={{
                    textAlign: 'center',
                    paddingBottom: '1em',
                  }}
                >
                  User is Banned !
                </h4>
              )}
              {!twoFactorAuthentication && (
                <button
                  className={`${styles.formbutton} ${styles.themeaccent}`}
                  onClick={handleSubmit}
                >
                  SIGN IN
                </button>
              )}
            </form>

            <form onSubmit={sendVerificationCode} ref={form}>
              <input
                type="text"
                name="email"
                defaultValue={email}
                style={{
                  display: 'none',
                }}
              />
              <input
                type="text"
                defaultValue={verificationCode}
                style={{
                  display: 'none',
                }}
                name="code"
              />
              {oneTimeCodeEnabled && !twoFactorAuthentication && (
                <button className={styles.formbutton}>
                  GET ONE-TIME SIGN IN CODE
                </button>
              )}
              {oneTimeCodeEnabled && !twoFactorAuthentication && (
                <a
                  href="/forgotpassword"
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px',
                  }}
                >
                  Forgot Password ?
                </a>
              )}
              {verificationCodeError && (
                <div style={{ marginTop: '20px', color: 'red' }}>
                  Unable to request another code yet ! Please wait 2 minutes
                </div>
              )}
            </form>
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
