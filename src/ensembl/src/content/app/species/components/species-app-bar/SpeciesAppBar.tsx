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

import { AppName } from 'src/global/globalConfig';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import AppBar from 'src/shared/components/app-bar/AppBar';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import { HelpPopupButton } from 'src/shared/components/help-popup';

type SpeciesAppBarProps = {
  species: CommittedItem[];
  activeGenomeId: string | null;
  onSpeciesSelect: (genomeId: string) => void;
};

const SpeciesAppBar = (props: SpeciesAppBarProps) => {
  const speciesTabs = props.species.map((species, index) => (
    <SelectedSpecies
      key={index}
      species={species}
      isActive={species.genome_id === props.activeGenomeId}
      onClick={() => props.onSpeciesSelect(species.genome_id)}
    />
  ));

  const wrappedSpecies = (
    <SpeciesTabsWrapper isWrappable={true} speciesTabs={speciesTabs} />
  );

  return (
    <AppBar
      appName={AppName.SPECIES_SELECTOR}
      mainContent={wrappedSpecies}
      aside={<HelpPopupButton slug="species-homepage" />}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  species: getCommittedSpecies(state),
  activeGenomeId: getActiveGenomeId(state)
});

export default connect(mapStateToProps)(SpeciesAppBar);
