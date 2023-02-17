import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/pagesstyles/account/wishlists/mylist.module.scss';
import Layout from '@/components/layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  GRAPHQLAPI,
  PRODUCT_CATEGORY_QUERY,
  PRODUCT_PRODUCTSGROUP_QUERY,
  PRODUCT_QUERY,
  USER_ADD_CART_MUTATION,
} from '@/util/constant';
import { FaTruck } from 'react-icons/fa';
import {
  Product,
  ProductCardData,
  ProductDetail,
} from '@/components/interfaces/interfaces';

import { useSessionStorage } from 'usehooks-ts';
import { ClipLoader } from 'react-spinners';

import WishlistNav from '@/components/wishlistnav';

const ProductDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // const [id, setId] = useState('');
  const [token, setToken] = useSessionStorage('token', '');
  const [available, setAvailable] = useState(false);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [descriptions, setDescriptions] = useState([]);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Layout>
      <WishlistNav />
    </Layout>
  );
};

export default ProductDetail;
