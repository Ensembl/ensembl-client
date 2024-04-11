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
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import SelectedSpecies from 'src/shared/components/selected-species/SelectedSpecies';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

export const SpeciesManagerAppBar = () => {
  const selectedSpecies = useAppSelector(getCommittedSpecies);
  const navigate = useNavigate();

  const onClose = () => navigate(-1);

  const mainContent = <AppBarMainContent selectedSpecies={selectedSpecies} />;

  const appName = <AppName>Species Selector</AppName>;

  return (
    <AppBar
      topLeft={appName}
      topRight={<SpeciesManagerIndicator mode="close" onClose={onClose} />}
      mainContent={mainContent}
      aside={<HelpPopupButton slug="species-selector-intro" />}
    />
  );
};

const AppBarMainContent = (props: { selectedSpecies: CommittedItem[] }) => {
  const selectedSpecies = props.selectedSpecies.map((species) => (
    <SelectedSpecies
      key={species.genome_id}
      species={species}
      isActive={false}
      disabled={true}
    />
  ));

  return (
    <div>
      <SpeciesTabsSlider>{selectedSpecies}</SpeciesTabsSlider>
    </div>
  );
};

export default SpeciesManagerAppBar;
