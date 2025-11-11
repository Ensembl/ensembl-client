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

import { memo } from 'react';

import { useAppSelector } from 'src/store';

import { AppName as AppNameText } from 'src/global/globalConfig';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';

const StructuralVariantsAppBar = () => {
  const speciesList = useAppSelector(getEnabledCommittedSpecies);

  const speciesTabs = speciesList.map((species, index) => (
    <SelectedSpecies key={index} species={species} disabled={true} />
  ));

  const speciesTabsSlider = (
    <SpeciesTabsSlider>{speciesTabs}</SpeciesTabsSlider>
  );
  const appName = <AppName>{AppNameText.ALIGNMENTS_VIEWER}</AppName>;

  const mainContent = speciesTabs.length ? speciesTabsSlider : null;

  return (
    <AppBar
      topLeft={appName}
      topRight={<SpeciesManagerIndicator />}
      mainContent={mainContent}
    />
  );
};

export default memo(StructuralVariantsAppBar);
