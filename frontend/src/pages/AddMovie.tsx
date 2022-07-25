import React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import MakePage from '../components/MakePage';
import Container from '../components/MyContainer';
import NewMovieForm, { SubmitMovie } from '../components/NewMovieForm';

import { apiGetGenres, apiAddMovie } from '../util/api';
import { getErrorMessage } from '../util/helper';

import Typography from '@mui/material/Typography';

const AddMovie = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();

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
      .then(res => navigate(`/movie/${res.movieId}`))
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
      <Typography gutterBottom variant="h4" component="h1">
        Add a Movie
      </Typography>
      <NewMovieForm submit={newMovie} error={newMovieErr} allGenres={allGenres} />
    </Container>
  );
};

export default MakePage(AddMovie);
