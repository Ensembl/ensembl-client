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

import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';

const filterGenomes = ({
  query,
  genomes
}: {
  query: string;
  genomes: SpeciesSearchMatch[];
}) => {
  return genomes.filter((genome) => {
    return (
      isSubstringOf(genome.common_name, query) ||
      isSubstringOf(genome.scientific_name, query) ||
      isSubstringOf(genome.type?.kind, query) ||
      isSubstringOf(genome.type?.value, query) ||
      (genome.is_reference && isSubstringOf('reference', query)) ||
      isSubstringOf(genome.assembly.accession_id, query) ||
      isSubstringOf(genome.assembly.name, query) ||
      isSubstringOf(genome.assembly.name, query) ||
      isSubstringOf(genome.annotation_provider, query) ||
      isSubstringOf(genome.annotation_method, query)
    );
  });
};

// Strings in modern javascript have a .localeCompare method
// that can do case-insensitive string comparison;
// but it does not check whether a string contains a substring.
// The function below is an old an not very elegant way of checking this.
const isSubstringOf = (
  string: string | undefined | null,
  candidateSubstring: string
) => {
  if (typeof string !== 'string') {
    return false;
  }
  const normalizedString = string.toUpperCase();
  const normalizedCandidateString = candidateSubstring.toUpperCase();
  return normalizedString.includes(normalizedCandidateString);
};

export default filterGenomes;
