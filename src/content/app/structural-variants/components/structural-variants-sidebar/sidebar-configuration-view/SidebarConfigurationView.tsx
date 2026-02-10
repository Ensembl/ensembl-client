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

import { useAppSelector, useAppDispatch } from 'src/store';

import {
  getReferenceGenome,
  getAlternativeGenome
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';
import { getTrackIds } from 'src/content/app/structural-variants/state/tracks/tracksSelectors';

import {
  hideTracks,
  showTracks
} from 'src/content/app/structural-variants/state/tracks/tracksSlice';

import useStructuralVariantsTracks from 'src/content/app/structural-variants/hooks/useStructuralVariantsTracks';

import VisibilityIcon from 'src/shared/components/visibility-icon/VisibilityIcon';
import {
  CollapsibleSection,
  CollapsibleSectionHead,
  CollapsibleSectionBody
} from 'src/shared/components/collapsible-section/CollapsibleSection';

import { Status } from 'src/shared/types/status';
import type { GenomicTrack } from 'src/content/app/genome-browser/state/types/tracks';

import styles from './SidebarConfigurationView.module.css';

const SidebarConfigurationView = () => {
  const referenceGenome = useAppSelector(getReferenceGenome);
  const altGenome = useAppSelector(getAlternativeGenome);
  const referenceGenomeId = referenceGenome?.genome_id ?? '';
  const altGenomeId = altGenome?.genome_id ?? '';
  const trackIdsFromRedux = useAppSelector((state) => {
    return getTrackIds(state, referenceGenomeId, altGenomeId);
  });
  const dispatch = useAppDispatch();

  const { referenceGenomeTracks, altGenomeTracks } =
    useStructuralVariantsTracks({
      referenceGenomeId: referenceGenome?.genome_id,
      altGenomeId
    });

  const onTrackToggle = ({
    trackId,
    isOn,
    isAltGenome
  }: {
    trackId: string;
    isOn: boolean;
    isAltGenome: boolean;
  }) => {
    const updateFunction = isOn ? hideTracks : showTracks;
    const trackIdsPayloadPart = isAltGenome
      ? { altGenomeTrackIds: [trackId] }
      : { referenceGenomeTrackIds: [trackId] };

    dispatch(
      updateFunction({
        referenceGenomeId,
        altGenomeId,
        ...trackIdsPayloadPart
      })
    );
  };

  return (
    <>
      <CollapsibleSection className={styles.filtersSection}>
        <CollapsibleSectionHead>Reference genome tracks</CollapsibleSectionHead>
        <CollapsibleSectionBody className={styles.filtersSectionBody}>
          <TrackList
            tracks={referenceGenomeTracks}
            enabledTrackIds={trackIdsFromRedux.referenceGenomeTrackIds}
            isAltGenome={false}
            onTrackToggle={onTrackToggle}
          />
        </CollapsibleSectionBody>
      </CollapsibleSection>
      {altGenomeTracks.length && (
        <CollapsibleSection className={styles.filtersSection}>
          <CollapsibleSectionHead>
            Alternative genome tracks
          </CollapsibleSectionHead>
          <CollapsibleSectionBody className={styles.filtersSectionBody}>
            <TrackList
              tracks={altGenomeTracks}
              enabledTrackIds={trackIdsFromRedux.altGenomeTrackIds}
              isAltGenome={true}
              onTrackToggle={onTrackToggle}
            />
          </CollapsibleSectionBody>
        </CollapsibleSection>
      )}
    </>
  );
};

const TrackList = ({
  tracks,
  enabledTrackIds,
  isAltGenome,
  onTrackToggle
}: {
  tracks: GenomicTrack[];
  enabledTrackIds: string[];
  isAltGenome: boolean;
  onTrackToggle: (params: {
    trackId: string;
    isOn: boolean;
    isAltGenome: boolean;
  }) => void;
}) => {
  return tracks.map((track) => {
    const isTrackOn = enabledTrackIds.includes(track.track_id);

    return (
      <div key={track.track_id} className={styles.track}>
        <span>{track.label}</span>
        <VisibilityIcon
          status={isTrackOn ? Status.SELECTED : Status.UNSELECTED}
          onClick={() =>
            onTrackToggle({
              trackId: track.track_id,
              isOn: isTrackOn,
              isAltGenome
            })
          }
        />
      </div>
    );
  });
};

export default SidebarConfigurationView;
