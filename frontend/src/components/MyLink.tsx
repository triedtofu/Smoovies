import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import styles from './MyLink.module.css';

const MyLink = (props: LinkProps & React.RefAttributes<HTMLAnchorElement>) => {
  return <Link {...props} className={`${props.className} ${styles.link}`}>{props.children}</Link>;
};

export default MyLink;
