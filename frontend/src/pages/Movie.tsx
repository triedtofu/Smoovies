import React from 'react';
import { useParams } from 'react-router-dom';

import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';
import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';

import { apiGetMovie, apiPUTUserWishlist } from '../util/api';

import Container from '@mui/material/Container';

interface movieInfo {
  name: string;
}

const Movie = () => {
<<<<<<< HEAD
  const [addedToWishlist, setAddedToWishlist] = React.useState(false);
  const data = apiGetMovie();
=======
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
>>>>>>> c98900f8d822581b86b3d43d6f689c46fbf283c1

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
<<<<<<< HEAD
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
=======
      <h1>{movie.name} ({movie.year})</h1>
>>>>>>> c98900f8d822581b86b3d43d6f689c46fbf283c1

      <div style={{ maxWidth: '740px' }}>
        <Youtube code={movie.trailer} />
      </div>

      <br />

      <div style={{ display: 'flex' }}>
<<<<<<< HEAD
        <img src={data.poster} style={{ width: '200px' }} />
=======
        <img src={movie.poster} style={{ width: '200px' }}/>
>>>>>>> c98900f8d822581b86b3d43d6f689c46fbf283c1

        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2>{movie.name}</h2>
        </div>
      </div>

      <h3>Movie Info</h3>

<<<<<<< HEAD
      <p>{data.description}</p>
=======
      <p>{movie.description}</p>


>>>>>>> c98900f8d822581b86b3d43d6f689c46fbf283c1
    </Container>
  );
};

export default MakePage(Movie);
