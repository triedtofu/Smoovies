import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';

import styles from './Movie.module.css';
import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';
import ReviewCard from '../components/ReviewCard';
import ReviewInput from '../components/ReviewInput';
import MyLink from '../components/MyLink';
import ConfirmModal from '../components/ConfirmModal';
import Container from '../components/MyContainer';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SimilarMovieCard from '../components/SimilarMovieCard';

import {
  apiGetMovie,
  apiUserWishlist,
  apiPutUserWishlist,
  apiDeleteMovie,
  apiAddReview,
  apiDeleteReview,
} from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';
import { SpecificMovieResponse } from '../util/interface';

interface buttonProps {
  state: number;
}

let addingReview = false;

const PAGE_SIZE = 5;

const Movie = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const params = useParams();

  const [movie, setMovie] = React.useState<SpecificMovieResponse | undefined>(
    undefined
  );
  const [numReviewsShown, setNumReviewsShown] = React.useState(PAGE_SIZE);

  const [errorStr, setErrorStr] = React.useState('');
  const [button, setButton] = React.useState(0);
  const [deleteMovieConfirm, setDeleteMovieConfirm] = React.useState(false);
  const [deleteMovieErr, setDeleteMovieErr] = React.useState('');
  const [deleteReviewErr, setDeleteReviewErr] = React.useState('');

  const updateMovie = (id: number) => {
    apiGetMovie(id, cookies.token)
      .then((data) => setMovie(data))
      .catch((error) => setErrorStr(getErrorMessage(error)));
  };

  React.useEffect(() => {
    const id = parseInt(params.id ?? '');

    if (Number.isNaN(id)) {
      setErrorStr('Invalid movie id');
      return;
    }

    setErrorStr('');
    setMovie(undefined);

    updateMovie(id);
  }, [params.id]);

  React.useEffect(() => {
    if (!movie || !cookies.token || cookies.admin) return;

    try {
      apiUserWishlist(parseInt(parseJwt(cookies.token).jti)).then((data) => {
        if (data.movies.find((m) => m.id === movie.id)) {
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
        <Button variant="outlined" onClick={addMovieToWishlist}>
          Add To Wishlist
        </Button>
      );

    if (state === 2)
      return (
        <Button
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
        setErrorStr('Movie has been deleted.');
        setDeleteMovieConfirm(false);
      })
      .catch((error) => setDeleteMovieErr(getErrorMessage(error)));
  };

  const AdminButton = () => {
    if (!cookies.admin) return <></>;

    return (
      <div className={styles.adminButtonsDiv}>
        <Button variant="outlined" onClick={() => navigate('edit')}>
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteMovieConfirm(true)}
        >
          Delete
        </Button>
      </div>
    );
  };

  if (errorStr) return (
    <Container maxWidth="md">
      <Typography variant="h5" component="h2">{errorStr}</Typography>
    </Container>
  );

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
    if (addingReview) return;

    addingReview = true;
    apiAddReview(cookies.token, parseInt(params.id!), review, rating)
      .then(() => {
        addingReview = false;
        updateMovie(parseInt(params.id!));
      })
      .catch(() => (addingReview = false));
  };

  const deleteReview = (movieId: number, reviewUser: number) => {
    apiDeleteReview(cookies.token, movieId, reviewUser)
      .then(() => updateMovie(movieId))
      .catch((error) => setDeleteReviewErr(getErrorMessage(error)));
    // TODO handle error
  };

  const deleteButtonFunc = (reviewUser: number) => {
    if (
      cookies.token &&
      (cookies.admin || reviewUser === parseInt(parseJwt(cookies.token).jti))
    ) {
      return () => deleteReview(movie!.id, reviewUser);
    }

    return undefined;
  };

  if (!movie) return <></>;

  return (
    <Container maxWidth="md">
      <Helmet>
        <title>{`${movie.name} - Smoovies`}</title>
      </Helmet>
      <div className={styles.titleDiv}>
        <Typography
          gutterBottom
          variant="h4"
          component="h1"
          fontFamily={'Verdana'}
        >
          {movie.name} ({movie.year})
        </Typography>

        <WishlistButton state={button} />
        <AdminButton />

        {deleteMovieConfirm && (
          <ConfirmModal
            title="Delete movie"
            body={`Are you sure you want to delete ${movie.name}? This action can't be undone.`}
            confirm={deleteMovie}
            cancel={() => setDeleteMovieConfirm(false)}
            error={deleteMovieErr}
          />
        )}
      </div>

      <div style={{ maxWidth: '740px' }}>
        <Youtube code={movie.trailer} />
      </div>

      <br />

      <div className={styles.movieSummary}>
        <img src={movie.poster} style={{ height: '300px', width: '200px' }} />

        <div style={{ width: '100%', display: 'flex ' }}>
          <div>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              fontFamily={'Verdana'}
            >
              {movie.name}
            </Typography>

            <p style={{ display: 'flex' }}>
              Genre:{' '}
              {movie.genres
                .map((s) => s[0].toUpperCase() + s.slice(1))
                .join(', ')}
              <br />
              Director:{' '}
              {movie.director
                .split(',')
                .map((s) => s.trim())
                .join(', ')}
              <br />
              Cast:{' '}
              {movie.cast
                .split(',')
                .map((s) => s.trim())
                .join(', ')}
              <br />
              Content Rating: {movie.contentRating}
              <br />
              Average Rating: {movie.averageRating} / 5
              <br />
              Runtime: {movie.runtime} minutes
            </p>
          </div>
        </div>
      </div>
      <br />
      <div>
        <Typography variant="h5" component="h3" fontFamily={'Verdana'}>
          Movie Info
        </Typography>

        <p>{movie.description}</p>
      </div>
      <br />
      <div>
        <Typography variant="h5" component="h3" fontFamily={'Verdana'}>
          Movies similar to this one!
        </Typography>
        <br />
        <div className={styles.similarMoviesDiv}>
          {movie.similar.map((similarMovie) => (
            <SimilarMovieCard key={similarMovie.id} movie={similarMovie} />
          ))}
        </div>
      </div>
      <br />
      <div>
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          fontFamily={'Verdana'}
        >
          Reviews
        </Typography>
        <div className={styles.reviewsDiv}>
          {movie.reviews.slice(0, numReviewsShown).map((review) => (
            <ReviewCard
              key={review.user}
              onDelete={deleteButtonFunc(review.user)}
              review={review}
              error={deleteReviewErr}
            />
          ))}

          {numReviewsShown < movie.reviews.length && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={() => setNumReviewsShown(numReviewsShown + PAGE_SIZE)}
              >
                Show more
              </Button>
            </div>
          )}
        </div>
      </div>

      {!cookies.token && (
        <p>
          <MyLink href="/login">Login</MyLink>/
          <MyLink href="/register">Register</MyLink> to write a review!
        </p>
      )}

      <br />

      {cookies.token &&
        !movie.reviews.find(
          (review) => review.user === parseInt(parseJwt(cookies.token).jti)
        ) && <ReviewInput submitReview={submitReview} />}
    </Container>
  );
};

export default MakePage(Movie);
