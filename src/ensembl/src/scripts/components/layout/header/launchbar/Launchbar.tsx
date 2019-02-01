import React, { Component, ReactNode } from 'react';
import SlideDown from 'react-slidedown';

import {
  LaunchbarCategory,
  launchbarConfig,
  LaunchbarApp
} from '../../../../configs/launchbarConfig';

import LaunchbarIcon from './LaunchbarIcon';

type LaunchbarProps = {
  currentApp: string;
  launchbarExpanded: boolean;
};

class Launchbar extends Component<LaunchbarProps> {
  public render() {
    const LaunchbarChildren: ReactNode = (
      <div className="launchbar">
        <div className="categories-wrapper">
          <div className="categories">
            {launchbarConfig.categories.map((category: LaunchbarCategory) => (
              <dl
                className={this.getCategoryClass(category.separator)}
                key={category.name}
              >
                {category.apps.map((app: LaunchbarApp) => (
                  <dt className={`${app.name}-app-icon`} key={app.name}>
                    <LaunchbarIcon
                      app={app}
                      currentApp={this.props.currentApp}
                    />
                  </dt>
                ))}
              </dl>
            ))}
          </div>
        </div>
        <div className="about">
          <dl>
            <dt className="about-app-icon">
              <LaunchbarIcon
                app={launchbarConfig.about}
                currentApp={this.props.currentApp}
              />
            </dt>
          </dl>
        </div>
      </div>
    );

    return (
      <SlideDown transitionOnAppear={false}>
        {this.props.launchbarExpanded ? LaunchbarChildren : null}
      </SlideDown>
    );
  }

  private getCategoryClass(separator: boolean) {
    return separator ? 'border' : '';
  }
}

export default Launchbar;
