import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import ReviewResultCard from '../components/ReviewResultCard';
import ConfirmModal from '../components/ConfirmModal';

import { apiBanUser, apiGetUserReviews, apiDeleteReview } from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';
import { UserReview } from '../util/interface';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';

const Profile = () => {
  const params = useParams();
  const [cookies] = useCookies();

  const [reviews, setReviews] = React.useState<UserReview[]>([]);
  const [errorStr, setErrorStr] = React.useState('');
  const [name, setName] = React.useState('');
  
  const[deletReviewErr, setDeleteReviewErr] = React.useState('');
  const[confirmBanUser, setConfirmBanUser] = React.useState(false);
  const[banUserErr, setBanUserErr] = React.useState('');

  const refreshPage = () => {
    setErrorStr('');
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiGetUserReviews(parseInt(idStr))
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
      .catch(error => setDeleteReviewErr(getErrorMessage(error)));
  };

  // returns whether the remove from review button should be shown
  const showButton = () => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return false;
    }

    if (!cookies.token || (!cookies.admin && idStr !== parseJwt(cookies.token).jti)) return false;

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
      .catch(error => setBanUserErr(getErrorMessage(error)));
  };

  if (errorStr || name === '') return <h2>{errorStr}</h2>;

  return (
    <Container maxWidth="lg">
      <div style={{ justifyContent: 'space-between' }}>
        <h1
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: '10px',
            marginRight: '10px',
          }}
        >
          {cookies.token && params.id === parseJwt(cookies.token).jti
            ? 'Your Reviews'
            : `${name}'s Reviews`}
          {cookies.token && cookies.admin && params.id !== parseJwt(cookies.token).jti && (
            <Button variant="outlined" color="error" onClick={() => setConfirmBanUser(true)}>
              Ban User &nbsp;<CancelIcon></CancelIcon>
            </Button>
          )}

          {confirmBanUser &&
            <ConfirmModal
              title="Ban user"
              body={`Are you sure you want to ban ${name}? This action can't be undone.`}
              confirm={banUser}
              cancel={() => setConfirmBanUser(false)}
              error={banUserErr}
            />
          }
        </h1>
      </div>

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
