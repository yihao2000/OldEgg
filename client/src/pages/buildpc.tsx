import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import { useEffect, useState, useTransition } from 'react';
import {
  CREATE_USER_SAVED_SEARCH,
  DELETE_USER_SAVED_SEARCH,
  GRAPHQLAPI,
  PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  USER_SAVED_SEARCHES,
} from '@/util/constant';
import axios from 'axios';
import { Product, UserSavedSearch } from '@/components/interfaces/interfaces';
import styles from '@/styles/pagesstyles/search.module.scss';
import ProductCard from '@/components/productcard';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import SearchProductcard from '@/components/searchproductcard';
import { useSessionStorage } from 'usehooks-ts';

const Search: NextPage = () => {
  const router = useRouter();
  const { search, category } = router.query;
  const [limit, setLimit] = useState(4);
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [orderBy, setorderBy] = useState('');

  const [token, setToken] = useSessionStorage('token', '');
  const [refresh, setRefresh] = useState(false);

  const [userSavedSearches, setUserSavedSearches] =
    useState<UserSavedSearch[]>();

  const [keywordSaved, setKeywordSaved] = useState(false);

  const refreshComponent = () => {
    setRefresh(!refresh);
  };
  //offset = (page-1)*limit

  useEffect(() => {
    if (search) {
      axios
        .post(GRAPHQLAPI, {
          query: SEARCH_PRODUCTS_QUERY,
          variables: {
            keyword: search,
          },
        })
        .then((res) => {
          console.log(res.data.data.products.length / limit);
          setTotalPage(Math.ceil(res.data.data.products.length / limit));
          setCurrentPage(1);
          setOffset(0);
        })
        .catch((err) => {
          console.log(err);
          console.log('Eror disini');
        });

      axios
        .post(
          GRAPHQLAPI,
          {
            query: USER_SAVED_SEARCHES,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          setUserSavedSearches(res.data.data.userSavedSearches);
        })
        .catch((err) => {});
    }
  }, [refresh]);

  useEffect(() => {
    if (search) {
      const containSearch = userSavedSearches?.find((x) => {
        return x.keyword === search;
      });

      setKeywordSaved(containSearch != null);
    }
  }, [userSavedSearches]);

  useEffect(() => {
    refreshComponent();
  }, [limit, search]);

  useEffect(() => {
    console.log(offset);
    if (search && totalPage) {
      console.log('masuk');
      console.log(search);
      axios
        .post(GRAPHQLAPI, {
          query: SEARCH_PRODUCTS_QUERY,
          variables: {
            keyword: search,
            limit: limit,
            offset: offset,
            orderBy: orderBy,
          },
        })
        .then((res) => {
          setProducts(res.data.data.products);
          setAllProducts(res.data.data.products);
          // setCurrentPage();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [search, category, totalPage, offset, orderBy, refresh]);

  const handleNextPageClick = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    // console.log(limit);
    // console.log(offset);
    setOffset((currentPage - 1) * limit);
  }, [currentPage]);

  const handlePrevPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSaveQuery = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: CREATE_USER_SAVED_SEARCH,
          variables: {
            keyword: search,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        refreshComponent();
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUnsaveQuery = () => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: DELETE_USER_SAVED_SEARCH,
          variables: {
            keyword: search,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        refreshComponent();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Search Bar
  const [searchInput, setSearchInput] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>();

  useEffect(() => {
    // refreshComponent();
    if (allProducts) {
      setProducts(
        allProducts.filter((x) => {
          return x.name.includes(searchInput);
        }),
      );
    }
  }, [searchInput]);
  return (
    <Layout>
      <div className={styles.maincontainer}>
        <div className={styles.header}></div>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          This features has not been implemented !
        </div>
      </div>
    </Layout>
  );
};

export default Search;
