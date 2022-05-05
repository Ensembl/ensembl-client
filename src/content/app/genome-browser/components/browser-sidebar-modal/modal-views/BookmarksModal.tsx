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
import upperFirst from 'lodash/upperFirst';
import { Link } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'src/store';

import analyticsTracking from 'src/services/analytics-service';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import { getPreviouslyViewedObjects } from 'src/content/app/genome-browser/state/browser-bookmarks/browserBookmarksSelectors';
import { changeDrawerViewAndOpen } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import TextLine from 'src/shared/components/text-line/TextLine';

import styles from './BookmarksModal.scss';

export const PreviouslyViewedLinks = () => {
  const previouslyViewedObjects = useAppSelector(getPreviouslyViewedObjects).slice(
    0,
    20
  );

  const onLinkClick = (objectType: string, index: number) => {
    analyticsTracking.trackEvent({
      category: 'recent_bookmark_link',
      label: objectType,
      action: 'clicked',
      value: index + 1
    });
  };

  return (
    <div data-test-id="previously viewed links">
      {previouslyViewedObjects.map((previouslyViewedObject, index) => {
        const path = urlFor.browser({
          genomeId: previouslyViewedObject.genome_id,
          focus: buildFocusIdForUrl(previouslyViewedObject.object_id)
        });

        return (
          <div
            key={previouslyViewedObject.object_id}
            className={styles.linkHolder}
          >
            <Link
              replace
              to={path}
              onClick={() => onLinkClick(previouslyViewedObject.type, index)}
            >
              <TextLine
                text={previouslyViewedObject.label}
                className={styles.label}
              />
            </Link>
            <span className={styles.type}>
              {upperFirst(previouslyViewedObject.type)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const BookmarksModal = () => {
  const previouslyViewedObjects = useAppSelector(getPreviouslyViewedObjects);
  const dispatch = useAppDispatch();

  const onMoreClick = () => {
    analyticsTracking.trackEvent({
      category: 'drawer_open',
      label: 'recent_bookmarks',
      action: 'clicked',
      value: previouslyViewedObjects.length
    });

    dispatch(changeDrawerViewAndOpen({ name: 'bookmarks' }));
  };

  return (
    <section className={styles.bookmarksModal}>
      {previouslyViewedObjects.length ? (
        <>
          <PreviouslyViewedLinks />
          {previouslyViewedObjects.length > 20 && (
            <div className={styles.more}>
              <span onClick={onMoreClick}>more...</span>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
};

export default BookmarksModal;
