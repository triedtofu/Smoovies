import React, { FormEvent } from 'react';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

import styles from './NewMovieForm.module.css';
import RequiredTextField from './RequiredTextField';
import Youtube from './Youtube';

import { youtubeURLToCode } from '../util/helper';
import { MovieDetails } from '../util/interface';

export type SubmitMovie = (
  name: string,
  year: number,
  poster: string,
  trailer: string,
  description: string,
  director: string,
  genres: string[],
  contentRating: string,
  cast: string,
  runtime: number
) => void;

interface NewMovieProps {
  submit: SubmitMovie;
  error: string;
  allGenres: string[];
  initialValues?: MovieDetails;
}

let timeout: undefined | NodeJS.Timeout = undefined;

const NewMovieForm = (props: NewMovieProps) => {
  const [name, setName] = React.useState('');
  const [year, setYear] = React.useState('');
  const [poster, setPoster] = React.useState('');
  const [trailer, setTrailer] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [director, setDirector] = React.useState('');
  const [genres, setGenres] = React.useState<string[]>([]);
  const [contentRating, setContentRating] = React.useState('');
  const [cast, setCast] = React.useState('');
  const [runtime, setRuntime] = React.useState('');
  
  const [posterUrl, setPosterUrl] = React.useState('');
  const [trailerUrl, setTrailerUrl] = React.useState('');

  React.useEffect(() => {
    const initialValues = props.initialValues;
    if (initialValues) {
      setName(initialValues.name);
      setYear(`${initialValues.year}`);
      setPosterUrl(initialValues.poster);
      setTrailerUrl(`https://youtu.be/${initialValues.trailer}`);
      setDescription(initialValues.description);
      setDirector(initialValues.director);
      setGenres(initialValues.genres);
      setContentRating(initialValues.contentRating);
      setCast(initialValues.cast);
      setRuntime(`${initialValues.runtime}`);
    }
  }, [props]);

  React.useEffect(() => {
    setTrailer(youtubeURLToCode(trailerUrl) ?? '');
  }, [trailerUrl]);

  React.useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setPoster(posterUrl);
    }, 1000);

    return () => clearTimeout();
  }, [posterUrl]);

  const newMovieSubmit = (e: FormEvent) => {
    e.preventDefault();

    let yearNumber = 0;
    let runtimeNumber = 0;

    try {
      yearNumber = parseInt(year);
    } catch {
      // TODO
      return;
    }

    try {
      runtimeNumber = parseInt(runtime);
    } catch {
      // TODO
      return;
    }

    props.submit(
      name,
      yearNumber,
      poster,
      trailer,
      description,
      director,
      genres,
      contentRating,
      cast,
      runtimeNumber
    );
  };

  return (
    <>
      <form onSubmit={newMovieSubmit} className={styles.movieForm}>
        <RequiredTextField
          size="small"
          name="name"
          label="Title"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className={styles.flexDiv}>
          <RequiredTextField
            type="text"
            size="small"
            name="year"
            label="Year"
            value={year}
            inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(e) => {
              setYear(e.target.value);
            }}
            className={styles.flexContents}
          />

          <RequiredTextField
            type="text"
            size="small"
            name="runtime"
            label="Runtime"
            value={runtime}
            inputProps={{ maxLength: 4 }}
            onChange={(e) => setRuntime(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">min</InputAdornment>
            }}
            className={styles.flexContents}
          />

          <FormControl className={styles.flexContents} size="small" >
            <InputLabel>Content Rating</InputLabel>
            <Select
              value={contentRating}
              label="Content Rating"
              onChange={(e) => setContentRating(e.target.value)}
            >
              {['NR', 'G', 'PG', 'PG-13', 'M', 'MA 15+', 'R', 'TV-PG', 'TV-14'].map(rating => {
                return <MenuItem key={rating} value={rating}>{rating}</MenuItem>
              })}
            </Select>
          </FormControl>
        </div>

        <Autocomplete
          multiple
          id="tags-standard"
          options={props.allGenres}
          autoHighlight
          size="small"
          value={genres}
          onChange={(e, value) => setGenres(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Genres"
            />
          )}
        />

        <RequiredTextField
          size="small"
          name="name"
          label="Director"
          value={director}
          onChange={(e) => {
            setDirector(e.target.value);
          }}
        />

        <RequiredTextField
          size="small"
          name="name"
          label="Cast"
          value={cast}
          inputProps={{ maxLength: 100 }}
          onChange={(e) => {
            setCast(e.target.value);
          }}
          helperText="Actors separated with a comma ','"
        />

        {poster && <img className={styles.poster} src={poster} alt="Movie poster"/>}

        <RequiredTextField
          label="Poster"
          size="small"
          fullWidth
          placeholder="image url"
          value={posterUrl}
          onChange={e => setPosterUrl(e.target.value)}
        />

        {trailerUrl && <div className={styles.youtube}>
          <Youtube code={trailer}/>
        </div>}

        <RequiredTextField
          label="Trailer"
          size="small"
          fullWidth
          placeholder="Youtube url"
          value={trailerUrl}
          onChange={e => setTrailerUrl(e.target.value)}
        />

        <RequiredTextField
          fullWidth
          label="Movie Description"
          multiline
          rows={8}
          inputProps={{ maxLength: 800 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          helperText={`${description.length} / 800`}
        />

        <Button variant="contained" type="submit">
          {props.initialValues ? 'Save' :  'Add'} Movie
        </Button>
      </form>
    </>
  );
};

export default NewMovieForm;
