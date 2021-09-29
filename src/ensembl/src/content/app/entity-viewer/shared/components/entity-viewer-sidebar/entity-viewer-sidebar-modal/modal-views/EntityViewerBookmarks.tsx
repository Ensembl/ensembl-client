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
import { useSelector } from 'react-redux';
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
import { getPreviouslyViewedEntities } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSelectors';

import TextLine from 'src/shared/components/text-line/TextLine';

import { RootState } from 'src/store';

import styles from './EntityViewerBookmarks.scss';

type PreviouslyViewedLinksProps = {
  activeGenomeId: string;
  activeEntityId: string;
  previouslyViewedEntities: ReturnType<typeof getPreviouslyViewedEntities>;
};

export const PreviouslyViewedLinks = (props: PreviouslyViewedLinksProps) => {
  const activeEntityStableId = parseEnsObjectId(props.activeEntityId).objectId;
  const previouslyViewedEntitiesWithoutActiveEntity =
    props.previouslyViewedEntities.filter(
      (entity) => entity.entity_id !== activeEntityStableId
    );

  return (
    <div data-test-id="previously viewed links">
      {[...previouslyViewedEntitiesWithoutActiveEntity].map(
        (previouslyViewedEntity, index) => {
          const path = urlFor.entityViewer({
            genomeId: props.activeGenomeId,
            entityId: buildFocusIdForUrl({
              type: 'gene',
              objectId: previouslyViewedEntity.entity_id
            })
          });

          return (
            <div key={index} className={styles.linkHolder}>
              <Link to={path}>
                <TextLine
                  text={previouslyViewedEntity.label}
                  className={styles.label}
                />
              </Link>
              <span className={styles.type}>
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

  const previouslyViewedEntities = useSelector((state: RootState) =>
    getPreviouslyViewedEntities(state, activeGenomeId)
  );

  if (activeGenomeId === '' || activeEntityId === '') {
    return null;
  }

  return (
    <section>
      <div className={styles.title}>Previously viewed</div>
      {previouslyViewedEntities.length ? (
        <>
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
