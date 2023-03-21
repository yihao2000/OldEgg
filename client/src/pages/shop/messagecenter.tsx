import { Category, Product, Shop } from '@/components/interfaces/interfaces';
import Layout from '@/components/layout';
import { GRAPHQLAPI, SHOP_PRODUCTS_QUERY, SHOP_QUERY } from '@/util/constant';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import styles from '@/styles/pagesstyles/shop/shopdetail.module.scss';
import ProductCard from '@/components/productcard';
import { links } from '@/util/route';
import ShopHeader from '@/components/shop/shopheader';

export default function ShopPage() {
  const router = useRouter();
  const { id } = router.query;

  const [shop, setShop] = useState<Shop>();
  const [products, setProducts] = useState<Product[]>();
  const [categoriesOwned, setCategoriesOwned] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState('topsold');

  return (
    <Layout>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        This feature has not been implemented yet !
      </div>
    </Layout>
  );
}
