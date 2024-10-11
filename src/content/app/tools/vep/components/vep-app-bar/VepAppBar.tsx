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

import { useMatch } from 'react-router';

import { useAppDispatch, useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import { getSelectedSpecies as getSelectedSpeciesForVep } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { setSelectedSpecies } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import { AppName as AppNameText } from 'src/global/globalConfig';
import { HelpPopupButton } from 'src/shared/components/help-popup';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const VepAppBar = () => {
  return (
    <AppBar
      mainContent={<SpeciesTabs />}
      topRight={<SpeciesManagerIndicator />}
      topLeft={<AppName>{AppNameText.TOOLS}</AppName>}
      aside={<HelpPopupButton slug="vep" />}
    />
  );
};

const SpeciesTabs = () => {
  const vepFormPath = urlFor.vepForm();
  const isVepFormView = useMatch({ path: vepFormPath, end: true });
  const speciesList = useAppSelector(getEnabledCommittedSpecies);
  const speciesSelectedForVep = useAppSelector(getSelectedSpeciesForVep);
  const dispatch = useAppDispatch();

  const hasSelectedSpeciesForVep = !!speciesSelectedForVep;
  const shouldEnableSpeciesTabs = isVepFormView && !hasSelectedSpeciesForVep;

  const onSpeciesSelect = (species: CommittedItem) => {
    dispatch(setSelectedSpecies({ species }));
  };

  const speciesTabs = speciesList.map((species) => (
    <SelectedSpecies
      key={species.genome_id}
      species={species}
      onClick={onSpeciesSelect}
      disabled={!shouldEnableSpeciesTabs}
    />
  ));

  return <SpeciesTabsSlider>{speciesTabs}</SpeciesTabsSlider>;
};

export default VepAppBar;
