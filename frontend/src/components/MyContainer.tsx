import React from 'react';

import Container, { ContainerTypeMap } from '@mui/material/Container';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';

const MyContainer = (props: DefaultComponentProps<ContainerTypeMap<unknown, "div">>) => {
  return (
    <Container sx={{ py: 2 }} {...props}>
      {props.children}
    </Container>
  )
};

export default MyContainer;
