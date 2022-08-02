import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';

import styles from './HigherOrLower.module.css';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { apiGetHigherOrLower, apiGetGenres } from '../util/api';
import { randInt } from '../util/helper';
import { HigherOrLowerData } from '../util/interface';

const transition = {
  x: { type: "tween", duration: 1},
  layout: { type: "tween", duration: 1},
}

let timeout: undefined | NodeJS.Timeout = undefined;
let selectedHigher = false;

const HigherOrLower = () => {
  const navigate = useNavigate();

  const [gameStatus, setGameStatus] = React.useState<"init" | "playing" | "animating" | "next" | "ending" | "end" | "win">("init");

  const [startYear, setStartYear] = React.useState('1888');
  const [endYear, setEndYear] = React.useState(new Date().getFullYear().toString());
  const [genres, setGenres] = React.useState<string[]>([]);
  const [contentRatings, setContentRatings] = React.useState<string[]>([]);

  const [allGenres, setAllGenres] = React.useState<string[]>([]);

  const [data, setData] = React.useState<HigherOrLowerData[]>([]);
  const [score, setScore] = React.useState(0);
  const [highscore, setHighscore] = React.useState(0);

  const [index0, setIndex0] = React.useState(-1);
  const [index1, setIndex1] = React.useState(-1);
  const [index2, setIndex2] = React.useState(-1);
  const [index3, setIndex3] = React.useState(-1);

  const [errorStr, setErrorStr] = React.useState('');

  const newGame = (len : number) => {
    setScore(0);

    const indexes: number[] = [];

    while (indexes.length !== 4) {
      const rand = randInt(0, len - 1);
      if (!indexes.includes(rand)) indexes.push(rand);
    }

    setIndex0(indexes[0]);
    setIndex1(indexes[1]);
    setIndex2(indexes[2]);
    setIndex3(indexes[3]);

    setGameStatus('playing');
  }

  React.useEffect(() => {
    // get list of genres
    apiGetGenres().then(res => setAllGenres(res.genres));

    () => clearTimeout(timeout);
  }, []);

  const handleClick = (higher : boolean) => {
    selectedHigher = higher;
    setGameStatus('animating');
  }

  const changeMovie = () => {
    let rand = randInt(0, data.length - 1);

    while ([index0, index1, index2, index3].includes(rand)) {
      rand = randInt(0, data.length - 1);
    }

    setIndex0(index1);
    setIndex1(index2);
    setIndex2(index3);
    setIndex3(rand);
  }

  const checkCorrect = () => {
    if (selectedHigher && data[index1].averageRating <= data[index2].averageRating) {
      setScore(score + 1);
    } else if (!selectedHigher && data[index1].averageRating >= data[index2].averageRating) {
      setScore(score + 1);
    } else {
      setGameStatus('ending');
      timeout = setTimeout(() => {
        setGameStatus('end');
        if (score > highscore) setHighscore(score);
      }, 1500);
      return;
    }

    setGameStatus('next');
    changeMovie();
  }

  const AnimatedNumber = ({ value }: { value: number }) => {
    const animatedValue = useSpring<{ val: number }>({
      from: { val: 0 },
      val: value,
      config: config.molasses,
      delay: 200,
      onRest: () => {
        if (gameStatus === 'animating') checkCorrect();
      }
    });

    if (gameStatus === 'animating') {
      return (
        <animated.span className={styles.rating}>
          {animatedValue.val.to((val: number) => val.toFixed(1))}
        </animated.span>
      );
    } else if (gameStatus === 'ending') {
      return <div className={styles.rating}>{value}</div>
    }

    return <></>;
  }

  const handleSubmit = () => {
    setErrorStr('');

    const startYearInt = parseInt(startYear);
    const endYearInt = parseInt(endYear);

    if (startYearInt > endYearInt) {
      setErrorStr("Start year cannot be greater than End year");
      return;
    }

    apiGetHigherOrLower(startYearInt, endYearInt, genres, contentRatings).then(res => {
      if (res.movies.length < 10) {
        setErrorStr("Sorry, there aren't enough movies that match the criteria");
        return;
      }

      setData(res.movies);
      newGame(res.movies.length);
    });
  }

  if (gameStatus === 'init') return (
    <div className={styles.endScreen}>
      <Helmet>
        <title>Higher or Lower - Smoovies</title>
      </Helmet>

      <Typography gutterBottom variant="h4" component="h1">Higher or Lower Menu</Typography>

      <form onSubmit={handleSubmit} style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {errorStr && <FormLabel error>{errorStr}</FormLabel>}
        <div style={{ display: 'flex', gap: '10px' }}>

          <TextField
            id="outlined-number"
            label="Start year"
            type="number"
            size="small"
            sx={{ flex: '1' }}
            value={startYear}
            onChange={e => setStartYear(e.target.value)}
            helperText="Start year (inclusive)"
            required
          />

          <TextField
            id="outlined-number"
            label="End year"
            type="number"
            size="small"
            sx={{ flex: '1' }}
            value={endYear}
            onChange={e => setEndYear(e.target.value)}
            helperText="End year (inclusive)"
            required
          />
        </div>

        <Autocomplete
          // className={styles.flexContents1}
          multiple
          id="tags-standard"
          options={['NR', 'G', 'PG', 'PG-13', 'M', 'MA 15+', 'R', 'TV-PG', 'TV-14']}
          autoHighlight
          size="small"
          value={contentRatings}
          onChange={(_, value) => setContentRatings(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Content Rating"
              helperText="Optional: Filter the movies based on their content rating"
            />
          )}
        />

        <Autocomplete
          className={styles.flexContents2}
          multiple
          id="tags-standard"
          options={allGenres}
          autoHighlight
          size="small"
          loading
          loadingText="Loading..."
          value={genres}
          onChange={(_, value) => setGenres(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Genres"
              helperText="Optional: Genres which the movies must have at least one of"
            />
          )}
        />

        <Button variant="contained" type="submit">
          Start game
        </Button>
      </form>

      <Button
        variant="text"
        className={styles.endHomeButton}
        // sx={{ color: 'white' }}
        onClick={() => navigate('/')}
      >
        Home
      </Button>
    </div>
  );

  if (index1 < 0 || index2 < 0) return <></>;

  if (gameStatus === 'end') return (
    <div className={styles.endScreen}>

      <div>You scored: </div>

      <div className={styles.endScore}>{score}</div>

      <Button
        variant="contained"
        color="error"
        className={styles.button}
        onClick={() => newGame(data.length)}
      >
        Play again
      </Button>

      <Button
        variant="contained"
        className={styles.button}
        onClick={() => setGameStatus('init')}
      >
        Go to menu
      </Button>

      <Button
        variant="text"
        className={styles.endHomeButton}
        onClick={() => navigate('/')}
      >
        Home
      </Button>
    </div>
  );

  return (
    <div
      className={styles.flexDiv}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={`${data[index0].name} (${data[index0].year})`}
          className={styles.div}
          style={{ backgroundImage: `url(${data[index0].poster})` }}
          layoutId={`${data[index0].name} (${data[index0].year})`}
          transition={transition}
        >
          <h2 className={styles.movieTitle}>{data[index0].name} ({data[index0].year})</h2>

          <p>has a</p>

          <p className={styles.rating}>{data[index0].averageRating}</p>

          <p>Average Rating</p>
        </motion.div>

        <motion.div
          key={`${data[index1].name} (${data[index1].year})`}
          className={styles.div}
          style={{ backgroundImage: `url(${data[index1].poster})` }}
          layoutId={`${data[index1].name} (${data[index1].year})`}
          transition={transition}
          onLayoutAnimationComplete={() => setGameStatus('playing')}
        >
          <h2 className={styles.movieTitle}>{data[index1].name} ({data[index1].year})</h2>

          <p>has a</p>

          <p className={styles.rating}>{data[index1].averageRating}</p>

          <p>Average Rating</p>
        </motion.div>

        <motion.div
          key={`${data[index2].name} (${data[index2].year})`}
          className={styles.div}
          style={{ backgroundImage: `url(${data[index2].poster})` }}
          layoutId={`${data[index2].name} (${data[index2].year})`}
          transition={transition}
        >
          <h2 className={styles.movieTitle}>{data[index2].name} ({data[index2].year})</h2>

          <p>has a</p>

          {(gameStatus === 'playing' || gameStatus === 'next') && <><Button
            className={styles.button}
            variant="contained"
            color="success"
            startIcon={<ArrowUpwardIcon />}
            onClick={() => handleClick(true)}
          >
            Higher
          </Button>

          <Button
            className={styles.button}
            variant="contained"
            color="error"
            startIcon={<ArrowDownwardIcon />}
            onClick={() => handleClick(false)}
          >
            Lower
          </Button></>}

          <AnimatedNumber value={data[index2].averageRating} />

          <p>Average Rating</p>
        </motion.div>

        <motion.div
          key={`${data[index3].name} (${data[index3].year})`}
          className={styles.div}
          style={{ backgroundImage: `url(${data[index3].poster})` }}
          layoutId={`${data[index3].name} (${data[index3].year})`}
          transition={transition}
        >
          <h2 className={styles.movieTitle}>{data[index3].name} ({data[index3].year})</h2>

          <p>has a</p>

          <Button
            className={styles.button}
            variant="contained"
            color="success"
            startIcon={<ArrowUpwardIcon />}
          >
            Higher
          </Button>

          <Button
            className={styles.button}
            variant="contained"
            color="error"
            startIcon={<ArrowDownwardIcon />}
          >
            Lower
          </Button>

          <p>Average Rating</p>
        </motion.div>
      </AnimatePresence>

      <div className={styles.highscore}>
        <p className={styles.scoreNum}>{highscore}</p>

        <p className={styles.scoreText}>High score</p>
      </div>

      <div className={styles.score}>
        <p className={styles.scoreNum}>{score}</p>

        <p className={styles.scoreText}>Score</p>
      </div>

      <Button
        variant="text"
        className={styles.homeButton}
        sx={{ color: 'white' }}
        onClick={() => navigate('/')}
      >
        Home
      </Button>

      {(gameStatus === 'playing' || gameStatus === 'animating') && <div className={styles.center}>VS</div>}

      {gameStatus === 'next' &&
      <div className={`${styles.center} ${styles.circle}`} id={styles.correct}><CheckIcon sx={{ width: '3rem', height: '3rem' }} /></div>}

      {gameStatus === 'ending' &&
      <div className={`${styles.center} ${styles.circle}`} id={styles.incorrect}><CloseIcon sx={{ width: '3rem', height: '3rem' }} /></div>}
    </div>
  );
};

export default HigherOrLower;
