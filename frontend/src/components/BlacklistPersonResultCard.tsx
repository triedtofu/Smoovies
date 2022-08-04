import React from 'react';

import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { apiPutBlacklistUser } from '../util/api';

import styles from './PersonResultCard.module.css';
import MyLink from './MyLink';

interface BlacklistPersonResultCardProps {
  name: string;
  userId: number;
  link: string;
  image: string;
}

const BlacklistPersonResultCard = (props: BlacklistPersonResultCardProps) => {
  const [BLRemove, setBLRemove] = React.useState(false);
  const [cookies] = useCookies();

  const removeFromBlacklist = () => {
    apiPutBlacklistUser(cookies.token, props.userId, BLRemove);
    setBLRemove(true);
  };

  return (
    <Card className={styles.card}>
      <CardMedia
        component="img"
        image={props.image}
        alt={`Image of ${props.name}`}
        className={styles.card_media}
      />
      <CardContent className={styles.card_content}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: '20px',
            marginRight: '20px',
          }}
        >
          <MyLink href={props.link}>
            <Typography gutterBottom variant="h5" component="div">
              {props.name}
            </Typography>
          </MyLink>
          {!BLRemove && (
            <Button variant="outlined" onClick={() => removeFromBlacklist()}>
              Remove from blacklist
            </Button>
          )}
          {BLRemove && (
            <h3 style={{ color: 'green', font: 'Futura' }}>
              Removed from blacklist
            </h3>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlacklistPersonResultCard;
