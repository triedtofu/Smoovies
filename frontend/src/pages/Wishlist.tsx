import React from 'react';
import { useParams } from 'react-router-dom';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import { apiUserWishlist } from '../util/api';

const Wishlist = () => {
  const params = useParams();
  // const data = apiUserWishlist();

  const [movies, setMovies] = React.useState<any>([]);

  React.useEffect(() => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiUserWishlist(parseInt(idStr))
        .then(data => setMovies(data));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Container maxWidth="lg">
      <h1>Your Wishlist</h1>
      {movies.map((movie: any) => (
        <MovieResultCard
          key={movie.id}
          id={movie.id}
          poster={movie.poster}
          name={movie.name}
          year={movie.year}
          button={true}
          // genres={movie.genres}
          rating={movie.averageRating}
        />
      ))}
    </Container>
  );
};

export default MakePage(Wishlist);
