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

// A genomic HGVS substitution, e.g. `11:g.19237425T>G`: region, position, then
// ref>alt. VEP already emits HGVSg in ProtVar's expected minimal (parsimonious)
// form, so this needs no minimisation — the base positions are taken verbatim.
const HGVSG_SUBSTITUTION = /^([^:]+):g\.(\d+)([ACGTN]+)>([ACGTN]+)$/;

/**
 * Build a link to a variant's ProtVar entry from its HGVSg genomic
 * representation, e.g. `11:g.19237425T>G` -> `.../ProtVar/g/11/19237425/T/G`.
 *
 * ProtVar links only appear on protein-structural (missense) rows, which are
 * single-nucleotide substitutions — the shape HGVSg writes with `>`. A missing
 * HGVSg, or a non-substitution (indels use del/ins/dup notation and carry no
 * ProtVar data), yields no link.
 */
export const buildProtvarUrlFromHgvsg = (
  hgvsgGenomic: string | null | undefined
): string | undefined => {
  const match = hgvsgGenomic?.match(HGVSG_SUBSTITUTION);
  if (!match) {
    return undefined;
  }
  const [, regionName, position, ref, alt] = match;
  return `https://www.ebi.ac.uk/ProtVar/g/${regionName}/${position}/${ref}/${alt}?annotation=fun`;
};
