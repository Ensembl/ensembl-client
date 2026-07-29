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

import type { Variant } from 'src/content/app/tools/vep/types/vepResultsResponse';

/**
 * A variant in OpenTargets' own notation —
 * `chromosome_position_reference_alternate`, e.g. `1_230710048_A_G` for rs699.
 *
 * That is the id their platform keys variant pages on, confirmed against their
 * GraphQL API: querying `1_230710048_A_G` returns `rsIds: ["rs699"]` at
 * chromosome 1, position 230710048, ref A, alt G — which is exactly the row the
 * dev-data VCF carries.
 *
 * Built from the results row rather than annotated, so it needs no extra column
 * and does not depend on the variant having an rsID at all.
 *
 * Undefined when the alternative allele is unknown — an intergenic row whose
 * allele could not be resolved — so the caller drops the link rather than
 * pointing at a malformed id.
 */
export const buildOpenTargetsVariantId = (
  variant: Pick<Variant, 'location' | 'reference_allele'>,
  alternativeAlleleSequence: string | undefined
): string | undefined => {
  if (!alternativeAlleleSequence) {
    return undefined;
  }
  const { region_name, start } = variant.location;
  const reference = variant.reference_allele.allele_sequence;
  return `${region_name}_${start}_${reference}_${alternativeAlleleSequence}`;
};
