import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import MakePage from '../components/MakePage';
import MovieResultCard from '../components/MovieResultCard';
import PersonResultCard from '../components/PersonResultCard';

import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { apiMovieSearch } from '../util/api';
import { MovieSummary, ActorSearch, DirectorSearch } from '../util/interface';
import MyLink from '../components/MyLink';

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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const Search = () => {
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = React.useState<MovieSummary[]>([]);
  const [actors, setActors] = React.useState<ActorSearch[]>([]);
  const [directors, setDirectors] = React.useState<DirectorSearch[]>([]);
  const [fetched, setFetched] = React.useState(false);
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    setFetched(false);
    const name = searchParams.get('name') ?? '';

    if (name === '') return;

    try {
      apiMovieSearch(name)
        .then((res) => {
          setMovies(res.movies);
          setActors(res.actors);
          setDirectors(res.directors);
          setFetched(true);
        })
        .catch((err) => {
          setMovies([]);
          setFetched(true);
        });
    } catch (err) {
      console.log(err);
      setMovies([]);
    }
  }, [searchParams]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>Search Results - Smoovies</title>
      </Helmet>

      <h1>Results: {searchParams.get('name')}</h1>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Movies" {...a11yProps(0)} />
          <Tab label="Actors" {...a11yProps(1)} />
          <Tab label="Directors" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {fetched && movies.length === 0 && <p>No movies found.</p>}
        {movies.length > 0 &&
          movies.map(movie => (
            <MovieResultCard
              key={movie.id}
              movie={movie}
              buttonClick={null}
            />
          ))}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {fetched && actors.length === 0 && <p>No actors found.</p>}
        {actors.length > 0 && 
          actors.map(actor => (
            <PersonResultCard
              key={actor.id}
              name={actor.name}
              link={`/actor/${actor.id}`}
              image="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
            />
          ))}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {fetched && directors.length === 0 && <p>No directors found.</p>}
        {directors.length > 0 && 
          directors.map(director => (
            <PersonResultCard
            key={director.id}
            name={director.name}
            link={`/director/${director.id}`}
            image="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
          />
          ))}
      </TabPanel>
    </Container>
  );
};

export default MakePage(Search);
