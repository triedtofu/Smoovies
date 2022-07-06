import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import { apiUserWishlist, apiPutUserWishlist } from '../util/api';
import { parseJwt } from '../util/helper';

const Wishlist = () => {
  const params = useParams();
  const [cookies] = useCookies();

  const [movies, setMovies] = React.useState<any>([]);
  const [fetched, setFetched] = React.useState(false);

  const removeMovie = (movieId: number) => {
    try {
      apiPutUserWishlist(cookies.token, movieId, false)
        .then(_ => {
          // delete movie
          setMovies(movies.filter((movie: any) => movie.id != movieId));
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

  console.log(fetched, movies.length);

  return (
    <Container maxWidth="lg">
      <h1>Your Wishlist</h1>
      {fetched && movies.length === 0 && <p>No movies in wishlist.</p>}
      {movies.length > 0 && movies.map((movie: any) => (
        <MovieResultCard
          key={movie.id}
          id={movie.id}
          poster={movie.poster}
          name={movie.name}
          year={movie.year}
          button={showButton()}
          buttonClick={() => removeMovie(movie.id)}
          // genres={movie.genres}
          description={movie.description}
          rating={movie.averageRating}
        />
      ))}
    </Container>
  );
};

export default MakePage(Wishlist);
