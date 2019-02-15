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
                <dd key={app.name} className={`${app.name}Icon`}>
                  <LaunchbarIcon app={app} currentApp={props.currentApp} />
                </dd>
              ))}
            </dl>
          ))}
        </div>
      </div>
      <div className={styles.about}>
        <h2>Genome research database</h2>
        <dl>
          <dd className={styles.about}>
            <LaunchbarIcon
              app={launchbarConfig.about}
              currentApp={props.currentApp}
            />
          </dd>
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
