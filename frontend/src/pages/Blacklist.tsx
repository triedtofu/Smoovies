import React from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Container from '../components/MyContainer';
import MakePage from '../components/MakePage';

import { apiBlacklistUser } from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';

import Typography from '@mui/material/Typography';
import { BlacklistResponse, BlacklistSummary } from '../util/interface';
import BlacklistPersonResultCard from '../components/BlacklistPersonResultCard';

const Blacklist = () => {
  const params = useParams();
  const [cookies] = useCookies();
  const [blacklistUsers, setBlacklistUsers] = React.useState<
    BlacklistSummary[]
  >([]);
  const [username, setUsername] = React.useState('');

  React.useEffect(() => {
    setBlacklistUsers([]);
    setUsername('');
    const idStr = params.id ?? '';

    if (idStr === '') {
      // TODO handle error
      return;
    }

    apiBlacklistUser(cookies.token).then((data) => {
      setBlacklistUsers(data.users);
      setUsername(data.username);
      console.log(data.users);
    });
  }, [params]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1">
        {cookies.token && params.id === parseJwt(cookies.token).jti
          ? 'Your Blacklist'
          : `${username}'s Blacklist`}
      </Typography>

      {blacklistUsers.length === 0 && <p>No users in blacklist.</p>}
      <div>
        {blacklistUsers.length > 0 &&
          blacklistUsers.map((user) => (
            <BlacklistPersonResultCard
              key={user.userId}
              userId={user.userId}
              name={user.username}
              link={`/actor/${user.userId}`}
              image="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
            />
          ))}
      </div>
    </Container>
  );
};

export default MakePage(Blacklist);
