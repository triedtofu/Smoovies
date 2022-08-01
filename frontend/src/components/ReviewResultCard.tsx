import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';

import styles from './ReviewResultCard.module.css';
import MyLink from './MyLink';
import ConfirmModal from './ConfirmModal';

import { UserReview } from '../util/interface';

interface ReviewResultCardProps {
  buttonClick: (() => void) | null;
  review: UserReview;
  error?: string;
}

const ReviewResultCard = ({
  buttonClick,
  review,
  error,
}: ReviewResultCardProps) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  return (
    <>
      <Card className={styles.card}>
        <CardMedia
          component="img"
          image={review.poster}
          alt={`Movie poster for ${review.movieName}`}
          className={styles.cardMedia}
        />
        <CardContent className={styles.cardContent}>
          <div className={styles.reviewDiv}>
            <div className={styles.reviewHead}>
              <Typography variant="h5" component="h2">
                <MyLink href={`/movie/${review.movieId}`}>
                  {review.movieName}
                </MyLink>
              </Typography>
              <div className={styles.ratingDiv}>
                <Rating name="read-only" value={review.rating} readOnly />
                <Typography variant="h5" component="h2">
                  {review.rating} / 5
                </Typography>
              </div>
              {review.likes}
            </div>
            <Divider />
            <p>{review.review}</p>
          </div>

          {buttonClick ? (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setConfirmDelete(true)}
            >
              <DeleteIcon></DeleteIcon>
            </Button>
          ) : (
            <div></div>
          )}
        </CardContent>
      </Card>
      {buttonClick && confirmDelete && (
        <ConfirmModal
          title="Delete review"
          body="Are you sure you want to delete this review? This action can't be undone."
          confirm={buttonClick}
          cancel={() => setConfirmDelete(false)}
          error={error ?? ''}
        />
      )}
    </>
  );
};

export default ReviewResultCard;
