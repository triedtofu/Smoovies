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
  description: string;
}

const Search = () => {
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = React.useState<Array<MovieInfo>>([]);
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
        movies.map((movie) => (
          <MovieResultCard
            key={movie.id}
            poster={movie.poster}
            name={movie.name}
            year={movie.year}
            button={false}
            buttonClick={null}
            id={movie.id}
            // genres={movie.genres}
            description={movie.description}
            rating={movie.averageRating}
          />
        ))}
      {/* {movies.length === 0 && (
        <h1>Sorry, No results found for "{searchParams.get('name')}"</h1>
      )} */}
    </Container>
  );
};

export default MakePage(Search);
