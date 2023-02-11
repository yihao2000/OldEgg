import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { GRAPHQLAPI, PROMOS_QUERY } from '@/util/constant';
import styles from '@/styles/home.module.css';

interface Promo {
  id: string;
  name: string;
  description: string;
  image: string;
}

const PromoCarousel = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<Promo>();
  const carouselItemsRef = useRef<HTMLDivElement[] | null[]>([]);

  const [promos, setPromos] = useState<Promo[]>([]);
  useEffect(() => {
    axios
      .post(GRAPHQLAPI, {
        query: PROMOS_QUERY,
      })
      .then((res) => setPromos(res.data.data.promos));
  }, []);

  useEffect(() => {
    if (promos[0] && promos[0].image) {
      console.log(promos[0].image);
      carouselItemsRef.current = carouselItemsRef.current.slice(
        0,
        promos.length,
      );

      setSelectedImageIndex(0);
      setSelectedImage(promos[0]);
    }
  }, [promos]);

  const handleSelectedImageChange = (newIdx: number) => {
    if (promos && promos.length > 0) {
      setSelectedImage(promos[newIdx]);
      setSelectedImageIndex(newIdx);
      if (carouselItemsRef?.current[newIdx]) {
        carouselItemsRef?.current[newIdx]?.scrollIntoView({
          block: 'end',
          inline: 'center',
          behavior: 'smooth',
        });
      }
    }
  };

  const handleRightClick = () => {
    if (promos && promos.length > 0) {
      let newIdx = selectedImageIndex + 1;
      if (newIdx >= promos.length) {
        newIdx = 0;
      }
      handleSelectedImageChange(newIdx);
    }
  };

  const handleLeftClick = () => {
    if (promos && promos.length > 0) {
      let newIdx = selectedImageIndex - 1;
      if (newIdx < 0) {
        newIdx = promos.length - 1;
      }
      handleSelectedImageChange(newIdx);
    }
  };

  return (
    <div className={styles.promocarouselcontainer}>
      {/* <button onClick={handleLeftClick} className={styles.textbutton}>
        &lsaquo;
      </button> */}

      <div className={styles.selectedimagecontainer}>
        {/* <button onClick={handleLeftClick} className={styles.textbutton}>
          &lsaquo;
        </button> */}
        <img
          src={selectedImage?.image}
          alt=""
          className={styles.selectedimage}
        />
      </div>
      {/* <button onClick={handleRightClick} className={styles.textbutton}>
        &rsaquo;
      </button> */}
    </div>
  );
};

export default PromoCarousel;
