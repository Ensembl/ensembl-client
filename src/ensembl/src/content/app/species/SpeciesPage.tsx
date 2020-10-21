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
import useSpeciesRouting from './hooks/useSpeciesRouting';
import { isSidebarOpen } from 'src/content/app/species/state/sidebar/speciesSidebarSelectors';
import { toggleSidebar } from 'src/content/app/species/state/sidebar/speciesSidebarSlice';

import SpeciesAppBar from './components/species-app-bar/SpeciesAppBar';
import { StandardAppLayout } from 'src/shared/components/layout';
import SpeciesMainView from 'src/content/app/species/components/species-main-view/SpeciesMainView';

type SpeciesPageParams = {
  genomeId: string;
};

const SpeciesPage = () => {
  const { changeGenomeId } = useSpeciesRouting();

  const { genomeId } = useParams() as SpeciesPageParams;

  const sidebarStatus = useSelector(isSidebarOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGenomeData(genomeId));
  }, [genomeId]);

  const sidebarContent = 'I am sidebar';
  const sidebarNavigationContent = 'I am sidebar navigation';
  const topbarContent = 'I am topbar content';

  return (
    <>
      <SpeciesAppBar onSpeciesSelect={changeGenomeId} />

      <StandardAppLayout
        mainContent={<SpeciesMainView />}
        sidebarContent={sidebarContent}
        sidebarNavigation={sidebarNavigationContent}
        topbarContent={topbarContent}
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
