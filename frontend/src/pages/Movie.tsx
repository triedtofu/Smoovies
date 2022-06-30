import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';
import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';

import { apiGetMovie, apiPutUserWishlist } from '../util/api';

import Container from '@mui/material/Container';

interface movieInfo {
  name: string;
}

const Movie = () => {
  const [cookies] = useCookies();

  const [addedToWishlist, setAddedToWishlist] = React.useState(false);
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

  const addMovieToWishlist = () => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiPutUserWishlist(cookies.token, parseInt(idStr), true)
        .catch(err => console.log(err));
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
        {movie.name} ({movie.year})
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
        <Youtube code={movie.trailer} />
      </div>

      <br />

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
};

export default MakePage(Movie);
