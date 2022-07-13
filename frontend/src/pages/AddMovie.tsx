import React from 'react';

import MakePage from '../components/MakePage';
import Container from '@mui/material/Container';

import NewMovieForm from '../components/NewMovieForm';

const AddMovie = () => {
  const [newMovieErr, setNewMovieErr] = React.useState('');

  const newMovie = (
    name: string,
    year: string,
    poster: string,
    trailer: string,
    description: string,
    director: string,
    genres: string[],
    contentRating: string,
    cast: string
  ) => {
    // TODO
    console.log('adding movie to database');
  };

  return (
    <Container maxWidth="sm">
      <h1>Add a Movie</h1>
      <NewMovieForm submit={newMovie} error={newMovieErr} />
    </Container>
  );
};

export default MakePage(AddMovie);
