import * as React from 'react';
import { useParams } from 'react-router-dom';

import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';

import styles from './ReviewCard.module.css';

import MyLink from './MyLink';
import ConfirmModal from './ConfirmModal';

import { Review } from '../util/interface';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useCookies } from 'react-cookie';
import { apilikeUnlikeReview } from '../util/api';

interface ReviewCardProps {
  review: Review;
  onDelete: (() => void) | undefined;
  error?: string;
}

const ReviewCard = ({ review, onDelete, error }: ReviewCardProps) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [numLikes, setLikes] = React.useState(review.likes);
  const [heartColour, setHeartColour] = React.useState('');
  const [reviewTextColour, setReviewTextColour] = React.useState('');
  const [reviewBGColour, setReviewBGColour] = React.useState('');

  const [cookies] = useCookies();
  const params = useParams();

  React.useEffect(() => {
    if (review.liked === true) {
      setHeartColour('#ff0000');
      setReviewTextColour('#000000');
      setReviewBGColour('#ffa8b5');
    } else {
      setHeartColour('#a9a9a9');
      setReviewTextColour('#bebebe');
      setReviewBGColour('#ffffff');
    }
  }, []);

  const likeUnlikeClick = () => {
    if (heartColour === '#a9a9a9') {
      // set to like status
      setHeartColour('#ff0000');
      setReviewTextColour('#000000');
      setReviewBGColour('#ffa8b5');
      setLikes(numLikes + 1);
      apilikeUnlikeReview(
        cookies.token,
        parseInt(params.id ?? ''),
        review.user,
        true
      );
      // Do api
    } else {
      // set to unlike status
      setHeartColour('#a9a9a9');
      setReviewTextColour('#bebebe');
      setReviewBGColour('#ffffff');
      setLikes(numLikes - 1);
      apilikeUnlikeReview(
        cookies.token,
        parseInt(params.id ?? ''),
        review.user,
        false
      );
    }
  };

  return (
    <div className={styles.reviewOuter}>
      <div className={styles.reviewHeader}>
        <MyLink href={`/user/${review.user}`}>{review.name}</MyLink>
        <div className={styles.likeAndReview}>
          <Rating
            name="text-feedback"
            value={review.rating}
            readOnly
            emptyIcon={<StarIcon style={{ opacity: 0.7 }} fontSize="inherit" />}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          {cookies.token && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <Button
                variant="outlined"
                style={{
                  backgroundColor: reviewBGColour,
                  borderColor: reviewTextColour,
                }}
                onClick={() => likeUnlikeClick()}
              >
                <FavoriteIcon style={{ color: heartColour }} />
                &nbsp;
                <span style={{ color: reviewTextColour }}>{numLikes}</span>
              </Button>
            </motion.div>
          )}
          {!cookies.token && (
            <Button
              disabled
              variant="outlined"
              style={{
                backgroundColor: reviewBGColour,
                borderColor: reviewTextColour,
              }}
              onClick={() => likeUnlikeClick()}
            >
              <FavoriteIcon style={{ color: heartColour }} />
              &nbsp;
              <span style={{ color: reviewTextColour }}>{numLikes}</span>
            </Button>
          )}
        </div>
      </div>
      <div>{review.review}</div>
      {onDelete && (
        <div className={styles.buttonDiv}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>
        </div>
      )}

      {onDelete && confirmDelete && (
        <ConfirmModal
          title="Delete review"
          body="Are you sure you want to delete this review? This action can't be undone."
          confirm={onDelete}
          cancel={() => setConfirmDelete(false)}
          error={error ?? ''}
        />
      )}
    </div>
  );
};

export default ReviewCard;
