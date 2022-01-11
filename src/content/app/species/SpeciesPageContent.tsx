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
import { useNavigate } from 'react-router-dom';

import { BreakpointWidth } from 'src/global/globalConfig';
import * as urlFor from 'src/shared/helpers/urlHelper';

import { fetchGenomeData } from 'src/shared/state/genome/genomeSlice';
import { isSidebarOpen } from 'src/content/app/species/state/sidebar/speciesSidebarSelectors';
import { toggleSidebar } from 'src/content/app/species/state/sidebar/speciesSidebarSlice';
import { setActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSlice';

import SpeciesAppBar from './components/species-app-bar/SpeciesAppBar';
import SpeciesSidebar from './components/species-sidebar/SpeciesSidebar';
import { StandardAppLayout } from 'src/shared/components/layout';
import SpeciesMainView from 'src/content/app/species/components/species-main-view/SpeciesMainView';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './SpeciesPage.scss';

type SpeciesPageParams = {
  genomeId: string;
};

const SpeciesPageContent = () => {
  const { genomeId } = useParams() as SpeciesPageParams;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeGenomeId = (genomeId: string) => {
    const params = {
      genomeId
    };

    navigate(urlFor.speciesPage(params), { replace: true });
  };

  const sidebarStatus = useSelector(isSidebarOpen);

  useEffect(() => {
    dispatch(setActiveGenomeId(genomeId));
    dispatch(fetchGenomeData(genomeId));
  }, [genomeId]);

  return (
    <div className={styles.speciesPage}>
      <SpeciesAppBar onSpeciesSelect={changeGenomeId} />

      <StandardAppLayout
        mainContent={<SpeciesMainView />}
        sidebarContent={<SpeciesSidebar />}
        sidebarNavigation={null}
        topbarContent={<TopBar />}
        isSidebarOpen={sidebarStatus}
        onSidebarToggle={() => {
          dispatch(toggleSidebar({ genomeId }));
        }}
        viewportWidth={BreakpointWidth.DESKTOP}
      />
    </div>
  );
};

const TopBar = () => {
  const navigate = useNavigate();

  const returnToSpeciesSelector = () => {
    navigate(urlFor.speciesSelector());
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <span className={styles.pageTitle}>Species Home page</span>
        <CloseButton
          className={styles.close}
          onClick={returnToSpeciesSelector}
        />
      </div>
      <div className={styles.dataForSpecies}>Data for this species</div>
    </div>
  );
};

export default SpeciesPageContent;
