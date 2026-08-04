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
      blocks: [
        {
          heading: 'HGVS',
          kind: 'group',
          blocks: [
            {
              requires_selected: {
                id: 'hgvs',
                default: false
              },
              kind: 'rows',
              rows: [
                {
                  key: 'c',
                  label: 'HGVSc',
                  from: 'hgvs.transcript',
                  mono: true
                },
                {
                  key: 'p',
                  label: 'HGVSp',
                  from: 'hgvs.protein',
                  mono: true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      option_id: 'spdi',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              label: 'SPDI',
              from: 'spdi.spdi',
              mono: true
            }
          ]
        }
      ]
    },
    {
      option_id: 'alphamissense',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              label: 'AlphaMissense',
              compose: {
                format: 'with_score',
                classification: 'alphamissense.classification',
                score: 'alphamissense.score'
              },
              mono: false
            }
          ]
        }
      ]
    },
    {
      option_id: 'revel',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              label: 'REVEL',
              from: 'revel.score',
              format: 'num',
              mono: false
            }
          ]
        }
      ]
    },
    {
      option_id: 'clinpred',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              label: 'ClinPred',
              from: 'clinpred.score',
              format: 'num',
              mono: false
            }
          ]
        }
      ]
    },
    {
      option_id: 'cadd',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              label: 'CADD (PHRED)',
              from: 'cadd.phred',
              format: 'num',
              mono: false
            },
            {
              label: 'CADD (RAW)',
              from: 'cadd.raw',
              format: 'num',
              mono: false
            }
          ]
        }
      ]
    },
    {
      option_id: 'spliceai',
      blocks: [
        {
          heading: 'SpliceAI',
          kind: 'group',
          blocks: [
            {
              kind: 'table',
              requires: 'spliceai',
              indent: false,
              columns: [
                {
                  mono: false,
                  nowrap: false,
                  label: 'Splicing event',
                  lift_when_invariant: false
                },
                {
                  format: 'num',
                  mono: false,
                  nowrap: false,
                  label: 'ΔS',
                  lift_when_invariant: false
                },
                {
                  format: 'num',
                  mono: false,
                  nowrap: false,
                  label: 'ΔP',
                  lift_when_invariant: false
                }
              ],
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
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              key: 'eve',
              label: 'EVE',
              compose: {
                format: 'with_score',
                classification: 'eve.classification',
                score: 'eve.score'
              },
              mono: false
            }
          ]
        },
        {
          heading: 'popEVE',
          kind: 'rows',
          rows: [
            {
              key: 'score',
              label: 'Score',
              from: 'popeve.score',
              format: 'num',
              mono: false
            },
            {
              key: 'pop',
              label: 'Population-adjusted EVE',
              from: 'popeve.pop_adjusted_eve',
              format: 'num',
              mono: false
            },
            {
              key: 'gap',
              label: 'Gap frequency',
              from: 'popeve.gap_frequency',
              format: 'num',
              mono: false,
              help: 'Authors recommend filtering if > 0.5',
              help_link: {
                href: 'https://www.nature.com/articles/s41588-025-02400-1',
                label: 'popEVE paper'
              }
            }
          ]
        }
      ]
    },
    {
      option_id: 'gerp',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              label: 'GERP conservation score',
              from: 'gerp.score',
              format: 'num',
              mono: false
            }
          ]
        }
      ]
    },
    {
      option_id: 'loeuf',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              label: 'LOEUF',
              from: 'loeuf.score',
              format: 'num',
              mono: false
            }
          ]
        }
      ]
    },
    {
      option_id: 'nmd',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              label: 'NMD',
              from: 'nmd.prediction',
              format: 'humanize',
              mono: false
            }
          ]
        }
      ]
    },
    {
      option_id: 'dosage_sensitivity',
      blocks: [
        {
          heading: 'Dosage sensitivity',
          kind: 'rows',
          rows: [
            {
              key: 'ph',
              label: 'pHaplo',
              from: 'dosage_sensitivity.phaplo',
              format: 'num',
              mono: false
            },
            {
              key: 'pt',
              label: 'pTriplo',
              from: 'dosage_sensitivity.ptriplo',
              format: 'num',
              mono: false
            }
          ]
        }
      ]
    },
    {
      option_id: 'utrannotator',
      blocks: [
        {
          heading: 'UTRAnnotator',
          kind: 'rows',
          rows: [
            {
              key: 'cons',
              label: 'Consequence',
              from: 'utr_annotation.consequence',
              mono: false
            },
            {
              key: 'uorf',
              label: 'Existing uORFs',
              from: 'utr_annotation.existing_uorfs',
              mono: false
            },
            {
              key: 'inf',
              label: 'In-frame oORFs',
              from: 'utr_annotation.existing_inframe_oorfs',
              mono: false
            },
            {
              key: 'oof',
              label: 'Out-of-frame oORFs',
              from: 'utr_annotation.existing_outofframe_oorfs',
              mono: false
            }
          ]
        }
      ]
    },
    {
      option_id: 'riboseqorfs',
      blocks: [
        {
          heading: 'RiboSeqORFs',
          kind: 'rows',
          rows: [
            {
              key: 'id',
              label: 'ORF',
              from: 'riboseq_orfs.orf_id',
              mono: false
            },
            {
              key: 'cons',
              label: 'Consequences',
              from: 'riboseq_orfs.consequences',
              format: 'join',
              mono: false
            },
            {
              key: 'imp',
              label: 'Impact',
              from: 'riboseq_orfs.impact',
              mono: false
            }
          ]
        }
      ]
    },
    {
      option_id: 'phenotypes',
      blocks: [
        {
          heading: 'Phenotypes',
          kind: 'group',
          blocks: [
            {
              heading: 'Gene associated',
              kind: 'group',
              blocks: [
                {
                  kind: 'table',
                  indent: false,
                  from: 'phenotype_data.phenotypes',
                  columns: [
                    {
                      from: 'phenotype',
                      format: 'phenotype',
                      mono: false,
                      nowrap: false,
                      label: 'Phenotype',
                      lift_when_invariant: false
                    },
                    {
                      from: 'source',
                      format: 'humanize',
                      mono: false,
                      nowrap: false,
                      label: 'Source',
                      lift_when_invariant: false
                    }
                  ],
                  where: {
                    field: 'type',
                    equals: 'Gene'
                  },
                  truncate: {
                    visible_count: 3
                  }
                }
              ]
            },
            {
              heading: 'Variant associated',
              kind: 'group',
              blocks: [
                {
                  kind: 'table',
                  indent: false,
                  from: 'phenotype_data.phenotypes',
                  columns: [
                    {
                      from: 'phenotype',
                      format: 'phenotype',
                      mono: false,
                      nowrap: false,
                      label: 'Phenotype',
                      lift_when_invariant: false
                    },
                    {
                      from: 'source',
                      format: 'humanize',
                      mono: false,
                      nowrap: false,
                      label: 'Source',
                      lift_when_invariant: false
                    }
                  ],
                  where: {
                    field: 'type',
                    not_equals: 'Gene'
                  },
                  truncate: {
                    visible_count: 3
                  }
                }
              ]
            }
          ]
        },
        {
          heading: 'ClinVar',
          when: {
            present: 'clinvar.classification_summary'
          },
          kind: 'group',
          blocks: [
            {
              kind: 'rows',
              rows: [
                {
                  label: 'ClinVar variant ID',
                  from: 'clinvar.id',
                  mono: false,
                  link: {
                    kind: 'external',
                    template:
                      'https://www.ncbi.nlm.nih.gov/clinvar/variation/{value}/'
                  }
                },
                {
                  label: 'Classification',
                  from: 'clinvar.classification_summary',
                  mono: false,
                  help: "For more detail regarding ClinVar's calculation of review status see",
                  help_link: {
                    href: 'https://www.ncbi.nlm.nih.gov/clinvar/docs/review_status/',
                    label: 'ClinVar review status'
                  },
                  item: {
                    cells: [
                      {
                        from: 'type',
                        mono: false,
                        labels: {
                          SomaticClinicalImpact: 'Somatic Clinical Impact'
                        },
                        nowrap: true
                      },
                      {
                        from: 'classification',
                        format: 'humanize_terms',
                        mono: false,
                        stars_from: 'rating_scale',
                        stars_of: 'review_status',
                        nowrap: false
                      },
                      {
                        from: 'review_status',
                        format: 'humanize',
                        mono: false,
                        nowrap: false
                      },
                      {
                        from: 'supporting',
                        mono: false,
                        template:
                          '{supporting}/{submissions} submission(s) contribute to aggregate classification',
                        nowrap: false
                      }
                    ]
                  },
                  where: {
                    field: 'type',
                    equals: 'Germline'
                  }
                }
              ]
            },
            {
              when: {
                present: 'clinvar.conditions'
              },
              kind: 'table',
              indent: true,
              from: 'clinvar.conditions',
              columns: [
                {
                  from: 'classifications',
                  mono: false,
                  nowrap: false,
                  label: 'Classification',
                  notes: [
                    {
                      text: 'Submissions not contributing to the aggregate classification shown in light text',
                      muted: true
                    }
                  ],
                  items: {
                    from: 'classification',
                    format: 'humanize',
                    mono: false,
                    nowrap: false,
                    count_from: 'count',
                    expand: {
                      from: 'submitters',
                      cells: [
                        {
                          from: 'submitter',
                          format: 'humanize',
                          mono: false,
                          nowrap: false
                        },
                        {
                          from: 'date_last_evaluated',
                          mono: false,
                          nowrap: false
                        },
                        {
                          from: 'review_status',
                          format: 'humanize',
                          mono: false,
                          stars: 'clinvar_submission',
                          nowrap: false
                        },
                        {
                          from: 'pmid',
                          mono: false,
                          link: {
                            kind: 'external',
                            template:
                              'https://europepmc.org/article/MED/{value}'
                          },
                          split: '+',
                          nowrap: true
                        }
                      ],
                      emphasis: {
                        field: 'contributes',
                        equals: '1'
                      }
                    }
                  },
                  lift_when_invariant: false
                },
                {
                  from: 'names',
                  mono: false,
                  nowrap: false,
                  label: 'Condition',
                  items: {
                    from: 'name',
                    format: 'phenotype',
                    mono: false,
                    link: {
                      kind: 'external',
                      template: '{value}'
                    },
                    link_from: 'id_url',
                    nowrap: false
                  },
                  lift_when_invariant: false
                },
                {
                  from: 'records',
                  mono: false,
                  nowrap: false,
                  label: 'ClinVar record',
                  items: {
                    from: 'rcv',
                    mono: false,
                    link: {
                      kind: 'external',
                      template: 'https://www.ncbi.nlm.nih.gov/clinvar/{value}/'
                    },
                    nowrap: true
                  },
                  lift_when_invariant: false
                }
              ],
              where: {
                field: 'type',
                equals: 'Germline'
              },
              truncate: {
                visible_count: 3
              }
            },
            {
              kind: 'rows',
              rows: [
                {
                  from: 'clinvar.classification_summary',
                  mono: false,
                  item: {
                    cells: [
                      {
                        from: 'type',
                        mono: false,
                        labels: {
                          SomaticClinicalImpact: 'Somatic Clinical Impact'
                        },
                        nowrap: true
                      },
                      {
                        from: 'classification',
                        format: 'humanize_terms',
                        mono: false,
                        stars_from: 'rating_scale',
                        stars_of: 'review_status',
                        nowrap: false
                      },
                      {
                        from: 'review_status',
                        format: 'humanize',
                        mono: false,
                        nowrap: false
                      },
                      {
                        from: 'supporting',
                        mono: false,
                        template:
                          '{supporting}/{submissions} submission(s) contribute to aggregate classification',
                        nowrap: false
                      }
                    ]
                  },
                  where: {
                    field: 'type',
                    not_equals: 'Germline'
                  }
                }
              ]
            },
            {
              when: {
                present: 'clinvar.conditions'
              },
              kind: 'table',
              indent: true,
              from: 'clinvar.conditions',
              columns: [
                {
                  from: 'classifications',
                  mono: false,
                  nowrap: false,
                  label: 'Classification',
                  notes: [
                    {
                      text: 'Submissions not contributing to the aggregate classification shown in light text',
                      muted: true
                    }
                  ],
                  items: {
                    from: 'classification',
                    format: 'humanize',
                    mono: false,
                    nowrap: false,
                    count_from: 'count',
                    expand: {
                      from: 'submitters',
                      cells: [
                        {
                          from: 'submitter',
                          format: 'humanize',
                          mono: false,
                          nowrap: false
                        },
                        {
                          from: 'date_last_evaluated',
                          mono: false,
                          nowrap: false
                        },
                        {
                          from: 'review_status',
                          format: 'humanize',
                          mono: false,
                          stars: 'clinvar_submission',
                          nowrap: false
                        },
                        {
                          from: 'pmid',
                          mono: false,
                          link: {
                            kind: 'external',
                            template:
                              'https://europepmc.org/article/MED/{value}'
                          },
                          split: '+',
                          nowrap: true
                        }
                      ],
                      emphasis: {
                        field: 'contributes',
                        equals: '1'
                      }
                    }
                  },
                  lift_when_invariant: false
                },
                {
                  from: 'names',
                  mono: false,
                  nowrap: false,
                  label: 'Condition',
                  items: {
                    from: 'name',
                    format: 'phenotype',
                    mono: false,
                    link: {
                      kind: 'external',
                      template: '{value}'
                    },
                    link_from: 'id_url',
                    nowrap: false
                  },
                  lift_when_invariant: false
                },
                {
                  from: 'records',
                  mono: false,
                  nowrap: false,
                  label: 'ClinVar record',
                  items: {
                    from: 'rcv',
                    mono: false,
                    link: {
                      kind: 'external',
                      template: 'https://www.ncbi.nlm.nih.gov/clinvar/{value}/'
                    },
                    nowrap: true
                  },
                  lift_when_invariant: false
                }
              ],
              where: {
                field: 'type',
                not_equals: 'Germline'
              },
              truncate: {
                visible_count: 3
              }
            }
          ]
        }
      ]
    },
    {
      option_id: 'go',
      blocks: [
        {
          heading: 'Gene Ontology',
          kind: 'list',
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
            cells: [
              {
                from: 'name',
                mono: false,
                link: {
                  kind: 'external',
                  template: 'https://amigo.geneontology.org/amigo/term/{id}'
                },
                nowrap: false
              }
            ]
          }
        }
      ]
    },
    {
      option_id: 'nearest_gene',
      blocks: [
        {
          heading: 'Nearest gene',
          kind: 'list',
          from: 'nearest_gene.nearest_genes',
          truncate: {
            visible_count: 3
          },
          item: {
            cells: [
              {
                from: 'gene_id',
                mono: false,
                nowrap: false
              },
              {
                from: 'distance',
                mono: false,
                nowrap: false
              },
              {
                from: 'direction',
                mono: false,
                nowrap: false
              }
            ]
          }
        }
      ]
    },
    {
      option_id: 'nearest_exon_jb',
      blocks: [
        {
          heading: 'Nearest exon junction boundary',
          kind: 'list',
          from: 'nearest_exon_jb.boundaries',
          truncate: {
            visible_count: 3
          },
          item: {
            rows: [
              {
                label: 'Exon',
                from: 'exon_id'
              },
              {
                label: 'Distance to exon boundary',
                from: 'distance'
              },
              {
                label: 'Boundary type',
                from: 'boundary_type'
              },
              {
                label: 'Exon length',
                from: 'exon_length'
              }
            ]
          }
        }
      ]
    },
    {
      option_id: 'mavedb',
      heading: 'MaveDB',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              key: 'variant',
              label: 'Variant',
              from: 'mavedb.protein_variant',
              mono: false
            }
          ]
        },
        {
          kind: 'list',
          from: 'mavedb.assays',
          truncate: {
            visible_count: 3
          },
          item: {
            cells: [
              {
                from: 'urn',
                mono: false,
                link: {
                  kind: 'external',
                  template: 'https://www.mavedb.org/score-sets/{urn}'
                },
                nowrap: false
              },
              {
                from: 'score',
                format: 'num',
                mono: false,
                nowrap: false
              }
            ]
          }
        }
      ]
    },
    {
      option_id: 'mutfunc',
      blocks: [
        {
          heading: 'mutfunc',
          kind: 'rows',
          rows: [
            {
              key: 'motif',
              label: 'Linear motifs',
              from: 'mutfunc.linear_motifs',
              format: 'num',
              mono: false,
              sub_option: {
                id: 'mutfunc_motif',
                default: true
              }
            },
            {
              key: 'int',
              label: 'Protein interactions',
              from: 'mutfunc.protein_interactions',
              format: 'num',
              mono: false,
              sub_option: {
                id: 'mutfunc_int',
                default: true
              }
            },
            {
              key: 'mod',
              label: 'Protein structure',
              from: 'mutfunc.protein_structure',
              format: 'num',
              mono: false,
              sub_option: {
                id: 'mutfunc_mod',
                default: true
              }
            },
            {
              key: 'exp',
              label: 'Protein structure (exp.)',
              from: 'mutfunc.protein_structure_experimental',
              format: 'num',
              mono: false,
              sub_option: {
                id: 'mutfunc_exp',
                default: true
              }
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
          kind: 'rows',
          requires: 'opentargets',
          rows: [
            {
              label: '',
              mono: false,
              link: {
                kind: 'external',
                builder: 'opentargets_variant'
              }
            }
          ]
        },
        {
          heading: 'GWAS gene associations',
          kind: 'table',
          indent: false,
          from: 'opentargets.gwas_associations',
          columns: [
            {
              from: 'disease_label',
              mono: false,
              nowrap: false,
              label: 'Disease association',
              lift_when_invariant: false
            },
            {
              from: 'gene_id',
              mono: true,
              nowrap: false,
              label: 'Target Gene',
              lift_when_invariant: false
            },
            {
              from: 'p_value',
              mono: false,
              nowrap: false,
              label: 'Lead variant p-value',
              align: 'right',
              lift_when_invariant: false
            },
            {
              from: 'beta',
              format: 'num',
              mono: false,
              nowrap: false,
              label: 'beta',
              lift_when_invariant: false
            },
            {
              from: 'l2g_score',
              format: 'num',
              mono: false,
              nowrap: false,
              label: 'Locus to Gene (L2G) Score',
              lift_when_invariant: false
            }
          ],
          truncate: {
            visible_count: 3
          }
        },
        {
          heading: 'QTL gene associations',
          kind: 'table',
          indent: false,
          from: 'opentargets.qtl_associations',
          columns: [
            {
              from: 'biosample',
              mono: false,
              nowrap: false,
              label: 'BioSample',
              lift_when_invariant: false
            },
            {
              from: 'gene_id',
              mono: true,
              nowrap: false,
              label: 'Target Gene',
              lift_when_invariant: false
            },
            {
              from: 'p_value',
              mono: false,
              nowrap: false,
              label: 'Lead variant p-value',
              align: 'right',
              lift_when_invariant: false
            },
            {
              from: 'beta',
              format: 'num',
              mono: false,
              nowrap: false,
              label: 'beta',
              lift_when_invariant: false
            }
          ],
          truncate: {
            visible_count: 3
          }
        }
      ]
    },
    {
      option_id: 'clinvar',
      blocks: [
        {
          heading: 'Structural variant',
          requires_selected: {
            id: 'clinvar_sv',
            default: false
          },
          kind: 'group',
          blocks: [
            {
              kind: 'rows',
              requires: 'clinvar_sv',
              rows: [
                {
                  label: 'Clinical significance',
                  from: 'clinvar_sv.significance',
                  format: 'humanize_join',
                  mono: false
                },
                {
                  label: 'Origin',
                  from: 'clinvar_sv.origin',
                  format: 'humanize_join',
                  mono: false
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
          kind: 'rows',
          rows: [
            {
              label: 'Protein Structure Stability',
              from: 'protvar.structure_stability_score',
              format: 'num',
              mono: false,
              sub_option: {
                id: 'protvar_stability',
                default: true
              },
              link: {
                kind: 'external',
                builder: 'protvar'
              }
            }
          ]
        },
        {
          heading: 'Protein Pockets',
          kind: 'list',
          from: 'protvar.pockets',
          truncate: {
            visible_count: 3
          },
          item: {
            label: {
              template: 'Pocket {pocket_id}'
            },
            cells: [
              {
                from: 'score',
                format: 'num',
                mono: false,
                nowrap: false
              }
            ],
            link: {
              kind: 'external',
              builder: 'protvar'
            }
          }
        },
        {
          when: {
            empty: 'protvar.pockets'
          },
          view: 'show_all',
          kind: 'rows',
          rows: [
            {
              label: 'Protein Pockets',
              from: 'protvar.pockets',
              format: 'count',
              mono: false,
              sub_option: {
                id: 'protvar_pocket',
                default: true
              }
            }
          ]
        },
        {
          heading: 'Protein-Protein Interaction Interface',
          kind: 'list',
          from: 'protvar.interaction_interfaces',
          truncate: {
            visible_count: 3
          },
          item: {
            label: {
              template: 'Interface {partner}'
            },
            cells: [
              {
                from: 'score',
                format: 'num',
                mono: false,
                nowrap: false
              }
            ],
            link: {
              kind: 'external',
              builder: 'protvar'
            }
          }
        },
        {
          when: {
            empty: 'protvar.interaction_interfaces'
          },
          view: 'show_all',
          kind: 'rows',
          rows: [
            {
              label: 'Protein-Protein Interaction Interface',
              from: 'protvar.interaction_interfaces',
              format: 'count',
              mono: false,
              sub_option: {
                id: 'protvar_int',
                default: true
              }
            }
          ]
        }
      ]
    },
    {
      option_id: 'protein',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              label: 'Protein ID',
              from: 'protein.ensembl_protein_id',
              mono: true,
              link: {
                kind: 'app_popup',
                builder: 'protein_popup'
              }
            }
          ]
        }
      ]
    },
    {
      option_id: 'intact',
      blocks: [
        {
          heading: 'IntAct',
          kind: 'table',
          indent: false,
          from: 'intact.interactions',
          columns: [
            {
              from: 'interaction_ac',
              mono: false,
              link: {
                kind: 'external',
                template:
                  'https://www.ebi.ac.uk/intact/details/interaction/{value}'
              },
              nowrap: false,
              label: 'Interaction AC',
              lift_when_invariant: false
            },
            {
              from: 'feature_type',
              mono: false,
              nowrap: false,
              label: 'Feature Type',
              lift_when_invariant: false
            },
            {
              from: 'interaction_participants',
              mono: false,
              link: {
                kind: 'external',
                template: 'https://www.uniprot.org/uniprotkb/{value}/entry'
              },
              split: '_and_',
              link_prefix: 'uniprotkb:',
              nowrap: false,
              label: 'Interaction Participants',
              sub_option: {
                id: 'intact_interaction_participants',
                default: false
              },
              lift_when_invariant: false
            },
            {
              from: 'feature_short_label',
              mono: false,
              nowrap: false,
              label: 'Feature short label',
              sub_option: {
                id: 'intact_feature_short_label',
                default: false
              },
              lift_when_invariant: true
            },
            {
              from: 'ap_ac',
              mono: false,
              link: {
                kind: 'external',
                template: 'https://www.uniprot.org/uniprotkb/{value}/entry'
              },
              link_prefix: 'uniprotkb:',
              nowrap: false,
              label: 'Affected Protein',
              sub_option: {
                id: 'intact_ap_ac',
                default: false
              },
              lift_when_invariant: true
            },
            {
              from: 'pmid',
              mono: false,
              link: {
                kind: 'external',
                template: 'https://europepmc.org/article/MED/{value}'
              },
              nowrap: false,
              label: 'PubMed Links',
              sub_option: {
                id: 'intact_pmid',
                default: false
              },
              lift_when_invariant: false
            }
          ],
          truncate: {
            visible_count: 3
          }
        }
      ]
    },
    {
      option_id: 'gencode_promoters',
      blocks: [
        {
          heading: 'GENCODE promoter',
          kind: 'rows',
          rows: [
            {
              label: 'Region',
              from: 'gencode_promoter.region',
              mono: true
            },
            {
              label: 'Feature ID',
              from: 'gencode_promoter.feature_id',
              mono: true
            }
          ]
        }
      ]
    },
    {
      option_id: 'tss_distance',
      blocks: [
        {
          kind: 'rows',
          rows: [
            {
              key: 'tss_distance',
              label: 'Distance to TSS',
              from: 'tss_distance.distance',
              format: 'num',
              mono: false
            }
          ]
        }
      ]
    }
  ],
  rating_scales: {
    clinvar_aggregate: {
      out_of: 4,
      ratings: {
        'practice guideline': 4,
        'reviewed by expert panel': 3,
        'criteria provided, multiple submitters, no conflicts': 2,
        'criteria provided, conflicting classifications': 1,
        'criteria provided, single submitter': 1,
        'no assertion criteria provided': 0,
        'no classification provided': 0,
        'no classification for the individual variant': 0
      }
    },
    clinvar_submission: {
      out_of: 4,
      ratings: {
        'practice guideline': 4,
        'reviewed by expert panel': 3,
        'criteria provided, single submitter': 1,
        'no assertion criteria provided': 0,
        'no classification provided': 0
      }
    },
    clinvar_somatic: {
      out_of: 4,
      ratings: {
        'practice guideline': 4,
        'reviewed by expert panel': 3,
        'criteria provided, multiple submitters': 2,
        'criteria provided, single submitter': 1,
        'no assertion criteria provided': 0,
        'no classification provided': 0,
        'no classification for the individual variant': 0
      }
    }
  },
  plugin_scopes: {
    mutfunc: 'transcript',
    mavedb: 'transcript',
    protvar: 'transcript',
    clinvar: 'transcript',
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
    gerp: 'allele',
    loeuf: 'transcript',
    nmd: 'transcript',
    spdi: 'allele',
    protein: 'transcript',
    hgvsg: 'allele',
    tss_distance: 'transcript'
  }
};
