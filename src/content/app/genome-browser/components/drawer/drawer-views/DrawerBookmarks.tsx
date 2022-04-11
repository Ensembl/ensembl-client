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
import { useSelector, useDispatch } from 'react-redux';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import analyticsTracking from 'src/services/analytics-service';

import { closeBrowserSidebarModal } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import { getActiveGenomePreviouslyViewedObjects } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSelectors';

import TextLine from 'src/shared/components/text-line/TextLine';

import styles from './DrawerBookmarks.scss';

const DrawerBookmarks = () => {
  const previouslyViewedObjects = useSelector(
    getActiveGenomePreviouslyViewedObjects
  ).slice(20);
  const dispatch = useDispatch();

  const onClick = (objectType: string, index: number) => {
    analyticsTracking.trackEvent({
      category: 'recent_bookmark_link',
      label: objectType,
      action: 'clicked',
      value: index + 1
    });

    dispatch(closeBrowserSidebarModal());
    dispatch(closeDrawer());
  };

  return (
    <>
      <div className={styles.drawerTitle}>Previously viewed</div>
      <div className={styles.contentWrapper}>
        <div className={styles.linksWrapper}>
          {previouslyViewedObjects.map((previouslyViewedObject, index) => {
            const path = urlFor.browser({
              genomeId: previouslyViewedObject.genome_id,
              focus: buildFocusIdForUrl(previouslyViewedObject.object_id)
            });

            return (
              <span key={index} className={styles.linkHolder}>
                <Link
                  to={path}
                  onClick={() => onClick(previouslyViewedObject.type, index)}
                >
                  <TextLine
                    text={previouslyViewedObject.label}
                    className={styles.label}
                  />
                </Link>
                <span className={styles.type}>
                  {upperFirst(previouslyViewedObject.type)}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DrawerBookmarks;
