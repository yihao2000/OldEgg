import Head from 'next/head';
import React from 'react';
import styles from '@/styles/home.module.css';
import Link from 'next/link';
import { links } from '@/util/route';
import Image from 'next/image';

export default function Signup() {
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
          <form action="">
            <input
              type="text"
              className={styles.formtextinput}
              id="firstname"
              name="firstname"
              required
              placeholder="First Name"
            />

            <input
              type="text"
              className={styles.formtextinput}
              id="lastname"
              name="lastname"
              required
              placeholder="Last Name"
            />

            <input
              type="email"
              className={styles.formtextinput}
              id="emailaddress"
              name="emailaddress"
              required
              placeholder="Email Address"
            />

            <input
              type="text"
              className={styles.formtextinput}
              id="mobilephone"
              name="mobilephone"
              placeholder="Mobile Phone Number (optional)"
            />

            <div className={styles.formsplit}>
              <div className={styles.formsplitchild}></div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
