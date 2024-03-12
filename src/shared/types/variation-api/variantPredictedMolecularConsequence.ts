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

// NOTE: currently, VariantPredictedMolecularConsequence represents an affected transcript.
// This is why it has such fields as gene_stable_id, protein_stable_id, cdna_location, cds_location, etc.
export type VariantPredictedMolecularConsequence = {
  stable_id: string;
  gene_stable_id: string;
  gene_symbol: string;
  protein_stable_id: string | null;
  transcript_biotype: string;
  cdna_location: VariantRelativeLocation | null;
  cds_location: VariantRelativeLocation | null;
  protein_location: VariantRelativeLocation | null;
  consequences: AlleleConsequence[];
};

/**
 * If one end of the variant, in the genomic sequence, is in an exon,
 * and the other is in an intron, then one of the coordinates (either start or end)
 * cannot be projected onto cDNA or CDS. As a result, the length of the variant cannot
 * be determined, and neither can its reference or alternate sequence.
 */
export type VariantRelativeLocation = {
  start: number | null;
  end: number | null;
  length: number | null;
  percentage_overlap: number | null;
  ref_sequence: string | null;
  alt_sequence: string | null;
};

type AlleleConsequence = {
  value: string;
};
