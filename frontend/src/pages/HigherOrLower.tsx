import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { apiAuthLogin } from '../util/api';

import MakePage from '../components/MakePage';

const HigherOrLower = () => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies();

  return <p>Higher Or Lower Game</p>;
};

export default MakePage(HigherOrLower);
