import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';

import styles from './Movie.module.css';
import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';
import ReviewCard from '../components/ReviewCard';
import ReviewInput from '../components/ReviewInput';
import MyLink from '../components/MyLink';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

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

const Movie = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const params = useParams();
  const animation = useAnimation();
  const animation2 = useAnimation();
  const animation3 = useAnimation();

  const [movie, setMovie] = React.useState<SpecificMovieResponse | undefined>(
    undefined
  );
  const [errorStr, setErrorStr] = React.useState('');
  const [button, setButton] = React.useState(0);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [ref3, inView3] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const updateMovie = (id: number) => {
    apiGetMovie(id)
      .then((data) => setMovie(data))
      .catch((error) => setErrorStr(getErrorMessage(error)));
  };

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
      updateMovie(id);
    } catch (error) {
      setErrorStr(getErrorMessage(error));
    }
  }, [params]);

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

  React.useEffect(() => {
    if (inView) {
      animation.start({
        x: 0,
        transition: {
          type: 'spring',
          duration: 0.7,
          bounce: 0.3,
        },
      });
    } else {
      animation.start({ x: '-100vw' });
    }
  }, [inView]);

  React.useEffect(() => {
    if (inView2) {
      animation2.start({
        y: 0,
        transition: {
          type: 'spring',
          duration: 0.5,
          bounce: 0.3,
        },
      });
    } else {
      animation2.start({ y: '100vh' });
    }
  }, [inView2]);

  React.useEffect(() => {
    if (inView3) {
      animation3.start({
        y: 0,
        transition: {
          type: 'spring',
          duration: 0.5,
          bounce: 0.3,
        },
      });
    } else {
      animation3.start({ y: '50vh' });
    }
  }, [inView3]);

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
    apiDeleteMovie(cookies.token, movie!.id).then(() => {
      setMovie(undefined);
      setErrorStr('Movie has been deleted.');
    });
  };

  const AdminButton = () => {
    if (!cookies.admin) return <></>;

    return (
      <div className={styles.adminButtonsDiv}>
        <Button variant="outlined" onClick={() => navigate('edit')}>
          Edit
        </Button>
        <Button variant="outlined" color="error" onClick={deleteMovie}>
          Delete
        </Button>
      </div>
    );
  };

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
    if (addingReview) return;

    addingReview = true;
    apiAddReview(cookies.token, parseInt(params.id!), review, rating).then(() => {
      addingReview = false;
      updateMovie(parseInt(params.id!));
    })
      .catch(() => addingReview = false);
  };

  const deleteReview = (movieId: number, reviewUser: number) => {
    apiDeleteReview(cookies.token, movieId, reviewUser)
      .then(() => updateMovie(movieId));
    // TODO handle error
  };

  const deleteButtonFunc = (reviewUser: number) => {
    if (cookies.token && 
      (cookies.admin || reviewUser === parseInt(parseJwt(cookies.token).jti))) {
      return () => deleteReview(movie!.id, reviewUser);
    }

    return undefined;
  }

  if (!movie) return <></>;

  return (
    <Container maxWidth="md">
      <Helmet>
        <title>{`${movie.name} - Smoovies`}</title>
      </Helmet>
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

      <div ref={ref} style={{ display: 'flex' }}>
        <motion.div
          style={{ display: 'flex' }}
          initial={{ x: '-100vw' }}
          animate={animation}
          transition={{ type: 'spring', duration: 0.7, bounce: 0.3 }}
        >
          <img src={movie.poster} style={{ width: '200px' }} />

          <div style={{ width: '100%', textAlign: 'center' }}>
            <h2>{movie.name}</h2>
            <div style={{ paddingLeft: '20px', textAlign: 'left' }}>
              <p>
                Genre: {movie.genres.join(', ')}
                <br />
                Director: {movie.director}
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
        </motion.div>
      </div>

      <div ref={ref3}>
        <motion.div
          initial={{ y: '50vh' }}
          animate={animation3}
          transition={{ type: 'spring', duration: 1, bounce: 0.3 }}
        >
          <h3>Movie Info</h3>

          <p>{movie.description}</p>
        </motion.div>
      </div>

      <div ref={ref2}>
        <div>
          <h2>Reviews</h2>
          <div className={styles.reviewsDiv}>
            {movie.reviews.map((review) => (
              <ReviewCard
                key={review.user}
                onDelete={deleteButtonFunc(review.user)}
                review={review}
              />
            ))}
          </div>
        </div>

        {!cookies.token && (
          <p>
            <MyLink to="/login">Login</MyLink>/
            <MyLink to="/register">Register</MyLink> to write a review!
          </p>
        )}

        <br />

        {cookies.token &&
          !movie.reviews.find(
            (review) =>
              review.user === parseInt(parseJwt(cookies.token).jti)
          ) &&
          <motion.div animate={animation2}>
            <ReviewInput submitReview={submitReview} />
          </motion.div>
        }
      </div>
    </Container>
  );
};

export default MakePage(Movie);
