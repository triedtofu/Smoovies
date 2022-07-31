import React from 'react';

import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from 'react-spring'

import MakePage from '../components/MakePage';

import styles from './HigherOrLower.module.css';

import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import stubData from './HigherOrLower.json';
import { HigherOrLowerData } from '../util/interface';

const transition = {
  x: { type: "tween", duration: 1},
  layout: { type: "tween", duration: 1},
  // onTransitionEnd: () => {console.log("Done!")},
}

let timeout: undefined | NodeJS.Timeout = undefined;
let selectedHigher = false;

const HigherOrLower = () => {
  const navigate = useNavigate();

  const [gameStatus, setGameStatus] = React.useState<"init" | "playing" | "animating" | "next" | "ending" | "end" | "win">("playing");
  const [data, setData] = React.useState<HigherOrLowerData[]>([]);
  const [score, setScore] = React.useState(0);
  const [highscore, setHighscore] = React.useState(0);

  const [index0, setIndex0] = React.useState(-1);
  const [index1, setIndex1] = React.useState(-1);
  const [index2, setIndex2] = React.useState(-1);
  const [index3, setIndex3] = React.useState(-1);

  const newGame = () => {
    setScore(0);

    setIndex0(0);
    setIndex1(1);
    setIndex2(2);
    setIndex3(3);

    setGameStatus('playing');
  }

  React.useEffect(() => {
    setData(stubData);

    newGame();

    () => clearTimeout(timeout);
  }, []);

  // React.useEffect(() => {
  //   console.log(gameStatus);
  // }, [gameStatus]);

  const handleClick = (higher : boolean) => {
    selectedHigher = higher;
    setGameStatus('animating');
  }

  const changeMovie = () => {
    setIndex0(index1);
    setIndex1((index1 + 1) % data.length);
    setIndex2((index2 + 1) % data.length);
    setIndex3((index3 + 1) % data.length);
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

  if (index1 < 0 || index2 < 0) return <></>;

  if (gameStatus === 'end') return (
    <div className={styles.endScreen}>

      <div>You scored: </div>

      <div className={styles.endScore}>{score}</div>

      <Button
        variant="contained"
        color="error"
        className={styles.button}
        onClick={() => newGame()}
      >
        Play again
      </Button>

      <Button
        variant="text"
        className={styles.endHomeButton}
        sx={{ color: 'white' }}
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
