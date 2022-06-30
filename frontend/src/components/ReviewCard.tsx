import * as React from 'react';
import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

interface ReviewCardProps {
  reviewUser: number;
  reviewDescription: string;
  reviewRating: number;
}

const ReviewCard = (props: ReviewCardProps) => {
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
          User {props.reviewUser}
          &nbsp;&nbsp;&nbsp;
          <Rating
            name="text-feedback"
            value={props.reviewRating}
            readOnly
            precision={0.1}
            emptyIcon={<StarIcon style={{ opacity: 0.7 }} fontSize="inherit" />}
          />
        </div>
        <br />"{props.reviewDescription}"
      </div>
    </div>
  );
};

export default ReviewCard;
