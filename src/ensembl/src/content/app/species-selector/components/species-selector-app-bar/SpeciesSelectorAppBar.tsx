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
import { Link } from 'react-router-dom';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import {
  toggleSpeciesUseAndSave,
  deleteSpeciesAndSave
} from 'src/content/app/species-selector/state/speciesSelectorActions';
import * as urlFor from 'src/shared/helpers/urlHelper';

import AppBar from 'src/shared/components/app-bar/AppBar';
import SelectedSpecies from 'src/shared/components/selected-species/SelectedSpecies';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';
import { HelpPopupButton } from 'src/shared/components/help-popup';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSelectorAppBar.scss';

type Props = {
  selectedSpecies: CommittedItem[];
  onSpeciesDelete: (genomeId: string) => void;
};

export const PlaceholderMessage = () => (
  <div className={styles.placeholderMessage}>
    Search for a species, select from popular species or browse species by data
    to manage your favourites
  </div>
);

export const SpeciesSelectorAppBar = (props: Props) => {
  const mainContent =
    props.selectedSpecies.length > 0 ? (
      <SelectedSpeciesList {...props} />
    ) : (
      <PlaceholderMessage />
    );

  return (
    <AppBar
      appName="Species Selector"
      mainContent={mainContent}
      aside={<HelpPopupButton slug="selecting-a-species" />}
    />
  );
};

const showSpeciesHomepage = () => {
  return;
};

const SelectedSpeciesList = (props: Props) => {
  const shouldLinkToGenomeBrowser =
    props.selectedSpecies.filter(({ isEnabled }) => isEnabled).length > 0;

  const selectedSpecies = props.selectedSpecies.map((species) => (
    <SelectedSpecies
      key={species.genome_id}
      species={species}
      onClick={showSpeciesHomepage}
      // onToggleUse={props.toggleSpeciesUse}
      // onRemove={props.onSpeciesDelete}
    />
  ));

  const link = shouldLinkToGenomeBrowser ? (
    <Link to={urlFor.browser()}>View in Genome Browser</Link>
  ) : null;

  return <SpeciesTabsWrapper speciesTabs={selectedSpecies} link={link} />;
};

const mapStateToProps = (state: RootState) => ({
  selectedSpecies: getCommittedSpecies(state)
});

const mapDispatchToProps = {
  showSpeciesHomepage: showSpeciesHomepage,
  toggleSpeciesUse: toggleSpeciesUseAndSave,
  onSpeciesDelete: deleteSpeciesAndSave
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesSelectorAppBar);
