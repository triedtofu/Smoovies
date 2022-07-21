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
  UserReviewResponse,
  ActorResponse,
  DirectorResponse,
} from './interface';

const apiFetch = <Type>(path: string, init?: RequestInit) => {
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
  return apiFetch<SpecificMovieResponse>(`/movie/getMovie?id=${id}`).then(
    (data) => {
      data.id = id;
      return data;
    }
  );
};

export const apiGetGenres = () => {
  return apiFetch<{ genres: string[] }>('/movie/genres');
};

export const apiAddMovie = (token: string, movie: MovieDetails) => {
  return apiFetch<AddMovieResponse>('/movie/addMovie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, ...movie }),
  });
};

export const apiEditMovie = (
  token: string,
  id: number,
  movie: MovieDetails
) => {
  return apiFetch<Record<string, never>>('/movie/editMovie', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, id, ...movie }),
  });
};

export const apiDeleteMovie = (token: string, movieId: number) => {
  return apiFetch<Record<string, never>>('/movie/deleteMovie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, movieId }),
  });
};

export const apiAddReview = (
  token: string,
  movieId: number,
  review: string,
  rating: number
) => {
  return apiFetch<Record<string, never>>('/movie/addReview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, movieId, review, rating }),
  });
};

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

export const apiGetUserReviews = (userId: number) => {
  return apiFetch<UserReviewResponse>(`/user/reviews?userId=${userId}`);
};

export const apiDeleteReview = (token: string, movieId: number, userId: number) => {
  return apiFetch<Record<string, never>>('/user/deleteReview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, movieId, userId }),
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

export const apiBanUser = (token: string, userId: number) => {
  return apiFetch<Record<string, never>>('/user/banUser', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, userId }),
  });
};

// Actors

export const apiGetActor = (id: number) => {
  return apiFetch<ActorResponse>(`/actor/getActor?id=${id}`);
};

// Directors

export const apiGetDirector = (id: number) => {
  return apiFetch<DirectorResponse>(`/director/getDirector?id=${id}`);
};
