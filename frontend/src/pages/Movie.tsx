import React from 'react';

import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';
import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';

import { apiGetMovie, apiPUTUserWishlist } from '../util/api';

import Container from '@mui/material/Container';

const Movie = () => {
  const [addedToWishlist, setAddedToWishlist] = React.useState(false);
  const data = apiGetMovie();

  const addMovieToWishlist = () => {
    try {
      apiPUTUserWishlist().then((body) => setAddedToWishlist(body.turnon));
    } catch (err) {
      console.log(err);
    }
  };

  const removeMovieFromWishlist = () => {
    // TODO
  };

  return (
    <Container maxWidth="md">
      <h1>
        {data.name} ({data.year})
        <Button
          style={{ marginLeft: '30px' }}
          variant="outlined"
          onClick={addMovieToWishlist}
        >
          Add To Wishlist
        </Button>
        <Button
          style={{ marginLeft: '30px' }}
          variant="outlined"
          color="error"
          onClick={removeMovieFromWishlist}
        >
          Remove From Wishlist
        </Button>
      </h1>

      <div style={{ maxWidth: '740px' }}>
        <Youtube code={data.trailer} />
      </div>

      <br />

      <div style={{ display: 'flex' }}>
        <img src={data.poster} style={{ width: '200px' }} />

        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2>{data.name}</h2>
        </div>
      </div>

      <h3>Movie Info</h3>

      <p>{data.description}</p>
    </Container>
  );
};

export default MakePage(Movie);
