import * as React from 'react';
import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

interface MovieCardProps {
  poster: string;
  name: string;
  year: number;
  id: number;
  // genres: Array<string>;
  rating: number;
}

const MovieCard = (props: MovieCardProps) => {
  return (
    <Card sx={{ width: '200px', margin: '10px' }}>
      <CardMedia
        component="img"
        height="300"
        image={props.poster}
        alt={`Movie poster for ${props.name}`}
      />
      <CardContent>
        <Link to={`/movie/${props.id}`}>
          <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
            {`${props.name} (${props.year})`}
          </Typography>
        </Link>
        <div>
          Rating {props.rating}
        </div>
        {/* <div>
          {props.genres.map((genre, index) => (
            <Chip key={index} label={genre} sx={{margin: '5px'}}/>
          ))}
        </div> */}
      </CardContent>
    </Card>
  );
}

export default MovieCard;
