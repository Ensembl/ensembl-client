import React, { PureComponent } from 'react';

import { LaunchbarApp } from '../../../../configs/launchbarConfig';

type LaunchbarIconProps = {
  app: LaunchbarApp;
  changeCurrentApp: (currentApp: string) => void;
  currentApp: string;
};

class LaunchbarIcon extends PureComponent<LaunchbarIconProps> {
  constructor(props: LaunchbarIconProps) {
    super(props);

    this.changeCurrentApp = this.changeCurrentApp.bind(this);
  }

  public render() {
    return (
      <dt>
        <button onClick={this.changeCurrentApp}>
          <img
            src={this.getAppIcon()}
            alt={this.props.app.description}
            title={this.props.app.description}
          />
        </button>
      </dt>
    );
  }

  private changeCurrentApp() {
    this.props.changeCurrentApp(this.props.app.name);
  }

  private getAppIcon(): string {
    const { app, currentApp } = this.props;

    return currentApp === app.name ? app.icon.selected : app.icon.default;
  }
}

export default LaunchbarIcon;
