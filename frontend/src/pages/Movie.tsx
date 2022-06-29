import React from 'react';

import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';
// import { useNavigate } from 'react-router-dom';

import { apiGetMovie } from '../util/api';

import Container from '@mui/material/Container';

const Movie = () => {

  const data = apiGetMovie();

  return (
    <Container maxWidth="md">
      <h1>{data.name} ({data.year})</h1>

      <div style={{ maxWidth: '740px' }}>
        <Youtube code={data.trailer} />
      </div>
      
      <br/>

      <div style={{ display: 'flex' }}>
        <img src={data.poster} style={{ width: '200px' }}/>

        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2>{data.name}</h2>
        </div>
      </div>

      <h3>Movie Info</h3>

      <p>{data.description}</p>


    </Container>
  );
}

export default MakePage(Movie);
