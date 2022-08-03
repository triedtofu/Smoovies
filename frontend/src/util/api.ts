// const baseUrl = '';
const baseUrl = 'http://localhost:8080';
// const baseUrl = 'https://comp3900-lawnchair-back.herokuapp.com';
// const baseUrl = 'https://comp3900-lawnchair-front.herokuapp.com';

import {
  ActorResponse,
  AddMovieResponse,
  BlacklistResponse,
  DirectorResponse,
  HigherOrLowerResponse,
  LoginResponse,
  MovieDetails,
  MovieSummaries,
  RegisterReponse,
  SearchResponse,
  SpecificMovieResponse,
  UserDetails,
  UserReviewResponse,
  WishlistResponse,
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

export const apiMovieHomepage = (token?: string) => {
  let path = '/movie/homepage';

  if (token) path += `?token=${token}`;

  return apiFetch<MovieSummaries>(path);
};

export const apiMovieSearch = (
  name: string,
  genres?: string[],
  contentRating?: string[]
) => {
  let searchStr = `name=${name}`;

  if (genres) searchStr += `&genres=${genres.join(',')}`;
  if (contentRating) searchStr += `&contentRating=${contentRating.join(',')}`;

  return apiFetch<SearchResponse>(`/movie/search?${searchStr}`);
};

// TODO update once api is done
export const apiGetMovie = (id: number, token?: string) => {
  let path = `/movie/getMovie?id=${id}`;

  if (token) path += `&token=${token}`;

  return apiFetch<SpecificMovieResponse>(path).then((data) => {
    data.id = id;
    return data;
  });
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

//  Reviews

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

export const apilikeUnlikeReview = (
  token: string,
  movieId: number,
  userId: number,
  turnon: boolean
) => {
  return apiFetch<Record<string, never>>('/movie/likeReview', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, movieId, userId, turnon }),
  });
};

export const apiGetHigherOrLower = (
  startYear: number,
  endYear: number,
  genres: string[],
  contentRating: string[]
) => {
  let path = `/movie/higherOrLower?startYear=${startYear}&endYear=${endYear}`;

  if (genres.length > 0) path += `&genres=${genres.join(',')}`
  if (contentRating.length > 0) path += `&contentRating=${contentRating.join(',')}`

  return apiFetch<HigherOrLowerResponse>(path);
};

// TODO update once api is done
export const apiUserWishlist = (id: number, token?: string) => {
  let path = `/user/wishlist?userId=${id}`;

  if (token) path += `&token=${token}`;

  return apiFetch<WishlistResponse>(path);
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

export const apiGetUserReviews = (userId: number, token?: string) => {
  let path = `/user/reviews?userId=${userId}`;

  if (token) path += `&token=${token}`;

  return apiFetch<UserReviewResponse>(path);
};

export const apiDeleteReview = (
  token: string,
  movieId: number,
  userId: number
) => {
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

export const apiBlacklistUser = (token: string) => {
  return apiFetch<BlacklistResponse>(`/user/blacklist?token=${token}`);
};

export const apiPutBlacklistUser = (
  token: string,
  userId: number,
  turnon: boolean
) => {
  return apiFetch<Record<string, never>>('/user/blacklist', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, userId, turnon }),
  });
};

export const apiGetUserDetails = (token: string) => {
  return apiFetch<UserDetails>(`/user/details?token=${token}`);
};

export interface UpdateUserParams {
  token: string;
  name?: string;
  email?: string;
  oldPassword?: string;
  password?: string;
}

export const apiUpdateUserDetails = (params: UpdateUserParams) => {
  return apiFetch<Record<string, never>>('/user/details', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
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
