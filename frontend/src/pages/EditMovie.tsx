import React from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';

import MakePage from '../components/MakePage';
import Container from '../components/MyContainer';
import NewMovieForm, { SubmitMovie } from '../components/NewMovieForm';

import { apiGetMovie, apiEditMovie, apiGetGenres } from '../util/api';
import { getErrorMessage } from '../util/helper';
import { SpecificMovieResponse } from '../util/interface';

import Typography from '@mui/material/Typography';

const EditMovie = () => {
  const [cookies] = useCookies();
  const params = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = React.useState<SpecificMovieResponse | undefined>(undefined);
  const [allGenres, setAllGenres] = React.useState<string[]>([]);

  const [errorString, setErrorString] = React.useState('');

  /**
   * Calls the api to edit a movie
   */
  const editMovie: SubmitMovie = (
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
    const movieDetails = {name, year, poster, trailer, description, genres, contentRating, cast, director, runtime};
    apiEditMovie(cookies.token, movie!.id, movieDetails)
      .then(_ => navigate(`/movie/${movie!.id}`))
      .catch(error => setErrorString(getErrorMessage(error)));
  };

  React.useEffect(() => {
    const movieId = parseInt(params.id ?? '');

    if (Number.isNaN(movieId)) {
      // TODO set error
      return;
    }

    try {
      apiGetMovie(movieId)
        .then((data) => setMovie(data));
    } catch {
      // TODO handle errors
    }
  }, [params.id]);


  React.useEffect(() => {
    // get the list of possible genres
    apiGetGenres().then(data => setAllGenres(data.genres));
  }, []);

  if (!cookies.token || !cookies.admin) return  (
    <Container maxWidth="md">
      <h2>Access denied. Only admins can access this page.</h2>
    </Container>
  );

  if (!movie) return <></>;

  return (
    <Container maxWidth="sm">
      <Typography gutterBottom variant="h4" component="h1">Movie - Edit Details</Typography>

      <NewMovieForm
        submit={editMovie}
        error={errorString}
        allGenres={allGenres}
        initialValues={movie}
      />
    </Container>
  );
};

export default MakePage(EditMovie);
