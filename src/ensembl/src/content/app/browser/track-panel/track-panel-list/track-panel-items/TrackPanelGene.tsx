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

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';
import browserMessagingService from 'src/content/app/browser/browser-messaging-service';

import { useGetTrackPanelGeneQuery } from 'src/content/app/browser/state/genomeBrowserApiSlice';
import { changeDrawerViewForGenome } from 'src/content/app/browser/state/drawer/drawerSlice';
import { updateTrackStatesAndSave } from 'src/content/app/browser/browserActions';

import { getBrowserTrackState } from 'src/content/app/browser/browserSelectors';

import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import TrackPanelTranscript from './TrackPanelTranscript';
import TrackPanelItemsCount from './TrackPanelItemsCount';
import GroupTrackPanelItemLayout from './track-panel-item-layout/GroupTrackPanelItemLayout';

import { Status } from 'src/shared/types/status';
import type { TrackActivityStatus } from 'src/content/app/browser/track-panel/trackPanelConfig';
import type { RootState } from 'src/store';

import styles from './TrackPanelItem.scss';

type TrackPanelGeneProps = {
  genomeId: string;
  geneId: string;
  ensObjectId: string;
};

// TODO: figure out proper gene and transcript track naming conventions
const GENE_TRACK_ID = 'track:gene-feat';
const getTranscriptTrackId = (num: number) => `track:transcript-feat-${num}`;

const TrackPanelGene = (props: TrackPanelGeneProps) => {
  const { genomeId, geneId, ensObjectId } = props;
  const startWithCollapsed = !isEnvironment([Environment.PRODUCTION]); // TODO: remove after multiple transcripts are available
  const [isCollapsed, setIsCollapsed] = useState(startWithCollapsed);
  const { data } = useGetTrackPanelGeneQuery({
    genomeId,
    geneId
  });
  const trackStatus = useSelector((state: RootState) =>
    getBrowserTrackState(state, {
      genomeId,
      objectId: ensObjectId,
      tracksGroup: 'objectTracks',
      categoryName: 'main',
      trackId: GENE_TRACK_ID
    })
  );
  const dispatch = useDispatch();

  if (!data) {
    return null;
  }

  const toggleExpand = () => {
    setIsCollapsed(!isCollapsed);
  };

  const onShowMore = () => {
    dispatch(
      changeDrawerViewForGenome({
        genomeId,
        drawerView: {
          name: 'gene_summary',
          geneId: geneId
        }
      })
    );
  };

  const toggleTrack = ({
    trackId,
    status
  }: {
    trackId: string;
    status: Status;
  }) => {
    const newStatus =
      status === Status.SELECTED ? Status.UNSELECTED : Status.SELECTED;
    updateGenomeBrowser({ trackId, status: newStatus });

    dispatch(
      updateTrackStatesAndSave({
        [genomeId]: {
          objectTracks: {
            [ensObjectId]: {
              main: {
                [trackId]: newStatus
              }
            }
          }
        }
      })
    );
  };

  const updateGenomeBrowser = ({
    trackId,
    status
  }: {
    trackId: string;
    status: Status;
  }) => {
    const currentTrackStatus = status === Status.SELECTED ? 'on' : 'off';

    const payload = {
      [currentTrackStatus]: trackId
    };

    browserMessagingService.send('bpane', payload);
  };

  const { gene } = data;
  let sortedTranscripts;

  if (isEnvironment([Environment.PRODUCTION])) {
    // TODO: remove this branch when multiple transcripts become available
    sortedTranscripts = isCollapsed ? [] : [defaultSort(gene.transcripts)[0]];
  } else {
    sortedTranscripts = isCollapsed
      ? [defaultSort(gene.transcripts)[0]]
      : defaultSort(gene.transcripts);
  }

  return (
    <>
      <GroupTrackPanelItemLayout
        isCollapsed={isCollapsed}
        visibilityStatus={trackStatus}
        onChangeVisibility={() =>
          toggleTrack({ trackId: GENE_TRACK_ID, status: trackStatus })
        }
        onShowMore={onShowMore}
        toggleExpand={toggleExpand}
      >
        <div className={styles.label}>
          <span className={styles.labelTextStrong}>
            {gene.symbol ?? gene.stable_id}
          </span>
          <span className={styles.labelTextSecondary}>
            {gene.metadata.biotype.label}
          </span>
        </div>
      </GroupTrackPanelItemLayout>
      {sortedTranscripts.map((transcript, index) => {
        const trackId = getTranscriptTrackId(index + 1);
        return (
          <TrackPanelTranscript
            transcript={transcript}
            trackId={trackId}
            genomeId={genomeId}
            ensObjectId={ensObjectId}
            onChangeVisibility={(trackStatus: TrackActivityStatus) =>
              toggleTrack({ trackId, status: trackStatus })
            }
            key={transcript.stable_id}
          />
        );
      })}
      {!isEnvironment([Environment.PRODUCTION]) &&
        isCollapsed &&
        gene.transcripts.length > 1 && (
          <TrackPanelItemsCount
            itemName="transcript"
            count={gene.transcripts.length - 1}
          />
        )}
    </>
  );
};

export default TrackPanelGene;
