import * as React from 'react';

import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

import styles from './ReviewCard.module.css';

import MyLink from './MyLink';

import { Review } from '../util/interface';


const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className={styles.reviewOuter}>
      <div className={styles.reviewHeader}>
        <MyLink to={`/user/${review.user}`}>{review.name}</MyLink>
        <Rating
          name="text-feedback"
          value={review.rating}
          readOnly
          emptyIcon={<StarIcon style={{ opacity: 0.7 }} fontSize="inherit" />}
        />
      </div>
      <div>"{review.review}"</div>
    </div>
  );
};

export default ReviewCard;
