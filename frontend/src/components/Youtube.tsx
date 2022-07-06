import React from 'react';

import styles from './Youtube.module.css';

interface YoutubeProps {
  code: string;
}

const Youtube = (props: YoutubeProps) => {
  return (
    <div className={styles.div}>
      <iframe
        className={styles.iframe}
        src={`https://www.youtube.com/embed/${props.code}`}
        title="YouTube video player"
        allowFullScreen
      />
    </div>
  );
}

export default Youtube;
