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

import analyticsTracking from 'src/services/analytics-service';
import * as urlFor from 'src/shared/helpers/urlHelper';
import {
  buildFocusIdForUrl,
  parseEnsObjectId
} from 'src/shared/state/ens-object/ensObjectHelpers';
import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import { closeSidebarModal } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarActions';

import { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';
import { getPreviouslyViewedEntities } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSelectors';

import { RootState } from 'src/store';

import styles from './EntityViewerSidebarBookmarks.scss';

export type ExampleLinksProps = {
  activeGenomeId: string | null;
  exampleEntities: ExampleFocusObject[];
  closeSidebarModal: () => void;
};

export const ExampleLinks = (props: ExampleLinksProps) => {
  const exampleGene = props.exampleEntities.find(({ type }) => type === 'gene');

  if (!exampleGene?.id) return <></>;

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
      <div className={styles.sectionTitle}>Example links</div>
      <div key={exampleGene.id} className={styles.linkHolder}>
        <Link to={path} onClick={closeSidebarModal}>
          Example {exampleGene.type}
        </Link>
      </div>
    </div>
  );
};

type PreviouslyViewedLinksProps = {
  genomeId: string;
  entityId: string;
  previouslyViewedObjects: ReturnType<typeof getPreviouslyViewedEntities>;
  closeSidebarModal: () => void;
};

export const PreviouslyViewedLinks = (props: PreviouslyViewedLinksProps) => {
  const onLinkClick = (objectType: string, index: number) => {
    analyticsTracking.trackEvent({
      category: 'recent_bookmark_link',
      label: objectType,
      action: 'clicked',
      value: index + 1
    });

    props.closeSidebarModal();
  };

  const activeObjectId = parseEnsObjectId(props.entityId);
  const previouslyViewedObjectsWithoutActiveObject = props.previouslyViewedObjects.filter(
    (entity) => entity.stable_id !== activeObjectId.objectId
  );

  return (
    <div data-test-id="previously viewed links">
      {[...previouslyViewedObjectsWithoutActiveObject]
        // .reverse()
        .map((previouslyViewedObject, index) => {
          const path = urlFor.entityViewer({
            genomeId: props.genomeId,
            entityId: buildFocusIdForUrl({
              type: 'gene',
              objectId: previouslyViewedObject.stable_id
            })
          });

          return (
            <div
              key={previouslyViewedObject.label}
              className={styles.linkHolder}
            >
              <Link
                to={path}
                onClick={() => onLinkClick(previouslyViewedObject.label, index)}
              >
                {previouslyViewedObject.label}
              </Link>
              <span className={styles.previouslyViewedType}>
                {upperFirst(previouslyViewedObject.type)}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export const EntityViewerSidebarBookmarks = () => {
  const activeGenomeId = useSelector(getEntityViewerActiveGenomeId) || '';
  const activeEntityId = useSelector(getEntityViewerActiveEnsObjectId) || '';

  const exampleEntities = useSelector((state: RootState) =>
    getGenomeExampleFocusObjects(state, activeGenomeId)
  );
  const previouslyViewedObjects = useSelector((state: RootState) =>
    getPreviouslyViewedEntities(state, activeGenomeId)
  );

  const dispatch = useDispatch();

  return (
    <section className="entityViewerSidebarBookmarks">
      <div className={styles.title}>Bookmarks</div>
      {exampleEntities.length ? (
        <ExampleLinks
          exampleEntities={exampleEntities}
          activeGenomeId={activeGenomeId}
          closeSidebarModal={() => dispatch(closeSidebarModal)}
        />
      ) : null}
      {previouslyViewedObjects.length ? (
        <>
          <div className={styles.sectionTitle}>Previously viewed</div>
          <PreviouslyViewedLinks
            genomeId={activeGenomeId}
            entityId={activeEntityId}
            previouslyViewedObjects={previouslyViewedObjects}
            closeSidebarModal={() => dispatch(closeSidebarModal)}
          />
        </>
      ) : null}
    </section>
  );
};

export default EntityViewerSidebarBookmarks;
