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
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import * as urlFor from 'src/shared/helpers/urlHelper';

import AppBar from 'src/shared/components/app-bar/AppBar';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import SelectedSpecies from 'src/shared/components/selected-species/SelectedSpecies';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSelectorAppBar.scss';

type Props = {
  selectedSpecies: CommittedItem[];
  push: (url: string) => void;
};

export const placeholderMessage = `
Search for a species, select from popular species or browse species by data
to manage your favourites`;

const PlaceholderMessage = () => (
  <div className={styles.placeholderMessage}>{placeholderMessage}</div>
);

export const SpeciesSelectorAppBar = (props: Props) => {
  const mainContent =
    props.selectedSpecies.length > 0 ? (
      <SelectedSpeciesList {...props} />
    ) : (
      <PlaceholderMessage />
    );

  const speciesSelectorSlug = {
    slug: 'species-selector'
  };

  return (
    <AppBar
      appName="Species Selector"
      mainContent={mainContent}
      aside={<HelpPopupButton slug={speciesSelectorSlug} />}
    />
  );
};

const SelectedSpeciesList = (props: Props) => {
  const showSpeciesPage = (genome_id: string) => {
    const speciesPageUrl = urlFor.speciesPage({
      genomeId: genome_id
    });

    props.push(speciesPageUrl);
  };

  const selectedSpecies = props.selectedSpecies.map((species) => (
    <SelectedSpecies
      key={species.genome_id}
      species={species}
      onClick={showSpeciesPage}
    />
  ));

  return <SpeciesTabsWrapper speciesTabs={selectedSpecies} />;
};

const mapStateToProps = (state: RootState) => ({
  selectedSpecies: getCommittedSpecies(state)
});

const mapDispatchToProps = {
  push
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesSelectorAppBar);
