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

import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import upperFirst from 'lodash/upperFirst';

import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  buildFocusIdForUrl,
  parseEnsObjectId
} from 'src/shared/state/ens-object/ensObjectHelpers';
import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import { getPreviouslyViewedEntities } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSelectors';

import { closeSidebarModal } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';

import { RootState } from 'src/store';

import styles from './EntityViewerBookmarks.scss';
import modalStyles from '../EntityViewerSidebarModal.scss';

export type ExampleLinksProps = {
  activeGenomeId: string | null;
  exampleEntities: ExampleFocusObject[];
};

export const ExampleLinks = (props: ExampleLinksProps) => {
  const exampleGene = props.exampleEntities.find(({ type }) => type === 'gene');
  const dispatch = useDispatch();

  if (!exampleGene?.id) {
    return null;
  }

  const featureIdInUrl = buildFocusIdForUrl({
    type: 'gene',
    objectId: exampleGene.id
  });
  const path = urlFor.entityViewer({
    genomeId: props.activeGenomeId,
    entityId: featureIdInUrl,
    view: 'transcripts'
  });

  return (
    <div data-test-id="example links">
      <div className={modalStyles.sectionTitle}>Example links</div>
      <div key={exampleGene.id} className={styles.linkHolder}>
        <Link to={path} onClick={() => dispatch(closeSidebarModal())}>
          Example {exampleGene.type}
        </Link>
      </div>
    </div>
  );
};

type PreviouslyViewedLinksProps = {
  activeGenomeId: string;
  activeEntityId: string;
  previouslyViewedEntities: ReturnType<typeof getPreviouslyViewedEntities>;
};

export const PreviouslyViewedLinks = (props: PreviouslyViewedLinksProps) => {
  const dispatch = useDispatch();

  const activeEntityStableId = parseEnsObjectId(props.activeEntityId).objectId;
  const previouslyViewedEntitiesWithoutActiveEntity =
    props.previouslyViewedEntities.filter(
      (entity) => entity.stable_id !== activeEntityStableId
    );

  return (
    <div data-test-id="previously viewed links">
      {[...previouslyViewedEntitiesWithoutActiveEntity].map(
        (previouslyViewedEntity) => {
          const path = urlFor.entityViewer({
            genomeId: props.activeGenomeId,
            entityId: buildFocusIdForUrl({
              type: 'gene',
              objectId: previouslyViewedEntity.stable_id
            })
          });

          return (
            <div
              key={previouslyViewedEntity.label}
              className={styles.linkHolder}
            >
              <Link to={path} onClick={() => dispatch(closeSidebarModal())}>
                {previouslyViewedEntity.label}
              </Link>
              <span className={styles.previouslyViewedType}>
                {upperFirst(previouslyViewedEntity.type)}
              </span>
            </div>
          );
        }
      )}
    </div>
  );
};

export const EntityViewerSidebarBookmarks = () => {
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId) || '';
  const activeEntityId = useSelector(getEntityViewerActiveEntityId) || '';

  const exampleEntities = useSelector((state: RootState) =>
    getGenomeExampleFocusObjects(state, activeGenomeId)
  );
  const previouslyViewedEntities = useSelector((state: RootState) =>
    getPreviouslyViewedEntities(state, activeGenomeId)
  );

  if (activeGenomeId === '' || activeEntityId === '') {
    return null;
  }

  return (
    <section>
      <div className={styles.title}>Bookmarks</div>
      {exampleEntities.length ? (
        <ExampleLinks
          exampleEntities={exampleEntities}
          activeGenomeId={activeGenomeId}
        />
      ) : null}
      {previouslyViewedEntities.length ? (
        <>
          <div className={modalStyles.sectionTitle}>Previously viewed</div>
          <PreviouslyViewedLinks
            activeGenomeId={activeGenomeId}
            activeEntityId={activeEntityId}
            previouslyViewedEntities={previouslyViewedEntities}
          />
        </>
      ) : null}
    </section>
  );
};

export default EntityViewerSidebarBookmarks;
