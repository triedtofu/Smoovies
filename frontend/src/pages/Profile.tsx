import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Typography from '@mui/material/Typography';

import Container from '../components/MyContainer';
import MakePage from '../components/MakePage';
import ReviewResultCard from '../components/ReviewResultCard';
import ConfirmModal from '../components/ConfirmModal';

import {
  apiBanUser,
  apiGetUserReviews,
  apiDeleteReview,
  apiPutBlacklistUser,
} from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';
import { UserReview } from '../util/interface';

import styles from './Profile.module.css';

const Profile = () => {
  const params = useParams();
  const [cookies] = useCookies();

  const [reviews, setReviews] = React.useState<UserReview[]>([]);
  const [errorStr, setErrorStr] = React.useState('');
  const [name, setName] = React.useState('');

  const [deletReviewErr, setDeleteReviewErr] = React.useState('');
  const [confirmBanUser, setConfirmBanUser] = React.useState(false);
  const [BLUser, setBLUser] = React.useState(true);
  const [banUserErr, setBanUserErr] = React.useState('');

  const refreshPage = () => {
    setErrorStr('');
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiGetUserReviews(parseInt(idStr), cookies.token)
        .then((data) => {
          setReviews(data.reviews);
          setName(data.username);
        })
        .catch((error) => setErrorStr(getErrorMessage(error)));
    } catch (error) {
      setErrorStr(getErrorMessage(error));
    }
  };

  React.useEffect(() => {
    setReviews([]);
    setName('');
    refreshPage();
  }, [params]);

  const removeReview = (movieId: number) => {
    apiDeleteReview(cookies.token, movieId, parseInt(params.id!))
      .then(() => refreshPage())
      .catch((error) => setDeleteReviewErr(getErrorMessage(error)));
  };

  // returns whether the remove from review button should be shown
  const showButton = () => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return false;
    }

    if (
      !cookies.token ||
      (!cookies.admin && idStr !== parseJwt(cookies.token).jti)
    )
      return false;

    return true;
  };

  const banUser = () => {
    setErrorStr('');

    const idStr = params.id ?? '';
    apiBanUser(cookies.token, parseInt(idStr))
      .then(() => {
        setConfirmBanUser(false);
        refreshPage();
      })
      .catch((error) => setBanUserErr(getErrorMessage(error)));
  };

  const blacklistUser = () => {
    // TODO
    const idStr = params.id ?? '';
    apiPutBlacklistUser(cookies.token, parseInt(idStr), BLUser);
    setBLUser(false);
  };

  if (errorStr || name === '') return <h2>{errorStr}</h2>;

  return (
    <Container maxWidth="lg">
      <div className={styles.headerDiv}>
        <Typography gutterBottom variant="h4" component="h1">
          {cookies.token && params.id === parseJwt(cookies.token).jti
            ? 'Your Reviews'
            : `${name}'s Reviews`}
        </Typography>
        {cookies.token &&
          cookies.admin &&
          params.id !== parseJwt(cookies.token).jti && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setConfirmBanUser(true)}
            >
              Ban User &nbsp;<CancelIcon></CancelIcon>
            </Button>
          )}
        {BLUser && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => blacklistUser()}
          >
            Blacklist User
          </Button>
        )}
        {!BLUser && (
          <h2 style={{ color: 'red', font: 'Futura' }}>
            You have blacklisted this user
          </h2>
        )}
      </div>

      {confirmBanUser && (
        <ConfirmModal
          title="Ban user"
          body={`Are you sure you want to ban ${name}? This action can't be undone.`}
          confirm={banUser}
          cancel={() => setConfirmBanUser(false)}
          error={banUserErr}
        />
      )}

      {reviews.map((review) => (
        <ReviewResultCard
          key={review.movieId}
          review={review}
          buttonClick={showButton() ? () => removeReview(review.movieId) : null}
          error={deletReviewErr}
        />
      ))}
      {reviews.length === 0 && <p>No reviews.</p>}
    </Container>
  );
};

export default MakePage(Profile);
