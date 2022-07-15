import React from 'react';

import styles from './Homepage.module.css';

import MakePage from '../components/MakePage';
import MovieCard from '../components/MovieCard';
// import { useNavigate } from 'react-router-dom';

import { apiMovieHomepage } from '../util/api';
import { MovieSummary } from '../util/interface';

import Container from '@mui/material/Container';

const Homepage = () => {
  const [movies, setMovies] = React.useState<MovieSummary[]>([]);

  React.useEffect(() => {
    try {
      apiMovieHomepage().then((data) => setMovies(data.movies));
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Container maxWidth="lg">
      <h1>Trending</h1>
      
      {movies.length > 0 && <div className={styles.container}>
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))
        }
      </div>}
    </Container>
  );
};

export default MakePage(Homepage);
