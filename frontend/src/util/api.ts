// const baseUrl = '';
// const baseUrl = 'http://localhost:8080';
// const baseUrl = 'https://comp3900-lawnchair-back.herokuapp.com';
const baseUrl = 'https://comp3900-lawnchair-front.herokuapp.com';

import {
  LoginResponse,
  MovieDetails,
  MovieSummaries,
  RegisterReponse,
  SpecificMovieResponse,
  WishlistResponse,
  AddMovieResponse,
} from './interface';

const apiFetch = <Type>(path: string, init?: RequestInit) =>  {
  return fetch(baseUrl + '/api' + path, init)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.error) throw Error(data.error);
      return data as Type;
    });
};

// Auth

export const apiAuthRegister = (
  name: string,
  email: string,
  password: string
) => {
  return apiFetch<RegisterReponse>('/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
};

export const apiAuthLogin = (email: string, password: string) => {
  return apiFetch<LoginResponse>('/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

// Movies

export const apiMovieHomepage = () => {
  return apiFetch<MovieSummaries>('/movie/homepage');
};

export const apiMovieSearch = (name: string) => {
  return apiFetch<MovieSummaries>(`/movie/search?name=${name}`);
};

// TODO update once api is done
export const apiGetMovie = (id: number) => {
  return apiFetch<SpecificMovieResponse>(`/movie/getMovie?id=${id}`).then((data) => {
    data.averageRating = 3.14;
    data.reviews.push(
      {
        user: 1729,
        name: 'Dave',
        review: "It's Morbin Time",
        rating: 5,
      },
    );
    return data;
  });
};

export const apiGetGenres = () => {
  return apiFetch<{genres: string[]}>('/movie/genres');
};

export const apiAddMovie = (token: string, movie: MovieDetails) => {
  return apiFetch<AddMovieResponse>('/movie/addMovie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, ...movie }),
  });
}

export const apiDeleteMovie = (token: string, movieId: number) => {
  return apiFetch<Record<string, never>>('/movie/deleteMovie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, movieId }),
  });
};

export const apiAddReview = (token: string, movieId: number, review: string, rating: number) => {
  apiFetch<Record<string, never>>('/movie/addReview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, movieId, review, rating }),
  });
}

// Users

// TODO update once api is done
export const apiUserWishlist = (id: number) => {
  return apiFetch<WishlistResponse>(`/user/wishlist?userId=${id}`);
};

export const apiPutUserWishlist = (
  token: string,
  movieId: number,
  turnon: boolean
) => {
  return apiFetch<Record<string, never>>('/user/wishlist', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, movieId, turnon }),
  });
};

export const apiRequestResetPassword = (email: string) => {
  return apiFetch<Record<string, never>>('/user/requestResetPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
};

export const apiResetPassword = (resetCode: string, password: string) => {
  return apiFetch<Record<string, never>>('/user/resetPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resetCode, password }),
  });
};
