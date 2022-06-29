import * as React from 'react';

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
  button: boolean
  // genres: Array<string>;
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
        <Typography gutterBottom variant="h5" component="div">
          {`${props.name} (${props.year})`}
        </Typography>
        <div>
          Rating {props.rating}
        </div>
        {/* <div>
          {props.genres.map((genre, index) => (
            <Chip key={index} label={genre} sx={{margin: '5px'}}/>
          ))}
        </div> */}
      </CardContent>
      {props.button ?
        <Button variant="outlined" color="error" sx={{ margin: '10px' }}>
          Remove
        </Button> : 
        <div></div>
      }
    </Card>
  );
}

export default MovieResultCard;
