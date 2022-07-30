import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import MakePage from '../components/MakePage';

import styles from './HigherOrLower.module.css';

import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import stubData from './HigherOrLower.json';
import { HigherOrLowerData } from '../util/interface';

const transition = {
  x: { type: "tween", duration: 1},
  layout: { type: "tween", duration: 1},
}

const HigherOrLower = () => {
  const [data, setData] = React.useState<HigherOrLowerData[]>([]);

  const [index0, setIndex0] = React.useState(-1);
  const [index1, setIndex1] = React.useState(-1);
  const [index2, setIndex2] = React.useState(-1);
  const [index3, setIndex3] = React.useState(-1);

  React.useEffect(() => {
    setData(stubData);

    setIndex0(0);
    setIndex1(1);
    setIndex2(2);
    setIndex3(3);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => { document.body.style.overflow = ''; }
  }, []);

  const handleClick = () => {
    setIndex0(index1);
    setIndex1((index1 + 1) % data.length);
    setIndex2((index2 + 1) % data.length);
    setIndex3((index3 + 1) % data.length);
  }

  if (index1 < 0 || index2 < 0) return <></>;

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

          <div className={styles.highscore}>
            <p>0</p>

            <p>High score</p>
          </div>
        </motion.div>

        <motion.div
          key={`${data[index1].name} (${data[index1].year})`}
          className={styles.div}
          style={{ backgroundImage: `url(${data[index1].poster})` }}
          layoutId={`${data[index1].name} (${data[index1].year})`}
          transition={transition}
        >
          <h2 className={styles.movieTitle}>{data[index1].name} ({data[index1].year})</h2>

          <p>has a</p>

          <p className={styles.rating}>{data[index1].averageRating}</p>

          <p>Average Rating</p>

          <div className={styles.highscore}>
            <p>0</p>

            <p>High score</p>
          </div>
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

          <Button
            className={styles.button}
            variant="contained"
            color="success"
            startIcon={<ArrowUpwardIcon />}
            onClick={handleClick}
          >
            Higher
          </Button>

          <Button
            className={styles.button}
            variant="contained"
            color="error"
            startIcon={<ArrowDownwardIcon />}
            onClick={handleClick}
          >
            Lower
          </Button>

          <p>Average Rating</p>

          <div className={styles.score}>
            <p>0</p>

            <p>Score</p>
          </div>
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

          <div className={styles.score}>
            <p>0</p>

            <p>Score</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className={styles.vs}>VS</p>
    </div>
  );
};

export default MakePage(HigherOrLower);
