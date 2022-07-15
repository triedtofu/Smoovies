import React, { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import RequiredTextField from './RequiredTextField';
import styles from './NewMovieForm.module.css';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
  runTime: number
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

  // const [focusedTitle, setFocusedTitle] = React.useState(false);
  const [focusedDescription, setFocusedDescription] = React.useState(false);
  // const [countTitle, setCountTitle] = React.useState(0);
  const [countDescription, setCountDescription] = React.useState(0);

  // const onFocusTitle = () => setFocusedTitle(true);
  // const onBlurTitle = () => setFocusedTitle(false);
  const onFocusDescription = () => setFocusedDescription(true);
  const onBlurDescription = () => setFocusedDescription(false);

  const [hover, setHover] = React.useState(false);
  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };

  React.useEffect(() => {
    setTrailer(trailerUrl);
  }, [trailerUrl]);

  // const fileToDataUrl = (file) => {
  //   const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  //   const valid = validFileTypes.find((type) => type === file.type);
  //   // Bad data, let's walk away.
  //   if (!valid) {
  //     throw Error('provided file is not a png, jpg or jpeg image.');
  //   }

  //   const reader = new FileReader();
  //   const dataUrlPromise = new Promise((resolve, reject) => {
  //     reader.onerror = reject;
  //     reader.onload = () => resolve(reader.result);
  //   });
  //   reader.readAsDataURL(file);
  //   return dataUrlPromise;
  // };

  // const convertPoster = (event) => {
  //   fileToDataUrl(event.target.files[0]).then((data) => {
  //     setPoster(data);
  //     console.log(data);
  //   });
  // };

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

  const handleChange = (event: SelectChangeEvent) => {
    setContentRating(event.target.value as string);
  };

  return (
    <>
      <FormControl>
        <form onSubmit={newMovieSubmit}>
          <div className={styles.title}>
            <RequiredTextField
              style={{ width: '75%' }}
              size="small"
              name="name"
              label="Title (required)"
              value={name}
              // inputProps={{ maxLength: 50 }}
              onChange={e => setName(e.target.value)}
              // setCountTitle(e.target.value.length);
              // onFocus={onFocusTitle}
              // onBlur={onBlurTitle}
            />
            &nbsp;
            {/* {focusedTitle && <p>{countTitle}/50</p>} */}
            <RequiredTextField
              style={{ width: '25%' }}
              type="text"
              size="small"
              name="year"
              label="Year"
              value={year}
              inputProps={{ maxLength: 4 }}
              onChange={(e) => {
                setYear(e.target.value);
              }}
            />
          </div>
          {/* <div>
            <h2>Image</h2>
            <Input
              type="file"
              label="Poster"
              onChange={convertPoster}
              className="filetype"
              id="group_image"
            ></Input>
            <div>
              <img width="40%" height="40%" src={poster} alt="questionImage" />
            </div>
          </div> */}
          <br />
          <div>
            <FormControl fullWidth>
              <InputLabel style={{ display: 'flex' }}> Rating</InputLabel>
              <Select
                value={contentRating}
                size="small"
                style={{ width: '20%', textAlign: 'center' }}
                label="Maturity Rating"
                onChange={handleChange}
              >
                {['G', 'PG', '13+', '14A', '16+', '18A', '18+', 'R', 'A'].map(rating => {
                  return <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                })}
              </Select>
            </FormControl>
          </div>
          <br/>
          <div>
            <RequiredTextField
              style={{ width: '25%' }}
              type="text"
              size="small"
              name="runtime"
              label="Runtime (mins)"
              value={runtime}
              inputProps={{ maxLength: 4 }}
              onChange={(e) => {
                setRuntime(e.target.value);
              }}
            />
          </div>
          <br />
          <div>
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
          </div>

          <br />
          <div className={styles.directorAndCast}>
            <RequiredTextField
              // style={{ width: '50%', height: '10%' }}
              size="small"
              name="name"
              label="Director"
              value={director}
              inputProps={{ maxLength: 40 }}
              onChange={(e) => {
                setDirector(e.target.value);
              }}
            />
            &nbsp;
            <RequiredTextField
              // style={{ width: '50%', height: '10%' }}
              size="small"
              name="name"
              label="Cast"
              value={cast}
              inputProps={{ maxLength: 100 }}
              onChange={(e) => {
                setCast(e.target.value);
              }}
            />
            <HelpOutlineIcon
              onMouseEnter={onHover}
              onMouseLeave={onLeave}
            />
          </div>
          {hover ? (
            <div className={styles.commaDiv}>
              <span className={styles.commaDivText}>
                Please separate actors with a comma ','
              </span>
            </div>
          ) : (
            ''
          )}
          <br/>
          <div>
            <RequiredTextField
              label="Poster"
              size="small"
              fullWidth
              placeholder="image url"
              value={poster}
              onChange={e => setPoster(e.target.value)}
            />
          </div>
          <br/>
          <div>
            <RequiredTextField
              label="Trailer"
              size="small"
              fullWidth
              placeholder="Youtube url"
              value={trailerUrl}
              onChange={e => setTrailerUrl(e.target.value)}
            />
          </div>
          <br/>
          <div>
            <RequiredTextField
              fullWidth
              label="Movie Description (required)"
              multiline
              rows={8}
              inputProps={{ maxLength: 800 }}
              onChange={(e) => {
                setDescription(e.target.value);
                setCountDescription(e.target.value.length);
              }}
              onFocus={onFocusDescription}
              onBlur={onBlurDescription}
            />
            {focusedDescription && <p>{countDescription}/1000</p>}
          </div>
          <br />
          <Button variant="contained" type="submit">
            Add Movie
          </Button>
        </form>
      </FormControl>
    </>
  );
};

export default NewMovieForm;