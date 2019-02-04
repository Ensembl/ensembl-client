import React, { Component, ReactNode } from 'react';
import SlideDown from 'react-slidedown';

import {
  LaunchbarCategory,
  launchbarConfig,
  LaunchbarApp
} from './launchbarConfig';

import LaunchbarIcon from './LaunchbarIcon';

import styles from './Launchbar.scss';

type LaunchbarProps = {
  currentApp: string;
  launchbarExpanded: boolean;
};

class Launchbar extends Component<LaunchbarProps> {
  public render() {
    const LaunchbarChildren: ReactNode = (
      <div className={styles.launchbar}>
        <div className={styles.categoriesWrapper}>
          <div className={styles.categories}>
            {launchbarConfig.categories.map((category: LaunchbarCategory) => (
              <dl
                className={styles[this.getCategoryClass(category.separator)]}
                key={category.name}
              >
                {category.apps.map((app: LaunchbarApp) => (
                  <dt key={app.name} className={`${app.name}Icon`}>
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
        <div className={styles.about}>
          <dl>
            <dt className="aboutIcon">
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
