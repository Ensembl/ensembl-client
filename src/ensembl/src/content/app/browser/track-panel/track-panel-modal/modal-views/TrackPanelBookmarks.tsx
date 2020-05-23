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
import { connect } from 'react-redux';
import upperFirst from 'lodash/upperFirst';

import { RootState } from 'src/store';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';
import { getBrowserActiveGenomeId } from '../../../browserSelectors';
import { updateTrackStatesAndSave } from 'src/content/app/browser/browserActions';
import { BrowserTrackStates } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { getActiveGenomePreviouslyViewedObjects } from 'src/content/app/browser/track-panel/trackPanelSelectors';
import { fetchExampleEnsObjects } from 'src/shared/state/ens-object/ensObjectActions';
import { getExampleEnsObjects } from 'src/shared/state/ens-object/ensObjectSelectors';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { closeTrackPanelModal } from '../../trackPanelActions';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as EllipsisIcon } from 'static/img/track-panel/ellipsis.svg';
import { changeDrawerViewAndOpen } from 'src/content/app/browser/drawer/drawerActions';
import { PreviouslyViewedObject } from 'src/content/app/browser/track-panel/trackPanelState';
import analyticsTracking from 'src/services/analytics-service';

import { Status } from 'src/shared/types/status';

import styles from './TrackPanelBookmarks.scss';

export type TrackPanelBookmarksProps = {
  activeGenomeId: string | null;
  exampleEnsObjects: EnsObject[];
  previouslyViewedObjects: PreviouslyViewedObject[];
  fetchExampleEnsObjects: (objectId: string) => void;
  updateTrackStatesAndSave: (trackStates: BrowserTrackStates) => void;
  closeTrackPanelModal: () => void;
  changeDrawerViewAndOpen: (drawerView: string) => void;
};

type ExampleLinksProps = Pick<
  TrackPanelBookmarksProps,
  'exampleEnsObjects' | 'activeGenomeId' | 'closeTrackPanelModal'
>;
export const ExampleLinks = (props: ExampleLinksProps) => {
  return (
    <div>
      {props.exampleEnsObjects.map((exampleObject) => {
        const path = urlFor.browser({
          genomeId: props.activeGenomeId,
          focus: exampleObject.object_id
        });

        return (
          <div key={exampleObject.object_id} className={styles.linkHolder}>
            <Link to={path} onClick={props.closeTrackPanelModal}>
              {exampleObject.label}
            </Link>
            <span className={styles.previouslyViewedType}>
              {upperFirst(exampleObject.object_type)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

type PreviouslyViewedLinksProps = Pick<
  TrackPanelBookmarksProps,
  | 'previouslyViewedObjects'
  | 'updateTrackStatesAndSave'
  | 'closeTrackPanelModal'
>;

export const PreviouslyViewedLinks = (props: PreviouslyViewedLinksProps) => {
  const onLinkClick = (objectType: string, index: number) => {
    analyticsTracking.trackEvent({
      category: 'recent_bookmark_link',
      label: objectType,
      action: 'clicked',
      value: index + 1
    });

    props.closeTrackPanelModal();
  };

  return (
    <div>
      {[...props.previouslyViewedObjects]
        .reverse()
        .map((previouslyViewedObject, index) => {
          const path = urlFor.browser({
            genomeId: previouslyViewedObject.genome_id,
            focus: previouslyViewedObject.object_id
          });

          return (
            <div
              key={previouslyViewedObject.object_id}
              className={styles.linkHolder}
            >
              <Link
                to={path}
                onClick={() =>
                  onLinkClick(previouslyViewedObject.object_type, index)
                }
              >
                {previouslyViewedObject.label}
              </Link>
              <span className={styles.previouslyViewedType}>
                {upperFirst(previouslyViewedObject.object_type)}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export const TrackPanelBookmarks = (props: TrackPanelBookmarksProps) => {
  const {
    previouslyViewedObjects,
    exampleEnsObjects,
    activeGenomeId,
    updateTrackStatesAndSave,
    closeTrackPanelModal
  } = props;

  const limitedPreviouslyViewedObjects = previouslyViewedObjects.slice(-20);

  const onEllipsisClick = () => {
    analyticsTracking.trackEvent({
      category: 'drawer_open',
      label: 'recent_bookmarks',
      action: 'clicked',
      value: previouslyViewedObjects.length
    });

    props.changeDrawerViewAndOpen('bookmarks');
  };

  return (
    <section className="trackPanelBookmarks">
      <h3>Bookmarks</h3>
      {exampleEnsObjects.length ? (
        <>
          <div className={styles.title}>Example links</div>
          <ExampleLinks
            exampleEnsObjects={exampleEnsObjects}
            activeGenomeId={activeGenomeId}
            closeTrackPanelModal={closeTrackPanelModal}
          />
        </>
      ) : null}
      {limitedPreviouslyViewedObjects.length ? (
        <>
          <div className={styles.title}>
            Previously viewed
            {props.previouslyViewedObjects.length > 20 && (
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
          <PreviouslyViewedLinks
            previouslyViewedObjects={limitedPreviouslyViewedObjects}
            updateTrackStatesAndSave={updateTrackStatesAndSave}
            closeTrackPanelModal={closeTrackPanelModal}
          />
        </>
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return {
    activeGenomeId,
    exampleEnsObjects: activeGenomeId
      ? getExampleEnsObjects(state, activeGenomeId)
      : [],
    previouslyViewedObjects: getActiveGenomePreviouslyViewedObjects(state)
  };
};

const mapDispatchToProps = {
  fetchExampleEnsObjects,
  updateTrackStatesAndSave,
  closeTrackPanelModal,
  changeDrawerViewAndOpen
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBookmarks);
