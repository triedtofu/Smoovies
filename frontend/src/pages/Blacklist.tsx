import React from 'react';
import { useCookies } from 'react-cookie';

import Typography from '@mui/material/Typography';

import MakePage from '../components/MakePage';
import Container from '../components/MyContainer';
import BlacklistPersonResultCard from '../components/BlacklistPersonResultCard';

import { apiBlacklistUser } from '../util/api';
import { getErrorMessage } from '../util/helper';
import { BlacklistSummary } from '../util/interface';

const Blacklist = () => {
  const [cookies] = useCookies();

  const [blacklistUsers, setBlacklistUsers] = React.useState<
    BlacklistSummary[] | undefined
  >(undefined);

  const [errorStr, setErrorStr] = React.useState('');

  React.useEffect(() => {
    setErrorStr('');
    setBlacklistUsers(undefined);

    if (!cookies.token) {
      setErrorStr('You must be logged in to view this page');
      return;
    }

    // get the blacklisted users
    apiBlacklistUser(cookies.token)
      .then((data) => {
        setBlacklistUsers(data.users);
      })
      .catch(error => setErrorStr(getErrorMessage(error)));
  }, [cookies.token]);

  if (errorStr) return (
    <Container maxWidth="lg">
      <h2>{errorStr}</h2>
    </Container>
  );

  if (!blacklistUsers) return <></>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1">
        Your Blacklist
      </Typography>

      {blacklistUsers.length === 0 && <p>No users in blacklist.</p>}

      <div>
        {blacklistUsers.length > 0 &&
          blacklistUsers.map((user) => (
            <BlacklistPersonResultCard
              key={user.userId}
              userId={user.userId}
              name={user.username}
              link={`/user/${user.userId}`}
              image="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
            />
          ))}
      </div>
    </Container>
  );
};

export default MakePage(Blacklist);
