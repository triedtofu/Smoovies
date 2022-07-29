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
  likes: number;
  liked: boolean;
}

export interface UserReview {
  movieId: number;
  movieName: string;
  poster: string;
  review: string;
  rating: number;
}

export interface UserReviewResponse {
  username: string;
  reviews: UserReview[];
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

export interface SpecificMovieResponse extends MovieDetails {
  id: number;
  averageRating: number;
  reviews: Review[];
}

export interface WishlistResponse {
  movies: MovieSummary[];
  username: string;
}

export interface MovieSummaries {
  movies: MovieSummary[];
}

export interface AddMovieResponse {
  movieId: number;
  name: string;
  year: number;
}

export interface ActorResponse {
  name: string;
  movies: MovieSummary[];
}

export interface DirectorResponse {
  name: string;
  movies: MovieSummary[];
}

export interface ActorSearch {
  name: string;
  id: number;
}

export interface DirectorSearch {
  name: string;
  id: number;
}

export interface SearchResponse {
  movies: MovieSummary[];
  actors: ActorSearch[];
  directors: DirectorSearch[];
}

export interface HigherOrLowerData {
  name: string;
  year: number;
  averageRating: number;
  poster: string;
}
