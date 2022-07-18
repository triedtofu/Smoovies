import React from 'react';
import { useCookies } from 'react-cookie';

import MakePage from '../components/MakePage';
import Container from '@mui/material/Container';

import NewMovieForm, { SubmitMovie } from '../components/NewMovieForm';

import { apiGetGenres, apiAddMovie } from '../util/api';
import { getErrorMessage } from '../util/helper';

const AddMovie = () => {
  const [cookies] = useCookies();

  const [newMovieErr, setNewMovieErr] = React.useState('');
  const [allGenres, setAllGenres] = React.useState<string[]>([]);

  const newMovie: SubmitMovie = (
    name,
    year,
    poster,
    trailer,
    description,
    director,
    genres,
    contentRating,
    cast,
    runtime
  ) => {
    const movie = {name, year, poster, trailer, description, genres, contentRating, cast, director, runtime};
    apiAddMovie(cookies.token, movie)
      .catch(error => setNewMovieErr(getErrorMessage(error)));
  };

  React.useEffect(() => {
    apiGetGenres().then(data => setAllGenres(data.genres));
  }, []);

  if (!cookies.token || !cookies.admin) return  (
    <h2>Access denied. Only admins can access this page.</h2>
  );

  return (
    <Container maxWidth="sm">
      <h1>Add a Movie</h1>
      <NewMovieForm submit={newMovie} error={newMovieErr} allGenres={allGenres} />
    </Container>
  );
};

export default MakePage(AddMovie);
