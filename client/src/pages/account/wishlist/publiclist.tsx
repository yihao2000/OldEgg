import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/pagesstyles/account/wishlists/publiclist.module.scss';
import Layout from '@/components/layout';
import Link from 'next/link';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PUBLIC_WISHLISTS_QUERY } from '@/util/constant';
import axios from 'axios';
import {
  CREATE_WISHLIST_MUTATION,
  GRAPHQLAPI,
  PRODUCT_CATEGORY_QUERY,
  PRODUCT_PRODUCTSGROUP_QUERY,
  PRODUCT_QUERY,
  USER_ADD_CART_MUTATION,
  USER_WISHLISTS_QUERY,
} from '@/util/constant';
import { FaAngleLeft, FaAngleRight, FaTruck } from 'react-icons/fa';
import {
  Product,
  ProductCardData,
  ProductDetail,
} from '@/components/interfaces/interfaces';

import { useSessionStorage } from 'usehooks-ts';
import { ClipLoader } from 'react-spinners';

import WishlistNav from '@/components/wishlistnav';
import Modal from '@/components/modal/modal';
import WishlistCard from '@/components/wishlistcard';

const Mylist: NextPage = () => {
  interface Wishlist {
    id: string;
    name: string;
    privacy: string;
  }

  const router = useRouter();

  // const [id, setId] = useState('');
  const [token, setToken] = useSessionStorage('token', '');

  const [refresh, setRefresh] = useState(false);

  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [sortBy, setSortBy] = useState('date_created');
  const [limit, setLimit] = useState(15);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  //Filter
  const [ratingFilter, setRatingFilter] = useState(0);
  const [minimumPriceFilter, setMinimumPriceFilter] = useState(0);
  const [maximumPriceFilter, setMaximumPriceFilter] = useState(0);

  useEffect(() => {
    refreshComponent();
  }, [sortBy]);

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: PUBLIC_WISHLISTS_QUERY,
          variables: {
            filter: 'Public',
            sortBy: sortBy,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        console.log(res);
        setTotalPage(Math.ceil(res.data.data.wishlists.length / limit));
        setCurrentPage(1);
        setOffset(0);
      })

      .catch((err) => console.log(err));
  }, [refresh]);

  useEffect(() => {
    refreshComponent();
  }, [limit]);

  useEffect(() => {
    console.log(maximumPriceFilter);
    if (totalPage) {
      axios
        .post(GRAPHQLAPI, {
          query: PUBLIC_WISHLISTS_QUERY,
          variables: {
            limit: limit,
            offset: offset,
            sortBy: sortBy,
            ratingFilter: ratingFilter != 0 ? ratingFilter : null,
            startPriceFilter:
              minimumPriceFilter == 0 ? null : minimumPriceFilter,
            endPriceFilter: maximumPriceFilter == 0 ? null : maximumPriceFilter,
          },
        })
        .then((res) => {
          console.log(res);
          setWishlists(res.data.data.wishlists);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    totalPage,
    offset,
    sortBy,
    ratingFilter,
    minimumPriceFilter,
    maximumPriceFilter,
  ]);

  useEffect(() => {
    setOffset((currentPage - 1) * limit);
  }, [currentPage]);

  const handlePrevPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPageClick = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Layout>
      <WishlistNav />
      <div className={styles.pagedivider}>
        <div className={styles.leftside}>
          <div className={styles.ratingcontainer}>
            <h2>Lists Rating</h2>

            <label htmlFor="">
              <input
                type="checkbox"
                checked={ratingFilter == 5}
                onChange={() => {
                  setRatingFilter(5);
                }}
              />
              <span>5 Eggs</span>
            </label>
            <label htmlFor="">
              <input
                type="checkbox"
                checked={ratingFilter == 4}
                onChange={() => {
                  setRatingFilter(4);
                }}
              />
              <span>4 Eggs</span>
            </label>
            <label htmlFor="">
              <input
                type="checkbox"
                checked={ratingFilter == 3}
                onChange={() => {
                  setRatingFilter(3);
                }}
              />
              <span>3 Eggs</span>
            </label>
            <label htmlFor="">
              <input
                type="checkbox"
                checked={ratingFilter == 2}
                onChange={() => {
                  setRatingFilter(2);
                }}
              />
              <span>2 Eggs</span>
            </label>
            <label htmlFor="">
              <input
                type="checkbox"
                checked={ratingFilter == 1}
                onChange={() => {
                  setRatingFilter(1);
                }}
              />
              <span>1 Eggs</span>
            </label>
            <label htmlFor="">
              <input
                type="checkbox"
                checked={ratingFilter == 0}
                onChange={() => {
                  setRatingFilter(0);
                }}
              />
              <span>All Ratings</span>
            </label>
          </div>
          <hr
            style={{
              width: '100%',
            }}
          />
          <h2>Lists Price</h2>
          <div className={styles.pricecontainer}>
            <div>
              <span>Minimum Price: </span>{' '}
              <input
                type="number"
                placeholder="Minimum Price ($)"
                value={minimumPriceFilter}
                onChange={(event) => {
                  setMinimumPriceFilter(Number(event?.target.value));
                }}
              />
            </div>
            <div>
              {' '}
              <span>Maximum Price: </span>
              <input
                type="number"
                placeholder="Maximum Price ($)"
                value={maximumPriceFilter}
                onChange={(event) => {
                  setMaximumPriceFilter(Number(event?.target.value));
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.rightside}>
          <div className={styles.contentcontainer}>
            <div className={styles.filtercontainer}>
              <div className={styles.filtersubcontainer}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {wishlists.length} Lists
                </div>
                <div
                  className={styles.orderBycontainer}
                  style={{
                    marginLeft: '10px',
                  }}
                >
                  <b>Sort By:</b>
                  <select
                    value={sortBy}
                    className={styles.forminputselection}
                    onChange={(event) => {
                      setSortBy(event.target.value);
                    }}
                    // className={styles.selectstyle}
                  >
                    <option value="date_created">Date Created</option>
                    <option value="highestrating">Highest Rating</option>
                    <option value="lowestprice">Lowest Price</option>
                    <option value="highestprice">Highest Price</option>
                    <option value="highestfollowers">Most Followers</option>
                  </select>
                </div>
              </div>
              <div className={styles.filtersubcontainer}>
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
                <div className={styles.paginationcontainer}>
                  <b>View:</b>
                  <select
                    value={limit}
                    className={styles.forminputselection}
                    onChange={(event) => {
                      setLimit(Number(event.target.value));
                    }}
                  >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.wishlistcontainer}>
              {wishlists.map((w) => {
                return (
                  <WishlistCard
                    key={w.id}
                    style="full"
                    refreshComponent={refreshComponent}
                    wishlistId={w.id}
                    wishlistName={w.name}
                    wishlistPrivacy={w.privacy}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* <div className={styles.mylistoutercontainer}></div>
      <div className={styles.mylistcontainer}>
        {wishlists.map((res) => {
          console.log('Mapping');
          return (
            <WishlistCard
              wishlistName={res.name}
              wishlistPrivacy={res.privacy}
              refreshComponent={refreshComponent}
              wishlistId={res.id}
            />
          );
        })}
      </div> */}
    </Layout>
  );
};

export default Mylist;
