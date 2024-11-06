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

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import { HelpPopupButton } from 'src/shared/components/help-popup';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';

import { AppName as AppNameText } from 'src/global/globalConfig';

import { useAppDispatch, useAppSelector } from 'src/store';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import { placeholderMessage } from 'src/content/app/species-selector/components/species-selector-app-bar/SpeciesSelectorAppBar';

import { setSelectedSpecies } from '../state/biomartSlice';

const BiomartAppBar = () => {
  const dispatch = useAppDispatch();
  const speciesList = useAppSelector(getEnabledCommittedSpecies);
  const selectedSpecies = useAppSelector(
    (state) => state.biomart.general.selectedSpecies
  );

  const onSpeciesClick = (species: CommittedItem): void => {
    dispatch(setSelectedSpecies(species));
  };

  const appBarProps = {
    topLeft: <AppName>{AppNameText.TOOLS}</AppName>,
    aside: <HelpPopupButton slug="biomart" />
  };

  const speciesTabs = speciesList.map((species, index) => (
    <SelectedSpecies
      key={index}
      species={species}
      onClick={() => onSpeciesClick(species)}
      isActive={selectedSpecies?.genome_id === species.genome_id}
    />
  ));

  const speciesTabsSlider = (
    <SpeciesTabsSlider>{speciesTabs}</SpeciesTabsSlider>
  );

  const mainContent =
    speciesList.length > 0 ? speciesTabsSlider : placeholderMessage;

  return (
    <AppBar
      mainContent={mainContent}
      topRight={<SpeciesManagerIndicator />}
      {...appBarProps}
    />
  );
};

export default BiomartAppBar;
