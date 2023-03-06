import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import { useEffect, useState, useTransition } from 'react';
import {
  GRAPHQLAPI,
  PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
} from '@/util/constant';
import axios from 'axios';
import { Product } from '@/components/interfaces/interfaces';
import styles from '@/styles/pagesstyles/search.module.scss';
import ProductCard from '@/components/productcard';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import SearchProductcard from '@/components/searchproductcard';

const Search: NextPage = () => {
  const router = useRouter();
  const { search, category } = router.query;
  const [limit, setLimit] = useState(4);
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [orderBy, setorderBy] = useState('');

  const [refresh, setRefresh] = useState(false);

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
    }
  }, [refresh]);

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
          // setCurrentPage();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [search, category, totalPage, offset, orderBy]);

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
  return (
    <Layout>
      <div className={styles.maincontainer}>
        <div className={styles.header}>This is Header</div>
        <div className={styles.pagedivider}>
          <div className={styles.leftside}>aa</div>
          <div className={styles.rightside}>
            <div className={styles.searchsectioncontainer}>
              <div className={styles.searchcontainer}>
                <div className={styles.searchlabel}>
                  <b>Search Within: </b>
                </div>
                <input type="text" className={styles.searchinput} />
                <button className={styles.buttongo}>GO</button>
              </div>
              <div className={styles.changepagecontainer}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <b>Page</b> {currentPage + '/' + totalPage}{' '}
                </div>
                {totalPage > 1 && (
                  <div>
                    {' '}
                    <button
                      onClick={handlePrevPageClick}
                      style={{
                        display: 'inline',
                      }}
                      className={styles.changepagebutton}
                    >
                      <FaAngleLeft />
                    </button>
                    <button
                      onClick={handleNextPageClick}
                      style={{
                        display: 'inline',
                      }}
                      className={styles.changepagebutton}
                    >
                      <FaAngleRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.filtercontainer}>
              <div className={styles.orderBycontainer}>
                <b>Sort By:</b>
                <select
                  value={orderBy}
                  // className={styles.forminputselection}
                  onChange={(event) => {
                    setorderBy(event.target.value);
                  }}
                  className={styles.selectstyle}
                >
                  <option value="lowestprice">Lowest Price</option>
                  <option value="highestprice">Highest Price</option>
                  <option value="highestrating">Highest Rating</option>
                  <option value="lowestrating">Lowest Rating</option>
                  {/* <option value="featureditems">Featured Items</option> */}
                </select>
              </div>
              <div className={styles.paginationcontainer}>
                <b>View:</b>
                <select
                  value={limit}
                  // className={styles.forminputselection}
                  onChange={(event) => {
                    setLimit(Number(event.target.value));
                  }}
                  className={styles.selectstyle}
                >
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                </select>
              </div>
            </div>
            <div className={styles.productcontainer}>
              {products.map((e) => {
                return (
                  <SearchProductcard
                    id={e.id}
                    image={e.image}
                    name={e.name}
                    price={e.price}
                    key={e.id}
                    discount={e.discount}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
