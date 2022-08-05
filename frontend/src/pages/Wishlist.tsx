import React from 'react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import Container from '../components/MyContainer';
import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import { apiUserWishlist, apiPutUserWishlist } from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';
import { MovieSummary } from '../util/interface';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const PAGE_SIZE = 20;

const Wishlist = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [cookies] = useCookies();

  const [movies, setMovies] = React.useState<MovieSummary[]>([]);
  const [name, setName] = React.useState('');
  const [numMoviesShown, setNumMoviesShown] = React.useState(PAGE_SIZE);

  const [errorStr, setErrorStr] = React.useState('');

  const removeMovie = (movieId: number) => {
    apiPutUserWishlist(cookies.token, movieId, false)
      .then(() => {
        // delete movie
        setMovies(movies.filter((movie) => movie.id !== movieId));
      });
  };

  React.useEffect(() => {
    setMovies([]);
    setName('');
    setErrorStr('');
    const id = parseInt(params.id ?? '');

    if (Number.isNaN(id)) {
      setErrorStr(`Error: '${params.id}' is not an integer`);
      return;
    }

    apiUserWishlist(id, cookies.token)
      .then((data) => {
        setMovies(data.movies);
        setName(data.username);
      })
      .catch((error) => setErrorStr(getErrorMessage(error)));
  }, [params.id]);

  // whether the remove from wishlist button should be shown
  const showButton = cookies.token && params.id! === parseJwt(cookies.token).jti;

  if (errorStr || name === '') return (
    <Container maxWidth="md">
      <h2>{errorStr}</h2>
    </Container>
  )

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>
          {cookies.token && params.id === parseJwt(cookies.token).jti
            ? 'Your Wishlist'
            : `${name}'s Wishlist`}{' '}
          - Smoovies
        </title>
      </Helmet>

      <Typography variant="h4" component="h1" fontFamily={'Verdana'}>
        {cookies.token && params.id === parseJwt(cookies.token).jti
          ? 'Your Wishlist'
          : `${name}'s Wishlist`}
      </Typography>

      {!(cookies.token && params.id === parseJwt(cookies.token).jti) && (
        <Button
          variant="outlined"
          onClick={() => navigate(`/user/${params.id}/`)}
        >
          Their Reviews
        </Button>
      )}

      {movies.length === 0 && <p>No movies in wishlist.</p>}

      {movies.slice(0, numMoviesShown).map((movie) => (
        <MovieResultCard
          key={movie.id}
          movie={movie}
          buttonClick={showButton ? () => removeMovie(movie.id) : null}
        />
      ))}

      {numMoviesShown < movies.length && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={() => setNumMoviesShown(numMoviesShown + PAGE_SIZE)}
          >
            Show more
          </Button>
        </div>
      )}
    </Container>
  );
};

export default MakePage(Wishlist);
