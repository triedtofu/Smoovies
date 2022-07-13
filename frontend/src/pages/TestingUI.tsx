import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import styles from './Movie.module.css';
import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';

import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ReviewCard from '../components/ReviewCard';
import Container from '@mui/material/Container';

import { apiGetMovie, apiUserWishlist, apiPutUserWishlist } from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';
import { SpecificMovieResponse } from '../util/interface';

import * as ScrollMagic from 'scrollmagic';
import { gsap, TimelineMax, TweenMax } from 'gsap';
import { ScrollMagicPluginGsap } from 'scrollmagic-plugin-gsap';

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
        .catch((error) => setErrorStr(getErrorMessage(error)));
    } catch (error) {
      setErrorStr(getErrorMessage(error));
    }
  }, [params]);

  React.useEffect(() => {
    if (!movie || !cookies.token) return;

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

  // const controller = new ScrollMagic.Controller();

  // const scene = new ScrollMagic.Scene({
  //   triggerElement: '#trigger1',
  // })
  //   .setTween('#animate1', 0.5, { backgroundColor: 'green', scale: 2.5 }) // trigger a TweenMax.to tween
  //   .addIndicators({ name: '1 (duration: 0)' }) // add indicators (requires plugin)
  //   .addTo(controller);

  if (!movie) return <></>;

  return (
    <Container maxWidth="md">
      <div id="trigger1" className="spacer s0"></div>
      <div id="animate1" style={{ display: 'flex' }}>
        <img
          src={movie.poster}
          style={{ width: '200px', justifyContent: 'center' }}
        />
      </div>
    </Container>
  );
};

export default MakePage(TestingUI);
