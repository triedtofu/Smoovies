import React from 'react';

import styles from './Homepage.module.css';

import MakePage from '../components/MakePage';
import MovieCard from '../components/MovieCard';
// import { useNavigate } from 'react-router-dom';

import { apiMovieHomepage } from '../util/api';

import Container from '@mui/material/Container';
import Movie from './Movie';

interface MovieInfo {
  id: number;
  name: string;
  year: number;
  poster: string;
  genres: Array<string>;
  averageRating: number;
}

const Homepage = () => {
  const [movies, setMovies] = React.useState<Array<MovieInfo>>([]);

  React.useEffect(() => {
    try {
      apiMovieHomepage().then((data) => setMovies(data.movies));
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Container maxWidth="lg">
      <h1>Home Page</h1>

<<<<<<< HEAD
      {movies.length > 0 && (
        <div className={styles.container}>
          {movies.map((movie, index) => (
            <MovieCard
              key={index}
              poster={movie.poster}
              name={movie.name}
              year={movie.year}
              // genres={movie.genres}
              rating={movie.averageRating}
            />
          ))}
        </div>
      )}
=======
      {movies.length > 0 && <div className={styles.container}>
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            poster={movie.poster}
            name={movie.name}
            year={movie.year}
            id={movie.id}
            // genres={movie.genres}
            rating={movie.averageRating}
          />
        ))
        }
      </div>}
>>>>>>> c98900f8d822581b86b3d43d6f689c46fbf283c1
    </Container>
  );
};

export default MakePage(Homepage);
