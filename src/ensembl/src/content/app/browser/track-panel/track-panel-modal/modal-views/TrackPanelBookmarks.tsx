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
import { useSelector, useDispatch } from 'react-redux';
import upperFirst from 'lodash/upperFirst';

import analyticsTracking from 'src/services/analytics-service';
import { getActiveGenomePreviouslyViewedObjects } from 'src/content/app/browser/track-panel/trackPanelSelectors';
import { getExampleEnsObjects } from 'src/shared/state/ens-object/ensObjectSelectors';
import { closeTrackPanelModal } from '../../trackPanelActions';
import { changeFocusObject } from 'src/content/app/browser/browserActions';
import { changeDrawerViewAndOpen } from 'src/content/app/browser/drawer/drawerActions';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as EllipsisIcon } from 'static/img/track-panel/ellipsis.svg';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';
import { Status } from 'src/shared/types/status';
import { PreviouslyViewedObject } from '../../trackPanelState';

import styles from './TrackPanelBookmarks.scss';

export const ExampleLinks = () => {
  const exampleEnsObjects = useSelector(getExampleEnsObjects);
  const dispatch = useDispatch();

  const onLinkClick = (exampleObject: EnsObject) => {
    dispatch(changeFocusObject(exampleObject.object_id));
    dispatch(closeTrackPanelModal());
  };

  return (
    <div data-test-id="example links">
      <div className={styles.sectionTitle}>Example links</div>
      {exampleEnsObjects.map((exampleObject) => (
        <div key={exampleObject.object_id} className={styles.linkHolder}>
          <div
            className={styles.pseudoLink}
            onClick={() => onLinkClick(exampleObject)}
          >
            Example {exampleObject.type}
          </div>
        </div>
      ))}
    </div>
  );
};

export const PreviouslyViewedLinks = () => {
  const previouslyViewedObjects = useSelector(
    getActiveGenomePreviouslyViewedObjects
  );
  const dispatch = useDispatch();

  const onLinkClick = (
    previouslyViewedObject: PreviouslyViewedObject,
    index: number
  ) => {
    analyticsTracking.trackEvent({
      category: 'recent_bookmark_link',
      label: previouslyViewedObject.object_type,
      action: 'clicked',
      value: index + 1
    });

    dispatch(changeFocusObject(previouslyViewedObject.object_id));
    dispatch(closeTrackPanelModal());
  };

  return (
    <div data-test-id="previously viewed links">
      {[...previouslyViewedObjects]
        .reverse()
        .map((previouslyViewedObject, index) => {
          return (
            <div
              key={previouslyViewedObject.object_id}
              className={styles.linkHolder}
            >
              <span
                className={styles.pseudoLink}
                onClick={() => onLinkClick(previouslyViewedObject, index)}
              >
                {previouslyViewedObject.label}
              </span>
              <span className={styles.previouslyViewedType}>
                {upperFirst(previouslyViewedObject.object_type)}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export const TrackPanelBookmarks = () => {
  const previouslyViewedObjects = useSelector(
    getActiveGenomePreviouslyViewedObjects
  );
  const exampleEnsObjects = useSelector(getExampleEnsObjects);
  const dispatch = useDispatch();

  const limitedPreviouslyViewedObjects = previouslyViewedObjects.slice(-20);

  const onEllipsisClick = () => {
    analyticsTracking.trackEvent({
      category: 'drawer_open',
      label: 'recent_bookmarks',
      action: 'clicked',
      value: previouslyViewedObjects.length
    });

    dispatch(changeDrawerViewAndOpen('bookmarks'));
  };

  return (
    <section className="trackPanelBookmarks">
      <div className={styles.title}>Bookmarks</div>
      {exampleEnsObjects.length ? (
        <>
          <ExampleLinks />
        </>
      ) : null}
      {limitedPreviouslyViewedObjects.length ? (
        <>
          <div className={styles.sectionTitle}>
            Previously viewed
            {previouslyViewedObjects.length > 20 && (
              <span className={styles.ellipsis}>
                <ImageButton
                  status={Status.DEFAULT}
                  description={'View all'}
                  image={EllipsisIcon}
                  onClick={onEllipsisClick}
                />
              </span>
            )}
          </div>
          <PreviouslyViewedLinks />
        </>
      ) : null}
    </section>
  );
};

export default TrackPanelBookmarks;
