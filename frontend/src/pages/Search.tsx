import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

import MakePage from '../components/MakePage';
import Container from '../components/MyContainer';
import MovieResultCard from '../components/MovieResultCard';
import PersonResultCard from '../components/PersonResultCard';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import styles from './Search.module.css';

import { apiMovieSearch, apiGetGenres } from '../util/api';
import { MovieSummary, ActorSearch, DirectorSearch } from '../util/interface';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const PAGE_SIZE = 20;

const Search = () => {
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = React.useState<MovieSummary[]>([]);
  const [actors, setActors] = React.useState<ActorSearch[]>([]);
  const [directors, setDirectors] = React.useState<DirectorSearch[]>([]);
  const [fetched, setFetched] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [genres, setGenres] = React.useState<string[]>([]);

  const [allGenres, setAllGenres] = React.useState<string[]>([]);

  const [contentRatings, setContentRatings] = React.useState<string[]>([]);

  const [numMoviesShown, setNumMoviesShown] = React.useState(PAGE_SIZE);
  const [numActorsShown, setNumActorsShown] = React.useState(PAGE_SIZE);
  const [numDirectorsShown, setNumDirectorsShown] = React.useState(PAGE_SIZE);

  const resetResults = () => {
    setMovies([]);
    setActors([]);
    setDirectors([]);
  };

  React.useEffect(() => {
    resetResults();
    setFetched(false);

    const myContentRatings =
      contentRatings.length != 0 ? [...contentRatings] : undefined;
    const myGenres = genres.length != 0 ? [...genres] : undefined;

    const name = searchParams.get('name') ?? '';

    if (name === '') {
      setFetched(true);
      return;
    }

    apiMovieSearch(name, myGenres, myContentRatings)
      .then((res) => {
        setMovies(res.movies);
        setActors(res.actors);
        setDirectors(res.directors);
        setFetched(true);
      })
      .catch(() => {
        setMovies([]);
        setFetched(true);
      });
  }, [searchParams, genres, contentRatings]);

  React.useEffect(() => {
    apiGetGenres().then((data) => setAllGenres(data.genres));
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>Search Results - Smoovies</title>
      </Helmet>

      <Typography gutterBottom variant="h4" component="h1">
        Results: {searchParams.get('name')}
      </Typography>

      {!fetched && (
        <Typography gutterBottom variant="h5" component="h2">
          Searching...
        </Typography>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Movies" {...a11yProps(0)} />
          <Tab label="Actors" {...a11yProps(1)} />
          <Tab label="Directors" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <form className={styles.form}>
          <Autocomplete
            className={styles.flexContents1}
            multiple
            id="tags-standard"
            options={[
              'NR',
              'G',
              'PG',
              'PG-13',
              'M',
              'MA 15+',
              'R',
              'TV-PG',
              'TV-14',
            ]}
            autoHighlight
            size="small"
            value={contentRatings}
            onChange={(_, value) => setContentRatings(value)}
            renderInput={(params) => (
              <TextField {...params} label="Content Rating" />
            )}
          />
          <Autocomplete
            className={styles.flexContents2}
            multiple
            id="tags-standard"
            options={allGenres}
            autoHighlight
            size="small"
            value={genres}
            onChange={(_, value) => setGenres(value)}
            renderInput={(params) => <TextField {...params} label="Genres" />}
          />
        </form>

        {fetched && movies.length === 0 && <p>No movies found.</p>}
        {movies.length > 0 &&
          movies
            .slice(0, numMoviesShown)
            .map((movie) => (
              <MovieResultCard
                key={movie.id}
                movie={movie}
                buttonClick={null}
              />
            ))}

        {numMoviesShown < movies.length && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => setNumMoviesShown(numMoviesShown + PAGE_SIZE)}
            >
              Show more
            </Button>
          </div>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {fetched && actors.length === 0 && <p>No actors found.</p>}
        {actors.length > 0 &&
          actors
            .slice(0, numActorsShown)
            .map((actor) => (
              <PersonResultCard
                key={actor.id}
                name={actor.name}
                link={`/actor/${actor.id}`}
                image="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
              />
            ))}

        {numActorsShown < actors.length && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => setNumActorsShown(numActorsShown + PAGE_SIZE)}
            >
              Show more
            </Button>
          </div>
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {fetched && directors.length === 0 && <p>No directors found.</p>}
        {directors.length > 0 &&
          directors
            .slice(0, numDirectorsShown)
            .map((director) => (
              <PersonResultCard
                key={director.id}
                name={director.name}
                link={`/director/${director.id}`}
                image="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
              />
            ))}

        {numDirectorsShown < directors.length && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() =>
                setNumDirectorsShown(numDirectorsShown + PAGE_SIZE)
              }
            >
              Show more
            </Button>
          </div>
        )}
      </TabPanel>
    </Container>
  );
};

export default MakePage(Search);
