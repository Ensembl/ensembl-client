import React, { FunctionComponent, ReactNode } from 'react';
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

export const getCategoryClass = (separator: boolean): string => {
  return separator ? 'border' : '';
};

const Launchbar: FunctionComponent<LaunchbarProps> = (
  props: LaunchbarProps
) => {
  const LaunchbarChildren: ReactNode = (
    <div className={styles.launchbar}>
      <div className={styles.categoriesWrapper}>
        <div className={styles.categories}>
          {launchbarConfig.categories.map((category: LaunchbarCategory) => (
            <dl
              className={styles[getCategoryClass(category.separator)]}
              key={category.name}
            >
              {category.apps.map((app: LaunchbarApp) => (
                <dt key={app.name} className={`${app.name}Icon`}>
                  <LaunchbarIcon app={app} currentApp={props.currentApp} />
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
              currentApp={props.currentApp}
            />
          </dt>
        </dl>
      </div>
    </div>
  );

  return (
    <SlideDown transitionOnAppear={false}>
      {props.launchbarExpanded ? LaunchbarChildren : null}
    </SlideDown>
  );
};

export default Launchbar;
