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

import { buildCommittedItemFromBriefGenomeSummary } from 'src/content/app/species-selector/helpers/selectedGenomeHelpers';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

/**
 * Input:
 *  - an array of newly fetched genomes that we can treat as reference
 *  - an array of locally stored genomes
 * Note: The two arrays don't have to be of equal size.
 */

export const checkNeedToUpdateGenomes = ({
  localGenomes,
  referenceGenomes
}: {
  localGenomes: CommittedItem[];
  referenceGenomes: BriefGenomeSummary[];
}) => {
  // This function will run several rounds of checks (several sequential for-loops).
  // Is this silly and inefficient? Perhaps.
  // In practice though, the numbers of stored genomes will be so small that this shouldn't be a problem.

  let shouldUpdateGenomes = false;

  const draftGenomes: CommittedItem[] = [...localGenomes];
  const genomeIdsToDelete = new Set<string>();

  // GENOME DELETION
  // Examples:
  // - request with a genome uuid has returned a response that is indicating that there is a better genome

  for (const referenceGenome of referenceGenomes) {
    // Remove genome with deprecated uuid
    if (referenceGenome.latest_genome) {
      // find genome with same genome id as reference genome,
      // and replace it with the suggested latest genome
      const deprecatedGenomeId = referenceGenome.genome_id;
      const newGenome = buildCommittedItemFromBriefGenomeSummary(
        referenceGenome.latest_genome
      );
      const localOldGenomeIndex = draftGenomes.findIndex(
        (genome) => genome.genome_id === deprecatedGenomeId
      );

      if (localOldGenomeIndex > -1) {
        const oldGenome = draftGenomes[localOldGenomeIndex];
        newGenome.addedAt = oldGenome.addedAt; // to preserve the sorting order after the new genome is saved
        draftGenomes.splice(localOldGenomeIndex, 1, newGenome);
      }

      shouldUpdateGenomes = true;
      genomeIdsToDelete.add(referenceGenome.genome_id);
    }
  }

  // The above step should have removed all genomes where the backend suggests the migration,
  // including old integrated genomes that were claiming genome tags.
  // So if we see below a genome that claims a genome tag that should now be assigned to a different genome
  // we can just null out the genome tag.

  // STORED GENOME MODIFICATION BASED ON NEW DATA
  for (const referenceGenome of referenceGenomes) {
    const genome = referenceGenome.latest_genome ?? referenceGenome;
    const genomeTag = genome.genome_tag;
    const genomeId = genome.genome_id;
    const release = genome.release;

    // Inspect local genomes, and update them if necessary
    draftGenomes.forEach((localGenome) => {
      // if some other genome claims the genome tag of the reference genome, remove the tag
      if (
        localGenome.genome_tag === genomeTag &&
        localGenome.genome_id !== genomeId
      ) {
        localGenome.genome_tag = null;
        shouldUpdateGenomes = true;
      }

      // if the locally stored genome should have a genome tag, but doesn't
      if (
        localGenome.genome_id === genomeId &&
        localGenome.genome_tag !== genomeTag
      ) {
        localGenome.genome_tag = genomeTag;
        shouldUpdateGenomes = true;
      }

      // if a genome that was first released in a partial release get included in integrated release
      // update the release of the stored genome
      if (
        localGenome.genome_id === genomeId &&
        localGenome.release.name !== release.name
      ) {
        localGenome.release = { ...release };
        shouldUpdateGenomes = true;
      }

      // not sure if it is possible for a genome to become a reference one if it wasn't before;
      // but it doesn't hurt to check
      if (
        localGenome.genome_id === genomeId &&
        localGenome.is_reference !== genome.is_reference
      ) {
        localGenome.is_reference = genome.is_reference;
        shouldUpdateGenomes = true;
      }
    });
  }

  return {
    genomes: draftGenomes,
    genomeIdsToDelete,
    shouldUpdateGenomes
  };
};
