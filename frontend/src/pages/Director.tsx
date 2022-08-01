import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';
import Container from '../components/MyContainer';

import { apiGetDirector } from '../util/api';
import { getErrorMessage } from '../util/helper';
import { DirectorResponse } from '../util/interface';

const Director = () => {
  const params = useParams();

  const [directorRes, setDirectorRes] = React.useState<DirectorResponse | undefined>(undefined);
  const [errorString, setErrorString] = React.useState('');

  React.useEffect(() => {
    setErrorString('');

    const directorId = parseInt(params.id ?? '');

    if (Number.isNaN(directorId)) {
      setErrorString(`Error: '${params.id}' is not an integer`);
      return;
    }

    apiGetDirector(directorId)
      .then(data => setDirectorRes(data))
      .catch(error => setErrorString(getErrorMessage(error)));
  }, [params]);

  // show error message if there is
  if (errorString) return (
    <Container maxWidth="lg">
      {errorString}
    </Container>
  );

  if (!directorRes) return <></>;

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>{`${directorRes.name} - Smoovies`}</title>
      </Helmet>

      <Typography gutterBottom variant="h4" component="h1">{directorRes.name}</Typography>

      <h2>Directed:</h2>

      {directorRes.movies.map(movie => (
        <MovieResultCard
          key={movie.id}
          movie={movie}
          buttonClick={null}
        />
      ))}
    </Container>
  )
}

export default MakePage(Director);