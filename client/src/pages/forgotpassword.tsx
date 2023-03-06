import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import styles from '@/styles/home.module.scss';
import Link from 'next/link';
import { links } from '@/util/route';
import axios from 'axios';
import {
  GRAPHQLAPI,
  INSERT_USER_VERIFICATION_CODE,
  LOGIN_QUERY,
  USER_QUERY,
  USER_UPDATE_FORGOTTEN_PASSWORD_MUTATION,
  USER_UPDATE_PASSWORD_MUTATION,
  VALIDATE_USER_VERIFICATION_CODE,
} from '@/util/constant';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useSessionStorage } from 'usehooks-ts';
import Router, { useRouter } from 'next/router';
import emailjs from '@emailjs/browser';
import { v4 } from 'uuid';

export default function Login() {
  const [email, setEmail] = useState('');
  const [inputtedVerificationCode, setInputtedVerificationCode] = useState('');
  const [isEmailExist, setIsEmailExist] = useState(false);
  const [nextPrompt, setNextPrompt] = useState(false);
  const [loginInvalid, setLoginInvalid] = useState(false);
  const [token, setToken] = useSessionStorage('token', '');
  const [tempToken, setTempToken] = useState('');

  const [verificationCode, setVerificationCode] = useState('');
  const [emailRegistered, setEmailRegistered] = useState(false);
  const [generateVerificationCode, setGenerateVerificationCode] =
    useState(false);

  const [verificationCodeError, setVerificationCodeError] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const [verificationCodeInvalid, setVerificationCodeInvalid] = useState(false);

  const [newPassword, setNewPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewPassword(event.target.value);
  };

  useEffect(() => {
    setVerificationCode(v4().slice(0, 6));
  }, [generateVerificationCode]);

  const sendVerificationCode = (e: React.FormEvent<HTMLFormElement>) => {
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

                  console.log(form.current);

                  axios
                    .post(GRAPHQLAPI, {
                      query: INSERT_USER_VERIFICATION_CODE,
                      variables: {
                        email: email,
                        verificationcode: verificationCode,
                      },
                    })
                    .then((res) => {
                      res.data.data.userInputVerificationCode.id;

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
          }
        })
        .catch(() => {
          console.log('Error');
        });
    }
  };

  const handleInputtedVerificationCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputtedVerificationCode(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
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

  const handleConfirmNewPasswordClick = () => {
    if (!validatePasswordValid()) {
      setErrorMessage(
        'Password must contains Uppercase, Lowercase, Symbols, and Number !',
      );
      return;
    }

    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_UPDATE_FORGOTTEN_PASSWORD_MUTATION,
          variables: {
            newPassword: newPassword,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + tempToken,
          },
        },
      )
      .then((res) => {
        console.log(res);
        setToken(tempToken);
        Router.push('/');
      })
      .catch((err) => {});
  };

  const handleConfirmCodeClick = () => {
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
          // setVerificationCodeInvalid(false);
          // setToken(res.data.data.validateUserVerificationCode.token);
          setTempToken(res.data.data.validateUserVerificationCode.token);
        } else {
          setVerificationCodeInvalid(true);
        }
      })
      .catch(() => {
        console.log('Error');
      });
  };

  return (
    <>
      <Head>
        <title>OldEgg Forgot Password</title>
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
            <h3 className="centered-text">Forgot Password</h3>

            {tempToken == '' && (
              <form
                style={{
                  width: '100%',
                  paddingBottom: '15px',
                }}
                onSubmit={sendVerificationCode}
                ref={form}
              >
                <div>
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
                  <input
                    type="text"
                    defaultValue={verificationCode}
                    style={{
                      display: 'none',
                    }}
                    name="code"
                  />
                </div>

                {nextPrompt && (
                  <div className={styles.formcontainer}>
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

                {!nextPrompt && tempToken == '' && (
                  <button
                    className={`${styles.formbutton} ${styles.themeaccent}`}
                  >
                    CONFIRM EMAIL
                  </button>
                )}

                {nextPrompt && tempToken == '' && (
                  <button
                    className={`${styles.formbutton} ${styles.themeaccent}`}
                    onClick={handleConfirmCodeClick}
                  >
                    CONFIRM CODE
                  </button>
                )}

                {verificationCodeError && (
                  <div style={{ marginTop: '20px', color: 'red' }}>
                    Unable to request another code yet ! Please wait 2 minutes
                  </div>
                )}
                {verificationCodeInvalid && (
                  <div
                    className={styles.errorMessage}
                    style={{ paddingBottom: '1em' }}
                  >
                    Invalid Verification Code !
                  </div>
                )}
              </form>
            )}
            {tempToken != '' && (
              <div>
                <input
                  type="password"
                  style={{
                    marginBottom: '15px',
                  }}
                  className={styles.formtextinput}
                  id="newpassword"
                  name="newpassword"
                  required
                  placeholder="New Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
                <button
                  className={`${styles.formbutton} ${styles.themeaccent}`}
                  onClick={handleConfirmNewPasswordClick}
                >
                  CONFIRM PASSWORD
                </button>
                {errorMessage != '' && (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      color: 'red',
                    }}
                  >
                    {errorMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
