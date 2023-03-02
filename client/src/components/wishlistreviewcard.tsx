import { WishlistReview } from './interfaces/interfaces';
import styles from '@/styles/componentstyles/reviewcard.module.scss';

interface Parameter {
  wishlistReview: WishlistReview;
}

export default function WishlistReviewCard(props: Parameter) {
  return (
    <div className={styles.cardcontainer}>
      <div className={styles.reviewratingcontainer}>
        <span>Rating: </span>
        <span className={styles.accenthighlight}>
          {props.wishlistReview.rating}/5
        </span>
      </div>
      <div className={styles.reviewtitle}>{props.wishlistReview.title}</div>
      <div className={styles.reviewcomment}>{props.wishlistReview.comment}</div>
      <div className={styles.reviewuser}>
        By {props.wishlistReview.customName}
      </div>
    </div>
  );
}
