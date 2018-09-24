import React, { PureComponent } from 'react';

import { LaunchbarApp } from '../../../../configs/launchbarConfig';

type LaunchbarIconProps = {
  app: LaunchbarApp;
  gotoApp: (appName: string) => void;
  currentApp: string;
};

class LaunchbarIcon extends PureComponent<LaunchbarIconProps> {
  constructor(props: LaunchbarIconProps) {
    super(props);

    this.gotoAppHandler = this.gotoAppHandler.bind(this);
  }

  public render() {
    return (
      <dt>
        <button onClick={this.gotoAppHandler}>
          <img
            src={this.getAppIcon()}
            alt={this.props.app.description}
            title={this.props.app.description}
          />
        </button>
      </dt>
    );
  }

  private gotoAppHandler() {
    this.props.gotoApp(this.props.app.name);
  }

  private getAppIcon(): string {
    const { app, currentApp } = this.props;

    return currentApp === app.name ? app.icon.selected : app.icon.default;
  }
}

export default LaunchbarIcon;
