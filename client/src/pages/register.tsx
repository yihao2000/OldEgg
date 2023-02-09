import Head from 'next/head';
import React, { useState } from 'react';
import styles from '@/styles/home.module.css';
import Link from 'next/link';
import { links } from '@/util/route';
import Image from 'next/image';
import axios from 'axios';
import { phone } from 'phone';
import { GRAPHQLAPI, REGISTER_QUERY, USER_QUERY } from '@/util/constant';
import { useSessionStorage } from 'usehooks-ts';
import { ClipLoader } from 'react-spinners';
import Router, { useRouter } from 'next/router';

export default function Signup() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useSessionStorage('token', '');
  const [loading, setLoading] = useState(false);

  const validateEmptyFields = () => {
    if (
      firstname.length == 0 ||
      lastname.length == 0 ||
      email.length == 0 ||
      phone.length == 0
    ) {
      return true;
    }

    return false;
  };

  const validatePasswordValid = () => {
    var regexp = new RegExp(
      /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/,
    );

    if (password.match(regexp)) {
      return true;
    }

    return false;
  };

  const validateEmailValid = () => {
    var regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

    if (email.match(regexp)) {
      return true;
    }
    return false;
  };

  const validatePhoneValid = () => {
    return phone(phoneNumber).isValid;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateEmptyFields()) {
      setErrorMessage('All Fields must be filled !');
      return;
    } else if (!validateEmailValid()) {
      setErrorMessage('Invalid Email Format !');
      return;
    } else if (!validatePhoneValid()) {
      setErrorMessage('Invalid Phone Format !');
      return;
    } else if (!validatePasswordValid()) {
      setErrorMessage(
        'Password must contains Uppercase, Lowercase, Symbols, and Number !',
      );
      return;
    }

    var emailExist;
    var fullName = firstname.concat(lastname);
    setLoading(true);
    axios
      .post(GRAPHQLAPI, {
        query: USER_QUERY,
        variables: {
          email: email,
        },
      })
      .then((res) => {
        if (res.data.data.user == null) {
          axios
            .post(GRAPHQLAPI, {
              query: REGISTER_QUERY,
              variables: {
                name: fullName,
                email: email,
                phone: phoneNumber,
                password: password,
                banned: false,
                role: 'User',
              },
            })
            .then((res) => {
              setToken(res.data.data.auth.register.token);

              Router.push('/');
            });
        } else {
          setErrorMessage('Inputted email already exist !');
          return;
        }
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFirstname(event.target.value);
    console.log(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastname(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handleSubscribeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSubscribe(event.target.checked);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <Head>
        <title>OldEgg Sign Up</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.formcontainer}>
          <Image alt="Logo" src="/asset/logo.svg" width={170} height={70} />
          <h3>Create Account</h3>
          <p className={`${styles.nopadding} ${styles.nomargin}`}>
            Shopping for your business? <u>Create a free business account</u>
          </p>
          <form className={styles.formcontainer} onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.formtextinput}
              id="firstname"
              name="firstname"
              value={firstname}
              onChange={handleFirstNameChange}
              placeholder="First Name"
            />

            <input
              type="text"
              className={styles.formtextinput}
              id="lastname"
              name="lastname"
              value={lastname}
              onChange={handleLastNameChange}
              placeholder="Last Name"
            />

            <input
              type="email"
              className={styles.formtextinput}
              id="emailaddress"
              name="emailaddress"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
            />

            <input
              type="text"
              className={styles.formtextinput}
              id="mobilephone"
              name="mobilephone"
              placeholder="Mobile Phone Number (optional)"
              value={phoneNumber}
              onChange={handlePhoneChange}
            />
            <input
              type="password"
              className={styles.formtextinput}
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {errorMessage != '' && (
              <h4 className={styles.errorMessage}>{errorMessage}</h4>
            )}
            <div className={styles.formsplit}>
              <div className={styles.formsplitchild}>
                Including 3 of the following:
              </div>
              <div className={styles.formsplitchild}>Must contain:</div>
            </div>

            <label htmlFor="checkbox">
              <input
                type="checkbox"
                checked={subscribe}
                onChange={handleSubscribeChange}
              />
              <span className={styles.formcheckboxtitle}>
                Subscribe for exclusive e-mail offers and discounts
              </span>
            </label>

            <p>
              By creating an account, you agree to Newegg's Privacy Notice and
              Terms of Use
            </p>

            <button
              onClick={handleSubmit}
              className={`${styles.formbutton} ${styles.themeaccent}`}
            >
              {loading ? <ClipLoader size={20} /> : 'Submit'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
