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

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import noop from 'lodash/noop';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import AppBar from 'src/shared/components/app-bar/AppBar';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';
import { SelectedSpecies } from 'src/shared/components/selected-species';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './HomepageSpeciesBar.scss';

type Props = {
  species: CommittedItem[];
};

const HomepageSpeciesBar = (props: Props) => {
  let barContent;
  if (!props.species.length) {
    barContent = (
      <div className={styles.emptySpeciesBar}>
        <span className={styles.speciesSelectorBannerText}>
          7 species now available
        </span>
        <Link
          className={styles.speciesSelectorBannerLink}
          to={urlFor.speciesSelector()}
        >
          Select a species to begin
        </Link>
      </div>
    );
  } else {
    const speciesItems = props.species.map((species, index) => (
      <SelectedSpecies
        key={index}
        species={species}
        onClick={noop}
        isActive={true}
      />
    ));
    barContent = <SpeciesTabsWrapper speciesTabs={speciesItems} />;
  }

  return <AppBar mainContent={barContent} />;
};

const mapStateToProps = (state: RootState) => ({
  species: getEnabledCommittedSpecies(state)
});

export default connect(mapStateToProps)(HomepageSpeciesBar);