import * as React from 'react';
// import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { MovieSummary } from '../util/interface';

import styles from './MovieCard.module.css';
import MyLink from './MyLink';

const MovieCard = ({ movie }: { movie: MovieSummary }) => {
  return (
    <Card className={styles.movieCard} sx={{ width: '200px', margin: '10px' }}>
      <CardMedia
        component="img"
        height="300"
        image={movie.poster}
        alt={`Movie poster for ${movie.name}`}
      />
      <CardContent>
        <MyLink href={`/movie/${movie.id}`}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            color={'#b77a37'}
            sx={{
              textAlign: 'center',
            }}
            className={styles.movieLink}
          >
            {`${movie.name} (${movie.year})`}
          </Typography>
        </MyLink>
        <div className={styles.genresDiv}>
          {movie.genres.map((genre, index) => (
            <Chip key={index} label={genre} />
          ))}
        </div>
        {/* <div>Rating: {movie.averageRating} / 5</div> */}
      </CardContent>
    </Card>
  );
};

export default MovieCard;
