import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import MakePage from '../components/MakePage';
import NewMovieForm, { SubmitMovie } from '../components/NewMovieForm';
import Container from '../components/MyContainer';

import { apiGetMovie, apiEditMovie, apiGetGenres } from '../util/api';
import { SpecificMovieResponse } from '../util/interface';

import Typography from '@mui/material/Typography';

const EditMovie = () => {
  const [cookies] = useCookies();
  const params = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = React.useState<SpecificMovieResponse | undefined>(
    undefined
  );

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
    const newMovie = {
      name,
      year,
      poster,
      trailer,
      description,
      genres,
      contentRating,
      cast,
      director,
      runtime,
    };
    apiEditMovie(cookies.token, movie!.id, newMovie).then((res) =>
      navigate(`/movie/${movie!.id}`)
    );
    // .catch(error => setNewMovieErr(getErrorMessage(error)));
  };

  React.useEffect(() => {
    try {
      apiGetMovie(parseInt(params.id ?? ''), cookies.token).then((data) =>
        setMovie(data)
      );
    } catch {
      // TODO handle errors
    }
  }, [params]);

  React.useEffect(() => {
    apiGetGenres().then((data) => setAllGenres(data.genres));
  }, []);

  if (!cookies.token || !cookies.admin)
    return (
      <Container maxWidth="md">
        <h2>Access denied. Only admins can access this page.</h2>
      </Container>
    );

  if (!movie) return <></>;

  return (
    <Container maxWidth="sm">
      <Typography gutterBottom variant="h4" component="h1">
        Movie - Edit Details
      </Typography>

      <NewMovieForm
        submit={newMovie}
        error=""
        allGenres={allGenres}
        initialValues={movie}
      />
    </Container>
  );
};

export default MakePage(EditMovie);
