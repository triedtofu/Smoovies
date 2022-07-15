import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { apiMovieSearch } from '../util/api';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import Container from '@mui/material/Container';
import { MovieSummary } from '../util/interface';

const Search = () => {
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = React.useState<MovieSummary[]>([]);
  const [found, setFound] = React.useState(true);

  React.useEffect(() => {
    setFound(true);
    const name = searchParams.get('name') ?? '';

    if (name === '') return;

    try {
      apiMovieSearch(name)
        .then((res) => setMovies(res.movies))
        .catch((err) => {
          setMovies([]);
          setFound(false);
        });
    } catch (err) {
      console.log(err);
      setMovies([]);
    }
  }, [searchParams]);

  return (
    <Container maxWidth="lg">
      <h1>Results: {searchParams.get('name')}</h1>
      {!found && movies.length === 0 && <p>No movies found.</p>}
      {movies.length > 0 &&
        movies.map(movie => (
          <MovieResultCard
            key={movie.id}
            movie={movie}
            buttonClick={null}
          />
        ))}
    </Container>
  );
};

export default MakePage(Search);
