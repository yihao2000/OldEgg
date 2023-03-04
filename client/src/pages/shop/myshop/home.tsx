import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import Layout from '@/components/layout';
import ShopHeader from '@/components/shop/shopheader';
import styles from '@/styles/pagesstyles/shop/myshop/home.module.scss';

import {
  Brand,
  Category,
  Product,
  Shop,
} from '@/components/interfaces/interfaces';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import {
  BRANDS_QUERY,
  CATEGORIES_QUERY,
  CREATE_NEW_PRODUCT_MUTATION,
  GET_CURRENT_USER_SHOP,
  GRAPHQLAPI,
  SHOP_PRODUCTS_QUERY,
  SHOP_TOTAL_SALES_QUERY,
} from '@/util/constant';
import ProductCard from '@/components/productcard';
import { LAPTOP_NAME_CONVERTER } from '@/components/converter/converter';
import { ShopSideBar } from '@/components/sidebar/shopsidebar';
import Modal from '@/components/modal/modal';

export default function MyShop() {
  const router = useRouter();
  const [token, setToken] = useSessionStorage('token', '');
  const [shop, setShop] = useState<Shop>();
  const [totalSales, setTotalSales] = useState(0);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [orderBy, setorderBy] = useState('');
  const [sortBy, setSortBy] = useState('featureditems');

  const [openAddModal, setOpenAddModal] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const closeAddModal = () => {
    setOpenAddModal(false);
  };

  useEffect(() => {
    console.log(token);
  }, []);

  const AddProductModalContent = () => {
    const [productCategoryList, setProductCategoryList] = useState<Category[]>(
      [],
    );
    const [productBrandList, setProductBrandList] = useState<Brand[]>([]);

    useEffect(() => {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: CATEGORIES_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setProductCategoryList(res.data.data.categories);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .post(
          GRAPHQLAPI,
          {
            query: BRANDS_QUERY,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setProductBrandList(res.data.data.brands);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productImage, setProductImage] = useState('');
    const [productQuantity, setProductQuantity] = useState(0);
    const [productDiscount, setProductDiscount] = useState(0);
    const [productBrand, setProductBrand] = useState(
      'b3c07dd5-ff10-49c7-a7eb-101fbb790e38',
    );
    const [productCategory, setProductCategory] = useState(
      '60273be6-1379-40c3-9926-977533f54f39',
    );

    const [error, setError] = useState('');

    const handleSubmitAddProductClick = () => {
      if (productName == '' || productDescription == '' || productImage == '') {
        setError('All Fields must be Filled!');
      } else if (
        productPrice <= 0 ||
        productQuantity < 0 ||
        productDiscount < 0
      ) {
        setError("Number can't be below zero!");
      } else {
        axios
          .post(
            GRAPHQLAPI,
            {
              query: CREATE_NEW_PRODUCT_MUTATION,
              variables: {
                brandID: productBrand,
                categoryID: productCategory,
                shopID: shop?.id,
                name: productName,
                description: productDescription,
                price: productPrice,
                image: productImage,
                quantity: productQuantity,
                discount: productDiscount,
              },
            },
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            },
          )
          .then((res) => {
            router.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    return (
      <div className={styles.addproductcontainer}>
        <h2>Add New Product</h2>
        <div className={styles.rowcontainer}>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: '17px',
            }}
          >
            Product Name
          </span>
          <input
            type="text"
            className={styles.forminputcontainer}
            placeholder="Gaming Laptop"
            value={productName}
            onChange={(event) => {
              setProductName(event.target.value);
            }}
          />
        </div>
        <div className={styles.rowcontainer}>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: '17px',
            }}
          >
            Product Description
          </span>
          <input
            type="text"
            className={styles.forminputcontainer}
            placeholder="Good Gaming Laptop"
            value={productDescription}
            onChange={(event) => {
              setProductDescription(event.target.value);
            }}
          />
        </div>
        <div className={styles.rowcontainer}>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: '17px',
            }}
          >
            {' '}
            Product Image
          </span>
          <input
            type="text"
            className={styles.forminputcontainer}
            placeholder="https://sampleimage.org"
            value={productImage}
            onChange={(event) => {
              setProductImage(event.target.value);
            }}
          />
        </div>
        <div className={styles.dropdowncontainer}>
          {' '}
          <select
            style={{
              width: '50%',
              padding: '5px',
            }}
            value={productCategory}
            className={styles.forminputselection}
            onChange={(event) => {
              setProductCategory(event.target.value);
            }}
          >
            {productCategoryList.map((x) => {
              return <option value={x.id}>{x.name}</option>;
            })}
          </select>
          <select
            style={{
              width: '50%',
              padding: '5px',
            }}
            value={productBrand}
            className={styles.forminputselection}
            onChange={(event) => {
              setProductBrand(event.target.value);
              console.log(productBrand);
            }}
          >
            {productBrandList.map((x) => {
              return <option value={x.id}>{x.name}</option>;
            })}
          </select>
        </div>
        <div className={styles.rowcontainer}>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: '17px',
            }}
          >
            {' '}
            Product Price ($)
          </span>
          <input
            type="number"
            className={styles.forminputcontainer}
            placeholder="Product Price"
            value={productPrice}
            onChange={(event) => {
              setProductPrice(Number(event.target.value));
            }}
          />
        </div>
        <div className={styles.rowcontainer}>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: '17px',
            }}
          >
            {' '}
            Product Quantity
          </span>
          <input
            type="number"
            className={styles.forminputcontainer}
            placeholder="Product Quantity"
            value={productQuantity}
            onChange={(event) => {
              setProductQuantity(Number(event.target.value));
            }}
          />
        </div>
        <div className={styles.rowcontainer}>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: '17px',
            }}
          >
            {' '}
            Product Discount
          </span>
          <input
            type="number"
            className={styles.forminputcontainer}
            placeholder="Product Discount (0 For no Discount)"
            value={productDiscount}
            onChange={(event) => {
              setProductDiscount(Number(event.target.value));
            }}
          />
        </div>

        <div className={styles.gapcontainer}>
          <span style={{ color: 'red' }}>{error}</span>
          <button
            className={styles.addbutton}
            onClick={handleSubmitAddProductClick}
          >
            Add Product
          </button>
        </div>
      </div>
    );
  };

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    refreshComponent();
    console.log(orderBy);
  }, [token, limit, orderBy]);

  const handleAddProductClick = () => {
    setOpenAddModal(true);
  };

  useEffect(() => {
    if (token) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: GET_CURRENT_USER_SHOP,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          console.log(res);
          setTotalPage(
            Math.ceil(res.data.data.getUserShop.products.length / limit),
          );
          setCurrentPage(1);
          setOffset(0);
          setShop(res.data.data.getUserShop);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [refresh]);

  useEffect(() => {
    if (shop) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: SHOP_PRODUCTS_QUERY,
            variables: {
              limit: limit,
              offset: offset,
              sortBy: sortBy,
              shopID: shop?.id,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
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
      {shop && shop.banned == false && (
        <div className={styles.maincontainer}>
          <div className={styles.pagedivider}>
            <ShopSideBar />
            <div className={styles.rightsection}>
              <div className={styles.flexbetween}>
                <h2>My Products</h2>
                <button
                  className={styles.addbutton}
                  onClick={handleAddProductClick}
                >
                  Add Product
                </button>
              </div>

              <div className={styles.filtercontainer}>
                <div className={styles.filtersubcontainer}>
                  <div className={styles.orderBycontainer}>
                    <b>Sort By:</b>
                    <select
                      value={sortBy}
                      className={styles.forminputselection}
                      onChange={(event) => {
                        setSortBy(event.target.value);
                      }}
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
      )}
      {shop && shop.banned == true && (
        <div className={styles.bannedcontainer}>
          <h2
            style={{
              fontWeight: 'bold',
              color: 'red',
            }}
          >
            This shop is Banned !
          </h2>
        </div>
      )}
      {!shop && (
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Your account does not have any shop yet !
        </div>
      )}
      {openAddModal && (
        <Modal closeModal={closeAddModal} height={50} width={50}>
          <AddProductModalContent />
        </Modal>
      )}
    </Layout>
  );
}
