import React, { FunctionComponent, memo, Props } from 'react';
import { Link } from 'react-router-dom';

import { LaunchbarApp } from './launchbarConfig';

import styles from './LaunchbarIcon.scss';

type LaunchbarIconProps = {
  app: string;
  description: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  enabled: boolean;
};

export const LaunchbarIcon: FunctionComponent<LaunchbarIconProps> = (
  props: LaunchbarIconProps
) => {
  const icon =
    typeof props.icon === 'string' ? (
      <img
        src={props.icon}
        className={styles.launchbarIcon}
        alt={props.description}
      />
    ) : (
      <props.icon />
    );

  return <div>{icon}</div>;
};

export default memo(LaunchbarIcon);
