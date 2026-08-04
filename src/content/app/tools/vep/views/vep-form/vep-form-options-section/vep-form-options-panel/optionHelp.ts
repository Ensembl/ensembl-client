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
  FormPanelOption,
  OptionHelp
} from 'src/content/app/tools/vep/types/vepFormConfig';

/**
 * Local fallback help text, keyed by option id.
 *
 * These descriptions are expected to move to the tools API's form_config
 * endpoint (delivered on each option, per species, alongside the panel config).
 * Until then they live here. The shape matches the API contract's `OptionHelp`
 * type exactly — plain strings and link descriptors, no JSX — so switching to
 * the API is just a matter of the option carrying its own `help`; nothing
 * downstream (resolver or renderer) needs to change.
 */
/**
 * Appended to every allele-frequency option's description. Population and
 * ancestry-group names are reproduced exactly as the source publishes them —
 * they are not mapped onto a common vocabulary, so the same cohort can appear
 * under different names between sources.
 */
const POPULATION_NAMING = 'Populations are named as at source.';

/**
 * The help map is keyed by option id, and an id is shared across assemblies —
 * `gnomad_exomes` is *gnomAD Exomes v4.1.1* on GRCh38 and *v2.1.1* on GRCh37 —
 * so anything version-specific written in here would be wrong for one of them.
 * The label is already per-assembly and comes from the API, so both the
 * description's `{version}` and the choice of which links apply are resolved
 * from it, leaving one version to keep right instead of two.
 */
const VERSION_PLACEHOLDER = /\s?\{version\}/g;
const VERSION_IN_LABEL = /\bv\d+(?:\.\d+)*/;

const resolveVersionedHelp = (
  help: OptionHelp,
  option: FormPanelOption
): OptionHelp => {
  const version = option.label.match(VERSION_IN_LABEL)?.[0];
  // 'v4.1' -> '4'. Matching on the major alone means a point release does not
  // silently drop a link that still describes the right callset.
  const majorVersion = version?.slice(1).split('.')[0];

  // No version in the label leaves the sentence reading cleanly rather than
  // with a gap or a stray space before the full stop.
  const description = help.description.includes('{version}')
    ? help.description.replace(
        VERSION_PLACEHOLDER,
        version ? ` ${version}` : ''
      )
    : help.description;

  // A version-specific link is dropped rather than guessed at when the label
  // carries no version: citing the wrong release is worse than citing none.
  const links = help.links?.filter(
    (link) => !link.majorVersion || link.majorVersion === majorVersion
  );

  return { ...help, description, links };
};

export const OPTION_HELP: Record<string, OptionHelp> = {
  // --- Variant representations ---
  // HGVSg is not described here while its checkbox is hidden (pending
  // chromosome synonyms) — put the sentence back with the control.
  hgvs: {
    description:
      'HGVS — Human Genome Variation Society nomenclature. HGVSc (*c*oding ' +
      'DNA) describes changes at the nucleotide level. HGVSp describes the ' +
      'change at the *p*rotein level.'
  },
  spdi: {
    description:
      'SPDI — Sequence Position Deletion Insertion. An NCBI-developed format ' +
      'to represent and normalise genetic variants.',
    links: [{ href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7523648/' }]
  },

  // --- Genes & transcripts ---
  tss_distance: {
    description: 'Distance in bases to the nearest transcription start site.'
  },
  nearest_gene: { description: 'Distance in bases to the nearest gene.' },
  nearest_exon_jb: {
    description:
      'Distance in bases to the nearest exon junction. The intronic option ' +
      'overrides the max search range for variants in introns and checks the ' +
      'nearest introns.'
  },
  utrannotator: {
    description:
      'Annotates the effect of 5′ UTR variants, especially variants ' +
      'creating/disrupting upstream Open Reading Frames (ORFs). The original ' +
      'UTRAnnotator plugin is written by Xiaolei Zhang et al., later adopted ' +
      'by Ensembl VEP plugins with some changes.',
    links: [
      {
        href: 'https://github.com/ImperialCardioGenetics/UTRannotator',
        label: 'Original plugin'
      }
    ]
  },
  go: {
    description:
      'Annotates transcripts with their Gene Ontology (GO) terms — the ' +
      'molecular functions, biological processes and cellular components ' +
      'associated with the gene product.',
    links: [{ href: 'https://geneontology.org/' }]
  },
  riboseqorfs: {
    description:
      'Reports consequences of variants overlapping Open Reading Frames ' +
      '(ORFs), determined by RiboSeq experiments curated from the literature ' +
      'by GENCODE.',
    links: [{ href: 'https://www.gencodegenes.org/pages/riboseq_orfs/' }]
  },

  // --- Protein & functional ---
  protein: { description: 'The Ensembl protein identifier (ENSP).' },
  protvar: {
    description:
      'Functional annotations of protein variation data from the UniProt ' +
      'resource. Specifically, assessments of variant impact on protein ' +
      'structure stability, protein pockets and protein-protein interaction ' +
      'interfaces.',
    links: [{ href: 'https://www.ebi.ac.uk/ProtVar/help#structure' }]
  },
  mavedb: {
    description:
      'Annotate variants with data from MaveDB, a database that contains ' +
      '*m*ultiplex *a*ssays of *v*ariant *e*ffect, including deep mutational ' +
      'scans and massively parallel reporter assays. Enables reporting of ' +
      'experimentally determined variant impact on readouts including mRNA ' +
      'and protein expression levels.',
    links: [{ href: 'https://www.mavedb.org' }]
  },
  intact: {
    description:
      "Annotates variants with data from IntAct's Molecular Interaction " +
      'Database. By default returns the interaction accession, with options ' +
      'to return further data: the feature accession, the feature short name, ' +
      'the feature annotation, the affected protein accession, the ' +
      'interaction participants and all PubMed IDs of the relevant ' +
      'experimental work.',
    links: [{ href: 'https://www.ebi.ac.uk/intact/home' }]
  },
  mutfunc: {
    description:
      'Annotates variants with information from the mutfunc database, which ' +
      'highlights where a variant is predicted to disrupt protein structure ' +
      'stability, protein interaction interfaces or linear motifs.',
    links: [{ href: 'https://www.ebi.ac.uk/research/beltrao/software/' }]
  },

  // --- Conservation & constraint ---
  gerp: {
    description: 'Conservation scores calculated using GERP.',
    links: [{ href: 'https://europepmc.org/article/pmc/2996323' }]
  },

  // --- Variant Impact Predictions ---
  alphamissense: {
    description:
      'Annotate missense variants with pre-computed AlphaMissense ' +
      'pathogenicity scores. AlphaMissense is a deep learning model ' +
      'developed by Google DeepMind, utilising data from the AlphaFold ' +
      'project.',
    links: [{ href: 'https://doi.org/10.1126/science.adg7492' }]
  },
  revel: {
    description:
      'Annotate missense variants with predictions from the *R*are *e*xome ' +
      '*v*ariant *e*nsemble *l*earner (REVEL), trained with multiple other ' +
      'algorithms. Use of these scores is permitted for non-commercial use ' +
      'only.',
    links: [{ href: 'https://europepmc.org/article/MED/27666373' }]
  },
  clinpred: {
    description:
      'A prediction tool for the identification of disease-relevant ' +
      'nonsynonymous single nucleotide variants.',
    links: [{ href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6174354/' }]
  },
  eve: {
    description:
      'Annotates missense variants with predictions from the *e*volutionary ' +
      'model of *v*ariant *e*ffect (EVE) and the proteome-wide, ' +
      'human-specific spectrum of pathogenicity evolutionary model of ' +
      'variant effect (popEVE).',
    links: [
      {
        href: 'https://www.nature.com/articles/s41586-021-04043-8',
        label: 'EVE'
      },
      {
        href: 'https://www.nature.com/articles/s41588-025-02400-1',
        label: 'popEVE'
      }
    ]
  },
  nmd: {
    description:
      'Predicts whether a variant introducing a premature stop codon escapes ' +
      '*n*onsense-*m*ediated m*RNA* *d*ecay, the pathway that degrades such ' +
      'transcripts. An escaping transcript may still be translated into a ' +
      'truncated protein.',
    links: [
      {
        href: 'https://www.ensembl.org/info/docs/tools/vep/script/vep_plugins.html#nmd'
      }
    ]
  },
  spliceai: {
    description:
      'Predicts variant impact on splicing. SpliceAI is a deep neural ' +
      'network, developed by Illumina, Inc., that predicts splice junctions ' +
      'from an arbitrary pre-mRNA transcript sequence. Delta scores and ' +
      'positions are reported for acceptor and donor gain and loss. ' +
      'Author-recommended cut-offs for delta scores are 0.2 (high recall), ' +
      '0.5 (recommended) and 0.8 (high precision). These scores are ' +
      'generated by Ensembl against the MANE transcript set.',
    links: [{ href: 'https://europepmc.org/article/MED/30661751' }]
  },
  cadd: {
    description:
      '*C*ombined *A*nnotation *D*ependent *D*epletion (CADD) is a tool for ' +
      'scoring the deleteriousness of single nucleotide variants and ' +
      'insertion/deletion variants in the human genome. CADD integrates ' +
      'multiple annotations into one metric by contrasting variants that ' +
      'survived natural selection with simulated mutations. CADD is only ' +
      'available here for non-commercial use.',
    links: [{ href: 'https://cadd.bihealth.org/' }]
  },

  // --- Conservation & constraint ---
  loeuf: {
    description:
      'Annotates variants with the loss-of-function observed/expected upper ' +
      'bound fraction (LOEUF) scores from gnomAD. These are gene-level ' +
      'constraint metrics, indicating regions less tolerant to mutations.',
    links: [{ href: 'https://gnomad.broadinstitute.org/help/constraint' }]
  },
  dosage_sensitivity: {
    description:
      'Annotates variants with haploinsufficiency and triplosensitivity ' +
      'probability scores for the affected genes, from a dosage sensitivity ' +
      'catalogue.',
    links: [
      {
        href: 'https://www.sciencedirect.com/science/article/pii/S0092867422007887'
      }
    ]
  },

  // --- Phenotype & disease associations ---
  geno2mp: {
    description:
      'Annotates variants with data from Geno2MP — a resource containing rare ' +
      'variant genotypes linked to phenotypic information.',
    links: [{ href: 'http://geno2mp.gs.washington.edu' }]
  },
  clinvar: {
    description:
      'Annotates variants with clinical significance terms from ClinVar. ' +
      'Where the significance term is conflicting, a summary of all terms is ' +
      'presented.',
    links: [{ href: 'https://www.ncbi.nlm.nih.gov/clinvar/intro/' }]
  },
  opentargets: {
    description:
      'Annotates variants with GWAS-based locus-to-gene (L2G) scores and eQTL ' +
      'associations from the Open Targets platform.',
    links: [{ href: 'https://platform.opentargets.org' }]
  },
  phenotypes: {
    description:
      'Annotates variants with associated phenotypes, diseases and traits ' +
      'curated by Ensembl from sources including ClinVar, OMIM and the GWAS ' +
      'Catalog.',
    links: [
      {
        href: 'https://www.ensembl.org/info/genome/variation/phenotype/phenotype_annotation.html'
      }
    ]
  },

  // --- Regulatory ---
  gencode_promoters: {
    description:
      'Reports overlap with a promoter region defined by the GENCODE gene ' +
      'annotation, giving the overlapping region and its feature identifier.',
    links: [{ href: 'https://www.gencodegenes.org/pages/promoter_windows/' }]
  },

  // --- Allele frequencies ---
  // Every allele-frequency option carries POPULATION_NAMING: the group names in
  // these panels are the source's own, and differ between sources for what is
  // often the same cohort, so the reader needs to know we have not harmonised
  // them.
  gnomad_exomes: {
    description:
      'Allele frequencies from the exome sequences in the Genome Aggregation ' +
      'Database (gnomAD){version}. ' +
      POPULATION_NAMING,
    links: [{ href: 'https://gnomad.broadinstitute.org/' }]
  },
  gnomad_genomes: {
    description:
      'Allele frequencies from the genome sequences in the Genome Aggregation ' +
      'Database (gnomAD){version}. ' +
      POPULATION_NAMING,
    links: [{ href: 'https://gnomad.broadinstitute.org/' }]
  },
  allofus: {
    description:
      'Allele frequencies from the NIH All of Us Research Program, a diverse ' +
      'cohort of participants from across the United States. ' +
      POPULATION_NAMING,
    links: [{ href: 'https://www.nature.com/articles/s41586-023-06957-x' }]
  },
  // The v4 release announcement does not describe the v2 callset that GRCh37
  // carries, so each assembly's version cites its own reference.
  gnomad_sv: {
    description:
      'Allele frequencies for structural variants in the Genome Aggregation ' +
      'Database (gnomAD){version}. ' +
      POPULATION_NAMING,
    links: [
      {
        href: 'https://gnomad.broadinstitute.org/news/2023-11-v4-structural-variants/',
        majorVersion: '4'
      },
      {
        href: 'https://www.nature.com/articles/s41586-020-2287-8',
        majorVersion: '2'
      }
    ]
  },
  // Sample rather than allele frequency: gnomAD reports CNVs as the fraction of
  // samples carrying the call (hence the `_sf` option ids), not as an allele
  // count over a called total.
  gnomad_cnv: {
    description:
      'Sample frequencies for copy number variants in the Genome Aggregation ' +
      'Database (gnomAD){version}. ' +
      POPULATION_NAMING,
    links: [
      {
        href: 'https://gnomad.broadinstitute.org/news/2023-11-v4-copy-number-variants/'
      }
    ]
  }
};

/**
 * Resolve the help text for an option. Prefers help delivered by the API on the
 * option itself; falls back to the local map keyed by option id. This is the
 * single switch point: once the API supplies `help`, the local map can shrink
 * to nothing and eventually be deleted, with no change to callers.
 */
export const getOptionHelp = (
  option: FormPanelOption
): OptionHelp | undefined => {
  const help = option.help ?? OPTION_HELP[option.id];
  // Applied to API-supplied help too, so the placeholder stays a property of
  // the contract rather than of this fallback map.
  return help && resolveVersionedHelp(help, option);
};
