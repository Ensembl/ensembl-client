import React from 'react';

import ensemblIcon from 'static/img/launchbar/ensembl-logo.png'; // <-- note it's a png

import { ReactComponent as SearchIcon } from 'static/img/launchbar/search.svg';
import { ReactComponent as SpeciesSelectorIcon } from 'static/img/launchbar/species-selector.svg';
import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';
import { ReactComponent as CustomDownloadIcon } from 'static/img/launchbar/custom-download.svg';
import { ReactComponent as HelpIcon } from 'static/img/launchbar/help.svg';
import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import LaunchbarButton from './LaunchbarButton';

import styles from './Launchbar.scss';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

type LaunchbarProps = {
  launchbarExpanded: boolean;
  committedSpecies: CommittedItem[];
};

export const getCategoryClass = (separator: boolean): string => {
  return separator ? 'border' : '';
};

const Launchbar = (props: LaunchbarProps) => {
  return (
    <div className={styles.launchbar}>
      <div className={styles.categoriesWrapper}>
        <div className={styles.categories}>
          <div className={styles.category}>
            <LaunchbarButton
              app="global-search"
              description="Site search"
              icon={SearchIcon}
              enabled={false}
            />
            <LaunchbarButton
              app="species-selector"
              description="Species selector"
              icon={SpeciesSelectorIcon}
              enabled={true}
            />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              app="browser"
              description="Genome browser"
              icon={BrowserIcon}
              enabled={props.committedSpecies.length > 0}
            />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              app="entity-viewer"
              description="Entity Viewer"
              icon={EntityViewerIcon}
              enabled={
                isEnvironment([Environment.DEVELOPMENT, Environment.INTERNAL]) &&
                props.committedSpecies.length > 0
              }
            />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              app="custom-download"
              description="Downloads"
              icon={CustomDownloadIcon}
              enabled={
                isEnvironment([
                  Environment.DEVELOPMENT,
                  Environment.INTERNAL
                ]) && props.committedSpecies.length > 0
              }
            />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              app="help-docs"
              description="Help & documentation"
              icon={HelpIcon}
              enabled={false}
            />
          </div>
        </div>
      </div>
      <div className={styles.about}>
        <span className={styles.aboutText}>Genome research database</span>
        <LaunchbarButton
          app="about"
          description="About Ensembl"
          icon={ensemblIcon}
          enabled={false}
        />
      </div>
    </div>
  );
};

export default Launchbar;
