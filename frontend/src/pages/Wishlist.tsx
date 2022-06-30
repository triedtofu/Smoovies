import React, { useEffect } from 'react';

import Container from '@mui/material/Container';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import { apiUserWishlist } from '../util/api';

const Wishlist = () => {
  // const data = apiUserWishlist();

  // React.useEffect(() => {
  //   try {
  //     apiUserWishlist(id).then((data) => data.movies);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  return (
    <Container maxWidth="lg">
      <h1>Your Wishlist</h1>
      {/* {data.movies.map((movie) => (
        <MovieResultCard
          key={movie.id}
          poster={movie.poster}
          name={movie.name}
          year={movie.year}
          button={true}
          // genres={movie.genres}
          rating={movie.averageRating}
        />
      ))} */}
    </Container>
  );
};

export default MakePage(Wishlist);
