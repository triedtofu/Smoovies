import * as React from 'react';
import { Link } from 'react-router-dom';

import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

import { Review } from '../util/interface';


const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div>
      <div
        style={{
          paddingBottom: '10px',
          paddingLeft: '30px',
          paddingRight: '30px',
          border: '1px solid black',
          borderRadius: '5px',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            display: 'flex',
          }}
        >
          {review.name}
          &nbsp;&nbsp;&nbsp;
          <Rating
            name="text-feedback"
            value={review.rating}
            readOnly
            precision={0.1}
            emptyIcon={<StarIcon style={{ opacity: 0.7 }} fontSize="inherit" />}
          />
        </div>
        <br />"{review.review}"
      </div>
    </div>
  );
};

export default ReviewCard;
