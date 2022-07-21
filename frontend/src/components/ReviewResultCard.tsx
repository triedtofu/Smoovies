import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';

import styles from './ReviewResultCard.module.css';
import { UserReview } from '../util/interface';
import MyLink from './MyLink';

import DeleteIcon from '@mui/icons-material/Delete';

interface ReviewResultCardProps {
  buttonClick: (() => void) | null;
  review: UserReview;
}

const ReviewResultCard = ({ buttonClick, review }: ReviewResultCardProps) => {
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
          onClick={buttonClick}
        >
          <DeleteIcon></DeleteIcon>
        </Button>
      ) : (
        <div></div>
      )}
    </Card>
  );
};

export default ReviewResultCard;
