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

import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import classNames from 'classnames';

import { GenomeTrackCategory } from 'src/shared/state/genome/genomeTypes';
import { EnsObjectTrack } from 'src/shared/state/ens-object/ensObjectTypes';
import {
  getBrowserActiveEnsObject,
  getBrowserTrackStates,
  getBrowserActiveGenomeId
} from '../../browserSelectors';
import { getSelectedTrackPanelTab } from '../trackPanelSelectors';
import { getGenomeTrackCategoriesById } from 'src/shared/state/genome/genomeSelectors';

import TrackPanelListItem from './TrackPanelListItem';
import TrackPanelGene from './TrackPanelGene';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'src/shared/components/accordion';

import { TrackActivityStatus } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { Status } from 'src/shared/types/status';

import styles from './TrackPanelList.scss';

export const TrackPanelList = () => {
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const activeEnsObject = useSelector(getBrowserActiveEnsObject);
  const selectedTrackPanelTab = useSelector(getSelectedTrackPanelTab);
  const genomeTrackCategories = useSelector(getGenomeTrackCategoriesById);
  const trackStates = useSelector(getBrowserTrackStates);

  const currentTrackCategories = genomeTrackCategories?.filter(
    (category: GenomeTrackCategory) =>
      category.types.includes(selectedTrackPanelTab)
  );

  // TODO: get default track status properly if it can ever be inactive
  const getDefaultTrackStatus = (): TrackActivityStatus => {
    return Status.SELECTED;
  };

  const getTrackListItem = (
    categoryName: string,
    track: EnsObjectTrack | null
  ) => {
    if (!track) {
      return;
    }

    const { track_id } = track;

    const defaultTrackStatus = getDefaultTrackStatus();
    let trackStatus = defaultTrackStatus;

    if (activeEnsObject) {
      // FIXME: Temporary hack until we have a set of proper track names
      if (track_id.startsWith('track:gene')) {
        trackStatus = get(
          trackStates,
          `${activeGenomeId}.objectTracks.${activeEnsObject.object_id}.${categoryName}.${track_id}`,
          trackStatus
        ) as TrackActivityStatus;
      } else {
        trackStatus = get(
          trackStates,
          `${activeGenomeId}.commonTracks.${categoryName}.${track_id}`,
          trackStatus
        ) as TrackActivityStatus;
      }
    }

    return (
      <TrackPanelListItem
        categoryName={categoryName}
        defaultTrackStatus={defaultTrackStatus}
        trackStatus={trackStatus}
        key={track.track_id}
        track={track}
      >
        {track.child_tracks &&
          track.child_tracks.map((childTrack: EnsObjectTrack) =>
            getTrackListItem(categoryName, childTrack)
          )}
      </TrackPanelListItem>
    );
  };

  const trackCategoryIds = currentTrackCategories
    ?.filter((category: GenomeTrackCategory) => category.track_list.length)
    .map((category: GenomeTrackCategory) => category.track_category_id);

  return (
    <div className={styles.trackPanelList}>
      {activeEnsObject?.type === 'gene' &&
      activeGenomeId &&
      activeEnsObject.stable_id ? (
        <section className="mainTrackItem">
          <TrackPanelGene
            ensObjectId={activeEnsObject.object_id}
            genomeId={activeGenomeId}
            geneId={activeEnsObject.stable_id}
          />
        </section>
      ) : null}
      <div className={styles.accordionContainer}>
        <Accordion
          className={styles.trackPanelAccordion}
          allowMultipleExpanded={true}
          preExpanded={trackCategoryIds}
        >
          {currentTrackCategories?.map((category: GenomeTrackCategory) => {
            const accordionButtonClassNames = classNames(
              styles.trackPanelAccordionButton,
              {
                [styles.trackPanelAccordionButtonDisabled]:
                  !category.track_list.length
              }
            );

            return (
              <AccordionItem
                className={styles.trackPanelAccordionItem}
                uuid={category.track_category_id}
                key={category.track_category_id}
              >
                <AccordionItemHeading
                  className={styles.trackPanelAccordionHeader}
                >
                  <AccordionItemButton
                    className={accordionButtonClassNames}
                    disabled={!category.track_list.length}
                  >
                    {category.label}
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel
                  className={styles.trackPanelAccordionItemContent}
                >
                  <dl>
                    {category.track_list.map((track: EnsObjectTrack) =>
                      getTrackListItem(category.track_category_id, track)
                    )}
                  </dl>
                </AccordionItemPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default memo(TrackPanelList);
