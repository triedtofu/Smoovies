import React from 'react';
import { Helmet } from 'react-helmet-async';

import styles from './Homepage.module.css';

import MakePage from '../components/MakePage';
import MovieCard from '../components/MovieCard';
import Container from '../components/MyContainer';

import { apiMovieHomepage } from '../util/api';
import { MovieSummary } from '../util/interface';

import Typography from '@mui/material/Typography';

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
      <Helmet>
        <title>Trending - Smoovies</title>
      </Helmet>

      <Typography gutterBottom variant="h4" component="h1">Trending</Typography>
      
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
