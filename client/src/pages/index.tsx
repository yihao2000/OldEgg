import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/home.module.css';
import Link from 'next/link';
import { links } from '@/util/route';
import Layout from '@/components/layout';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GRAPHQLAPI, PROMOS_QUERY } from '@/util/constant';
import PromoCarousel from '@/components/promocarousel';

// const myImage = new CloudinaryImage('sample', {
//   cloudName: 'dmpbgjnrc',
// }).resize(fill());

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
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
      <Layout>
        <main className={styles.main}>
          <PromoCarousel />
        </main>
      </Layout>
    </>
  );
}
