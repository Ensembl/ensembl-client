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
    links: [{ href: 'https://www.ncbi.nlm.nih.gov/pubmed/27666373' }]
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
  spliceai: {
    description:
      'Predicts variant impact on splicing. SpliceAI is a deep neural ' +
      'network, developed by Illumina, Inc., that predicts splice junctions ' +
      'from an arbitrary pre-mRNA transcript sequence. Delta scores and ' +
      'positions are reported for acceptor and donor gain and loss. ' +
      'Author-recommended cut-offs for delta scores are 0.2 (high recall), ' +
      '0.5 (recommended) and 0.8 (high precision). These scores are ' +
      'generated by Ensembl against the MANE transcript set.',
    links: [{ href: 'https://www.ncbi.nlm.nih.gov/pubmed/30661751' }]
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

  // --- Allele frequencies ---
  gnomad_exomes: {
    description:
      'Allele frequencies from the exome sequences in the Genome Aggregation ' +
      'Database (gnomAD) v4.1.1.',
    links: [{ href: 'https://gnomad.broadinstitute.org/' }]
  },
  gnomad_genomes: {
    description:
      'Allele frequencies from the genome sequences in the Genome Aggregation ' +
      'Database (gnomAD) v4.1.1.',
    links: [{ href: 'https://gnomad.broadinstitute.org/' }]
  },
  allofus: {
    description:
      'Allele frequencies from the NIH All of Us Research Program, a diverse ' +
      'cohort of participants from across the United States.',
    links: [{ href: 'https://www.nature.com/articles/s41586-023-06957-x' }]
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
): OptionHelp | undefined => option.help ?? OPTION_HELP[option.id];
