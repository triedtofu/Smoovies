import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import styles from './MovieResultCard.module.css';
import { MovieSummary } from '../util/interface';
import MyLink from './MyLink';

import DeleteIcon from '@mui/icons-material/Delete';

interface MovieResultCardProps {
  buttonClick: (() => void) | null;
  movie: MovieSummary;
}

const MovieResultCard = ({ buttonClick, movie }: MovieResultCardProps) => {
  return (
    <Card className={styles.card}>
      <CardMedia
        component="img"
        image={movie.poster}
        alt={`Movie poster for ${movie.name}`}
        className={styles.card_media}
      />
      <CardContent className={styles.card_content}>
        <MyLink to={`/movie/${movie.id}`}>
          <Typography gutterBottom variant="h5" component="div">
            {`${movie.name} (${movie.year})`}
          </Typography>
        </MyLink>
        <div>
          {movie.genres.map((genre) => (
            <Chip key={genre} label={genre} sx={{ margin: '5px' }} />
          ))}
        </div>
        <div>
          <b>Rating:</b> {movie.averageRating} / 5
        </div>
        <div className={styles.description}>
          <b>Description:</b> {movie.description}
        </div>
      </CardContent>
      {buttonClick ? (
        <Button
          variant="outlined"
          color="error"
          sx={{ margin: '10px' }}
          onClick={buttonClick}
        >
          <DeleteIcon></DeleteIcon>
        </Button>
      ) : (
        <div></div>
      )}
    </Card>
  );
};

export default MovieResultCard;
