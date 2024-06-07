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

import { useAppSelector } from 'src/store';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import { AppName as AppNameText } from 'src/global/globalConfig';

const VepAppBar = () => {
  return (
    <AppBar
      mainContent={<SpeciesTabs />}
      topRight={<SpeciesManagerIndicator />}
      topLeft={<AppName>{AppNameText.TOOLS}</AppName>}
    />
  );
};

const SpeciesTabs = () => {
  const speciesList = useAppSelector(getEnabledCommittedSpecies);

  const speciesTabs = speciesList.map((species) => (
    <SelectedSpecies
      key={species.genome_id}
      species={species}
      disabled={true}
    />
  ));

  return <SpeciesTabsSlider>{speciesTabs}</SpeciesTabsSlider>;
};

export default VepAppBar;
