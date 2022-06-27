import React from 'react';

import Container from '@mui/material/Container';
import MakePage from '../components/MakePage';

const Wishlist = () => {
  const [noMovieMessage, setNoMovieMessage] = React.useState('');
  const [movieWishlist, setMovieWishlist] = React.useState([]);

  // const getMovieWishlist = async () => {
  //   const init = {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  //   fetch('http://localhost:3000/' + token + '/wishlist', init).then(
  //     (response) => {
  //       if (response.status === 400) {
  //         alert('ERROR, Invalid Input');
  //       } else if (response.status === 404) {
  //         alert('ERROR, User not found');
  //       } else {
  //         response.json().then((body) => {
  //           console.log(body.movies);
  //           /* TODO get movies.
  //             if length===0 print a string that says no movies
  //             else get the name of that movie and the year and keep pritning it on the screen
  //             CHANGE token TO THE ACTUAL THING WHEN I GET IT
  //           */
  //         });
  //       }
  //     }
  //   );
  // };

  return (
    <div>
      <h1>Your Wishlist</h1>
      {/* <div>
        {noMovieMessage}
        {movieWishlist.map((movie) => {
          <li>{movie}</li>;
        })}
      </div> */}
    </div>
  );
}

export default MakePage(Wishlist);
