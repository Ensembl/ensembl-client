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

import React, { useEffect, useState } from 'react';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import { useAppSelector, useAppDispatch } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import { useGetTrackPanelGeneQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { updateObjectTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import {
  getBrowserTrackState,
  getVisibleTranscriptIds
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import TrackPanelTranscript from './TrackPanelTranscript';
import TrackPanelItemsCount from './TrackPanelItemsCount';
import GroupTrackPanelItemLayout from './track-panel-item-layout/GroupTrackPanelItemLayout';

import { Status } from 'src/shared/types/status';
import { TrackId } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import type { TrackPanelTranscript as TrackPanelTranscriptType } from 'src/content/app/genome-browser/state/types/track-panel-gene';
import type { RootState } from 'src/store';
import {
  IncomingActionType,
  type ReportVisibleTranscriptsAction
} from '@ensembl/ensembl-genome-browser';

import styles from './TrackPanelItem.scss';

type TrackPanelGeneProps = {
  genomeId: string;
  geneId: string;
  focusObjectId: string;
};

// TODO: figure out proper gene and transcript track naming conventions
const GENE_TRACK_ID = TrackId.GENE;
const TrackPanelGene = (props: TrackPanelGeneProps) => {
  const { genomeId, geneId, focusObjectId } = props;
  const startWithCollapsed = !isEnvironment([Environment.PRODUCTION]); // TODO: remove after multiple transcripts are available
  const [isCollapsed, setIsCollapsed] = useState(startWithCollapsed);
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
  const visibleTranscriptIds = useAppSelector(getVisibleTranscriptIds);
  const { toggleTrack, updateFocusGeneTranscripts, genomeBrowser } =
    useGenomeBrowser();
  const dispatch = useAppDispatch();

  let allTranscriptsInGene = currentData?.gene.transcripts ?? [];
  let sortedTranscripts: TrackPanelTranscriptType[] | undefined;

  useEffect(() => {
    toggleTrack({ trackId: GENE_TRACK_ID, status: trackStatus });

    const subscription = genomeBrowser?.subscribe(
      IncomingActionType.VISIBLE_TRANSCRIPTS,
      (action: ReportVisibleTranscriptsAction) => {
        setVisibleTranscriptIds(action.payload.transcript_ids);
      }
    );

    return () => subscription?.unsubscribe();
  }, [genomeBrowser, genomeId, focusObjectId]);

  // set status of all transcripts based on the saved redux state after loading component
  useEffect(() => {
    if (allTranscriptsInGene?.length) {
      updateFocusGeneTranscripts(visibleTranscriptIds);
    }
  }, [allTranscriptsInGene]);

  const setVisibleTranscriptIds = (transcriptIds: string[]) => {
    dispatch(
      updateObjectTrackStates({
        status: transcriptIds.length ? Status.SELECTED : Status.UNSELECTED,
        transcripts: transcriptIds
      })
    );
  };

  const updateObjectTrackStatus = (newStatus?: Status) => {
    if (!newStatus) {
      newStatus =
        trackStatus === Status.SELECTED ? Status.UNSELECTED : Status.SELECTED;
    }

    const newVisibleTranscriptIds =
      newStatus === Status.SELECTED
        ? allTranscriptsInGene?.map(({ stable_id }) => stable_id) ?? []
        : [];

    toggleTrack({ trackId: GENE_TRACK_ID, status: newStatus });
    updateFocusGeneTranscripts(newVisibleTranscriptIds);

    dispatch(
      updateObjectTrackStates({
        status: newStatus
      })
    );
  };

  if (!currentData) {
    return null;
  }

  const { gene } = currentData;

  allTranscriptsInGene = gene.transcripts;

  if (isEnvironment([Environment.PRODUCTION])) {
    // TODO: remove this branch when multiple transcripts become available
    sortedTranscripts = isCollapsed ? [] : [defaultSort(gene.transcripts)[0]];
  } else {
    sortedTranscripts = isCollapsed
      ? [defaultSort(gene.transcripts)[0]]
      : defaultSort(gene.transcripts);
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

  return (
    <>
      <GroupTrackPanelItemLayout
        isCollapsed={isCollapsed}
        visibilityStatus={trackStatus}
        onChangeVisibility={updateObjectTrackStatus}
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
      {sortedTranscripts.map((transcript) => (
        <TrackPanelTranscript
          transcript={transcript}
          genomeId={genomeId}
          focusObjectId={focusObjectId}
          key={transcript.stable_id}
        />
      ))}
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
