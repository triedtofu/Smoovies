import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import { apiGetUserReviews } from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';
import { UserReview } from '../util/interface';

const Profile = () => {
  const params = useParams();
  const [cookies] = useCookies();

  const [review, setReview] = React.useState<UserReview[]>([]);
  const [errorStr, setErrorStr] = React.useState('');
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    setReview([]);
    setName('');
    setErrorStr('');
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiGetUserReviews(parseInt(idStr))
        .then((data) => {
          console.log(data);
          setReview(data.reviews);
          setName(data.username);
        })
        .catch((error) => setErrorStr(getErrorMessage(error)));
    } catch (error) {
      setErrorStr(getErrorMessage(error));
    }
  }, [params]);

  // returns whether the remove from wishlist button should be shown
  const showButton = () => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return false;
    }

    if (!cookies.token || idStr !== parseJwt(cookies.token).jti) return false;

    return true;
  };

  if (errorStr || name === '') return <h2>{errorStr}</h2>;

  return (
    <Container maxWidth="lg">
      <h1>
        {cookies.token && params.id === parseJwt(cookies.token).jti
          ? 'Your Reviews'
          : `${name}'s Reviews`}
      </h1>

      {review.length === 0 && <p>No Reviews made by this user.</p>}
    </Container>
  );
};

export default MakePage(Profile);
