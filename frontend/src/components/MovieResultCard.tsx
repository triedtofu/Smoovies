import * as React from 'react';
import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import styles from './MovieResultCard.module.css';

interface MovieResultCardProps {
  poster: string;
  name: string;
  year: number;
  button: boolean;
  buttonClick: any;
  description: string;
  // genres: Array<string>;
  id: number;
  rating: number;
}

const MovieResultCard = (props: MovieResultCardProps) => {
  return (
    <Card className={styles.card}>
      <CardMedia
        component="img"
        image={props.poster}
        alt={`Movie poster for ${props.name}`}
        id={styles.card_media}
      />
      <CardContent className={styles.card_content}>
        <Link to={`/movie/${props.id}`}>
          <Typography gutterBottom variant="h5" component="div">
            {`${props.name} (${props.year})`}
          </Typography>
        </Link>
        <div>
          {["Action", "Fantasy"].map((genre, index) => (
            <Chip key={index} label={genre} sx={{margin: '5px'}}/>
          ))}
        </div>
        <div>
          <b>Rating:</b> {props.rating}
        </div>
        <div>
          <b>Descripton:</b> {props.description}
        </div>
      </CardContent>
      {props.button ?
        <Button
          variant="outlined"
          color="error"
          sx={{ margin: '10px' }}
          onClick={props.buttonClick}
        >
          Remove
        </Button> : 
        <div></div>
      }
    </Card>
  );
}

export default MovieResultCard;
