import React, { FunctionComponent, ReactNode } from 'react';
import SlideDown from 'react-slidedown';

import ensemblIcon from 'static/img/launchbar/ensembl-logo.png'; // <-- note it's a png

import { ReactComponent as SearchIcon } from 'static/img/launchbar/search.svg';
import { ReactComponent as SpeciesSelectorIcon } from 'static/img/launchbar/species-selector.svg';
import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as VEPIcon } from 'static/img/launchbar/vep.svg';
import { ReactComponent as CustomDownloadIcon } from 'static/img/launchbar/custom-download.svg';
import { ReactComponent as HelpIcon } from 'static/img/launchbar/help.svg';

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

// {launchbarConfig.categories.map((category: LaunchbarCategory) => (
//   <dl
//     className={styles[getCategoryClass(category.separator)]}
//     key={category.name}
//   >
//     {category.apps.map((app: LaunchbarApp) => (
//       <dd key={app.name} className={`${app.name}Icon`}>
//         <LaunchbarIcon app={app} currentApp={props.currentApp} />
//       </dd>
//     ))}
//   </dl>
// ))}

const LaunchbarContent = (props: LaunchbarProps) => (
  <div className={styles.launchbar}>
    <div className={styles.categoriesWrapper}>
      <div className={styles.categories}>
        <div className={styles.category}>
          <LaunchbarIcon
            app="global-search"
            description="Global search"
            icon={SearchIcon}
            enabled={false}
          />
          <LaunchbarIcon
            app="species-selector"
            description="Species selector"
            icon={SpeciesSelectorIcon}
            enabled={true}
          />
        </div>
        <div className={styles.category}>
          <LaunchbarIcon
            app="browser"
            description="Genome browser"
            icon={BrowserIcon}
            enabled={true}
          />
        </div>
        <div className={styles.category}>
          <LaunchbarIcon
            app="tools"
            description="Tools"
            icon={VEPIcon}
            enabled={false}
          />
        </div>
        <div className={styles.category}>
          <LaunchbarIcon
            app="downloads"
            description="Downloads"
            icon={CustomDownloadIcon}
            enabled={false}
          />
        </div>
        <div className={styles.category}>
          <LaunchbarIcon
            app="help-docs"
            description="Help & documentation"
            icon={HelpIcon}
            enabled={false}
          />
        </div>
      </div>
    </div>
    <div className={styles.about}>
      <span>Genome research database</span>
      <LaunchbarIcon
        app="about"
        description="About Ensembl"
        icon={ensemblIcon}
        enabled={false}
      />
    </div>
  </div>
);

const Launchbar = (props: LaunchbarProps) => {
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
