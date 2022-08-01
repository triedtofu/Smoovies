import * as React from 'react';
// import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { SimilarMovie } from '../util/interface';

import styles from './SimilarMovieCard.module.css';
import MyLink from './MyLink';

const SimilarMovieCard = ({ movie }: { movie: SimilarMovie }) => {
  return (
    <Card className={styles.movieCard} sx={{ width: '136px', margin: '3px' }}>
      <CardMedia
        component="img"
        height="200"
        image={movie.poster}
        alt={`Movie poster for ${movie.name}`}
      />
      <CardContent>
        <MyLink href={`/movie/${movie.id}`}>
          <Typography
            gutterBottom
            component="div"
            sx={{ textAlign: 'center', fontSize: '12px' }}
          >
            {`${movie.name} (${movie.year})`}
          </Typography>
        </MyLink>
      </CardContent>
    </Card>
  );
};

export default SimilarMovieCard;
