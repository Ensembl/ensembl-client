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

import type {
  Annotation,
  CaddScores,
  ClassificationWithScore,
  ClinPredScore,
  GencodePromoterData,
  GnomadStructuralData,
  ClinVarAnnotation,
  ClinVarSvAnnotation,
  DosageSensitivity,
  FivePrimeUtrAnnotation,
  GerpScore,
  GoAnnotation,
  HgvsNotations,
  HgvsgRepresentation,
  IntActAnnotation,
  LoeufScore,
  MaveDBAnnotation,
  MutfuncAnnotation,
  NearestExonJbData,
  NearestGeneData,
  NmdData,
  OpenTargetsAssociation,
  PopEve,
  PopulationFrequencies,
  ProteinData,
  ProtVarAnnotation,
  RevelScore,
  RiboseqOrfsAnnotation,
  SpdiRepresentation,
  SpliceAiScores,
  VariantPhenotypeData
} from 'src/content/app/tools/vep/types/vepResultsResponse';

/**
 * The plugin-id -> data-shape contract for the backend's generic `annotations`
 * list. Each key is a `plugin` id as emitted by the backend; the value is the
 * shape of that entry's `data` object.
 *
 * This is the single seam between the wire format and the UI: components should
 * read annotation data through `getAnnotation` rather than reaching into
 * `annotations` themselves.
 */
export type PluginDataMap = {
  // transcript-scoped
  mutfunc: MutfuncAnnotation;
  mavedb: MaveDBAnnotation;
  protvar: ProtVarAnnotation;
  protein: ProteinData;
  go: GoAnnotation;
  spliceai: SpliceAiScores;
  riboseq_orfs: RiboseqOrfsAnnotation;
  hgvs: HgvsNotations;
  dosage_sensitivity: DosageSensitivity;
  intact: IntActAnnotation;
  popeve: PopEve;
  revel: RevelScore;
  clinpred: ClinPredScore;
  alphamissense: ClassificationWithScore;
  eve: ClassificationWithScore;
  utr_annotation: FivePrimeUtrAnnotation;
  loeuf: LoeufScore;
  nmd: NmdData;
  nearest_exon_jb: NearestExonJbData;
  // ClinVar is transcript-scoped: its record is about a gene, and `applies_to`
  // narrows it to the CSQ rows whose SYMBOL that gene names. Its structural
  // sibling is a plain allele overlap, hence the different side of the line.
  clinvar: ClinVarAnnotation;
  // allele-scoped
  clinvar_sv: ClinVarSvAnnotation;
  nearest_gene: NearestGeneData;
  gencode_promoter: GencodePromoterData;
  gnomad_exomes: PopulationFrequencies;
  gnomad_genomes: PopulationFrequencies;
  all_of_us: PopulationFrequencies;
  gnomad_sv: GnomadStructuralData;
  gnomad_cnv: GnomadStructuralData;
  opentargets: OpenTargetsAssociation;
  phenotype_data: VariantPhenotypeData;
  cadd: CaddScores;
  gerp: GerpScore;
  spdi: SpdiRepresentation;
  hgvsg: HgvsgRepresentation;
};

export type PluginId = keyof PluginDataMap;

// Anything carrying the generic annotation list: an alternative allele or a
// predicted transcript consequence.
export type AnnotatedEntity = {
  annotations?: Annotation[];
};

/**
 * The data of the given plugin's annotation on this allele / consequence, or
 * `null` when the plugin did not run or produced nothing for it.
 */
export const getAnnotation = <Plugin extends PluginId>(
  entity: AnnotatedEntity | null | undefined,
  plugin: Plugin
): PluginDataMap[Plugin] | null => {
  const entry = entity?.annotations?.find(
    (annotation) => annotation.plugin === plugin
  );
  return entry ? (entry.data as PluginDataMap[Plugin]) : null;
};
