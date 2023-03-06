import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/home.module.scss';
import Link from 'next/link';
import { links } from '@/util/route';
import Layout from '@/components/layout';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GRAPHQLAPI,
  POPULAR_BRANDS_QUERY,
  PROMOS_QUERY,
  TOP_SHOPS_QUERY,
} from '@/util/constant';
import PromoCarousel from '@/components/promocarousel';
import ProductRecommendations from '@/components/productrecommendations';
import { useSessionStorage } from 'usehooks-ts';
import { Brand, Shop } from '@/components/interfaces/interfaces';

// const myImage = new CloudinaryImage('sample', {
//   cloudName: 'dmpbgjnrc',
// }).resize(fill());

const inter = Inter({ subsets: ['latin'] });

interface BrandParameter {
  brand: Brand;
}

const FeaturedBrandCard = (props: BrandParameter) => {
  return (
    <div className={styles.featuredbrandcard}>
      <img
        src={props.brand.image}
        alt=""
        className={styles.featuredbrandimage}
      />
    </div>
  );
};

interface ShopParameter {
  shop: Shop;
}
const FeaturedShopCard = (props: ShopParameter) => {
  return (
    <Link href={links.shopDetail(props.shop.id)} className={styles.shoplink}>
      <div className={styles.featuredshopcard}>
        <div className={styles.featuredshopcardcontainer}>
          <img
            src={props.shop.image}
            alt=""
            className={styles.featuredshopimage}
          />
        </div>
        <div className={styles.featuredshopname}>{props.shop.name}</div>
      </div>
    </Link>
  );
};

export default function Home() {
  const [popularBrands, setPopularBrands] = useState<Brand[]>();
  const [topShops, setTopShops] = useState<Shop[]>();
  useEffect(() => {
    axios
      .post(GRAPHQLAPI, {
        query: POPULAR_BRANDS_QUERY,
      })
      .then((res) => {
        setPopularBrands(res.data.data.popularBrands);
      })
      .catch(() => {});

    axios
      .post(GRAPHQLAPI, {
        query: TOP_SHOPS_QUERY,
      })
      .then((res) => {
        setTopShops(res.data.data.topShops);
      })
      .catch(() => {});
  }, []);
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
          {/* <div className={styles.promocarouseloutercontainer}> */}
          <PromoCarousel />
          <div className={styles.featuredsection}>
            <h1>FEATURED BRANDS</h1>
            <div className={styles.featuredbrandscontainer}>
              {popularBrands?.map((x) => {
                return <FeaturedBrandCard brand={x} key={x.id} />;
              })}
            </div>
          </div>
          <div className={styles.featuredsection}>
            <h1>FEATURED SHOPS</h1>
            <div className={styles.featuredshopscontainer}>
              {topShops?.map((x) => {
                return <FeaturedShopCard shop={x} key={x.id} />;
              })}
            </div>
          </div>
          {/* </div> */}
          <ProductRecommendations />
        </main>
      </Layout>
    </>
  );
}
