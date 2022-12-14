const baseUrl = '';
// const baseUrl = 'https://comp3900-lawnchair-back.herokuapp.com';
// const baseUrl = 'https://comp3900-lawnchair-front.herokuapp.com';

import movielist from './movielist.json';
import specificMovie from './specificmovie.json';

const apiFetch = (path: string, init: object) => {
  return fetch(baseUrl + '/api' + path, init)
    .then(res => res.json())
    .then(data => {
      if (data && data.error) throw Error(data.error);
      return data;
    });
}

// Auth

export const apiAuthRegister = (name: string, email: string, password: string) => {
  return apiFetch('/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
}

export const apiAuthLogin = (email: string, password: string) => {
  return apiFetch('/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

// Movies

export const apiMovieHomepage = () => {
  return apiFetch('/movie/homepage', {});
}

export const apiMovieSearch = (name: string) => {
  return apiFetch(`/movie/search?name=${name}`, {});
}

// TODO update once api is done
export const apiGetMovie = () => {
  return specificMovie;
}

// Users

// TODO update once api is done
export const apiUserWishlist = () => {
  return movielist;
}
