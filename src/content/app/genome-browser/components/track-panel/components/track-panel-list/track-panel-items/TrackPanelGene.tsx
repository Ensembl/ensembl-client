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

import { useAppSelector, useAppDispatch, type RootState } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import { useGetTrackPanelGeneQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { updateObjectTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import {
  getBrowserActiveGenomeTrackStates,
  getBrowserTrackState
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import TrackPanelTranscript from './TrackPanelTranscript';
import TrackPanelItemsCount from './TrackPanelItemsCount';
import GroupTrackPanelItemLayout from './track-panel-item-layout/GroupTrackPanelItemLayout';

import { Status } from 'src/shared/types/status';

import styles from './TrackPanelItem.scss';

type TrackPanelGeneProps = {
  genomeId: string;
  geneId: string;
  focusObjectId: string;
};

const TrackPanelGene = (props: TrackPanelGeneProps) => {
  const { genomeId, geneId, focusObjectId } = props;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { currentData } = useGetTrackPanelGeneQuery({
    genomeId,
    geneId
  });
  const trackStatus = useAppSelector((state: RootState) =>
    getBrowserTrackState(state, {
      genomeId,
      objectId: focusObjectId,
      tracksGroup: 'objectTracks'
    })
  );
  const visibleTranscriptIds = useAppSelector((state) => {
    const genomeTrackStates = getBrowserActiveGenomeTrackStates(state);
    return (
      genomeTrackStates?.objectTracks?.[focusObjectId]?.transcripts ?? null
    );
  });

  const { setFocusGene, updateFocusGeneTranscripts } = useGenomeBrowser();
  const dispatch = useAppDispatch();

  if (!currentData) {
    return null;
  }

  const { gene } = currentData;

  const sortedTranscripts = defaultSort(gene.transcripts);
  const visibleSortedTranscripts = isCollapsed
    ? sortedTranscripts.length
      ? [sortedTranscripts[0]]
      : []
    : sortedTranscripts;

  const geneVisibilityStatus = !visibleTranscriptIds?.length
    ? Status.UNSELECTED
    : visibleTranscriptIds.length === gene.transcripts.length
    ? Status.SELECTED
    : Status.PARTIALLY_SELECTED;

  const onGeneVisibilityChange = () => {
    if (geneVisibilityStatus === Status.PARTIALLY_SELECTED) {
      // show all transcripts
      const visibleTranscriptIds = pluckStableIds(sortedTranscripts);
      updateFocusGeneTranscripts(visibleTranscriptIds);
      return;
    }

    const newStatus =
      trackStatus === Status.SELECTED ? Status.UNSELECTED : Status.SELECTED;

    if (newStatus === Status.SELECTED) {
      setFocusGene(focusObjectId);
      const visibleTranscriptIds = pluckStableIds(sortedTranscripts);
      updateFocusGeneTranscripts(visibleTranscriptIds);
    } else {
      updateFocusGeneTranscripts([]);
    }

    dispatch(
      updateObjectTrackStates({
        status: newStatus
      })
    );
  };

  const onTranscriptVisibilityChange = (
    transcriptId: string,
    isVisible: boolean
  ) => {
    let updatedTranscriptIds = visibleTranscriptIds ?? ([] as string[]);

    updatedTranscriptIds = isVisible
      ? [...updatedTranscriptIds, transcriptId]
      : updatedTranscriptIds.filter((id) => id !== transcriptId);

    if (!visibleTranscriptIds?.length) {
      setFocusGene(focusObjectId);
    }
    updateFocusGeneTranscripts(updatedTranscriptIds);
  };

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

  const getVisibilityIconHelpText = (status: Status) => {
    if (status === Status.SELECTED) {
      return 'Hide all transcripts';
    }

    return 'Show all transcripts';
  };

  return (
    <>
      <GroupTrackPanelItemLayout
        isCollapsed={isCollapsed}
        visibilityStatus={geneVisibilityStatus}
        onChangeVisibility={onGeneVisibilityChange}
        visibilityIconHelpText={getVisibilityIconHelpText(geneVisibilityStatus)}
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
      {visibleSortedTranscripts.map((transcript) => (
        <TrackPanelTranscript
          transcript={transcript}
          genomeId={genomeId}
          isVisible={
            visibleTranscriptIds?.includes(transcript.stable_id) ?? false
          }
          onVisibilityChange={onTranscriptVisibilityChange}
          key={transcript.stable_id}
        />
      ))}
      {isCollapsed && gene.transcripts.length > 1 && (
        <TrackPanelItemsCount
          itemName="transcript"
          count={gene.transcripts.length - 1}
        />
      )}
    </>
  );
};

const pluckStableIds = (items: { stable_id: string }[]) =>
  items.map((item) => item.stable_id);

export default TrackPanelGene;
