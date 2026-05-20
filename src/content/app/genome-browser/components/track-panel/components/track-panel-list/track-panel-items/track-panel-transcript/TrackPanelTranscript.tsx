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

import { useAppDispatch } from 'src/store';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { useGbTranscriptSummaryQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import SidebarSectionHeading from 'src/shared/components/sidebar-section-heading/SidebarSectionHeading';
import SimpleTrackPanelItemLayout from '../track-panel-item-layout/SimpleTrackPanelItemLayout';

import type { FocusTranscript } from 'src/shared/types/focus-object/focusObjectTypes';

import trackPanelItemStyles from '../TrackPanelItem.module.css';

const TrackPanelTranscript = (props: { focusTranscript: FocusTranscript }) => {
  const { focusTranscript } = props;
  const { currentData: transcriptData } = useGbTranscriptSummaryQuery({
    genomeId: focusTranscript.genome_id,
    transcriptId: focusTranscript.versioned_stable_id
  });
  const dispatch = useAppDispatch();

  const transcript = transcriptData?.transcript;
  if (!transcript) {
    return null;
  }

  const showTranscriptInfo = () => {
    dispatch(
      changeDrawerViewForGenome({
        genomeId: focusTranscript.genome_id,
        drawerView: {
          name: 'transcript_summary',
          transcriptId: focusTranscript.stable_id
        }
      })
    );
  };

  const showGeneInfo = () => {
    dispatch(
      changeDrawerViewForGenome({
        genomeId: focusTranscript.genome_id,
        drawerView: {
          name: 'gene_summary',
          geneId: transcript.gene.unversioned_stable_id
        }
      })
    );
  };

  return (
    <>
      <SimpleTrackPanelItemLayout onShowMore={showTranscriptInfo}>
        <span className={trackPanelItemStyles.twoItemsGrid}>
          <span className={trackPanelItemStyles.labelTextLight}>
            Transcript
          </span>
          <span className={trackPanelItemStyles.labelTextStrong}>
            {transcript.stable_id}
          </span>
        </span>
      </SimpleTrackPanelItemLayout>

      <div className={trackPanelItemStyles.container}>
        <span className={trackPanelItemStyles.twoItemsGrid}>
          <span className={trackPanelItemStyles.labelTextLight}>Biotype</span>
          <span>{transcript.metadata.biotype.value}</span>
        </span>
      </div>

      <div className={trackPanelItemStyles.container}>
        <span className={trackPanelItemStyles.twoItemsGrid}>
          <span className={trackPanelItemStyles.labelTextLight}>Length</span>
          <span>
            {formatNumber(transcript.slice.location.length)}{' '}
            <span className={trackPanelItemStyles.labelTextLight}>bp</span>
          </span>
        </span>
      </div>

      <SidebarSectionHeading>Gene</SidebarSectionHeading>
      <SimpleTrackPanelItemLayout onShowMore={showGeneInfo}>
        <span className={trackPanelItemStyles.twoItemsGrid}>
          <span className={trackPanelItemStyles.labelTextStrong}>
            {transcript.gene.symbol ?? transcript.gene.stable_id}
          </span>
          <span className={trackPanelItemStyles.labelTextSecondary}>
            {transcript.gene.metadata.biotype.label}
          </span>
        </span>
      </SimpleTrackPanelItemLayout>
    </>
  );
};

export default TrackPanelTranscript;
