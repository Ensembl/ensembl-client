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
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getPreviouslyViewedEntities } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSelectors';

import useEntityViewerIds from 'src/content/app/entity-viewer/hooks/useEntityViewerIds';
import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import TextLine from 'src/shared/components/text-line/TextLine';

import { RootState } from 'src/store';

import styles from './EntityViewerBookmarks.scss';

type PreviouslyViewedLinksProps = {
  previouslyViewedEntities: ReturnType<typeof getPreviouslyViewedEntities>;
};

export const PreviouslyViewedLinks = (props: PreviouslyViewedLinksProps) => {
  const { genomeIdForUrl } = useEntityViewerIds();
  const { trackPreviouslyViewedLinkClick } = useEntityViewerAnalytics();

  const handleClick = (linkLabel: string | string[], index: number) => {
    trackPreviouslyViewedLinkClick({
      linkLabel:
        typeof linkLabel === 'string' ? linkLabel : linkLabel.join(' '),
      position: index + 1
    });
  };

  return (
    <div data-test-id="previously viewed links">
      {props.previouslyViewedEntities.map((entity, index) => {
        const path = urlFor.entityViewer({
          genomeId: genomeIdForUrl,
          entityId: buildFocusIdForUrl({
            type: 'gene',
            objectId: entity.unversioned_stable_id
          })
        });

        return (
          <div key={index} className={styles.linkHolder}>
            <Link to={path} onClick={() => handleClick(entity.label, index)}>
              <TextLine text={entity.label} className={styles.label} />
            </Link>
            <span className={styles.type}>{upperFirst(entity.type)}</span>
          </div>
        );
      })}
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
      {previouslyViewedEntities.length ? (
        <>
          <PreviouslyViewedLinks
            previouslyViewedEntities={previouslyViewedEntities}
          />
        </>
      ) : null}
    </section>
  );
};

export default EntityViewerSidebarBookmarks;
