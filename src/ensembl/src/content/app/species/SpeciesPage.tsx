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

import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import { BreakpointWidth } from 'src/global/globalConfig';

import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';
import { setActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSlice';

import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { isSidebarOpen } from 'src/content/app/species/state/sidebar/speciesSidebarSelectors';

import { toggleSidebar } from 'src/content/app/species/state/sidebar/speciesSidebarSlice';

import SpeciesAppBar from './components/species-app-bar/SpeciesAppBar';
import {
  StandardAppLayout,
  SidebarBehaviourType
} from 'src/shared/components/layout';
import SpeciesMainView from 'src/content/app/species/components/species-main-view/SpeciesMainView';

import { RootState } from 'src/store';

type SpeciesPageParams = {
  genomeId: string;
};

const SpeciesPage = () => {
  const { genomeId } = useParams() as SpeciesPageParams;
  const currentSpecies = useSelector((state: RootState) =>
    getCommittedSpeciesById(state, genomeId)
  );
  const sidebarStatus = useSelector(isSidebarOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveGenomeId(genomeId));
  }, [genomeId]);

  useEffect(() => {
    if (!currentSpecies) {
      dispatch(fetchGenomeData(genomeId));
    }
  }, [genomeId, currentSpecies]);

  const sidebarContent = 'I am sidebar';
  const sidebarNavigationContent = 'I am sidebar navigation';
  const topbarContent = 'I am topbar content';

  return (
    <>
      <SpeciesAppBar />
      <StandardAppLayout
        mainContent={<SpeciesMainView />}
        sidebarContent={sidebarContent}
        sidebarNavigation={sidebarNavigationContent}
        topbarContent={topbarContent}
        sidebarBehaviour={SidebarBehaviourType.SLIDEOVER}
        isSidebarOpen={sidebarStatus}
        onSidebarToggle={() => {
          dispatch(toggleSidebar());
        }}
        viewportWidth={BreakpointWidth.DESKTOP}
      />
    </>
  );
};

export default SpeciesPage;
