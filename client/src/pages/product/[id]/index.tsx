import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/pagesstyles/productdetail.module.scss';
import Layout from '@/components/layout';
import Link from 'next/link';
import { SyntheticEvent, use, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  CREATE_WISHLIST_DETAIL_MUTATION,
  CURRENT_USER_QUERY,
  DELETE_PRODUCT_FROM_WISHLIST_DETAILS,
  DELETE_SAVED_FOR_LATER_MUTATION,
  GET_CURRENT_USER_SHOP,
  GRAPHQLAPI,
  PRODUCT_CATEGORY_QUERY,
  PRODUCT_PRODUCTSGROUP_QUERY,
  PRODUCT_QUERY,
  PRODUCT_USER_WISHLISTS_QUERY,
  USER_ADD_CART_MUTATION,
  USER_WISHLISTS_QUERY,
} from '@/util/constant';
import { FaTruck, FaHeart, FaRegHeart } from 'react-icons/fa';
import {
  AddToWishlistModalParameter,
  Product,
  ProductCardData,
  ProductDetail,
  Shop,
  User,
  Wishlist,
} from '@/components/interfaces/interfaces';
import {
  GET_LAPTOP_COMPONENT_VARIANT,
  LAPTOP_COMPONENTS_CONVERTER,
  LAPTOP_NAME_CONVERTER,
} from '@/components/converter/converter';
import { useSessionStorage } from 'usehooks-ts';
import { ClipLoader } from 'react-spinners';
import ProductCard from '@/components/productcard';
import Modal from '@/components/modal/modal';
import UpdateProductModalContent from '@/components/modal/content/updateproduct';

const ProductDetail: NextPage = () => {
  interface ProductVariant {
    id: string;
    name: string;
  }

  const limit = 20;

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
  const [productQuantity, setProductQuantity] = useState(1);

  const [similarProducts, setSimilarProducts] = useState<ProductCardData[]>([]);

  const [success, setSuccess] = useState(false);

  const [productsVariant, setProductsVariant] = useState<
    ProductDetail[] | null
  >(null);

  const [variantList, setVariantList] = useState([]);

  const [openAddToWishlistModal, setOpenAddToWishlistModal] = useState(false);

  //Edit Product
  const [shop, setShop] = useState<Shop>();
  const [currUser, setCurrUser] = useState<User>();
  const [openUpdateProductModal, setOpenUpdateProductModal] = useState(false);

  const closeUpdateProductModal = () => {
    setOpenUpdateProductModal(false);
  };

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: GET_CURRENT_USER_SHOP,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setShop(res.data.data.getUserShop);
      })
      .catch(() => {});

    axios
      .post(
        GRAPHQLAPI,
        {
          query: CURRENT_USER_QUERY,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setCurrUser(res.data.data.getCurrentUser);
      })
      .catch(() => {});
  }, []);

  const closeAddToWishlistModal = () => {
    setOpenAddToWishlistModal(false);
  };

  const handleAddToWishlistClick = () => {
    setOpenAddToWishlistModal(true);
  };

  const handleQuantityChange = (event: any) => {
    if (event.target.value >= 20) {
      if (product?.quantity) {
        if (event.target.value > product?.quantity) {
          setProductQuantity(event.target.value);
        } else {
          setProductQuantity(20);
        }
      }
    } else if (event.target.value <= 0) {
      setProductQuantity(1);
    } else {
      setProductQuantity(event.target.value);
    }
  };

  const handleIncreaseQuantity = () => {
    if (productQuantity < 20) {
      if (product?.quantity) {
        if (productQuantity < product?.quantity) {
          setProductQuantity(productQuantity + 1);
        }
      }
    }
  };

  const handleDecreaseQuantity = () => {
    if (productQuantity > 1) {
      setProductQuantity(productQuantity - 1);
    }
  };

  const handleSubmit = () => {
    if (!token) {
      router.push('/login');
    } else {
      setLoading(true);
      setTimeout(() => {
        axios
          .post(
            GRAPHQLAPI,
            {
              query: USER_ADD_CART_MUTATION,
              variables: {
                productID: id,
                quantity: productQuantity,
              },
            },

            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then((res) => {
            if (res.data.data.createCart != null) {
              setSuccess(true);
            }
          })
          .catch(() => {});
        setLoading(false);

        setTimeout(() => {
          setSuccess(false);
        }, 7000);
        axios
          .post(
            GRAPHQLAPI,
            {
              query: DELETE_SAVED_FOR_LATER_MUTATION,
              variables: {
                productID: id,
              },
            },

            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {})
          .catch(() => {});
      }, 2000);
    }
  };

  useEffect(() => {
    if (product) {
      axios
        .post(GRAPHQLAPI, {
          query: PRODUCT_CATEGORY_QUERY,
          variables: {
            limit: limit,
            categoryId: product?.category.id,
          },
        })
        .then((res) => {
          setSimilarProducts(res.data.data.products);
        });
    }
  }, [product]);

  useEffect(() => {
    // var items = window.location.pathname.split('/');
    // setId(items[2]);
    if (id) {
      axios
        .post(GRAPHQLAPI, {
          query: PRODUCT_QUERY,
          variables: {
            id: id,
          },
        })
        .then((res) => {
          setProduct(res.data.data.product);
          console.log(res.data.data.product);

          var productCategory = res.data.data.product.category.name;
          setProductCategory(productCategory);

          if (productCategory == 'Laptop') {
            setProductName(LAPTOP_NAME_CONVERTER(res.data.data.product.name));
          }

          var temp = res.data.data.product.description.split(';');
          setDescriptions(temp);
          if (res.data.data.product.quantity > 0) {
            setAvailable(true);
          }

          axios
            .post(GRAPHQLAPI, {
              query: PRODUCT_PRODUCTSGROUP_QUERY,
              variables: {
                id: res.data.data.product.productgroup.id,
              },
            })
            .then((res) => {
              setProductsVariant(res.data.data.products);
            });
        })

        .catch((err) => console.log(err));
    }
  }, [id]);

  useEffect(() => {
    if (productCategory == 'Laptop') {
      // setVariantList(GET_LAPTOP_COMPONENT_VARIANT(productsVariant))
      if (productsVariant != null) {
        // console.log(GET_LAPTOP_COMPONENT_VARIANT(productsVariant));
      }
    }

    var variantlist;
  }, [productsVariant]);

  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [checkedWishlists, setCheckedWishlists] = useState<Wishlist[]>([]);
  const [loadChecked, setLoadChecked] = useState(false);

  useEffect(() => {
    axios
      .post(
        GRAPHQLAPI,
        {
          query: USER_WISHLISTS_QUERY,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((res) => {
        setWishlists(res.data.data.userwishlists);
      })
      .catch((error) => {
        // setError(true);
      });
  }, []);

  useEffect(() => {
    if (wishlists && product) {
      axios
        .post(
          GRAPHQLAPI,
          {
            query: PRODUCT_USER_WISHLISTS_QUERY,
            variables: {
              productId: product?.id,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then((res) => {
          setCheckedWishlists(res.data.data.productUserWishlists);
        })
        .catch((error) => {
          // setError(true);
        });
    }
  }, [wishlists, loadChecked, product]);

  const AddToWishlistModalContent = (props: AddToWishlistModalParameter) => {
    const [addingToWishlist, setAddingToWishlist] = useState(false);
    const handleWishlistSave = () => {
      setAddingToWishlist(true);
      axios
        .post(
          GRAPHQLAPI,
          {
            query: DELETE_PRODUCT_FROM_WISHLIST_DETAILS,
            variables: {
              productId: props.productId,
            },
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          checkedWishlists.map((c) => {
            axios
              .post(
                GRAPHQLAPI,
                {
                  query: CREATE_WISHLIST_DETAIL_MUTATION,
                  variables: {
                    wishlistId: c.id,
                    productId: props.productId,
                    quantity: 1,
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              )
              .then((res) => {})
              .catch(() => {});
          });

          setTimeout(() => {
            props.handleCloseModal();
            setLoadChecked(!loadChecked);
            setAddingToWishlist(false);
          }, 3000);
        })
        .catch(() => {
          console.log('ERROR');
        });
    };

    const handleCheckboxChange = (
      event: SyntheticEvent,
      wishlist: Wishlist,
    ) => {
      var exist = false;
      const target = event.target as HTMLInputElement;
      checkedWishlists.map((c) => {
        if (c.id == wishlist.id) {
          setCheckedWishlists(
            checkedWishlists.filter((item) => {
              return item.id !== wishlist.id;
            }),
          );
          target.checked = false;

          exist = true;
        }
      });

      if (exist) {
        return;
      }

      var temp = checkedWishlists;

      temp.push(wishlist);

      target.checked = true;
      setCheckedWishlists(temp);
    };

    return (
      <div className={styles.addtowishlistmodalcontent}>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          Manage Wish Lists{' '}
        </div>
        {wishlists.map((e) => {
          return (
            <div>
              <input
                type="checkbox"
                defaultChecked={
                  checkedWishlists.find((x) => e.id === x.id) != undefined
                    ? true
                    : false
                }
                value={e.id}
                id={e.id}
                title={e.name}
                onChange={(event: SyntheticEvent) => {
                  handleCheckboxChange(event, e);
                }}
              ></input>
              <label
                htmlFor={e.id}
                style={{
                  // display: 'block',
                  marginLeft: '5px',
                  fontSize: '15px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {e.name}
              </label>
            </div>
          );
        })}
        <hr style={{ width: '100%' }} />
        <button
          className={styles.savewishlistbutton}
          style={{
            maxWidth: '20%',
            alignSelf: 'end',
          }}
          onClick={handleWishlistSave}
        >
          {addingToWishlist ? <ClipLoader size={15} /> : 'Save'}
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div className={styles.pagedivider}>
        <div className={styles.sectionone}>
          <div className={styles.productimagebrandcontainer}>
            <div className={styles.productbrandcontainer}>
              <span className={styles.productid}>Item#: {id}</span>
              <img
                src={product?.brand.image}
                className={styles.productbrandimage}
              ></img>
            </div>
            <div className={styles.productimagecontainer}>
              <img
                className={styles.productimage}
                src={product?.image}
                alt=""
                style={{
                  margin: 'auto',
                }}
              />
            </div>
          </div>
          <div className={styles.sectiontwo}>
            <div>
              <h3 className={styles.visitshop}>Visit {product?.shop.name}</h3>
            </div>
            <div style={{ marginTop: '10px', fontSize: '28px' }}>
              {product?.name}
            </div>
            <hr style={{ color: 'grey', margin: '30px 0 30px 0' }} />
            <div className={styles.productinventory}>
              <b> {available ? 'In stock.' : ''} </b>
            </div>
            <hr style={{ color: 'grey', margin: '30px 0 30px 0' }} />
            <div className=""></div>
            <hr style={{ color: 'grey', margin: '30px 0 30px 0' }} />
            <div className={styles.productdescriptionscontainer}>
              <ul
                style={{ margin: 0, padding: 0, listStylePosition: 'inside' }}
              >
                {descriptions.map((e) => {
                  return (
                    <li
                      style={{ fontSize: '0.9em', marginTop: '10px' }}
                      key={e}
                    >
                      {e}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.sectionthree}>
          <div className={styles.soldandshippedcontainer}>
            <span className={styles.soldandshippedtext}>
              {' '}
              <a
                href=""
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FaTruck style={{ fontSize: '20px' }} />
                SOLD & SHIPPED BY NEWEGG
              </a>
            </span>
            <span>
              <span>Free Shipping</span> from United States
            </span>
            <hr className={styles.horizontaldivider} />

            <span style={{ display: 'block' }}>Estimated GST Inclusive</span>
            <div className={styles.pricecontainer}>
              <div className={styles.pricelabelcontainer}>
                {product?.discount == 0 && (
                  <span className={styles.pricelabel}>
                    <b>${product?.price.toFixed(2)}</b>
                  </span>
                )}
                {product?.discount != 0 && product?.price && (
                  <div style={{ display: 'flex' }}>
                    {' '}
                    <span className={styles.pricelabel}>
                      <b>
                        $
                        {(
                          product?.price -
                          (product?.price * product?.discount) / 100
                        ).toFixed(2)}
                      </b>
                    </span>
                    <span className={styles.discountedpricelabel}>
                      ${product.price}
                    </span>
                  </div>
                )}
              </div>
              {product?.discount != 0 && (
                <p className={styles.discountlabel}>
                  SAVE {product?.discount}%
                </p>
              )}
            </div>

            {shop && shop.id != product?.shop.id && (
              <div className={styles.quantityformcontainer}>
                <div className={styles.quantitycontainer}>
                  <input
                    type="number"
                    className={styles.quantityfield}
                    value={productQuantity}
                    onChange={handleQuantityChange}
                  />
                  <button
                    className={`${styles.quantityarrow} ${styles.uparrow}`}
                    onClick={handleIncreaseQuantity}
                  >
                    +
                  </button>
                  <button
                    className={`${styles.quantityarrow} ${styles.downarrow}`}
                    onClick={handleDecreaseQuantity}
                  >
                    -
                  </button>
                </div>
                <button
                  className={`${styles.addtocartbutton} ${
                    productQuantity < 0 ? styles.disablebutton : ''
                  }`}
                  onClick={() => {
                    productQuantity > 0 ? handleSubmit() : null;
                  }}
                >
                  {!loading ? (
                    product?.quantity && product?.quantity > 0 ? (
                      'Add To Cart'
                    ) : (
                      'Out of Stock'
                    )
                  ) : (
                    <ClipLoader size={20} />
                  )}
                </button>
              </div>
            )}

            {!shop ||
              (shop.id == product?.shop.id && (
                <div className={styles.quantityformcontainer}>
                  <button
                    className={styles.editproductbutton}
                    onClick={() => {
                      setOpenUpdateProductModal(true);
                    }}
                  >
                    Update Item
                  </button>
                </div>
              ))}

            {success ? (
              <span
                style={{
                  color: 'green',
                  fontWeight: 'bold',
                }}
              >
                Item added to cart successfully !
              </span>
            ) : null}

            <hr style={{ color: 'grey', margin: '30px 0 30px 0' }} />
            {shop && shop.id != product?.shop.id && (
              <div
                className={styles.addtowishlistcontainer}
                onClick={handleAddToWishlistClick}
              >
                <FaHeart fontSize={20} /> Add to wishlist
              </div>
            )}
          </div>
        </div>
        <div className={styles.similarproductsection}>
          <div className={styles.similarproductcontainer}>
            {/* Try */}
            {similarProducts &&
              similarProducts.map((e) => (
                <ProductCard
                  discount={e.discount}
                  id={e.id}
                  image={e.image}
                  name={e.name}
                  price={e.price}
                  key={e.id}
                  style="compact"
                />
              ))}
          </div>
        </div>
        <div>aas</div>
      </div>
      {openUpdateProductModal && product && (
        <Modal closeModal={closeUpdateProductModal} height={35} width={40}>
          <UpdateProductModalContent productID={product?.id} />
        </Modal>
      )}
      {openAddToWishlistModal && (
        <Modal closeModal={closeAddToWishlistModal} height={35} width={40}>
          <AddToWishlistModalContent
            handleCloseModal={closeAddToWishlistModal}
            productId={product?.id}
          />
        </Modal>
      )}
    </Layout>
  );
};

export default ProductDetail;
