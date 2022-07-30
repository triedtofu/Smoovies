import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Container from '../components/MyContainer';
import MakePage from '../components/MakePage';

import { apiUserWishlist, apiPutUserWishlist } from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';

import Typography from '@mui/material/Typography';

const Wishlist = () => {
  const params = useParams();
  const [cookies] = useCookies();

  // React.useEffect(() => {
  //   setMovies([]);
  //   setName('');
  //   setErrorStr('');
  //   const idStr = params.id ?? '';

  //   if (idStr === '') {
  //     // TODO handle error
  //     return;
  //   }

  //   try {
  //     apiUserWishlist(parseInt(idStr))
  //       .then((data) => {
  //         setMovies(data.movies);
  //         setName(data.username);
  //       })
  //       .catch((error) => setErrorStr(getErrorMessage(error)));
  //   } catch (error) {
  //     setErrorStr(getErrorMessage(error));
  //   }
  // }, [params]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1">
        {cookies.token && params.id === parseJwt(cookies.token).jti
          ? 'Your Blacklist'
          : `${name}'s Blacklist`}
      </Typography>
      {/* 
      {movies.length === 0 && <p>No users in blacklist.</p>} */}
      <div>
        {/* {fetched && actors.length === 0 && <p>No actors found.</p>}
        {actors.length > 0 &&
          actors.map((actor) => (
            <PersonResultCard
              key={actor.id}
              name={actor.name}
              link={`/actor/${actor.id}`}
              image="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
            />
          ))} */}
      </div>
    </Container>
  );
};

export default MakePage(Wishlist);
