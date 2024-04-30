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

import { useState } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import { useGetTrackPanelGeneQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { updateFocusGeneTranscriptsVisibility } from 'src/content/app/genome-browser/state/focus-object/focusObjectSlice';

import { getFocusGeneVisibleTranscripts } from 'src/content/app/genome-browser/state/focus-object/focusObjectSelectors';

import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import TrackPanelTranscript from './TrackPanelTranscript';
import TrackPanelItemsExpandLozenge from './TrackPanelItemsExpandLozenge';
import SimpleTrackPanelItemLayout from './track-panel-item-layout/SimpleTrackPanelItemLayout';

import { Status } from 'src/shared/types/status';
import { TrackActivityStatus } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';

import styles from './TrackPanelItem.module.css';

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
  const visibleTranscriptIds = useAppSelector((state) => {
    return getFocusGeneVisibleTranscripts(state, focusObjectId);
  });

  const { updateFocusGeneTranscripts } = useGenomeBrowser();
  const { trackDrawerOpened, trackFocusTrackVisibilityToggled } =
    useGenomeBrowserAnalytics();

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
    let visibleTranscriptIds: string[];
    let nextStatus: Status;

    if (geneVisibilityStatus === Status.PARTIALLY_SELECTED) {
      // show all transcripts
      visibleTranscriptIds = pluckStableIds(sortedTranscripts);
      nextStatus = Status.SELECTED;
    } else if (geneVisibilityStatus === Status.UNSELECTED) {
      // also show all transcripts, but also tell genome browser to enable focus track
      visibleTranscriptIds = pluckStableIds(sortedTranscripts);
      nextStatus = Status.SELECTED;
    } else {
      // hide all transcripts and hide the track
      visibleTranscriptIds = [];
      nextStatus = Status.UNSELECTED;
    }

    updateFocusGeneTranscripts(visibleTranscriptIds);
    trackFocusTrackVisibilityToggled(nextStatus);

    dispatch(
      updateFocusGeneTranscriptsVisibility({
        focusGeneId: focusObjectId,
        visibleTranscriptIds: visibleTranscriptIds
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

    updateFocusGeneTranscripts(updatedTranscriptIds);
  };

  const toggleExpand = () => {
    setIsCollapsed(!isCollapsed);
  };

  const onShowMore = () => {
    trackDrawerOpened('gene_summary');

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

  const commonComponentProps = {
    visibilityStatus: geneVisibilityStatus as TrackActivityStatus,
    onChangeVisibility: onGeneVisibilityChange,
    visibilityIconHelpText: getVisibilityIconHelpText(geneVisibilityStatus),
    onShowMore: onShowMore
  };

  const trackPanelItemChildren = (
    <div className={styles.label}>
      <span className={styles.labelTextStrong}>
        {gene.symbol ?? gene.stable_id}
      </span>
      <span className={styles.labelTextSecondary}>
        {gene.metadata.biotype.label}
      </span>
    </div>
  );

  return (
    <>
      <SimpleTrackPanelItemLayout {...commonComponentProps}>
        {trackPanelItemChildren}
      </SimpleTrackPanelItemLayout>

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
      {gene.transcripts.length > 1 && (
        <TrackPanelItemsExpandLozenge
          itemName="transcript"
          count={gene.transcripts.length - 1}
          isExpanded={!isCollapsed}
          toggleExpand={toggleExpand}
        />
      )}
    </>
  );
};

const pluckStableIds = (items: { stable_id: string }[]) =>
  items.map((item) => item.stable_id);

export default TrackPanelGene;
