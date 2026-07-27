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

import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';

import { getSelectedSpecies } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';
import {
  setSelectedSpecies,
  clearSelectedSpecies
} from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import { useVepSpeciesPresetsQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';

import { VepSpeciesName } from 'src/content/app/tools/vep/components/vep-species-name/VepSpeciesName';

import type { VepSelectedSpecies } from 'src/content/app/tools/vep/types/vepSubmission';

import styles from './VepSpeciesPresets.module.css';

const VepSpeciesPresets = (props: { className?: string }) => {
  // Resolved by the backend against the current integrated release. Genome ids
  // are release-scoped, so a committed list of them goes stale silently — see
  // vep/utils/species_presets.py.
  const { data: speciesPresets } = useVepSpeciesPresetsQuery();
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const dispatch = useAppDispatch();

  const onSelect = (species: VepSelectedSpecies) => {
    // Clicking the already-selected preset deselects it, clearing the rest of
    // the form (same behaviour as clearing the species elsewhere).
    if (selectedSpecies?.genome_id === species.genome_id) {
      dispatch(clearSelectedSpecies());
    } else {
      dispatch(setSelectedSpecies({ species }));
    }
  };

  // Nothing to offer: either still loading, or the backend could not resolve
  // any accession to the current integrated release. Showing the "Quick select"
  // label above an empty row would just look broken.
  if (!speciesPresets?.length) {
    return null;
  }

  return (
    <div className={classNames(styles.presets, props.className)}>
      <span className={styles.label}>Quick select</span>
      <div className={styles.buttons}>
        {speciesPresets.map((species) => {
          const isActive = selectedSpecies?.genome_id === species.genome_id;
          return (
            <button
              key={species.genome_id}
              type="button"
              className={classNames(styles.preset, {
                [styles.presetActive]: isActive
              })}
              aria-pressed={isActive}
              aria-label={`${species.common_name ?? species.scientific_name} ${species.assembly.name}`}
              onClick={() => onSelect(species)}
            >
              {/* Render the species name with the same component the Species
                  section uses, so the button and the selected-species display
                  always read identically (e.g. "Human GRCh38.p14"). */}
              <VepSpeciesName selectedSpecies={species} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VepSpeciesPresets;
