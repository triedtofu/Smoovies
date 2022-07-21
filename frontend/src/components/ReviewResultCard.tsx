import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from './ReviewResultCard.module.css';
import MyLink from './MyLink';
import ConfirmModal from './ConfirmModal';

import { UserReview } from '../util/interface';


interface ReviewResultCardProps {
  buttonClick: (() => void) | null;
  review: UserReview;
  error?: string;
}

const ReviewResultCard = ({ buttonClick, review, error }: ReviewResultCardProps) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  return (
    <Card className={styles.card}>
      <CardMedia
        component="img"
        image={review.poster}
        alt={`Movie poster for ${review.movieName}`}
        id={styles.card_media}
      />
      <CardContent className={styles.card_content}>
        <div style={{ display: 'flex' }}>
          <h1>
            <MyLink to={`/movie/${review.movieId}`}>{review.movieName}</MyLink> &nbsp;&nbsp;&nbsp;
            <Rating name="read-only" value={review.rating} readOnly />
            &nbsp;&nbsp;&nbsp;
            {review.rating} / 5
          </h1>
        </div>
        <Divider variant="middle" />
        <div style={{ marginTop: '15px', marginLeft: '4px' }}>
          <span style={{ fontSize: '18px' }}>{review.review}</span>
        </div>
      </CardContent>
      {buttonClick ? (
        <Button
          variant="outlined"
          color="error"
          sx={{ margin: '10px' }}
          onClick={() => setConfirmDelete(true)}
        >
          <DeleteIcon></DeleteIcon>
        </Button>
      ) : (
        <div></div>
      )}

      {buttonClick && confirmDelete &&
        <ConfirmModal
          title="Delete review"
          body="Are you sure you want to delete this review? This action can't be undone."
          confirm={buttonClick}
          cancel={() => setConfirmDelete(false)}
          error={error ?? ''}
        />
      }
    </Card>
  );
};

export default ReviewResultCard;
