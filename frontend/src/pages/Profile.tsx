import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import ReviewResultCard from '../components/ReviewResultCard';

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
    apiDeleteReview(cookies.token, movieId, parseJwt(cookies.token).jti).then(
      () => refreshPage()
    );
  };

  // returns whether the remove from review button should be shown
  const showButton = () => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return false;
    }

    if (!cookies.token || idStr !== parseJwt(cookies.token).jti) return false;

    return true;
  };

  const banUser = () => {
    // TODO
    const idStr = params.id ?? '';
    apiBanUser(cookies.token, parseInt(idStr));
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
          {cookies.token && cookies.admin && (
            <Button variant="outlined" color="error" onClick={banUser}>
              Ban User &nbsp;<CancelIcon></CancelIcon>
            </Button>
          )}
        </h1>
      </div>

      {reviews.map((review) => (
        <ReviewResultCard
          key={review.movieId}
          review={review}
          buttonClick={showButton() ? () => removeReview(review.movieId) : null}
        />
      ))}
      {reviews.length === 0 && <p>No reviews.</p>}
    </Container>
  );
};

export default MakePage(Profile);
