import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import styles from './Movie.module.css';
import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';
import Container from '../components/MyContainer';

import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ReviewCard from '../components/ReviewCard';

import {
  apiGetMovie,
  apiUserWishlist,
  apiPutUserWishlist,
  apiDeleteMovie,
} from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';
import { SpecificMovieResponse } from '../util/interface';

import { useInView } from 'react-intersection-observer';

import {
  motion,
  useViewportScroll,
  useTransform,
  useMotionValue,
  useAnimation,
} from 'framer-motion';

interface buttonProps {
  state: number;
}

const TestingUI = () => {
  const [cookies] = useCookies();

  const params = useParams();

  const [movie, setMovie] = React.useState<SpecificMovieResponse | undefined>(
    undefined
  );
  const [errorStr, setErrorStr] = React.useState('');
  const [button, setButton] = React.useState(0);

  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  const animation = useAnimation();

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
      apiGetMovie(id, cookies.token)
        .then((data) => setMovie({ ...data, id }))
        .catch((error) => setErrorStr(getErrorMessage(error)));
    } catch (error) {
      setErrorStr(getErrorMessage(error));
    }
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

  React.useEffect(() => {
    console.log('usedeffect hook working');
    if (inView) {
      animation.start({
        x: 0,
        transition: {
          type: 'string',
          duration: 1,
          bounce: 0.3,
        },
      });
    } else {
      animation.start({ x: '-100vw' });
    }
  }, [inView]);

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
    apiDeleteMovie(cookies.token, movie!.id).then(() => {
      setMovie(undefined);
      setErrorStr('Movie has been deleted.');
    });
  };

  const AdminButton = () => {
    if (!cookies.admin) return <></>;

    return (
      <div>
        <Button variant="outlined">Edit</Button>
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

  const submitReview = () => {
    // TODO
  };

  if (!movie) return <></>;

  return (
    <Container maxWidth="md">
      <div className={styles.title_div}>
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
      <div ref={ref}>
        <motion.div style={{ display: 'flex' }} animate={animation}>
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
                Average Rating: {movie.averageRating}
                <br />
                Runtime: {movie.runtime} minutes
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <div>
        <h3>Movie Info</h3>

        <p>{movie.description}</p>
      </div>
      <div>
        <h2>Reviews</h2>
        <div style={{ display: 'flex' }}>
          {movie.reviews.map((review) => (
            <ReviewCard
              key={review.user}
              onDelete={undefined}
              review={review}
            />
          ))}
        </div>
      </div>
      <br />
      <div>
        <div
          style={{
            paddingBottom: '10px',
            paddingLeft: '30px',
            border: '1px solid black',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            <h2>Write a Review</h2>
            <Rating
              style={{ paddingRight: '30px' }}
              name="half-rating"
              defaultValue={2.5}
              precision={0.5}
            />
          </div>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={5}
            placeholder="Write your review here"
            style={{ width: '95%' }}
          />
          <br />
          <Button size="small" variant="contained" onClick={submitReview}>
            Submit
          </Button>
          <br />
        </div>
      </div>
    </Container>
  );
};

export default MakePage(TestingUI);
