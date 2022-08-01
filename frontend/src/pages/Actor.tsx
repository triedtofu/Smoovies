import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';
import Container from '../components/MyContainer';

import { apiGetActor } from '../util/api';
import { getErrorMessage } from '../util/helper';
import { ActorResponse } from '../util/interface';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const PAGE_SIZE = 20;

const Actor = () => {
  const params = useParams();

  const [actorRes, setActorRes] = React.useState<ActorResponse | undefined>(undefined);
  const [numMoviesShown, setNumMoviesShown] = React.useState(PAGE_SIZE);

  const [errorString, setErrorString] = React.useState('');

  React.useEffect(() => {
    setErrorString('');

    const actorId = parseInt(params.id ?? '');

    if (Number.isNaN(actorId)) {
      setErrorString(`Error: '${params.id}' is not an integer`);
      return;
    }

    apiGetActor(actorId)
      .then(data => setActorRes(data))
      .catch(error => setErrorString(getErrorMessage(error)));
  }, [params]);

  // show error message if there is
  if (errorString) return (
    <Container maxWidth="lg">
      {errorString}
    </Container>
  );

  if (!actorRes) return <></>;

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>{`${actorRes.name} - Smoovies`}</title>
      </Helmet>

      <Typography variant="h4" component="h1">{actorRes.name}</Typography>

      <Typography variant="h5" component="h2">Acted in:</Typography>

      {actorRes.movies.slice(0, numMoviesShown).map(movie => (
        <MovieResultCard
          key={movie.id}
          movie={movie}
          buttonClick={null}
        />
      ))}

      {numMoviesShown < actorRes.movies.length &&
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={() => setNumMoviesShown(numMoviesShown + PAGE_SIZE)}>
            Show more
          </Button>
        </div>
      }
    </Container>
  );
};

export default MakePage(Actor);
