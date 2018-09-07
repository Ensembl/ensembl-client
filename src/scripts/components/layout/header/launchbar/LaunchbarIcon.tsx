import React, { SFC } from 'react';
import { Link } from 'react-router-dom';

import { LaunchbarApp } from '../../../../configs/launchbarConfig';

type LaunchbarIconProps = {
  app: LaunchbarApp;
};

const LaunchbarIcon: SFC<LaunchbarIconProps> = (props: LaunchbarIconProps) => (
  <dt>
    <Link to={`/app/${props.app.name}`}>
      <img
        src={props.app.icon.default}
        alt={props.app.description}
        title={props.app.description}
      />
    </Link>
  </dt>
);

export default LaunchbarIcon;
