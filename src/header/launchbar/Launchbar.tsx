/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Link } from 'react-router-dom';

import useHeaderAnalytics from '../hooks/useHeaderAnalytics';

import {
  GenomeBrowserIcon,
  GlobalSearchIcon,
  HelpIcon
} from 'src/shared/components/app-icon';
import LaunchbarButton from './LaunchbarButton';
import SpeciesSelectorLaunchbarButton from './SpeciesSelectorLaunchbarButton';
import EntityViewerLaunchbarButton from './EntityViewerLaunchbarButton';
import BlastLaunchbarButton from './BlastLaunchbarButton';

import Logotype from 'static/img/brand/logotype.svg';

import styles from './Launchbar.module.css';

export const getCategoryClass = (separator: boolean): string => {
  return separator ? 'border' : '';
};

const Launchbar = () => {
  return (
    <div className={styles.launchbar}>
      <div className={styles.categoriesWrapper}>
        <div className={styles.categories}>
          <div className={styles.category}>
            <LaunchbarButton
              path="/global-search"
              description="Site search"
              icon={GlobalSearchIcon}
              enabled={false}
            />
            <SpeciesSelectorLaunchbarButton />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              path="/genome-browser"
              description="Genome browser"
              icon={GenomeBrowserIcon}
              enabled={true}
            />
          </div>
          <div className={styles.category}>
            <EntityViewerLaunchbarButton />
          </div>
          <div className={styles.category}>
            <BlastLaunchbarButton />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              path="/help"
              description="Help & documentation"
              icon={HelpIcon}
              enabled={true}
            />
          </div>
        </div>
      </div>
      <AboutEnsembl />
    </div>
  );
};

const AboutEnsembl = () => {
  const { trackLaunchbarAppChange } = useHeaderAnalytics();

  return (
    <Link
      to="/about"
      className={styles.aboutEnsembl}
      onClick={() => trackLaunchbarAppChange('About')}
    >
      About the
      <Logotype className={styles.logotype} />
      project
    </Link>
  );
};

export default Launchbar;
