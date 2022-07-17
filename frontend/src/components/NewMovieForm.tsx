import React, { FormEvent } from 'react';
import { Link } from 'react-router-dom';

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
}

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
  const [trailerUrl, setTrailerUrl] = React.useState('');
  const [runtime, setRuntime] = React.useState('');

  React.useEffect(() => {
    setTrailer(trailerUrl);
  }, [trailerUrl]);

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
            inputProps={{ maxLength: 4 }}
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
            <InputLabel>Rating</InputLabel>
            <Select
              value={contentRating}
              label="Maturity Rating"
              onChange={(e) => setContentRating(e.target.value)}
            >
              {['G', 'PG', '13+', '14A', '16+', '18A', '18+', 'R', 'A'].map(rating => {
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
          value={poster}
          onChange={e => setPoster(e.target.value)}
        />

        {trailerUrl && <div className={styles.youtube}>
          <Youtube code={trailerUrl}/>
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
          onChange={(e) => setDescription(e.target.value)}
          helperText={`${description.length} / 800`}
        />

        <Button variant="contained" type="submit">
          Add Movie
        </Button>
      </form>
    </>
  );
};

export default NewMovieForm;
