import React from 'react';

import Link, { LinkTypeMap } from '@mui/material/Link';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';

const MyLink = (props: DefaultComponentProps<LinkTypeMap<unknown, "a">>) => {
  return (
    <Link underline="hover" {...props}>
      {props.children}
    </Link>
  )
};

export default MyLink;
