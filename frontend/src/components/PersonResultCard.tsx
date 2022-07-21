import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import styles from './PersonResultCard.module.css';
import MyLink from './MyLink';

interface PersonResultCardProps {
  name: string;
  link: string;
  image: string;
}

const PersonResultCard = (props: PersonResultCardProps) => {
  return (
    <Card className={styles.card}>
      <CardMedia
        component="img"
        image={props.image}
        alt={`Image of ${props.name}`}
        className={styles.card_media}
      />
      <CardContent className={styles.card_content}>
        <MyLink to={props.link}>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
        </MyLink>
      </CardContent>
    </Card>
  );
};

export default PersonResultCard;
