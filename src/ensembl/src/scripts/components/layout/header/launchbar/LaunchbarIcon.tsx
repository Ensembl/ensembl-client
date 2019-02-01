import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import { LaunchbarApp } from '../../../../configs/launchbarConfig';

type LaunchbarIconProps = {
  app: LaunchbarApp;
  currentApp: string;
};

class LaunchbarIcon extends PureComponent<LaunchbarIconProps> {
  public render() {
    const { app } = this.props;

    return (
      <Link to={`/app/${app.name}`}>
        <img
          src={this.getAppIcon()}
          alt={app.description}
          title={app.description}
        />
      </Link>
    );
  }

  private getAppIcon(): string {
    const { app, currentApp } = this.props;

    return currentApp === app.name ? app.icon.selected : app.icon.default;
  }
}

export default LaunchbarIcon;
