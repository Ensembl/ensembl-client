import React, { FunctionComponent, memo, Props } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Launchbar.scss';

type LaunchbarButtonProps = {
  app: string;
  description: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;
  enabled: boolean;
};

export const LaunchbarButton: FunctionComponent<LaunchbarButtonProps> = (
  props: LaunchbarButtonProps
) => {
  const icon =
    typeof props.icon === 'string' ? (
      <img
        src={props.icon}
        className={styles.LaunchbarButton}
        alt={props.description}
      />
    ) : (
      <props.icon />
    );

  return props.enabled ? (
    <NavLink
      className={styles.launchbarButton}
      title={props.description}
      to={`/app/${props.app}`}
      activeClassName={styles.launchbarButtonActive}
    >
      {icon}
    </NavLink>
  ) : (
    <span
      className={`${styles.launchbarButton} ${styles.launchbarButtonDisabled}`}
      title={props.description}
    >
      {icon}
    </span>
  );
};

export default memo(LaunchbarButton);
