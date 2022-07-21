import * as React from 'react';

import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';

import styles from './ReviewCard.module.css';

import MyLink from './MyLink';

import { Review } from '../util/interface';

interface ReviewCardProps {
  review: Review;
  onDelete: (() => void) | undefined;
}

const ReviewCard = ({ review, onDelete }: ReviewCardProps) => {
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
      <div>{review.review}</div>
      {onDelete && <div className={styles.buttonDiv}>
        <Button
          variant="outlined"
          color="error"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>}
    </div>
  );
};

export default ReviewCard;
