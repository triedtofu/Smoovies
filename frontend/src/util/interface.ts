export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  isAdmin: boolean;
}

export interface RegisterReponse {
  token: string;
  userId: number;
  name: string;
}

export interface Review {
  user: number;
  name: string;
  review: string;
  rating: number;
}

export interface MovieDetails {
  name: string;
  year: number;
  poster: string;
  trailer: string;
  description: string;
  director: string;
  genres: string[];
  contentRating: string;
  runtime: number;
  cast: string;
}

export interface SpecificMovieResponse extends MovieDetails {
  id: number;
  averageRating: number;
  reviews: Review[];
}

export interface MovieSummary {
  id: number;
  name: string;
  year: number;
  poster: string;
  description: string;
  genres: string[];
  averageRating: number;
}

export interface WishlistResponse {
  movies: MovieSummary[];
  username: string;
}

export interface MovieSummaries {
  movies: MovieSummary[];
}
