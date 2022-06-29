import React from 'react';

import styles from './Homepage.module.css';

import MakePage from '../components/MakePage';
import MovieCard from '../components/MovieCard';
// import { useNavigate } from 'react-router-dom';

import { apiMovieHomepage } from '../util/api';

import Container from '@mui/material/Container';

const Homepage = () => {
  // const navigate = useNavigate();

  // code for when I can get token
  // React.useEffect(() => {
  //   if (!token) {
  //     navigate('/login');
  //   }
  // });

  const data = apiMovieHomepage();

  return (
    <Container maxWidth="lg">
      <h1>Home Page</h1>

      <div className={styles.container}>
        {data.movies.map((movie, index) => (
          <MovieCard
            key={index}
            poster={movie.poster}
            name={movie.name}
            year={movie.year}
            genres={movie.genres}
            rating={movie.averageRating}
          />
        ))
        }
      </div>
    </Container>
  );
}

export default MakePage(Homepage);
