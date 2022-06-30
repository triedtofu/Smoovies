import React from 'react';
import { useParams } from 'react-router-dom';

import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';
// import { useNavigate } from 'react-router-dom';

import { apiGetMovie } from '../util/api';

import Container from '@mui/material/Container';

interface movieInfo {
  name: string;
}

const Movie = () => {
  const params = useParams();

  const [movie, setMovie] = React.useState<any>({});

  React.useEffect(() => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }
    
    try {
      apiGetMovie(parseInt(idStr))
        .then(data => setMovie(data));
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (Object.keys(movie).length === 0) return <></>;

  return (
    <Container maxWidth="md">
      <h1>{movie.name} ({movie.year})</h1>

      <div style={{ maxWidth: '740px' }}>
        <Youtube code={movie.trailer} />
      </div>
      
      <br/>

      <div style={{ display: 'flex' }}>
        <img src={movie.poster} style={{ width: '200px' }}/>

        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2>{movie.name}</h2>
        </div>
      </div>

      <h3>Movie Info</h3>

      <p>{movie.description}</p>


    </Container>
  );
}

export default MakePage(Movie);
