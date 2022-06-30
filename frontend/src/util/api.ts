// const baseUrl = '';
// const baseUrl = 'https://comp3900-lawnchair-back.herokuapp.com';
const baseUrl = 'https://comp3900-lawnchair-front.herokuapp.com';

// import movielist from './movielist.json';
// import specificMovie from './specificmovie.json';

const apiFetch = (path: string, init: object) => {
  return fetch(baseUrl + '/api' + path, init)
    .then(res => res.json())
    .then(data => {
      if (data && data.error) throw Error(data.error);
      return data;
    });
};

// Auth

export const apiAuthRegister = (
  name: string,
  email: string,
  password: string
) => {
  return apiFetch('/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
};

export const apiAuthLogin = (email: string, password: string) => {
  return apiFetch('/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

// Movies

export const apiMovieHomepage = () => {
  return apiFetch('/movie/homepage', {});
};

export const apiMovieSearch = (name: string) => {
  return apiFetch(`/movie/search?name=${name}`, {});
};

// TODO update once api is done
export const apiGetMovie = (id: number) => {
  return apiFetch(`/movie/getMovie?id=${id}`, {})
    .then(data => {
      data.trailer = 'SQK-QxxtE8Y';
      data.reviews = [
        {
          "user": 1729,
          "review": "It's Morbin Time",
          "rating": 5
        }
      ];
      data.genres = [
        "Action",
        "Fantasy"
      ];
      return data;
    });
};

// Users

// TODO update once api is done
export const apiUserWishlist = (id: number) => {
  return apiFetch(`/user/wishlist?userId=${id}`, {})
    .catch(err => {return { 'movies': [] }});
};

export const apiPutUserWishlist = (token: string, movieId: number, turnon: boolean) => {
  return apiFetch('/user/wishlist', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, movieId, turnon }),
  });
};
