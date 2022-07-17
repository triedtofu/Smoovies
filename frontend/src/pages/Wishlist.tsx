import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import { apiUserWishlist, apiPutUserWishlist } from '../util/api';
import { parseJwt } from '../util/helper';
import { MovieSummary } from '../util/interface';

const Wishlist = () => {
  const params = useParams();
  const [cookies] = useCookies();

  const [movies, setMovies] = React.useState<MovieSummary[]>([]);
  const [fetched, setFetched] = React.useState(false);

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
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiUserWishlist(parseInt(idStr))
        .then(data => {
          setMovies(data.movies);
          setFetched(true);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

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

  return (
    <Container maxWidth="lg">
      <h1>Your Wishlist</h1>
      {fetched && movies.length === 0 && <p>No movies in wishlist.</p>}
      {movies.length > 0 && movies.map(movie => (
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
