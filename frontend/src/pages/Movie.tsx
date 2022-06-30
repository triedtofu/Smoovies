import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import MakePage from '../components/MakePage';
import Youtube from '../components/Youtube';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ReviewCard from '../components/ReviewCard';
// import { useNavigate } from 'react-router-dom';

import { apiGetMovie, apiPutUserWishlist } from '../util/api';

import Container from '@mui/material/Container';

interface movieInfo {
  name: string;
}

interface reviewInfo {
  user: number;
  review: string;
  rating: number;
}

const Movie = () => {
  const [cookies] = useCookies();

  const [addedToWishlist, setAddedToWishlist] = React.useState(false);
  const params = useParams();

  const [movie, setMovie] = React.useState<any>({});
  const [review, setReviews] = React.useState<Array<reviewInfo>>([]);

  React.useEffect(() => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiGetMovie(parseInt(idStr)).then((data) => {
        setMovie(data);
        setReviews(data.reviews);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (Object.keys(movie).length === 0) return <></>;

  const addMovieToWishlist = () => {
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    try {
      apiPutUserWishlist(cookies.token, parseInt(idStr), true).catch((err) =>
        console.log(err)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const removeMovieFromWishlist = () => {
    // TODO
  };

  const submitReview = () => {
    // TODO
  };

  return (
    <Container maxWidth="md">
      <h1>
        {console.log(movie)}
        {movie.name} ({movie.year})
        <Button
          style={{ marginLeft: '30px' }}
          variant="outlined"
          onClick={addMovieToWishlist}
        >
          Add To Wishlist
        </Button>
        <Button
          style={{ marginLeft: '30px' }}
          variant="outlined"
          color="error"
          onClick={removeMovieFromWishlist}
        >
          Remove From Wishlist
        </Button>
      </h1>

      <div style={{ maxWidth: '740px' }}>
        <Youtube code={movie.trailer} />
      </div>

      <br />

      <div style={{ display: 'flex' }}>
        <img src={movie.poster} style={{ width: '200px' }} />

        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2>{movie.name}</h2>
          <div style={{ paddingLeft: '20px', textAlign: 'left' }}>
            <p>
              Genre: {movie.genres.join(', ')}
              <br />
              Director: {movie.director}
              <br />
              Cast: {movie.cast}
              <br />
              Content Rating: {movie.contentRating}
              <br />
              Average Rating: {movie.avgRating}
              <br />
              Runtime: {movie.runTime} minutes
            </p>
          </div>
        </div>
      </div>

      <h3>Movie Info</h3>

      <p>{movie.description}</p>

      <div>
        <h2>Reviews</h2>
        <div style={{ display: 'flex' }}>
          {review.map((reviews) => (
            <ReviewCard
              key={reviews.user}
              reviewUser={reviews.user}
              reviewDescription={reviews.review}
              reviewRating={reviews.rating}
            />
          ))}
        </div>
      </div>
      <br />
      <div>
        <div
          style={{
            paddingBottom: '10px',
            paddingLeft: '30px',
            border: '1px solid black',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            <h2>Write a Review</h2>
            <Rating
              style={{ paddingRight: '30px' }}
              name="half-rating"
              defaultValue={2.5}
              precision={0.5}
            />
          </div>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={5}
            placeholder="Write your review here"
            style={{ width: '95%' }}
          />
          <br />
          <Button size="small" variant="contained" onClick={submitReview}>
            Submit
          </Button>
          <br />
        </div>
      </div>
    </Container>
  );
};

export default MakePage(Movie);
