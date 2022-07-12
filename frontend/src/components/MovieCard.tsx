import * as React from 'react';
import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { MovieSummary } from '../util/interface';

const MovieCard = ({ movie }: { movie: MovieSummary}) => {
  return (
    <Card sx={{ width: '200px', margin: '10px' }}>
      <CardMedia
        component="img"
        height="300"
        image={movie.poster}
        alt={`Movie poster for ${movie.name}`}
      />
      <CardContent>
        <Link to={`/movie/${movie.id}`}>
          <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
            {`${movie.name} (${movie.year})`}
          </Typography>
        </Link>
        <div>
          {["Action", "Fantasy"].map((genre, index) => (
            <Chip key={index} label={genre} sx={{margin: '5px'}}/>
          ))}
        </div>
        <div>
          Rating: {movie.averageRating}
        </div>
      </CardContent>
    </Card>
  );
}

export default MovieCard;
