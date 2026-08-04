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

import type { FormPanel } from 'src/content/app/tools/vep/types/vepFormConfig';
import type { DisplaySpec } from 'src/content/app/tools/vep/types/vepDisplaySpec';

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
  // Present only when server-side filters were applied to this request.
  filters?: FilterMetadata;
  // AF columns present in this result set (the AF options chosen at input).
  available_af_sources?: AfSource[];
  /**
   * The option panels this job was submitted against, pinned by the tools API
   * at submission time. The results view lays itself out from these rather than
   * from the live form config, so a job renders against the options it actually
   * ran with. Absent (or null) for jobs submitted before pinning existed —
   * those fall back to the live form-config panels.
   */
  display_panels?: FormPanel[] | null;
  /**
   * How each option's parsed annotation is laid out, from the `display` section
   * of the spec pinned to this job (with the plugin->scope map derived from its
   * parsing half). Absent only from a backend with no display section at all.
   */
  display?: DisplaySpec | null;
};

// Per-filter count of how many records a filter removed (in pipeline order).
export type FilterStat = {
  field: string;
  removed: number;
};

export type FilterMetadata = {
  unfiltered_total: number;
  filtered_total: number;
  stats: FilterStat[];
};

// An allele-frequency column available to filter on (an AF option chosen at
// input). `population` is empty for the source's overall AF.
export type AfSource = {
  key: string; // CSQ column name
  source: string; // gnomad_exomes | gnomad_genomes | all_of_us
  population: string;
  // Human population label, decoded from the code by the backend (from the input
  // form's vocabulary); 'All' for the overall AF. The frontend renders this
  // rather than decoding the code itself.
  label: string;
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

/**
 * A single plugin's output, as emitted by the backend's generic annotation
 * list. `plugin` is the plugin id, and `data` holds that plugin's fields
 * verbatim. A plugin missing from the list means "did not run / no data".
 *
 * Which option a plugin belongs to is the spec's business, not the frontend's:
 * the display section names the plugins each option renders, and the scope map
 * says whether to read one from the allele or the consequence.
 */
export type Annotation = {
  plugin: string;
  scope: 'allele' | 'transcript';
  data: Record<string, unknown>;
};

export type AlternativeVariantAllele = {
  allele_sequence: string;
  allele_type: string;
  // A secondary line for a structural allele (the symbolic `allele_sequence`,
  // `<DEL>` / `<BND>`): the span in bases for sized SVs ("765 bp") or a breakend's
  // two loci ("2:321681 ↔ 17:198982"). Null for simple variants.
  structural_variant_detail?: string | null;
  predicted_molecular_consequences: PredictedMolecularConsequence[];
  // Allele-scoped plugin output (also the only annotations available for
  // intergenic variants, which have no transcript consequences).
  annotations?: Annotation[];
  // TODO(unspecced tail): the backend still emits `colocated_variants`
  // (Existing_variation); untyped here as nothing renders it yet — convert to a
  // plugin annotation like the rest when sample data arrives.
};

/** One submitter's account of a condition, behind the count that summarises it. */
export type ClinVarSubmission = {
  submitter: string | null;
  date_last_evaluated: string | null;
  review_status: string | null;
  /** Cited papers, as one `+`-joined list of PubMed ids. */
  pmid: string | null;
  /** ClinVar's own flag for whether this submission produced the aggregate
   *  classification. A code, so "0" is a true-looking string. */
  contributes: string | null;
};

/** How many submitters gave one classification for a condition, and who. */
export type ClinVarClassificationCount = {
  classification: string;
  count: number;
  submitters: ClinVarSubmission[];
};

/**
 * One condition ClinVar records for this variant: the disease name with the
 * ontology ids that name it, the classifications its submitters gave, and the
 * RCV records covering it. `ids` is null where ClinVar has none — it writes '.'
 * there — and `id_url`/`id_curie` are the one id resolved for linking (see the
 * `curie_link` post-op), null when none of them resolves.
 */
export type ClinVarCondition = {
  name: string;
  type: string | null; // the classification type this condition sits under
  ids: string | null;
  id_url: string | null;
  id_curie: string | null;
  classifications: ClinVarClassificationCount[];
  records: { rcv: string }[];
  /** How many submissions contributed to the aggregate, for ordering. */
  contributing?: number | null;
};

/** ClinVar's aggregate classification of one type (germline, oncogenicity,
 *  somatic clinical impact), with the scale its review status is read on. */
export type ClinVarClassification = {
  type: string;
  classification: string | null;
  review_status: string | null;
  rating_scale: string | null;
  supporting: number | null;
  submissions: number | null;
};

export type ClinVarAnnotation = {
  id: string | null; // the ClinVar variation id (the custom's match column)
  significance: string[]; // CLNSIG term(s)
  classification_summary: ClinVarClassification[];
  conditions: ClinVarCondition[];
};

// ClinVar structural variants (the ClinVar_SV custom): clinical significance and
// allele origin of an overlapping structural variant.
export type ClinVarSvAnnotation = {
  significance: string[]; // ClinVar_SV_CLNSIG term(s)
  origin: string[]; // ClinVar_SV_ORIGIN term(s)
};

export type PopulationFrequencies = {
  overall: number | null;
  populations: Record<string, number>;
  // For All of Us: the subpopulation code the "max" frequency came from...
  max_subpopulation?: string | null;
  // ...and its human label, decoded by the backend (' / '-joined when several).
  max_subpopulation_label?: string | null;
};

// gnomAD SV / CNV structural-frequency data: the overlapping variant's id +
// type, then its overall and per-population frequencies (like the other AF
// sources). Absent when the variant overlaps no gnomAD SV / CNV.
export type GnomadStructuralData = {
  id: string | null;
  svtype: string | null;
  overall: number | null;
  populations: Record<string, number>;
};

export type VariantPhenotypeData = {
  // The Phenotypes plugin produces a single PHENOTYPES column. (Co-located
  // ClinVar significance / PubMed are separate options, not phenotype data.)
  phenotypes: string[];
};

export type OpenTargetsGwasAssociation = {
  disease: string; // EFO ontology id
  gene_id: string; // Ensembl gene id
  l2g_score: number | null;
};

export type OpenTargetsQtlAssociation = {
  gene_id: string; // Ensembl gene id
  biosample: string | null; // affected tissue
};

export type OpenTargetsAssociation = {
  gwas_associations: OpenTargetsGwasAssociation[];
  qtl_associations: OpenTargetsQtlAssociation[];
};

export type PredictedMolecularConsequence =
  PredictedTranscriptConsequence | PredictedIntergenicConsequence;

export type PredictedTranscriptConsequence = {
  feature_type: 'transcript';
  stable_id: string; // transcript stable id, versioned
  gene_stable_id: string; // ideally, versioned; but ultimately, as stored in the vcfs
  gene_symbol: string | null;
  is_canonical: boolean;
  biotype: string;
  strand: 'forward' | 'reverse';
  consequences: string[];
  // MANE (human GRCh38 only)
  is_mane_select?: boolean;
  is_mane_plus_clinical?: boolean;
  mane_select_refseq_id?: string | null;
  // GENCODE primary (human GRCh38 only)
  is_gencode_primary?: boolean;
  // Transcript-scoped plugin output (protein & functional annotations, HGVS,
  // pathogenicity predictions, gene constraint, ...).
  annotations?: Annotation[];
  // TODO(unspecced tail): the backend still emits sift / polyphen / uniprot /
  // protein_matches here as typed fields; untyped here as nothing renders them
  // yet — convert to plugin annotations (like the `protein` plugin, read via
  // getAnnotation) when sample data arrives.
};

// A Gene Ontology annotation: the GO id and its term name.
export type GoTerm = {
  id: string; // e.g. GO:0001558
  name: string; // e.g. "regulation of cell growth"
};

// NearestGene: the nearest gene(s) to an (intergenic) variant. In both-directions
// mode there is one upstream and one downstream entry; otherwise a single entry
// with no direction (upstream is the default).
export type NearestGeneItem = {
  gene_id: string; // e.g. ENSG00000186092
  distance: number; // bases to the gene
  direction: string | null; // "upstream" | "downstream", or null (single mode)
};

export type NearestGeneData = {
  nearest_genes: NearestGeneItem[];
};

// NearestExonJB: the nearest exon junction boundary. Transcript-scoped (the
// nearest boundary depends on the transcript's exons). Intronic mode reports one
// boundary on each side; boundary_type is start / end / start_end.
export type NearestExonBoundary = {
  exon_id: string; // e.g. ENSE00004404283
  distance: number; // bases to the boundary
  boundary_type: string; // "start" | "end" | "start_end"
  exon_length: number; // length of the exon
};

export type NearestExonJbData = {
  boundaries: NearestExonBoundary[];
};

export type DosageSensitivity = {
  phaplo: number | null; // haploinsufficiency probability
  ptriplo: number | null; // triplosensitivity probability
};

export type FivePrimeUtrAnnotation = {
  consequence: string | null; // 5UTR_consequence
  // 5UTR_annotation, parsed by the spec's key_value transform into a bag of
  // string pairs (alt_type, KozakStrength, KozakContext, Evidence, ...). Key
  // order is not stable per record, so treat it as unordered. Not rendered yet.
  annotation: Record<string, string> | null;
  existing_uorfs: string | null;
  existing_inframe_oorfs: string | null;
  existing_outofframe_oorfs: string | null;
};

export type RiboseqOrfsAnnotation = {
  orf_id: string | null;
  consequences: string[];
  impact: string | null;
  protein_position: string | null;
  codons: string | null;
  amino_acids: string | null;
  publications: string[];
};

export type HgvsNotations = {
  genomic: string | null;
  transcript: string | null;
  protein: string | null;
};

export type SpliceAiScores = {
  symbol: string | null;
  ds_acceptor_gain: number | null;
  ds_acceptor_loss: number | null;
  ds_donor_gain: number | null;
  ds_donor_loss: number | null;
  dp_acceptor_gain: number | null;
  dp_acceptor_loss: number | null;
  dp_donor_gain: number | null;
  dp_donor_loss: number | null;
};

export type PopEve = {
  score: number | null; // popEVE_SCORE
  eve: number | null;
  esm1v: number | null;
  pop_adjusted_eve: number | null;
  pop_adjusted_esm1v: number | null;
  gene: string | null;
  protein: string | null;
  mutant: string | null;
  gap_frequency: number | null;
};

// Single-score / classification plugins.
export type RevelScore = {
  score: number | null;
};

export type ClinPredScore = {
  score: number | null;
};

export type LoeufScore = {
  score: number | null;
};

// GERP conservation score (VEP's Conservation plugin, over a per-assembly
// bigwig). Position-based, so it is the same on every transcript of an allele —
// hence allele-scoped. May be negative (a faster-than-neutral site).
export type GerpScore = {
  score: number | null;
};

// NMD (nonsense-mediated decay) escape prediction: 'NMD_escaping_variant' when
// the variant escapes NMD, else empty/absent.
export type NmdData = {
  prediction: string | null;
};

// GENCODE promoter-window overlap: the window's genomic region (e.g.
// '1:108559100-108560099') and its feature id. Empty when the variant overlaps
// no promoter window.
export type GencodePromoterData = {
  region: string | null;
  feature_id: string | null;
};

export type ClassificationWithScore = {
  classification: string | null;
  score: number | null;
};

export type CaddScores = {
  phred: number | null;
  raw: number | null;
};

export type SpdiRepresentation = {
  spdi: string | null;
};

// The Ensembl protein id (ENSP) of a transcript consequence — the `protein`
// parse plugin (was the typed `ensembl_protein_id` field).
export type ProteinData = {
  ensembl_protein_id: string | null;
};

export type HgvsgRepresentation = {
  genomic: string | null;
};

export type GoAnnotation = {
  go_terms: GoTerm[];
};

export type MutfuncAnnotation = {
  linear_motifs: number | null;
  protein_interactions: number | null;
  protein_structure: number | null;
  protein_structure_experimental: number | null;
};

export type MaveDBAssay = {
  urn: string | null;
  score: number | null;
};

export type MaveDBAnnotation = {
  protein_variant: string | null;
  assays: MaveDBAssay[];
};

export type ProtVarPocket = {
  pocket_id: string;
  energy: number | null;
  energy_per_volume: number | null;
  score: number | null;
  buriedness: number | null;
  radius_of_gyration: number | null;
  raw: string;
};

export type ProtVarInteractionInterface = {
  partner: string;
  score: number | null;
  raw: string;
};

export type ProtVarAnnotation = {
  structure_stability_score: number | null;
  pockets: ProtVarPocket[];
  interaction_interfaces: ProtVarInteractionInterface[];
};

export type IntActAnnotation = {
  feature_type: string | null;
  interaction_ac: string | null;
  feature_ac: string | null;
  feature_short_label: string | null;
  feature_annotation: string | null;
  ap_ac: string | null;
  interaction_participants: string | null;
  pmid: string | null;
};

export type PredictedIntergenicConsequence = {
  feature_type: null;
  consequences: string[];
};
