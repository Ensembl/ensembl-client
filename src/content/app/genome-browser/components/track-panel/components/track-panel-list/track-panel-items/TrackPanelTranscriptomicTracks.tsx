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

import {
  CollapsibleSection,
  CollapsibleSectionHead,
  CollapsibleSectionBody
} from 'src/shared/components/collapsible-section/CollapsibleSection';
import { groupTranscriptomicTracks } from 'src/content/app/genome-browser/helpers/transcriptomic';
import type { GenomicTrack } from 'src/content/app/genome-browser/state/types/tracks';
import type { TranscriptomicConfiguration } from 'src/content/app/genome-browser/state/types/transcriptomic';
import TrackPanelRegularItem from './TrackPanelRegularItem';
import styles from './TrackPanelTranscriptomicTracks.module.css';

export default function TrackPanelTranscriptomicTracks({
  genomeId,
  tracks,
  configuration
}: {
  genomeId: string;
  tracks: GenomicTrack[];
  configuration: TranscriptomicConfiguration;
}) {
  return groupTranscriptomicTracks(tracks, configuration).map((group) => (
    <section key={group.key} aria-label={`${group.label} tracks`}>
      <CollapsibleSection>
        <CollapsibleSectionHead className={styles.tissueHeading}>
          {group.label}
        </CollapsibleSectionHead>
        <CollapsibleSectionBody className={styles.tissueTracks}>
          <dl>
            {group.tracks.map((track) => (
              <TrackPanelRegularItem
                {...track}
                genomeId={genomeId}
                key={track.track_id}
              />
            ))}
          </dl>
        </CollapsibleSectionBody>
      </CollapsibleSection>
    </section>
  ));
}
