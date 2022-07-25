import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Container from '../components/MyContainer';
import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import { ActorResponse } from '../util/interface';
import { apiGetActor } from '../util/api';

import Typography from '@mui/material/Typography';

const Actor = () => {
  const params = useParams();

  const [actorRes, setActorRes] = React.useState<ActorResponse | undefined>(undefined);

  React.useEffect(() => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    apiGetActor(parseInt(idStr)).then(data => setActorRes(data));
  }, [params]);

  if (!actorRes) return <></>;

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>{`${actorRes.name} - Smoovies`}</title>
      </Helmet>

      <Typography variant="h4" component="h1">{actorRes.name}</Typography>

      <Typography variant="h5" component="h2">Acted in:</Typography>

      {actorRes.movies.map(movie => (
        <MovieResultCard
          key={movie.id}
          movie={movie}
          buttonClick={null}
        />
      ))}
    </Container>
  )
}

export default MakePage(Actor);