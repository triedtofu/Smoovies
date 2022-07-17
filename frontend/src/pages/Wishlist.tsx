import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import { apiUserWishlist, apiPutUserWishlist } from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';
import { MovieSummary } from '../util/interface';

const Wishlist = () => {
  const params = useParams();
  const [cookies] = useCookies();

  const [movies, setMovies] = React.useState<MovieSummary[]>([]);
  const [errorStr, setErrorStr] = React.useState('');
  const [name, setName] = React.useState('');

  const removeMovie = (movieId: number) => {
    try {
      apiPutUserWishlist(cookies.token, movieId, false)
        .then(_ => {
          // delete movie
          setMovies(movies.filter(movie => movie.id != movieId));
        })
        .catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    setMovies([]);
    setName('');
    setErrorStr('');
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiUserWishlist(parseInt(idStr))
        .then(data => {
          setMovies(data.movies);
          setName(data.username);
        })
        .catch(error => setErrorStr(getErrorMessage(error)));
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
  }

  if (errorStr || name === '') return <h2>{errorStr}</h2>;

  return (
    <Container maxWidth="lg">
      <h1>{cookies.token && params.id === parseJwt(cookies.token).jti ? 'Your Wishlist' : `${name}'s Wishlist`}</h1>
      
      {movies.length === 0 && <p>No movies in wishlist.</p>}

      {movies.map(movie => (
        <MovieResultCard
          key={movie.id}
          movie={movie}
          buttonClick={showButton() ? () => removeMovie(movie.id) : null}
        />
      ))}
    </Container>
  );
};

export default MakePage(Wishlist);
