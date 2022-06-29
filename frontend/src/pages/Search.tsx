import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { apiMovieSearch } from '../util/api';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';

import Container from '@mui/material/Container';

interface MovieInfo {
  id: number;
  name: string;
  year: number;
  poster: string;
  genres: Array<string>;
  averageRating: number;
}

const Search = () => {
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = React.useState<Array<MovieInfo>>([]);

  React.useEffect(() => {
    const name = searchParams.get('name') ?? '';

    if (name === '') return;

    try {
      apiMovieSearch(name)
        .then(res => setMovies(res.movies))
        .catch(err => setMovies([]));
    } catch (err) {
      console.log(err);
      setMovies([]);
    }
  }, [searchParams]);

  return (
    <Container maxWidth="lg">
      <h1>Results: {searchParams.get('name')}</h1>
      
      {movies.length > 0 && movies.map((movie) => (
        <MovieResultCard
          key={movie.id}
          poster={movie.poster}
          name={movie.name}
          year={movie.year}
          button={false}
          // genres={movie.genres}
          rating={movie.averageRating}
        />
      ))}
    </Container>
  );
}

export default MakePage(Search);
