import * as React from 'react';

import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';

import styles from './ReviewCard.module.css';

import MyLink from './MyLink';
import ConfirmModal from './ConfirmModal';

import { Review } from '../util/interface';

interface ReviewCardProps {
  review: Review;
  onDelete: (() => void) | undefined;
  error?: string;
}

const ReviewCard = ({ review, onDelete, error }: ReviewCardProps) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  return (
    <div className={styles.reviewOuter}>
      <div className={styles.reviewHeader}>
        <MyLink href={`/user/${review.user}`}>{review.name}</MyLink>
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
          onClick={() => setConfirmDelete(true)}
        >
          Delete
        </Button>
      </div>}

      {onDelete && confirmDelete &&
        <ConfirmModal
          title="Delete review"
          body="Are you sure you want to delete this review? This action can't be undone."
          confirm={onDelete}
          cancel={() => setConfirmDelete(false)}
          error={error ?? ''}
        />
      }
    </div>
  );
};

export default ReviewCard;
