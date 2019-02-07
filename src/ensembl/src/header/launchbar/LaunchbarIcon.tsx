import React, { FunctionComponent, memo } from 'react';
import { Link } from 'react-router-dom';

import { LaunchbarApp } from './launchbarConfig';

import styles from './LaunchbarIcon.scss';

type LaunchbarIconProps = {
  app: LaunchbarApp;
  currentApp: string;
};

export const LaunchbarIcon: FunctionComponent<LaunchbarIconProps> = (
  props: LaunchbarIconProps
) => {
  const iconImage = (
    <img
      className={styles.launchbarIcon}
      src={getAppIcon(props)}
      alt={props.app.description}
      title={props.app.description}
    />
  );

  if (props.app.icon.grey) {
    return iconImage;
  } else {
    return <Link to={`/app/${props.app.name}`}>{iconImage}</Link>;
  }
};

export function getAppIcon(props: LaunchbarIconProps): string {
  const { app, currentApp } = props;

  if (app.icon.grey) {
    return app.icon.grey;
  } else {
    return currentApp === app.name ? app.icon.selected : app.icon.default;
  }
}

export default memo(LaunchbarIcon);
