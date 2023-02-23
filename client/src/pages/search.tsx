import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import { useEffect } from 'react';

const Search: NextPage = () => {
  const router = useRouter();
  const { search, category } = router.query;

  useEffect(() => {
    console.log(search);
    console.log(category);
  }, [search]);
  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default Search;
