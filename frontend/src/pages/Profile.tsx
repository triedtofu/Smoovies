import React from 'react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

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

const PAGE_SIZE = 10;

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [cookies] = useCookies();

  const [reviews, setReviews] = React.useState<UserReview[]>([]);
  const [errorStr, setErrorStr] = React.useState('');
  const [name, setName] = React.useState('');

  const [numReviewsShown, setNumReviewsShown] = React.useState(PAGE_SIZE);

  const [deletReviewErr, setDeleteReviewErr] = React.useState('');
  const [confirmBanUser, setConfirmBanUser] = React.useState(false);
  const [BLUser, setBLUser] = React.useState(true);
  const [banUserErr, setBanUserErr] = React.useState('');

  const refreshPage = () => {
    setErrorStr('');
    try {
      apiGetUserReviews(parseInt(params.id!), cookies.token)
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
  }, [params.id]);

  const removeReview = (movieId: number) => {
    apiDeleteReview(cookies.token, movieId, parseInt(params.id!))
      .then(() => refreshPage())
      .catch((error) => setDeleteReviewErr(getErrorMessage(error)));
  };

  // returns whether the remove from review button should be shown
  const showButton = () => {
    if (
      !cookies.token ||
      (!cookies.admin && params.id! !== parseJwt(cookies.token).jti)
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
    const idStr = params.id ?? '';
    apiPutBlacklistUser(cookies.token, parseInt(idStr), BLUser);
    setBLUser(false);
  };

  if (errorStr || name === '') return <h2>{errorStr}</h2>;

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>
          {cookies.token && params.id === parseJwt(cookies.token).jti
            ? 'Your Reviews'
            : `${name}'s Reviews`}{' '}
          - Smoovies
        </title>
      </Helmet>

      <div className={styles.headerDiv}>
        <Typography
          gutterBottom
          variant="h4"
          component="h1"
          fontFamily={'Verdana'}
        >
          {cookies.token && params.id === parseJwt(cookies.token).jti
            ? 'Your Reviews'
            : `${name}'s Reviews`}
        </Typography>
        {cookies.admin && params.id !== parseJwt(cookies.token).jti && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => setConfirmBanUser(true)}
          >
            Ban User &nbsp;<CancelIcon></CancelIcon>
          </Button>
        )}
        {BLUser && cookies.token && params.id !== parseJwt(cookies.token).jti && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => blacklistUser()}
          >
            Blacklist User
          </Button>
        )}
        {!BLUser &&
          cookies.token &&
          params.id !== parseJwt(cookies.token).jti && 
          (
            <h2 style={{ color: 'red', font: 'Futura' }}>
              You have blacklisted this user
            </h2>
          )
        }
      </div>

      {!(cookies.token && params.id === parseJwt(cookies.token).jti) && (
        <Button variant="outlined" onClick={() => navigate('wishlist')}>
          Their Wishlist
        </Button>
      )}

      {confirmBanUser && (
        <ConfirmModal
          title="Ban user"
          body={`Are you sure you want to ban ${name}? This action can't be undone.`}
          confirm={banUser}
          cancel={() => setConfirmBanUser(false)}
          error={banUserErr}
        />
      )}

      {reviews.length === 0 && <p>No reviews.</p>}

      {reviews.slice(0, numReviewsShown).map((review) => (
        <ReviewResultCard
          key={review.movieId}
          review={review}
          buttonClick={showButton() ? () => removeReview(review.movieId) : null}
          error={deletReviewErr}
        />
      ))}

      {numReviewsShown < reviews.length && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={() => setNumReviewsShown(numReviewsShown + PAGE_SIZE)}
          >
            Show more
          </Button>
        </div>
      )}
    </Container>
  );
};

export default MakePage(Profile);
