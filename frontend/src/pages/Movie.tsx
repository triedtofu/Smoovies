import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import styles from './Movie.module.css';
import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';
import ReviewCard from '../components/ReviewCard';
import ReviewInput from '../components/ReviewInput';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import {
  apiGetMovie,
  apiUserWishlist,
  apiPutUserWishlist,
  apiDeleteMovie,
  apiAddReview
} from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';
import { SpecificMovieResponse } from '../util/interface';

interface buttonProps {
  state: number;
}

const Movie = () => {
  const [cookies] = useCookies();

  const params = useParams();

  const [movie, setMovie] = React.useState<SpecificMovieResponse | undefined>(undefined);
  const [errorStr, setErrorStr] = React.useState('');
  const [button, setButton] = React.useState(0);

  React.useEffect(() => {
    setErrorStr('');
    setMovie(undefined);

    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      setErrorStr('Error');
      return;
    }

    try {
      const id = parseInt(idStr);
      apiGetMovie(id)
        .then((data) => setMovie({ ...data, id }))
        .catch(error => setErrorStr(getErrorMessage(error)))
    } catch (error) {
      setErrorStr(getErrorMessage(error));
    }
  }, [params]);

  React.useEffect(() => {
    if (!movie || !cookies.token || cookies.admin) return;

    try {
      apiUserWishlist(parseInt(parseJwt(cookies.token).jti)).then((data) => {
        if (data.movies.find(m => m.id === movie.id)) {
          setButton(2);
        } else {
          setButton(1);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [movie]);

  const WishlistButton = ({ state }: buttonProps) => {
    if (state === 1)
      return (
        <Button
          style={{ marginLeft: '30px' }}
          variant="outlined"
          onClick={addMovieToWishlist}
        >
          Add To Wishlist
        </Button>
      );

    if (state === 2)
      return (
        <Button
          style={{ marginLeft: '30px' }}
          variant="outlined"
          color="error"
          onClick={removeMovieFromWishlist}
        >
          Remove From Wishlist
        </Button>
      );

    return <></>;
  };

  const deleteMovie = () => {
    apiDeleteMovie(cookies.token, movie!.id)
      .then(() => {
        setMovie(undefined);
        setErrorStr('Movie has been deleted.')
      })
  };

  const AdminButton = () => {
    if (!cookies.admin) return <></>;

    return (
      <div>
        <Button
          variant="outlined"
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={deleteMovie}
        >
          Delete
        </Button>
      </div>
    );
  }

  if (errorStr) return <p>{errorStr}</p>;

  if (movie && Object.keys(movie).length === 0) return <></>;

  const addMovieToWishlist = () => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiPutUserWishlist(cookies.token, parseInt(idStr), true)
        .then((_) => setButton(2))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  const removeMovieFromWishlist = () => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiPutUserWishlist(cookies.token, parseInt(idStr), false)
        .then((_) => setButton(1))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  const submitReview = (rating: number, review: string) => {
    apiAddReview(cookies.token, parseInt(params.id!), review, rating);
  };

  if (!movie) return <></>;

  return (
    <Container maxWidth="md">
      <div className={styles.titleDiv}>
        <h1>
          {movie.name} ({movie.year})
        </h1>

        <WishlistButton state={button} />
        <AdminButton />
      </div>

      <div style={{ maxWidth: '740px' }}>
        <Youtube code={movie.trailer} />
      </div>

      <br />

      <div style={{ display: 'flex' }}>
        <img src={movie.poster} style={{ width: '200px' }} />

        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2>{movie.name}</h2>
          <div style={{ paddingLeft: '20px', textAlign: 'left' }}>
            <p>
              Genre: {movie.genres.join(', ')}
              <br />
              Director: {movie.director}
              <br />
              Cast: {movie.cast.split(',').map(s => s.trim()).join(', ')}
              <br />
              Content Rating: {movie.contentRating}
              <br />
              Average Rating: {movie.averageRating}
              <br />
              Runtime: {movie.runtime} minutes
            </p>
          </div>
        </div>
      </div>

      <h3>Movie Info</h3>

      <p>{movie.description}</p>

      <div>
        <h2>Reviews</h2>
        <div className={styles.reviewsDiv}>
          {movie.reviews.map(review => (
            <ReviewCard
              key={review.user}
              review={review}
            />
          ))}
        </div>
      </div>
      <br/>

      {cookies.token ? <ReviewInput submitReview={submitReview} /> : <p>Login/Register to write a review!</p>}
         
    </Container>
  );
};

export default MakePage(Movie);
