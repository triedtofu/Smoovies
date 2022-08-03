import React from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';

import MakePage from '../components/MakePage';
import Container from '../components/MyContainer';
import BlacklistPersonResultCard from '../components/BlacklistPersonResultCard';

import { apiBlacklistUser } from '../util/api';
import { parseJwt, getErrorMessage } from '../util/helper';
import { BlacklistSummary } from '../util/interface';

const Blacklist = () => {
  const params = useParams();
  const [cookies] = useCookies();

  const [blacklistUsers, setBlacklistUsers] = React.useState<
    BlacklistSummary[] | undefined
  >(undefined);

  React.useEffect(() => {
    setBlacklistUsers(undefined);

    // get the blacklisted users
    apiBlacklistUser(cookies.token).then((data) => {
      setBlacklistUsers(data.users);
    });
  }, [params]);

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
