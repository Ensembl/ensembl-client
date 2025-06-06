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
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { AppName as AppNameText } from 'src/global/globalConfig';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import { getActiveGenomeId } from 'src/content/app/regulatory-activity-viewer/state/general/generalSelectors';

import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const ActivityViewerAppBar = () => {
  const speciesList = useAppSelector(getEnabledCommittedSpecies);
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  const navigate = useNavigate();

  const onSpeciesTabClick = (species: CommittedItem) => {
    const genomeIdForUrl = species.genome_tag ?? species.genome_id;
    const url = urlFor.regulatoryActivityViewer({
      genomeId: genomeIdForUrl
    });
    navigate(url);
  };

  const speciesTabs = speciesList.map((species, index) => (
    <SelectedSpecies
      key={index}
      species={species}
      isActive={species.genome_id === activeGenomeId}
      onClick={onSpeciesTabClick}
    />
  ));

  const speciesTabsSlider = (
    <SpeciesTabsSlider>{speciesTabs}</SpeciesTabsSlider>
  );
  const appName = <AppName>{AppNameText.REGULATORY_ACTIVITY_VIEWER}</AppName>;

  const mainContent = activeGenomeId
    ? speciesTabsSlider
    : 'To start using this app...';

  return (
    <AppBar
      topLeft={appName}
      topRight={<SpeciesManagerIndicator />}
      mainContent={mainContent}
    />
  );
};

export default memo(ActivityViewerAppBar);
