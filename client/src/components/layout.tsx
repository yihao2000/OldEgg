import React, { ReactNode } from 'react';
import Navbar from './navbar';
import styles from '@/styles/home.module.scss';
import Head from 'next/head';
import Script from 'next/script';

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
          crossOrigin="anonymous"
        />
      </Head>
      <Navbar />
      {props.children}
    </>
  );
};

export default Layout;

// tsrafce
