import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import styles from './Movie.module.css';
import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { apiGetMovie, apiUserWishlist, apiPutUserWishlist } from '../util/api';
import { parseJwt } from '../util/helper';


interface movieInfo {
  name: string;
}

interface buttonProps {
  state: number;
}

const Movie = () => {
  const [cookies] = useCookies();

  const [addedToWishlist, setAddedToWishlist] = React.useState(false);
  const params = useParams();

  const [movie, setMovie] = React.useState<any>({});

  const [button, setButton] = React.useState(0);

  React.useEffect(() => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }
    
    try {
      const id = parseInt(idStr);
      apiGetMovie(id)
        .then(data => setMovie({ ...data, id }));
    } catch (error) {
      console.log(error);
    }
  }, []);

  React.useEffect(() => {
    if (Object.keys(movie).length === 0 || !cookies.token) return;

    try {
      apiUserWishlist(parseInt(parseJwt(cookies.token).jti))
        .then(data => {
          if (data.movies.find((m: any) => m.id  === movie.id)) {
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
    console.log("State = " + state);
    if (state === 1) return (
      <Button
        style={{ marginLeft: '30px' }}
        variant="outlined"
        onClick={addMovieToWishlist}
      >
        Add To Wishlist
      </Button>
    );
  
    if (state === 2) return (
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
  }  

  if (Object.keys(movie).length === 0) return <></>;

  const addMovieToWishlist = () => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiPutUserWishlist(cookies.token, parseInt(idStr), true)
        .then(_ => setButton(2))
        .catch(err => console.log(err));
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
        .then(_ => setButton(1))
        .catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container maxWidth="md">
      <div className={styles.title_div}>
        <h1>
          {movie.name} ({movie.year})
        </h1>

        <WishlistButton state={button} />
      </div>

      <div style={{ maxWidth: '740px' }}>
        <Youtube code={movie.trailer} />
      </div>

      <br />

      <div style={{ display: 'flex' }}>
        <img src={movie.poster} style={{ width: '200px' }}/>

        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2>{movie.name}</h2>
        </div>
      </div>

      <h3>Movie Info</h3>

      <p>{movie.description}</p>

    </Container>
  );
};

export default MakePage(Movie);
