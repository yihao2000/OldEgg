import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/pagesstyles/productdetail.module.scss';
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
    console.log(token);
    if (!token) {
      router.push('/login');
    } else {
      console.log('Masuk');
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
            console.log(loading);
          })
          .catch(() => {
            console.log(id);
            console.log(productQuantity);
            router.push('/login');
          });
        setLoading(false);

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 7000);
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

  const AddToWishlistModalContent = (props: AddToWishlistModalParameter) => {
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);
    const [checkedWishlists, setCheckedWishlists] = useState<string[]>([]);

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
          // console.log(res.data.data.userwishlists);
          setWishlists(res.data.data.userwishlists);
        })
        .catch((error) => {
          // setError(true);
        });
    }, []);

    useEffect(() => {
      if (wishlists) {
        axios
          .post(
            GRAPHQLAPI,
            {
              query: PRODUCT_USER_WISHLISTS_QUERY,
              variables: {
                productId: props.productId,
              },
            },
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            },
          )
          .then((res) => {
            console.log(res.data.data.productUserWishlists);
          })
          .catch((error) => {
            // setError(true);
          });
      }
    }, [wishlists]);

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
              {productName}
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
            <span className={styles.pricelabel}>
              <b>${product?.price}</b>
            </span>

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
            <div
              className={styles.addtowishlistcontainer}
              onClick={handleAddToWishlistClick}
            >
              <FaHeart fontSize={20} /> Add to wishlist
            </div>
          </div>
        </div>
        <div className={styles.similarproductsection}>
          <div className={styles.similarproductcontainer}>
            {/* Try */}
            {similarProducts &&
              similarProducts.map((e) => (
                <ProductCard
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
