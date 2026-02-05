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

  const { referenceGenomeTracks } = useStructuralVariantsTracks({
    referenceGenomeId: referenceGenome?.genome_id
  });

  const onTrackToggle = ({
    trackId,
    isOn
  }: {
    trackId: string;
    isOn: boolean;
  }) => {
    const updateFunction = isOn ? hideTracks : showTracks;

    dispatch(
      updateFunction({
        referenceGenomeId,
        altGenomeId,
        referenceGenomeTrackIds: [trackId]
      })
    );
  };

  const trackList = referenceGenomeTracks.map((track) => {
    const isTrackOn = trackIdsFromRedux.referenceGenomeTrackIds.includes(
      track.track_id
    );

    return (
      <div key={track.track_id} className={styles.track}>
        <span>{track.label}</span>
        <VisibilityIcon
          status={isTrackOn ? Status.SELECTED : Status.UNSELECTED}
          onClick={() =>
            onTrackToggle({ trackId: track.track_id, isOn: isTrackOn })
          }
        />
      </div>
    );
  });

  return (
    <CollapsibleSection className={styles.filtersSection}>
      <CollapsibleSectionHead>Tracks</CollapsibleSectionHead>
      <CollapsibleSectionBody className={styles.filtersSectionBody}>
        {trackList}
      </CollapsibleSectionBody>
    </CollapsibleSection>
  );
};

export default SidebarConfigurationView;
