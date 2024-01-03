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
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'src/store';
import {
  useGenomeSummaryByGenomeSlugQuery,
  isGenomeNotFoundError
} from 'src/shared/state/genome/genomeApiSlice';
import { useSpeciesDetailsQuery } from 'src/content/app/species/state/api/speciesApiSlice';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  getIsSpeciesSidebarModalOpened,
  isSpeciesSidebarOpen
} from 'src/content/app/species/state/sidebar/speciesSidebarSelectors';
import { toggleSidebar } from 'src/content/app/species/state/sidebar/speciesSidebarSlice';
import { setActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSlice';

import SpeciesAppBar from './components/species-app-bar/SpeciesAppBar';
import SpeciesPageSidebar from './components/species-page-sidebar/SpeciesPageSidebar';
import { StandardAppLayout } from 'src/shared/components/layout';
import SpeciesMainView from 'src/content/app/species/components/species-main-view/SpeciesMainView';
import Chevron from 'src/shared/components/chevron/Chevron';
import MissingGenomeError from 'src/shared/components/error-screen/url-errors/MissingGenomeError';
import SpeciesSidebarModal from './components/species-sidebar-modal/SpeciesSidebarModal';
import SpeciesSidebarToolstrip from './components/species-sidebar-toolstrip/SpeciesSidebarToolstrip';

import { BreakpointWidth } from 'src/global/globalConfig';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './SpeciesPage.module.css';

type SpeciesPageParams = {
  genomeId: string;
};

const SpeciesPageContent = () => {
  const { genomeId: genomeIdInUrl } = useParams() as SpeciesPageParams;
  const {
    currentData: genomeSummary,
    isError,
    error
  } = useGenomeSummaryByGenomeSlugQuery(genomeIdInUrl);

  const { data: speciesDetails } = useSpeciesDetailsQuery(
    genomeSummary?.genome_id ?? '',
    {
      skip: !genomeSummary?.genome_id
    }
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const genomeId = genomeSummary?.genome_id;

  const changeGenomeId = (species: CommittedItem) => {
    const genomeIdForUrl = species.genome_tag ?? species.genome_id;
    const params = {
      genomeId: genomeIdForUrl
    };

    navigate(urlFor.speciesPage(params), { replace: true });
  };

  const sidebarStatus = useAppSelector(isSpeciesSidebarOpen);

  useEffect(() => {
    if (!genomeId) {
      return;
    }
    dispatch(setActiveGenomeId(genomeId));
  }, [genomeId]);

  if (isError && isGenomeNotFoundError(error)) {
    return (
      <div className={styles.speciesPage}>
        <SpeciesAppBar onSpeciesSelect={changeGenomeId} />
        <MissingGenomeError genomeId={genomeIdInUrl} />
      </div>
    );
  }

  if (!speciesDetails) {
    return null; // TODO: consider some kind of a spinner?
  }

  const SidebarContent = () => {
    const isSpeciesSidebarModalOpened = useAppSelector(
      getIsSpeciesSidebarModalOpened
    );

    return isSpeciesSidebarModalOpened ? (
      <SpeciesSidebarModal />
    ) : (
      <SpeciesPageSidebar data={speciesDetails} />
    );
  };

  return (
    <div className={styles.speciesPage}>
      <SpeciesAppBar onSpeciesSelect={changeGenomeId} />

      <StandardAppLayout
        mainContent={<SpeciesMainView />}
        sidebarContent={<SidebarContent />}
        sidebarNavigation={null}
        topbarContent={<TopBar />}
        isSidebarOpen={sidebarStatus}
        sidebarToolstripContent={<SpeciesSidebarToolstrip />}
        onSidebarToggle={() => {
          dispatch(toggleSidebar({ genomeId: genomeId ?? '' }));
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
      <div className={styles.topbarLeft} onClick={returnToSpeciesSelector}>
        <Chevron direction="left" animate={false} />
        <span className={styles.pageTitle}>Find a Species</span>
      </div>
    </div>
  );
};

export default SpeciesPageContent;
