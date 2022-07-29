import React from 'react';

import MakePage from '../components/MakePage';

import styles from './HigherOrLower.module.css';

import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import stubData from './HigherOrLower.json';
import { HigherOrLowerData } from '../util/interface';

const HigherOrLower = () => {
  const [data, setData] = React.useState<HigherOrLowerData[]>([]);

  const [index1, setIndex1] = React.useState(-1);
  const [index2, setIndex2] = React.useState(-1);

  React.useEffect(() => {
    setData(stubData);

    setIndex1(0);
    setIndex2(1);
  }, []);

  if (index1 < 0 || index2 < 0) return <></>;

  return (
    <div className={styles.flexDiv}>
      <div
        className={`${styles.div} ${styles.div1}`}
        style={{ backgroundImage: `url(${data[index1].poster})` }}
      >
        <h2 className={styles.movieTitle}>{data[index1].name} ({data[index1].year})</h2>

        <p>has a</p>

        <p className={styles.score}>{data[index1].averageRating}</p>

        <p>Average Rating</p>
      </div>

      <div
        className={`${styles.div} ${styles.div2}`}
        style={{ backgroundImage: `url(${data[index2].poster})` }}
      >
        <h2 className={styles.movieTitle}>{data[index2].name} ({data[index2].year})</h2>

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

        <p className={styles.centeredXY}>VS</p>
      </div>
    </div>
  );
};

export default MakePage(HigherOrLower);
