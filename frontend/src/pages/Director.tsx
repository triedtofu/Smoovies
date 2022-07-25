import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Typography from '@mui/material/Typography';

import Container from '../components/MyContainer';
import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import { DirectorResponse } from '../util/interface';
import { apiGetDirector } from '../util/api';

const Director = () => {
  const params = useParams();

  const [directorRes, setDirectorRes] = React.useState<DirectorResponse | undefined>(undefined);

  React.useEffect(() => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    apiGetDirector(parseInt(idStr)).then(data => setDirectorRes(data));
  }, [params]);

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