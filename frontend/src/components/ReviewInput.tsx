import React from 'react';

import styles from './ReviewInput.module.css';

import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface ReviewInputProps {
  submitReview: (rating: number, review: string) => void;
}

const ReviewInput = (props: ReviewInputProps) => {
  const [rating, setRating] = React.useState<number | null>(3);
  const [review, setReview] = React.useState('');

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    props.submitReview(rating ?? 0, review);
  }

  return (
    <div className={styles.reviewDiv}>
      <div className={styles.reviewHeader}>
        <Typography gutterBottom variant="h5" component="h2">Write a Review</Typography>
        <Rating
          name="half-rating"
          value={rating}
          onChange={(_, value) => setRating(value)}
        />
      </div>
      <form className={styles.reviewForm} onSubmit={submitReview}>
        <TextField
          minRows={5}
          multiline
          fullWidth
          required
          placeholder="Write your review here"
          value={review}
          onChange={e => setReview(e.target.value)}
        />
        <Button size="small" variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default ReviewInput;
