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

export type VepResultsResponse = {
  metadata: VepResultsResponseMetadata;
  variants: Variant[];
};

export type VepResultsResponseMetadata = {
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
};

export type Variant = {
  name: string; // This is a string with which user identifies a variant; in a VCF input, this can be a dot if user does not provide a name
  allele_type: string;
  location: {
    region_name: string;
    start: number;
    end: number;
  };
  reference_allele: ReferenceVariantAllele;
  alternative_alleles: AlternativeVariantAllele[];
};

export type ReferenceVariantAllele = {
  allele_sequence: string;
};

export type AlternativeVariantAllele = {
  allele_sequence: string;
  allele_type: string;
  predicted_molecular_consequences: PredictedMolecularConsequence[];
  representative_population_allele_frequency?: number | null; // FIXME: remove? not part of VEP Phase 1
};

export type PredictedMolecularConsequence =
  | PredictedTranscriptConsequence
  | PredictedIntergenicConsequence;

export type PredictedTranscriptConsequence = {
  feature_type: 'transcript';
  stable_id: string; // transcript stable id, versioned
  gene_stable_id: string; // ideally, versioned; but ultimately, as stored in the vcfs
  gene_symbol: string | null;
  is_canonical: boolean;
  biotype: string;
  strand: 'forward' | 'reverse';
  consequences: string[];
};

export type PredictedIntergenicConsequence = {
  feature_type: null;
  consequences: string[];
};
