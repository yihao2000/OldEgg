import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Layout from '@/components/layout';
import ShopHeader from '@/components/shop/shopheader';
import styles from '@/styles/pagesstyles/shop/products/shoppages.module.scss';

import { Product } from '@/components/interfaces/interfaces';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { GRAPHQLAPI, SHOP_PRODUCTS_QUERY } from '@/util/constant';
import ProductCard from '@/components/productcard';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';

export default function ShopProducts() {
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useSessionStorage('token', '');

  //Pagination
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [orderBy, setorderBy] = useState('');
  const [sortBy, setSortBy] = useState('featureditems');

  const [refresh, setRefresh] = useState(false);

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (id) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: SHOP_PRODUCTS_QUERY,
            variables: {
              shopID: id,
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
          setTotalPage(Math.ceil(res.data.data.shopProducts.length / limit));
          setCurrentPage(1);
          setOffset(0);
        })

        .catch((err) => console.log(err));
    }
  }, [refresh]);

  useEffect(() => {
    refreshComponent();
    console.log(orderBy);
  }, [id, limit, orderBy]);

  useEffect(() => {
    if (totalPage) {
      axios
        .post(GRAPHQLAPI, {
          query: SHOP_PRODUCTS_QUERY,
          variables: {
            limit: limit,
            offset: offset,
            sortBy: sortBy,
            shopID: id,
          },
        })
        .then((res) => {
          setProducts(res.data.data.shopProducts);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [totalPage, offset, sortBy, refresh]);

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
      <div className={styles.maincontainer}>
        <ShopHeader />
        <div className={styles.contentsection}>
          <div className={styles.pagedivider}>
            <div className={styles.leftsection}>sadsa</div>
            <div className={styles.rightsection}>
              <div className={styles.contentcontainer}>
                <div className={styles.filtercontainer}>
                  <div className={styles.filtersubcontainer}>
                    <div className={styles.orderBycontainer}>
                      <b>Sort By:</b>
                      <select
                        value={sortBy}
                        // className={styles.forminputselection}
                        onChange={(event) => {
                          setSortBy(event.target.value);
                        }}
                        className={styles.selectstyle}
                      >
                        <option value="lowestprice">Lowest Price</option>
                        <option value="highestprice">Highest Price</option>
                        <option value="featureditems">Featured Items</option>
                        <option value="toprating">Top Rating</option>
                        <option value="topsold">Top Sold</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className={styles.filtersubcontainer}
                    style={{
                      display: 'flex',
                      columnGap: '10px',
                    }}
                  >
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
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="150">150</option>
                        <option value="200">200</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className={styles.productcardcontainer}>
                  {products.map((product) => {
                    return (
                      <ProductCard
                        style="original"
                        id={product.id}
                        image={product.image}
                        name={LAPTOP_NAME_CONVERTER(product.name)}
                        price={product.price}
                        key={product.id}
                        discount={product.discount}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
