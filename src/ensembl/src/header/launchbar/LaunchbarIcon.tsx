import React, { FunctionComponent, memo, Props } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Launchbar.scss';

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

  return props.enabled ? (
    <NavLink
      className={styles.launchbarButton}
      to={`/app/${props.app}`}
      activeClassName={styles.launchbarButtonActive}
    >
      {icon}
    </NavLink>
  ) : (
    <span
      className={`${styles.launchbarButton} ${styles.launchbarButtonDisabled}`}
    >
      {icon}
    </span>
  );
};

export default memo(LaunchbarIcon);
