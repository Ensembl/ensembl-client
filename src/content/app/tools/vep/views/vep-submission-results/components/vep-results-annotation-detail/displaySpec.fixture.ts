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

import type { DisplaySpec } from 'src/content/app/tools/vep/types/vepDisplaySpec';

/**
 * The `display` payload the tools API serves for human GRCh38, captured
 * verbatim from the bundled annotation spec (`vep/specs/human_grch38.json`,
 * serialised by MergedSpec.display_payload).
 *
 * Tests render against the real served document rather than a hand-made
 * stand-in, so a spec change that would break the results view breaks a test.
 *
 * Do not hand-edit: regenerate after any display-spec change with
 * `scripts/generate_display_fixture.py` in the ensembl-web-tools-api repo.
 */
export const displaySpecFixture: DisplaySpec = {
  options: [
    {
      option_id: 'hgvs',
      heading: null,
      blocks: [
        {
          heading: 'HGVS',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'group',
          blocks: [
            {
              heading: null,
              requires_selected: {
                id: 'hgvs',
                default: false
              },
              when: null,
              view: null,
              kind: 'rows',
              requires: null,
              rows: [
                {
                  key: 'c',
                  label: 'HGVSc',
                  from: 'hgvs.transcript',
                  compose: null,
                  format: null,
                  mono: true,
                  placeholder: null,
                  help: null,
                  help_link: null,
                  sub_option: null,
                  link: null
                },
                {
                  key: 'p',
                  label: 'HGVSp',
                  from: 'hgvs.protein',
                  compose: null,
                  format: null,
                  mono: true,
                  placeholder: null,
                  help: null,
                  help_link: null,
                  sub_option: null,
                  link: null
                }
              ]
            }
          ]
        }
      ]
    },
    {
      option_id: 'spdi',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'SPDI',
              from: 'spdi.spdi',
              compose: null,
              format: null,
              mono: true,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'alphamissense',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'AlphaMissense',
              from: null,
              compose: {
                format: 'with_score',
                classification: 'alphamissense.classification',
                score: 'alphamissense.score'
              },
              format: null,
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'revel',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'REVEL',
              from: 'revel.score',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'clinpred',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'ClinPred',
              from: 'clinpred.score',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'cadd',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'CADD (PHRED)',
              from: 'cadd.phred',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            },
            {
              key: null,
              label: 'CADD (RAW)',
              from: 'cadd.raw',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'spliceai',
      heading: null,
      blocks: [
        {
          heading: 'SpliceAI',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'group',
          blocks: [
            {
              heading: null,
              requires_selected: null,
              when: null,
              view: null,
              kind: 'table',
              requires: 'spliceai',
              indent: false,
              from: null,
              columns: [
                {
                  label: 'Splicing event',
                  from: null,
                  format: null,
                  mono: false,
                  sub_option: null,
                  link: null,
                  split: null,
                  link_prefix: null,
                  align: null,
                  lift_when_invariant: false
                },
                {
                  label: 'ΔS',
                  from: null,
                  format: 'num',
                  mono: false,
                  sub_option: null,
                  link: null,
                  split: null,
                  link_prefix: null,
                  align: null,
                  lift_when_invariant: false
                },
                {
                  label: 'ΔP',
                  from: null,
                  format: 'num',
                  mono: false,
                  sub_option: null,
                  link: null,
                  split: null,
                  link_prefix: null,
                  align: null,
                  lift_when_invariant: false
                }
              ],
              group_by: null,
              where: null,
              truncate: null,
              rows: [
                {
                  label: 'Acceptor gain',
                  values: [
                    'spliceai.ds_acceptor_gain',
                    'spliceai.dp_acceptor_gain'
                  ]
                },
                {
                  label: 'Acceptor loss',
                  values: [
                    'spliceai.ds_acceptor_loss',
                    'spliceai.dp_acceptor_loss'
                  ]
                },
                {
                  label: 'Donor gain',
                  values: ['spliceai.ds_donor_gain', 'spliceai.dp_donor_gain']
                },
                {
                  label: 'Donor loss',
                  values: ['spliceai.ds_donor_loss', 'spliceai.dp_donor_loss']
                }
              ]
            }
          ]
        }
      ]
    },
    {
      option_id: 'eve',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: 'eve',
              label: 'EVE',
              from: null,
              compose: {
                format: 'with_score',
                classification: 'eve.classification',
                score: 'eve.score'
              },
              format: null,
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        },
        {
          heading: 'popEVE',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: 'score',
              label: 'Score',
              from: 'popeve.score',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            },
            {
              key: 'pop',
              label: 'Population-adjusted EVE',
              from: 'popeve.pop_adjusted_eve',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            },
            {
              key: 'gap',
              label: 'Gap frequency',
              from: 'popeve.gap_frequency',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: 'Authors recommend filtering if > 0.5',
              help_link: {
                href: 'https://www.nature.com/articles/s41588-025-02400-1',
                label: 'popEVE paper'
              },
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'loeuf',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'LOEUF',
              from: 'loeuf.score',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'nmd',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'NMD',
              from: 'nmd.prediction',
              compose: null,
              format: 'humanize',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'dosage_sensitivity',
      heading: null,
      blocks: [
        {
          heading: 'Dosage sensitivity',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: 'ph',
              label: 'pHaplo',
              from: 'dosage_sensitivity.phaplo',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            },
            {
              key: 'pt',
              label: 'pTriplo',
              from: 'dosage_sensitivity.ptriplo',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'utrannotator',
      heading: null,
      blocks: [
        {
          heading: 'UTRAnnotator',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: 'cons',
              label: 'Consequence',
              from: 'utr_annotation.consequence',
              compose: null,
              format: null,
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            },
            {
              key: 'uorf',
              label: 'Existing uORFs',
              from: 'utr_annotation.existing_uorfs',
              compose: null,
              format: null,
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            },
            {
              key: 'inf',
              label: 'In-frame oORFs',
              from: 'utr_annotation.existing_inframe_oorfs',
              compose: null,
              format: null,
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            },
            {
              key: 'oof',
              label: 'Out-of-frame oORFs',
              from: 'utr_annotation.existing_outofframe_oorfs',
              compose: null,
              format: null,
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'riboseqorfs',
      heading: null,
      blocks: [
        {
          heading: 'RiboSeqORFs',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: 'id',
              label: 'ORF',
              from: 'riboseq_orfs.orf_id',
              compose: null,
              format: null,
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            },
            {
              key: 'cons',
              label: 'Consequences',
              from: 'riboseq_orfs.consequences',
              compose: null,
              format: 'join',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            },
            {
              key: 'imp',
              label: 'Impact',
              from: 'riboseq_orfs.impact',
              compose: null,
              format: null,
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'phenotypes',
      heading: null,
      blocks: [
        {
          heading: 'Phenotypes',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'group',
          blocks: [
            {
              heading: 'Gene associated',
              requires_selected: null,
              when: null,
              view: null,
              kind: 'group',
              blocks: [
                {
                  heading: null,
                  requires_selected: null,
                  when: null,
                  view: null,
                  kind: 'table',
                  requires: null,
                  indent: false,
                  from: 'phenotype_data.phenotypes',
                  columns: [
                    {
                      label: 'Phenotype',
                      from: 'phenotype',
                      format: 'phenotype',
                      mono: false,
                      sub_option: null,
                      link: null,
                      split: null,
                      link_prefix: null,
                      align: null,
                      lift_when_invariant: false
                    },
                    {
                      label: 'Source',
                      from: 'source',
                      format: 'humanize',
                      mono: false,
                      sub_option: null,
                      link: null,
                      split: null,
                      link_prefix: null,
                      align: null,
                      lift_when_invariant: false
                    }
                  ],
                  group_by: null,
                  where: {
                    field: 'type',
                    equals: 'Gene',
                    not_equals: null
                  },
                  truncate: {
                    visible_count: 3
                  },
                  rows: null
                }
              ]
            },
            {
              heading: 'Variant associated',
              requires_selected: null,
              when: null,
              view: null,
              kind: 'group',
              blocks: [
                {
                  heading: null,
                  requires_selected: null,
                  when: null,
                  view: null,
                  kind: 'table',
                  requires: null,
                  indent: false,
                  from: 'phenotype_data.phenotypes',
                  columns: [
                    {
                      label: 'Phenotype',
                      from: 'phenotype',
                      format: 'phenotype',
                      mono: false,
                      sub_option: null,
                      link: null,
                      split: null,
                      link_prefix: null,
                      align: null,
                      lift_when_invariant: false
                    },
                    {
                      label: 'Source',
                      from: 'source',
                      format: 'humanize',
                      mono: false,
                      sub_option: null,
                      link: null,
                      split: null,
                      link_prefix: null,
                      align: null,
                      lift_when_invariant: false
                    }
                  ],
                  group_by: null,
                  where: {
                    field: 'type',
                    equals: null,
                    not_equals: 'Gene'
                  },
                  truncate: {
                    visible_count: 3
                  },
                  rows: null
                },
                {
                  heading: null,
                  requires_selected: null,
                  when: null,
                  view: null,
                  kind: 'table',
                  requires: null,
                  indent: false,
                  from: 'phenotype_data.clinvar_phenotypes',
                  columns: [
                    {
                      label: 'Phenotype (ClinVar)',
                      from: 'phenotype',
                      format: 'phenotype',
                      mono: false,
                      sub_option: null,
                      link: null,
                      split: null,
                      link_prefix: null,
                      align: null,
                      lift_when_invariant: false
                    },
                    {
                      label: 'Classification',
                      from: 'clinvar_clin_sig',
                      format: 'humanize',
                      mono: false,
                      sub_option: null,
                      link: null,
                      split: null,
                      link_prefix: null,
                      align: null,
                      lift_when_invariant: false
                    }
                  ],
                  group_by: null,
                  where: null,
                  truncate: {
                    visible_count: 3
                  },
                  rows: null
                }
              ]
            }
          ]
        }
      ]
    },
    {
      option_id: 'go',
      heading: null,
      blocks: [
        {
          heading: 'Gene Ontology',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'list',
          requires: null,
          from: 'go.go_terms',
          group_by: {
            field: 'namespace',
            labels: {
              biological_process: 'Biological process',
              cellular_component: 'Cellular component',
              molecular_function: 'Molecular function'
            }
          },
          truncate: {
            visible_count: 3
          },
          item: {
            label: null,
            cells: [
              {
                label: null,
                from: 'name',
                format: null,
                mono: false,
                link: {
                  kind: 'external',
                  template: 'https://amigo.geneontology.org/amigo/term/{id}',
                  builder: null
                }
              }
            ],
            rows: null,
            link: null
          }
        }
      ]
    },
    {
      option_id: 'nearest_gene',
      heading: null,
      blocks: [
        {
          heading: 'Nearest gene',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'list',
          requires: null,
          from: 'nearest_gene.nearest_genes',
          group_by: null,
          truncate: {
            visible_count: 3
          },
          item: {
            label: null,
            cells: [
              {
                label: null,
                from: 'gene_id',
                format: null,
                mono: false,
                link: null
              },
              {
                label: null,
                from: 'distance',
                format: null,
                mono: false,
                link: null
              },
              {
                label: null,
                from: 'direction',
                format: null,
                mono: false,
                link: null
              }
            ],
            rows: null,
            link: null
          }
        }
      ]
    },
    {
      option_id: 'nearest_exon_jb',
      heading: null,
      blocks: [
        {
          heading: 'Nearest exon junction boundary',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'list',
          requires: null,
          from: 'nearest_exon_jb.boundaries',
          group_by: null,
          truncate: {
            visible_count: 3
          },
          item: {
            label: null,
            cells: null,
            rows: [
              {
                label: 'Exon',
                from: 'exon_id',
                format: null
              },
              {
                label: 'Distance to exon boundary',
                from: 'distance',
                format: null
              },
              {
                label: 'Boundary type',
                from: 'boundary_type',
                format: null
              },
              {
                label: 'Exon length',
                from: 'exon_length',
                format: null
              }
            ],
            link: null
          }
        }
      ]
    },
    {
      option_id: 'mavedb',
      heading: 'MaveDB',
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: 'variant',
              label: 'Variant',
              from: 'mavedb.protein_variant',
              compose: null,
              format: null,
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        },
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'list',
          requires: null,
          from: 'mavedb.assays',
          group_by: null,
          truncate: {
            visible_count: 3
          },
          item: {
            label: null,
            cells: [
              {
                label: null,
                from: 'urn',
                format: null,
                mono: false,
                link: {
                  kind: 'external',
                  template: 'https://www.mavedb.org/score-sets/{urn}',
                  builder: null
                }
              },
              {
                label: null,
                from: 'score',
                format: 'num',
                mono: false,
                link: null
              }
            ],
            rows: null,
            link: null
          }
        }
      ]
    },
    {
      option_id: 'mutfunc',
      heading: null,
      blocks: [
        {
          heading: 'mutfunc',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: 'motif',
              label: 'Linear motifs',
              from: 'mutfunc.linear_motifs',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: {
                id: 'mutfunc_motif',
                default: true
              },
              link: null
            },
            {
              key: 'int',
              label: 'Protein interactions',
              from: 'mutfunc.protein_interactions',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: {
                id: 'mutfunc_int',
                default: true
              },
              link: null
            },
            {
              key: 'mod',
              label: 'Protein structure',
              from: 'mutfunc.protein_structure',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: {
                id: 'mutfunc_mod',
                default: true
              },
              link: null
            },
            {
              key: 'exp',
              label: 'Protein structure (exp.)',
              from: 'mutfunc.protein_structure_experimental',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: {
                id: 'mutfunc_exp',
                default: true
              },
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'opentargets',
      heading: 'OpenTargets',
      blocks: [
        {
          heading: 'Variant link',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: 'opentargets',
          rows: [
            {
              key: null,
              label: '',
              from: null,
              compose: null,
              format: null,
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: {
                kind: 'external',
                template: null,
                builder: 'opentargets_variant'
              }
            }
          ]
        },
        {
          heading: 'GWAS gene associations',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'table',
          requires: null,
          indent: false,
          from: 'opentargets.gwas_associations',
          columns: [
            {
              label: 'Disease association',
              from: 'disease_label',
              format: null,
              mono: false,
              sub_option: null,
              link: null,
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: false
            },
            {
              label: 'Target Gene',
              from: 'gene_id',
              format: null,
              mono: true,
              sub_option: null,
              link: null,
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: false
            },
            {
              label: 'Lead variant p-value',
              from: 'p_value',
              format: null,
              mono: false,
              sub_option: null,
              link: null,
              split: null,
              link_prefix: null,
              align: 'right',
              lift_when_invariant: false
            },
            {
              label: 'beta',
              from: 'beta',
              format: 'num',
              mono: false,
              sub_option: null,
              link: null,
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: false
            },
            {
              label: 'Locus to Gene (L2G) Score',
              from: 'l2g_score',
              format: 'num',
              mono: false,
              sub_option: null,
              link: null,
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: false
            }
          ],
          group_by: null,
          where: null,
          truncate: {
            visible_count: 3
          },
          rows: null
        },
        {
          heading: 'QTL gene associations',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'table',
          requires: null,
          indent: false,
          from: 'opentargets.qtl_associations',
          columns: [
            {
              label: 'BioSample',
              from: 'biosample',
              format: null,
              mono: false,
              sub_option: null,
              link: null,
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: false
            },
            {
              label: 'Target Gene',
              from: 'gene_id',
              format: null,
              mono: true,
              sub_option: null,
              link: null,
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: false
            },
            {
              label: 'Lead variant p-value',
              from: 'p_value',
              format: null,
              mono: false,
              sub_option: null,
              link: null,
              split: null,
              link_prefix: null,
              align: 'right',
              lift_when_invariant: false
            },
            {
              label: 'beta',
              from: 'beta',
              format: 'num',
              mono: false,
              sub_option: null,
              link: null,
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: false
            }
          ],
          group_by: null,
          where: null,
          truncate: {
            visible_count: 3
          },
          rows: null
        }
      ]
    },
    {
      option_id: 'clinvar',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: {
            id: 'clinvar_short',
            default: true
          },
          when: null,
          view: null,
          kind: 'group',
          blocks: [
            {
              heading: null,
              requires_selected: null,
              when: null,
              view: null,
              kind: 'rows',
              requires: null,
              rows: [
                {
                  key: null,
                  label: 'ClinVar variant ID',
                  from: 'clinvar.id',
                  compose: null,
                  format: null,
                  mono: false,
                  placeholder: null,
                  help: null,
                  help_link: null,
                  sub_option: null,
                  link: {
                    kind: 'external',
                    template:
                      'https://www.ncbi.nlm.nih.gov/clinvar/variation/{value}/',
                    builder: null
                  }
                }
              ]
            },
            {
              heading: null,
              requires_selected: null,
              when: null,
              view: null,
              kind: 'rows',
              requires: null,
              rows: [
                {
                  key: null,
                  label: 'Clinical significance',
                  from: 'clinvar.significance',
                  compose: null,
                  format: 'humanize_join',
                  mono: false,
                  placeholder: null,
                  help: null,
                  help_link: null,
                  sub_option: null,
                  link: null
                }
              ]
            },
            {
              heading: null,
              requires_selected: null,
              when: {
                present: 'clinvar.conflicting_breakdown',
                empty: null
              },
              view: null,
              kind: 'table',
              requires: null,
              indent: true,
              from: 'clinvar.conflicting_breakdown',
              columns: [
                {
                  label: 'Classification',
                  from: 'significance',
                  format: 'humanize',
                  mono: false,
                  sub_option: null,
                  link: null,
                  split: null,
                  link_prefix: null,
                  align: null,
                  lift_when_invariant: false
                },
                {
                  label: 'Submitters reporting',
                  from: 'count',
                  format: 'num',
                  mono: false,
                  sub_option: null,
                  link: null,
                  split: null,
                  link_prefix: null,
                  align: null,
                  lift_when_invariant: false
                }
              ],
              group_by: null,
              where: null,
              truncate: {
                visible_count: 3
              },
              rows: null
            }
          ]
        },
        {
          heading: 'Structural variant',
          requires_selected: {
            id: 'clinvar_sv',
            default: false
          },
          when: null,
          view: null,
          kind: 'group',
          blocks: [
            {
              heading: null,
              requires_selected: null,
              when: null,
              view: null,
              kind: 'rows',
              requires: 'clinvar_sv',
              rows: [
                {
                  key: null,
                  label: 'Clinical significance',
                  from: 'clinvar_sv.significance',
                  compose: null,
                  format: 'humanize_join',
                  mono: false,
                  placeholder: null,
                  help: null,
                  help_link: null,
                  sub_option: null,
                  link: null
                },
                {
                  key: null,
                  label: 'Origin',
                  from: 'clinvar_sv.origin',
                  compose: null,
                  format: 'humanize_join',
                  mono: false,
                  placeholder: null,
                  help: null,
                  help_link: null,
                  sub_option: null,
                  link: null
                }
              ]
            }
          ]
        }
      ]
    },
    {
      option_id: 'protvar',
      heading: 'ProtVar',
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'Protein Structure Stability',
              from: 'protvar.structure_stability_score',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: {
                id: 'protvar_stability',
                default: true
              },
              link: {
                kind: 'external',
                template: null,
                builder: 'protvar'
              }
            }
          ]
        },
        {
          heading: 'Protein Pockets',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'list',
          requires: null,
          from: 'protvar.pockets',
          group_by: null,
          truncate: {
            visible_count: 3
          },
          item: {
            label: {
              from: null,
              template: 'Pocket {pocket_id}',
              format: null,
              wrap: null
            },
            cells: [
              {
                label: null,
                from: 'score',
                format: 'num',
                mono: false,
                link: null
              }
            ],
            rows: null,
            link: {
              kind: 'external',
              template: null,
              builder: 'protvar'
            }
          }
        },
        {
          heading: null,
          requires_selected: null,
          when: {
            present: null,
            empty: 'protvar.pockets'
          },
          view: 'show_all',
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'Protein Pockets',
              from: 'protvar.pockets',
              compose: null,
              format: 'count',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: {
                id: 'protvar_pocket',
                default: true
              },
              link: null
            }
          ]
        },
        {
          heading: 'Protein-Protein Interaction Interface',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'list',
          requires: null,
          from: 'protvar.interaction_interfaces',
          group_by: null,
          truncate: {
            visible_count: 3
          },
          item: {
            label: {
              from: null,
              template: 'Interface {partner}',
              format: null,
              wrap: null
            },
            cells: [
              {
                label: null,
                from: 'score',
                format: 'num',
                mono: false,
                link: null
              }
            ],
            rows: null,
            link: {
              kind: 'external',
              template: null,
              builder: 'protvar'
            }
          }
        },
        {
          heading: null,
          requires_selected: null,
          when: {
            present: null,
            empty: 'protvar.interaction_interfaces'
          },
          view: 'show_all',
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'Protein-Protein Interaction Interface',
              from: 'protvar.interaction_interfaces',
              compose: null,
              format: 'count',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: {
                id: 'protvar_int',
                default: true
              },
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'protein',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'Protein ID',
              from: 'protein.ensembl_protein_id',
              compose: null,
              format: null,
              mono: true,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: {
                kind: 'app_popup',
                template: null,
                builder: 'protein_popup'
              }
            }
          ]
        }
      ]
    },
    {
      option_id: 'intact',
      heading: null,
      blocks: [
        {
          heading: 'IntAct',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'table',
          requires: null,
          indent: false,
          from: 'intact.interactions',
          columns: [
            {
              label: 'Interaction AC',
              from: 'interaction_ac',
              format: null,
              mono: false,
              sub_option: null,
              link: {
                kind: 'external',
                template:
                  'https://www.ebi.ac.uk/intact/details/interaction/{value}',
                builder: null
              },
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: false
            },
            {
              label: 'Feature Type',
              from: 'feature_type',
              format: null,
              mono: false,
              sub_option: null,
              link: null,
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: false
            },
            {
              label: 'Interaction Participants',
              from: 'interaction_participants',
              format: null,
              mono: false,
              sub_option: {
                id: 'intact_interaction_participants',
                default: false
              },
              link: {
                kind: 'external',
                template: 'https://www.uniprot.org/uniprotkb/{value}/entry',
                builder: null
              },
              split: '_and_',
              link_prefix: 'uniprotkb:',
              align: null,
              lift_when_invariant: false
            },
            {
              label: 'Feature short label',
              from: 'feature_short_label',
              format: null,
              mono: false,
              sub_option: {
                id: 'intact_feature_short_label',
                default: false
              },
              link: null,
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: true
            },
            {
              label: 'Affected Protein',
              from: 'ap_ac',
              format: null,
              mono: false,
              sub_option: {
                id: 'intact_ap_ac',
                default: false
              },
              link: {
                kind: 'external',
                template: 'https://www.uniprot.org/uniprotkb/{value}/entry',
                builder: null
              },
              split: null,
              link_prefix: 'uniprotkb:',
              align: null,
              lift_when_invariant: true
            },
            {
              label: 'PubMed Links',
              from: 'pmid',
              format: null,
              mono: false,
              sub_option: {
                id: 'intact_pmid',
                default: false
              },
              link: {
                kind: 'external',
                template: 'http://europepmc.org/abstract/MED/{value}',
                builder: null
              },
              split: null,
              link_prefix: null,
              align: null,
              lift_when_invariant: false
            }
          ],
          group_by: null,
          where: null,
          truncate: {
            visible_count: 3
          },
          rows: null
        }
      ]
    },
    {
      option_id: 'gencode_promoters',
      heading: null,
      blocks: [
        {
          heading: 'GENCODE promoter',
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: null,
              label: 'Region',
              from: 'gencode_promoter.region',
              compose: null,
              format: null,
              mono: true,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            },
            {
              key: null,
              label: 'Feature ID',
              from: 'gencode_promoter.feature_id',
              compose: null,
              format: null,
              mono: true,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    },
    {
      option_id: 'tss_distance',
      heading: null,
      blocks: [
        {
          heading: null,
          requires_selected: null,
          when: null,
          view: null,
          kind: 'rows',
          requires: null,
          rows: [
            {
              key: 'tss_distance',
              label: 'Distance to TSS',
              from: 'tss_distance.distance',
              compose: null,
              format: 'num',
              mono: false,
              placeholder: null,
              help: null,
              help_link: null,
              sub_option: null,
              link: null
            }
          ]
        }
      ]
    }
  ],
  plugin_scopes: {
    mutfunc: 'transcript',
    mavedb: 'transcript',
    protvar: 'transcript',
    clinvar: 'allele',
    clinvar_sv: 'allele',
    gencode_promoter: 'allele',
    gnomad_exomes: 'allele',
    gnomad_genomes: 'allele',
    all_of_us: 'allele',
    gnomad_sv: 'allele',
    gnomad_cnv: 'allele',
    opentargets: 'allele',
    go: 'transcript',
    nearest_gene: 'allele',
    nearest_exon_jb: 'transcript',
    spliceai: 'transcript',
    riboseq_orfs: 'transcript',
    hgvs: 'transcript',
    phenotype_data: 'allele',
    dosage_sensitivity: 'transcript',
    intact: 'transcript',
    popeve: 'transcript',
    revel: 'transcript',
    clinpred: 'transcript',
    alphamissense: 'transcript',
    cadd: 'allele',
    eve: 'transcript',
    utr_annotation: 'transcript',
    loeuf: 'transcript',
    nmd: 'transcript',
    spdi: 'allele',
    protein: 'transcript',
    hgvsg: 'allele',
    tss_distance: 'transcript'
  }
};
