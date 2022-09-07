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
  useGenomeInfoQuery,
  isGenomeNotFoundError
} from 'src/shared/state/genome/genomeApiSlice';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { fetchExampleFocusObjects } from 'src/content/app/genome-browser/state/focus-object/focusObjectSlice';
import { isSidebarOpen } from 'src/content/app/species/state/sidebar/speciesSidebarSelectors';
import { toggleSidebar } from 'src/content/app/species/state/sidebar/speciesSidebarSlice';
import { setActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSlice';

import SpeciesAppBar from './components/species-app-bar/SpeciesAppBar';
import SpeciesSidebar from './components/species-sidebar/SpeciesSidebar';
import { StandardAppLayout } from 'src/shared/components/layout';
import SpeciesMainView from 'src/content/app/species/components/species-main-view/SpeciesMainView';
import Chevron from 'src/shared/components/chevron/Chevron';
import MissingGenomeError from 'src/shared/components/error-screen/url-errors/MissingGenomeError';

import { BreakpointWidth } from 'src/global/globalConfig';
import type { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesPage.scss';

type SpeciesPageParams = {
  genomeId: string;
};

const SpeciesPageContent = () => {
  const { genomeId: genomeIdInUrl } = useParams() as SpeciesPageParams;
  const {
    data: genomeInfo,
    isError,
    error
  } = useGenomeInfoQuery(genomeIdInUrl);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const genomeId = genomeInfo?.genomeId;

  const changeGenomeId = (species: CommittedItem) => {
    const genomeIdForUrl = species.url_slug ?? species.genome_id;
    const params = {
      genomeId: genomeIdForUrl
    };

    navigate(urlFor.speciesPage(params), { replace: true });
  };

  const sidebarStatus = useAppSelector(isSidebarOpen);

  useEffect(() => {
    if (!genomeId) {
      return;
    }
    dispatch(setActiveGenomeId(genomeId));
    dispatch(fetchExampleFocusObjects(genomeId));
  }, [genomeId]);

  if (isError && isGenomeNotFoundError(error)) {
    return (
      <div className={styles.speciesPage}>
        <SpeciesAppBar onSpeciesSelect={changeGenomeId} />
        <MissingGenomeError genomeId={genomeIdInUrl} />
      </div>
    );
  }

  if (!genomeId) {
    return null; // TODO: consider some kind of a spinner?
  }

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
      <div className={styles.topbarLeft} onClick={returnToSpeciesSelector}>
        <Chevron direction="left" animate={false} />
        <span className={styles.pageTitle}>Find a Species</span>
      </div>
      <div className={styles.dataForSpecies}>
        {/* placeholder for future species data */}
      </div>
    </div>
  );
};

export default SpeciesPageContent;
