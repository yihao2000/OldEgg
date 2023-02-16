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
  USER_UPDATE_PHONE_MUTATION,
} from '@/util/constant';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useSessionStorage } from 'usehooks-ts';
import Router, { useRouter } from 'next/router';
import styles from '@/styles/pagesstyles/account/mobilephone.module.scss';
import { phone } from 'phone';

export default function UpdateMobilePhone() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isphoneExist, setIsphoneExist] = useState(false);
  const [nextPrompt, setNextPrompt] = useState(false);
  const [loginInvalid, setLoginInvalid] = useState(false);
  const [token, setToken] = useSessionStorage('token', '');

  const [error, setError] = useState('');

  const [phoneCode, setPhoneCode] = useState('62');

  const handlephoneContainerClick = () => {
    setNextPrompt(false);
  };
  const validatePhoneValid = (param: string) => {
    return phone(param).isValid;
  };

  const handlephoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/\D/g, '');
    setPhoneNumber(result);
  };

  useEffect(() => {
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
        var retrieved: string = res.data.data.getCurrentUser.phone;
        if (retrieved != '') {
          var code = retrieved.substring(1, 3);
          var number = retrieved.substring(3);
          setPhoneCode(code);
          setPhoneNumber(number);
        }
      })
      .catch((err) =>
        setError('Unable to update phone number! Please try again...'),
      );
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (phoneNumber == '') {
      setError('This field is required');
      return;
    }

    const formattedPhone = '+' + phoneCode + phoneNumber;
    console.log(formattedPhone);
    if (!validatePhoneValid(formattedPhone)) {
      setError('Invalid Phone Format !');
      return;
    }

    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_UPDATE_PHONE_MUTATION,
          variables: {
            phone: formattedPhone,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setTimeout(() => {
          Router.reload();
        }, 3000);
      })
      .catch((err) =>
        setError('Unable to update phone number! Please try again...'),
      );
  };
  return (
    <>
      <Head>
        <title>Update Mobile Phone</title>
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
              Add Mobile Number
            </h3>

            <form
              action=""
              style={{
                width: '100%',
                paddingBottom: '15px',
              }}
              onSubmit={handleSubmit}
            >
              <p style={{ marginTop: '0px', fontSize: '13px' }}>
                Enter the mobile phone number you would like to associate with
                your profile. We will send a One-time Code to that number.
              </p>

              <div className={styles.forminputcontainer}>
                <select
                  value={phoneCode}
                  className={styles.forminputselection}
                  onChange={(event) => {
                    setPhoneCode(event.target.value);
                  }}
                >
                  <option value="971">AE +971</option>
                  <option value="54">AR +54</option>
                  <option value="61">AU +61</option>
                  <option value="973">BH +973</option>
                  <option value="44">GB +44</option>
                  <option value="852">HK +852</option>
                  <option value="972">IL +972</option>
                  <option value="62">ID +62</option>
                  <option value="81">JP +81</option>
                  <option value="82">KR +82</option>
                  <option value="965">KW +965</option>
                  <option value="52">MX +52</option>
                  <option value="64">NZ +64</option>
                  <option value="968">OM +968</option>
                  <option value="63">PH +63</option>
                  <option value="974">QA +974</option>
                  <option value="65">SG +65</option>
                  <option value="66">TH +66</option>
                  <option value="90">TR +90</option>
                  <option value="1">US +1</option>
                </select>
                <input
                  type="text"
                  className={styles.formtextinput}
                  id="phone"
                  name="phone"
                  required
                  value={phoneNumber}
                  onChange={handlephoneChange}
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
                SAVE
              </button>

              <button
                className={`${styles.formbutton} ${styles.themebglight}`}
                onClick={handleSubmit}
              >
                CANCEL
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
