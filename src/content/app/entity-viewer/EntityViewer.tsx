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

import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppSelector, useAppDispatch } from 'src/store';
import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';

import { getGenomeById } from 'src/shared/state/genome/genomeSelectors';

import {
  setActiveIds,
  deleteActiveEntityIdAndSave
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSlice';
import { initializeSidebar } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import EntityViewerAppBar from './shared/components/entity-viewer-app-bar/EntityViewerAppBar';
import EntityViewerInterstitial from './interstitial/EntityViewerInterstitial';
import MissingGenomeError from 'src/shared/components/error-screen/url-errors/MissingGenomeError';
import MissingFeatureError from 'src/shared/components/error-screen/url-errors/MissingFeatureError';
import EntityViewerForGene from './EntityViewerForGene';
import EntityViewerForVariant from './EntityViewerForVariant';

import styles from './EntityViewer.module.css';

const EntityViewer = () => {
  const {
    activeGenomeId,
    genomeIdInUrl,
    entityIdInUrl,
    parsedEntityId,
    isMissingGenomeId,
    isMalformedEntityId
  } = useEntityViewerIds();
  const genome = useAppSelector((state) =>
    getGenomeById(state, activeGenomeId ?? '')
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEntityViewerRouting();

  useEffect(() => {
    if (activeGenomeId) {
      dispatch(initializeSidebar(activeGenomeId));
    }
  }, [activeGenomeId]);

  const openEntityViewerInterstitial = () => {
    dispatch(deleteActiveEntityIdAndSave());
    navigate(urlFor.entityViewer({ genomeId: genomeIdInUrl }));
  };

  const entityType = parsedEntityId?.type ?? 'unknown';

  return (
    <div className={styles.entityViewer}>
      <EntityViewerAppBar />
      {isMissingGenomeId ? (
        <MissingGenomeError genomeId={genomeIdInUrl as string} />
      ) : isMalformedEntityId ? (
        <MissingFeatureError
          featureId={entityIdInUrl as string}
          genome={genome}
          showTopBar={true}
          onContinue={openEntityViewerInterstitial}
        />
      ) : (
        <Routes>
          <Route index element={<EntityViewerInterstitial />} />
          <Route path="/:genomeId" element={<EntityViewerInterstitial />} />
          <Route
            path="/:genomeId/:entityId"
            element={<EntityViewerController entityType={entityType} />}
          />
        </Routes>
      )}
    </div>
  );
};

const EntityViewerController = (props: { entityType: string }) => {
  const { entityType } = props;

  if (entityType === 'gene') {
    return <EntityViewerForGene />;
  } else if (entityType === 'variant') {
    return <EntityViewerForVariant />;
  } else {
    // this shouldn't happen
    return null;
  }
};

const useEntityViewerRouting = () => {
  const {
    genomeIdInUrl,
    genomeIdForUrl,
    entityIdInUrl,
    entityIdForUrl,
    genomeId,
    entityId,
    hasActiveGenomeIdChanged
  } = useEntityViewerIds();
  const [previousActiveIds, setPreviousActiveIds] = useState<{
    genomeId?: string;
    entityId?: string;
  }>({});
  const [haveActiveIdsChanged, setHaveActiveIdsChanged] = useState(false);

  if (
    genomeId !== previousActiveIds.genomeId ||
    entityId !== previousActiveIds.entityId
  ) {
    const previousActiveIds = { genomeId, entityId };
    setPreviousActiveIds(previousActiveIds);
    setHaveActiveIdsChanged(true);
  }

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!genomeIdInUrl && genomeIdForUrl) {
      // the url is /entity-viewer; but the user has already viewed some species in EntityViewer
      const newUrl = urlFor.entityViewer({
        genomeId: genomeIdForUrl,
        entityId: entityIdForUrl
      });
      navigate(newUrl, { replace: true });
    } else if (
      !hasActiveGenomeIdChanged &&
      genomeIdForUrl &&
      entityIdForUrl &&
      !entityIdInUrl
    ) {
      // the url is /entity-viewer/:genome_id; but the user has already viewed a gene
      const replacementUrl = urlFor.entityViewer({
        genomeId: genomeIdForUrl,
        entityId: entityIdForUrl
      });
      navigate(replacementUrl, { replace: true });
    }
    if (haveActiveIdsChanged) {
      dispatch(
        setActiveIds({
          genomeId,
          entityId
        })
      );
      setHaveActiveIdsChanged(false);
    }
  }, [
    genomeIdInUrl,
    entityIdInUrl,
    genomeId,
    entityId,
    entityIdForUrl,
    haveActiveIdsChanged
  ]);
};

export default EntityViewer;
