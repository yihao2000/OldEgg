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

  useEffect(() => {
    console.log(id);
    if (id) {
      axios
        .post(GRAPHQLAPI, {
          query: SHOP_QUERY,
          variables: {
            shopID: id,
          },
        })
        .then((res) => {
          setShop(res.data.data.shop);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      axios
        .post(GRAPHQLAPI, {
          query: SHOP_PRODUCTS_QUERY,
          variables: {
            shopID: id,
            sortBy: sortBy,
          },
        })
        .then((res) => {
          setProducts(res.data.data.shopProducts);
          console.log(res.data.data.shopProducts);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [sortBy, id]);

  useEffect(() => {
    var tempCategories = [] as Category[];
    products?.map((p) => {
      console.log(p);
      var exist;
      if (tempCategories.length == 0) {
        console.log('masuk');
        exist = false;
      } else {
        console.log(tempCategories);
        exist = tempCategories.some((obj) => obj.id === p.category.id);
      }

      if (!exist) {
        console.log('Masuk sekali');
        tempCategories.push(p.category);
      }
    });
    setCategoriesOwned(tempCategories);
  }, [products]);

  return (
    <Layout>
      {shop && shop.banned == true && (
        <div
          style={{
            width: '98vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'red',
          }}
        >
          Shop is banned
        </div>
      )}
      {shop && shop.banned == false && (
        <div className={styles.maincontainer}>
          <ShopHeader />
          <div className={styles.contentcontainer}>
            <div className={styles.bannercontainer}>
              <img src={shop.banner} alt="" className={styles.shopbanner} />
            </div>
            <div className={styles.categorysection}>
              <div className={styles.titlelabel}>Shop by Category</div>

              <div className={styles.listcontainer}>
                {categoriesOwned.map((c) => {
                  return (
                    <form action={links.shopProductslistCategory(shop.id)}>
                      <div onClick={() => {}}>
                        <button className={styles.categorycard}>
                          {c.name}
                        </button>
                        <input
                          type="text"
                          placeholder="Search.."
                          name="category"
                          id="category"
                          className={styles.navbarsearch}
                          value={c.id}
                          style={{
                            display: 'none',
                          }}
                        />
                      </div>
                    </form>
                  );
                })}
              </div>
            </div>
            <div className={styles.titlelabel}>Recommended Products</div>
            <div>
              {' '}
              <span
                style={{
                  fontWeight: 'bold',
                }}
              >
                Filter By:
              </span>{' '}
              <select
                value={sortBy}
                // className={styles.forminputselection}
                onChange={(event) => {
                  setSortBy(event.target.value);
                }}
                className={styles.selectstyle}
              >
                <option value="topsold">Most Sold</option>
                <option value="toprating">Highest Rating</option>
                {/* <option value="featureditems">Featured Items</option> */}
              </select>
            </div>
            <div className={styles.productscontainer}>
              {products?.map((x) => {
                return (
                  <ProductCard
                    discount={x.discount}
                    id={x.id}
                    image={x.image}
                    name={x.name}
                    price={x.price}
                    style="original"
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
