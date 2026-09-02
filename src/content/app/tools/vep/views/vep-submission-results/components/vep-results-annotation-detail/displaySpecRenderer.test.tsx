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

import { render, screen, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderDisplayOption } from './displaySpecRenderer';

import type { VocabularyEntry } from './displaySpecRenderer';
import { displaySpecFixture } from './displaySpec.fixture';

import type {
  PredictedTranscriptConsequence,
  Annotation
} from 'src/content/app/tools/vep/types/vepResultsResponse';
import type { AnnotatedEntity } from 'src/content/app/tools/vep/utils/annotations';
import type {
  DisplayOptionSpec,
  DisplaySpec
} from 'src/content/app/tools/vep/types/vepDisplaySpec';
import type { OptionHelp } from 'src/content/app/tools/vep/types/vepFormConfig';

const spec = displaySpecFixture;

const optionSpec = (optionId: string): DisplayOptionSpec =>
  spec.options.find((option) => option.option_id === optionId)!;

const annotation = (
  plugin: string,
  scope: 'allele' | 'transcript',
  data: Record<string, unknown>
): Annotation => ({ plugin, scope, data });

const renderOption = (
  optionId: string,
  entities: {
    consequence?: AnnotatedEntity;
    allele?: Annotation[];
    spec?: DisplaySpec;
    showAll?: boolean;
    subOptionRan?: (optionId: string, defaultValue: boolean) => boolean;
    protvarUrl?: string;
    genomeId?: string;
    help?: OptionHelp;
    openTargetsVariantId?: string;
    vocabularies?: Record<string, VocabularyEntry[]>;
  }
) =>
  render(
    <>
      {renderDisplayOption({
        option: optionSpec(optionId),
        spec: entities.spec ?? spec,
        consequence: entities.consequence,
        allele: { annotations: entities.allele ?? [] },
        showAll: entities.showAll,
        subOptionRan: entities.subOptionRan,
        protvarUrl: entities.protvarUrl,
        genomeId: entities.genomeId,
        help: entities.help,
        openTargetsVariantId: entities.openTargetsVariantId,
        vocabularies: entities.vocabularies
      })}
    </>
  );

afterEach(cleanup);

describe('renderDisplayOption', () => {
  it('reads an allele-scoped plugin from the allele, not the consequence', () => {
    renderOption('cadd', {
      allele: [annotation('cadd', 'allele', { phred: 24.6, raw: 3.21 })],
      // a same-named entry on the consequence must be ignored
      consequence: {
        annotations: [annotation('cadd', 'transcript', { phred: 99, raw: 88 })]
      }
    });
    // Both CADD scores (PHRED and RAW) render, read from the allele.
    expect(screen.getByText('24.6')).toBeDefined();
    expect(screen.getByText('3.21')).toBeDefined();
    expect(screen.queryByText('99')).toBeNull();
    expect(screen.queryByText('88')).toBeNull();
  });

  it('reads a transcript-scoped plugin from the consequence', () => {
    renderOption('loeuf', {
      consequence: {
        annotations: [annotation('loeuf', 'transcript', { score: 0.123 })]
      },
      allele: [annotation('loeuf', 'allele', { score: 9 })]
    });
    expect(screen.getByText('0.123')).toBeDefined();
    expect(screen.queryByText('9')).toBeNull();
  });

  it('renders the pLI score from the consequence', () => {
    renderOption('pli', {
      consequence: {
        annotations: [annotation('pli', 'transcript', { score: 0.9821 })]
      },
      allele: [annotation('pli', 'allele', { score: 9 })]
    });
    expect(screen.getByText('pLI')).toBeDefined();
    expect(screen.getByText('0.9821')).toBeDefined();
    expect(screen.queryByText('9')).toBeNull();
  });

  it('renders the GERP conservation score from the allele', () => {
    // GERP is position-based, so it is allele-scoped like CADD: a same-named
    // entry on the consequence must be ignored.
    renderOption('gerp', {
      allele: [annotation('gerp', 'allele', { score: 2.25 })],
      consequence: {
        annotations: [annotation('gerp', 'transcript', { score: 99 })]
      }
    });
    expect(screen.getByText('GERP conservation score')).toBeDefined();
    expect(screen.getByText('2.25')).toBeDefined();
    expect(screen.queryByText('99')).toBeNull();
  });

  it('renders a negative GERP score as-is', () => {
    // `num` formatting must not drop the sign.
    renderOption('gerp', {
      allele: [annotation('gerp', 'allele', { score: -0.674 })]
    });
    expect(screen.getByText('-0.674')).toBeDefined();
  });

  it('renders nothing for a block whose required plugin produced no annotation', () => {
    const { container } = renderOption('spliceai', {});
    expect(container.innerHTML).toBe('');
  });

  it('renders the SpliceAI event table once the required plugin is present', () => {
    renderOption('spliceai', {
      consequence: {
        annotations: [
          annotation('spliceai', 'transcript', {
            symbol: null,
            ds_acceptor_gain: 0
          })
        ]
      }
    });
    expect(screen.getByText('SpliceAI')).toBeDefined();
    // The absent gene symbol drops its row.
    expect(screen.queryByText('Gene')).toBeNull();
    expect(
      screen.getByRole('columnheader', { name: 'Splicing event' })
    ).toBeDefined();
    expect(screen.getByRole('cell', { name: 'Acceptor gain' })).toBeDefined();
    expect(screen.getByRole('cell', { name: 'Donor loss' })).toBeDefined();
    // ds_acceptor_gain: 0 shows in the Acceptor gain row's ΔS cell
    const acceptorGain = screen
      .getByRole('cell', { name: 'Acceptor gain' })
      .closest('tr') as HTMLElement;
    expect(within(acceptorGain).getByRole('cell', { name: '0' })).toBeDefined();
  });

  /** An option can emit a sequence of blocks (EVE plus its popEVE sibling). */
  it('renders each block of a multi-block option', () => {
    renderOption('eve', {
      consequence: {
        annotations: [
          annotation('eve', 'transcript', {
            classification: 'likely_pathogenic',
            score: 0.812
          }),
          annotation('popeve', 'transcript', {
            score: -3.21,
            gap_frequency: 0.07
          })
        ]
      }
    });
    expect(screen.getByText('EVE')).toBeDefined();
    expect(screen.getByText('0.812 (likely pathogenic)')).toBeDefined();
    expect(screen.getByText('popEVE')).toBeDefined();
    expect(screen.getByText('-3.21')).toBeDefined();
    expect(screen.getByText('Gap frequency')).toBeDefined();
    expect(screen.getByText('0.07')).toBeDefined();
  });

  it("renders a help row's cited source as a link", async () => {
    const { getByRole } = renderOption('eve', {
      consequence: {
        annotations: [
          annotation('popeve', 'transcript', {
            score: -3.21,
            gap_frequency: 0.07
          })
        ]
      }
    });
    const questionButton = getByRole('button');
    expect(questionButton).toBeDefined();
    await userEvent.click(questionButton);
    expect(screen.getByText(/Authors recommend filtering/)).toBeDefined();
    const link = screen.getByRole('link', { name: /popEVE paper/ });
    expect(link.getAttribute('href')).toBe(
      'https://europepmc.org/article/MED/41286104'
    );
    expect(link.getAttribute('target')).toBe('_blank');
  });

  /** A composed value needs its classification; a lone score is not a value. */
  it('drops a composed row that has a score but no classification', () => {
    const { container } = renderOption('alphamissense', {
      consequence: {
        annotations: [
          annotation('alphamissense', 'transcript', {
            classification: null,
            score: 0.5
          })
        ]
      }
    });
    expect(container.innerHTML).toBe('');
  });

  it('renders a composed row without its score', () => {
    renderOption('alphamissense', {
      consequence: {
        annotations: [
          annotation('alphamissense', 'transcript', {
            classification: 'likely_benign',
            score: null
          })
        ]
      }
    });
    expect(screen.getByText('likely benign')).toBeDefined();
  });

  it('renders nothing when the plugin produced no annotation', () => {
    const { container } = renderOption('hgvs', {});
    expect(container.innerHTML).toBe('');
  });

  // --- list blocks: repeat + link + truncate -------------------------------

  it('groups GO terms into a section per aspect, each term linked', () => {
    renderOption('go', {
      consequence: {
        annotations: [
          annotation('go', 'transcript', {
            go_terms: [
              {
                id: 'GO:0006355',
                name: 'regulation of transcription',
                namespace: 'biological_process'
              },
              {
                id: 'GO:0003677',
                name: 'DNA binding',
                namespace: 'molecular_function'
              },
              {
                id: 'GO:0005634',
                name: 'nucleus',
                namespace: 'cellular_component'
              }
            ]
          })
        ]
      }
    });
    expect(screen.getByText('Gene Ontology')).toBeDefined();
    // one headed section per aspect, named by the spec's `labels` rather than
    // the raw underscored value the data carries
    expect(screen.getByText('Biological process')).toBeDefined();
    expect(screen.getByText('Molecular function')).toBeDefined();
    expect(screen.getByText('Cellular component')).toBeDefined();
    expect(screen.queryByText('biological_process')).toBeNull();
    // The accession is not shown -- it is not useful to read -- but it is still
    // what the link is built from, so the column links on a field it does not
    // display.
    expect(screen.queryByText('GO:0006355')).toBeNull();
    const link = screen.getByText('regulation of transcription').closest('a');
    expect(link?.getAttribute('href')).toBe(
      'https://amigo.geneontology.org/amigo/term/GO:0006355'
    );
    expect(screen.getByText('DNA binding')).toBeDefined();
    // a term sits under its own aspect, not merely somewhere on the page
    // each group is its own OptionBlock: the heading span's nearest div
    const section = screen
      .getByText('Molecular function')
      .closest('div') as HTMLElement;
    expect(within(section).getByText('DNA binding')).toBeDefined();
    expect(
      within(section).queryByText('regulation of transcription')
    ).toBeNull();
  });

  test('a GO term missing the accession its link needs stays plain text', () => {
    // The column reads `name` and links `{id}`, so a term with one and not the
    // other used to link to `https://amigo.geneontology.org/amigo/term/` --
    // a URL that goes somewhere, just not anywhere about this term.
    renderOption('go', {
      consequence: {
        annotations: [
          annotation('go', 'transcript', {
            go_terms: [
              { id: null, name: 'DNA binding', namespace: 'molecular_function' }
            ]
          })
        ]
      }
    });
    const term = screen.getByText('DNA binding');
    expect(term).toBeDefined();
    expect(term.closest('a')).toBeNull();
  });

  test('a condition whose resolved URL is not http(s) stays plain text', () => {
    // `link_from` points at a URL the parse resolved, so its scheme is whatever
    // came out of the data. Only the two web schemes are rendered as a link.
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            id: '440915',
            significance: ['Pathogenic'],
            review_status: 'no_assertion_criteria_provided',
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'no_assertion_criteria_provided',
                rating_scale: 'clinvar_aggregate'
              }
            ],
            records: [
              {
                names: [
                  {
                    name: 'Parkinsonism-dystonia_3,_childhood-onset',
                    ids: 'MedGen:C5676913',
                    id_url: 'javascript:alert(1)',
                    id_curie: 'MedGen:C5676913'
                  }
                ],
                classification_type: 'Germline',
                classifications: [],
                rcv: null
              }
            ]
          })
        ]
      }
    });
    const condition = screen.getByText(
      'Parkinsonism-dystonia 3, childhood-onset'
    );
    expect(condition.closest('a')).toBeNull();
  });

  it('renders NearestGene (allele-scoped): gene id, distance and direction', () => {
    renderOption('nearest_gene', {
      allele: [
        annotation('nearest_gene', 'allele', {
          nearest_genes: [
            {
              gene_id: 'ENSG00000269981',
              distance: 19457,
              direction: 'upstream'
            },
            {
              gene_id: 'ENSG00000279928',
              distance: 25274,
              direction: 'downstream'
            }
          ]
        })
      ]
    });
    expect(screen.getByText('Nearest gene')).toBeDefined();
    expect(screen.getByText('ENSG00000269981')).toBeDefined();
    expect(screen.getByText('19457')).toBeDefined();
    expect(screen.getByText('upstream')).toBeDefined();
    expect(screen.getByText('ENSG00000279928')).toBeDefined();
    expect(screen.getByText('downstream')).toBeDefined();
  });

  it('renders NearestExonJB (transcript-scoped) as labelled field-rows', () => {
    renderOption('nearest_exon_jb', {
      consequence: {
        annotations: [
          annotation('nearest_exon_jb', 'transcript', {
            boundaries: [
              {
                exon_id: 'ENSE00004404283',
                distance: 53,
                boundary_type: 'start',
                exon_length: 117
              }
            ]
          })
        ]
      }
    });
    expect(screen.getByText('Nearest exon junction boundary')).toBeDefined();
    // each field is a labelled row (item.rows), not bare inline cells
    expect(screen.getByText('Exon')).toBeDefined();
    expect(screen.getByText('ENSE00004404283')).toBeDefined();
    expect(screen.getByText('Distance to exon boundary')).toBeDefined();
    expect(screen.getByText('53')).toBeDefined();
    expect(screen.getByText('Boundary type')).toBeDefined();
    expect(screen.getByText('start')).toBeDefined();
    expect(screen.getByText('Exon length')).toBeDefined();
    expect(screen.getByText('117')).toBeDefined();
  });

  it('renders two NearestExonJB boundaries (intronic) as separate records', () => {
    renderOption('nearest_exon_jb', {
      consequence: {
        annotations: [
          annotation('nearest_exon_jb', 'transcript', {
            boundaries: [
              {
                exon_id: 'ENSE1',
                distance: 3744,
                boundary_type: 'end',
                exon_length: 144
              },
              {
                exon_id: 'ENSE2',
                distance: 3169,
                boundary_type: 'start',
                exon_length: 86
              }
            ]
          })
        ]
      }
    });
    // both boundaries render; "Exon" label appears once per record
    expect(screen.getByText('ENSE1')).toBeDefined();
    expect(screen.getByText('ENSE2')).toBeDefined();
    expect(screen.getAllByText('Exon')).toHaveLength(2);
  });

  // --- table group_by: data-driven sections (phenotypes by `type`) ----------

  const phenotype = (fields: Record<string, unknown>) => ({
    type: null,
    source: null,
    phenotype: null,
    id: null,
    risk_allele: null,
    ...fields
  });

  it('groups table rows into headed sections driven by the data', () => {
    // Gene-associated phenotypes are narrowed to the gene their `id` names, so
    // they arrive on the transcript consequence; variant-associated ones are
    // narrowed by risk allele and stay on the allele.
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('phenotype_gene', 'transcript', {
            phenotypes: [
              phenotype({
                type: 'Gene',
                source: 'GenCC',
                phenotype: 'Li-Fraumeni_syndrome',
                id: 'ENSG00000141510'
              })
            ]
          })
        ]
      },
      allele: [
        annotation('phenotype_data', 'allele', {
          phenotypes: [
            phenotype({
              type: 'Variation',
              source: 'ClinVar',
              phenotype: 'BREAST_CANCER',
              id: 'rs699',
              risk_allele: 'A'
            })
          ]
        })
      ]
    });
    expect(screen.getByText('Phenotypes')).toBeDefined();
    // the sections come from the data; `group_by.labels` words the two known
    // types for display ("Variation" is the pipeline's term, not the reader's)
    expect(screen.getByText('Gene associated')).toBeDefined();
    expect(screen.getByText('Variant associated')).toBeDefined();
    // one table per section, Phenotype first then Source
    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(2);
    expect(
      within(tables[0])
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent)
    ).toEqual(['Phenotype', 'Source']);
    // normalizePhenotype: underscores -> spaces; all-caps -> sentence case
    expect(
      screen.getByRole('cell', { name: 'Li-Fraumeni syndrome' })
    ).toBeDefined();
    expect(screen.getByRole('cell', { name: 'Breast cancer' })).toBeDefined();
    // neither the id nor the risk allele is a column
    expect(screen.queryByText('ENSG00000141510')).toBeNull();
    expect(screen.queryByText('rs699')).toBeNull();
    expect(screen.queryByText('A')).toBeNull();
  });

  it('links the phenotype source, not the phenotype', () => {
    // The URL identifies the record in the source's own database, so it belongs
    // on the source's name; the phenotype is what the reader is scanning for and
    // reads better as plain text.
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('phenotype_gene', 'transcript', {
            phenotypes: [
              phenotype({
                type: 'Gene',
                source: 'MIM_morbid',
                phenotype: 'Li-Fraumeni_syndrome',
                id: 'ENSG00000141510',
                source_url: 'https://omim.org/entry/151623'
              })
            ]
          })
        ]
      },
      allele: [
        annotation('phenotype_data', 'allele', {
          phenotypes: [
            phenotype({
              type: 'Variation',
              source: 'NHGRI-EBI_GWAS_catalog',
              phenotype: 'BREAST_CANCER',
              id: 'rs699',
              risk_allele: 'A',
              source_url: 'https://www.ebi.ac.uk/gwas/variants/rs699'
            })
          ]
        })
      ]
    });

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'https://omim.org/entry/151623',
      'https://www.ebi.ac.uk/gwas/variants/rs699'
    ]);
    // Both tables, gene-associated and variant-associated.
    expect(links.map((link) => link.textContent)).toEqual([
      'MIM morbid',
      'NHGRI-EBI GWAS catalog'
    ]);
    // …and the phenotype itself carries no link of its own.
    expect(screen.getByText('Li-Fraumeni syndrome').closest('a')).toBeNull();
  });

  it('shows a type nobody anticipated rather than dropping it', () => {
    renderOption('phenotypes', {
      allele: [
        annotation('phenotype_data', 'allele', {
          phenotypes: [
            phenotype({
              type: 'Somatic',
              source: 'COSMIC',
              phenotype: 'Melanoma'
            })
          ]
        })
      ]
    });
    // A type the pipeline starts emitting is still shown. The gene-associated
    // table reads a plugin that takes only `Gene`, and everything else falls to
    // `phenotype_data` and so to the variant-associated table — which is why
    // that one has no filter: whatever reaches it belongs there. It gets no
    // heading of its own, but being filed under "Variant associated" beats
    // vanishing between two tables that each name what they want.
    expect(screen.getByText('Melanoma')).toBeDefined();
    expect(screen.getByText('Variant associated')).toBeDefined();
    expect(screen.queryByText('Gene associated')).toBeNull();
  });

  it('truncates each grouped table section on its own', () => {
    const genes = Array.from({ length: 6 }, (_, index) =>
      phenotype({
        type: 'Gene',
        source: 'GenCC',
        phenotype: `disease_${index + 1}`,
        id: 'ENSG1'
      })
    );
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('phenotype_gene', 'transcript', { phenotypes: genes })
        ]
      },
      allele: [
        annotation('phenotype_data', 'allele', {
          phenotypes: [
            phenotype({
              type: 'Variation',
              source: 'ClinVar',
              phenotype: 'Breast_cancer',
              risk_allele: 'A'
            })
          ]
        })
      ]
    });
    // the gene-associated section shows 3 of 6 behind a toggle; the
    // variant-associated one, with a single row, has none.
    expect(screen.getByText('+ 3 more')).toBeDefined();
    expect(screen.getByRole('cell', { name: 'disease 1' })).toBeDefined();
    expect(screen.queryByRole('cell', { name: 'disease 4' })).toBeNull();
    expect(screen.getByRole('cell', { name: 'Breast cancer' })).toBeDefined();
  });

  it('truncates a long list behind a show-more toggle (visible_count)', () => {
    renderOption('go', {
      consequence: {
        annotations: [
          annotation('go', 'transcript', {
            // one aspect, so this exercises truncation rather than grouping
            go_terms: [1, 2, 3, 4, 5].map((n) => ({
              id: `GO:${n}`,
              name: `term ${n}`,
              namespace: 'biological_process'
            }))
          })
        ]
      }
    });
    // visible_count is 3: the first three show, the rest hide behind "+ 2 more".
    expect(screen.getByText('term 3')).toBeDefined();
    expect(screen.queryByText('term 4')).toBeNull();
    expect(screen.getByText('+ 2 more')).toBeDefined();
  });

  it('renders nothing for an empty list', () => {
    const { container } = renderOption('go', {
      consequence: {
        annotations: [annotation('go', 'transcript', { go_terms: [] })]
      }
    });
    expect(container.innerHTML).toBe('');
  });

  // --- option-level heading spanning multiple blocks (MaveDB) ---------------

  it('wraps a multi-block option under one option-level heading', () => {
    // ProtVar rather than MaveDB: MaveDB used to be a rows block plus a list,
    // and is now a single table, so it no longer exercises this at all.
    renderOption('protvar', {
      consequence: {
        annotations: [
          annotation('protvar', 'transcript', {
            structure_stability_score: 1.23,
            pockets: [{ pocket_id: '1', score: 0.5 }]
          })
        ]
      },
      protvarUrl: 'https://protvar.example/x'
    });
    expect(screen.getByText('ProtVar')).toBeDefined(); // the option heading
    // ...over content drawn from two different blocks beneath it: a rows block
    // and a headed list.
    expect(screen.getByText('Protein Structure Stability')).toBeDefined();
    expect(screen.getByText('1.23')).toBeDefined();
    expect(screen.getByText('Protein Pockets')).toBeDefined();
    expect(screen.getByText('Pocket 1')).toBeDefined();
  });

  test('MaveDB: one row per assay, with the score set linked', () => {
    renderOption('mavedb', {
      consequence: {
        annotations: [
          annotation('mavedb', 'transcript', {
            assays: [
              mavedbAssay('a', 1.234, null),
              mavedbAssay('b', -0.5, null)
            ]
          })
        ]
      }
    });
    expect(screen.getByText('MaveDB')).toBeDefined(); // the option heading
    // The plugin reports the score set, not the variant within it, so the link
    // opens the score set's distribution.
    const link = screen.getByText('urn:mavedb:00000045-a-1').closest('a');
    expect(link?.getAttribute('href')).toBe(
      'https://www.mavedb.org/score-sets/urn:mavedb:00000045-a-1?calibration'
    );
    expect(screen.getByText('1.234')).toBeDefined();
  });

  // --- merge_by: one cell per run of rows sharing an element field ----------

  const mavedbAssay = (letter: string, score: number, doi: string | null) => ({
    urn: `urn:mavedb:00000045-${letter}-1`,
    experiment: 'urn:mavedb:00000045',
    doi,
    score
  });

  const publicationCells = (container: HTMLElement) =>
    [...container.querySelectorAll('tbody tr')].map(
      (row) => [...row.querySelectorAll('td')].length
    );

  it('merges a column down the rows that share its group', () => {
    // The publication belongs to the experiment, not the score set, and MaveDB
    // states it on only some of an experiment's rows. All three rows here are
    // one experiment, so the column is one cell spanning all three — drawn from
    // the row that actually carries the DOI, not the first row.
    const { container } = renderOption('mavedb', {
      consequence: {
        annotations: [
          annotation('mavedb', 'transcript', {
            assays: [
              mavedbAssay('a', 1, null),
              mavedbAssay('b', 2, '10.1038/s41589-020-0480-6'),
              mavedbAssay('c', 3, null)
            ]
          })
        ]
      }
    });

    const link = screen
      .getByText('10.1038/s41589-020-0480-6')
      .closest('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe(
      'https://europepmc.org/search?query=DOI:%2210.1038/s41589-020-0480-6%22'
    );
    // One cell, spanning the run...
    const merged = link.closest('td') as HTMLTableCellElement;
    expect(merged.getAttribute('rowspan')).toBe('3');
    // ...so only the first row carries a third cell; the other two are absorbed.
    expect(publicationCells(container)).toEqual([3, 2, 2]);
  });

  it('does not merge a group whose stated values disagree', () => {
    // Two different publications inside one experiment is not something the
    // data should contain, but if it does, spanning them would present one
    // row's value as the whole group's. Repetition is the honest fallback.
    const { container } = renderOption('mavedb', {
      consequence: {
        annotations: [
          annotation('mavedb', 'transcript', {
            assays: [
              mavedbAssay('a', 1, '10.1000/first'),
              mavedbAssay('b', 2, '10.1000/second')
            ]
          })
        ]
      }
    });

    expect(screen.getByText('10.1000/first')).toBeDefined();
    expect(screen.getByText('10.1000/second')).toBeDefined();
    expect(publicationCells(container)).toEqual([3, 3]);
    expect(container.querySelector('td[rowspan]')).toBeNull();
  });

  it('clamps a merged span to the rows actually on screen', () => {
    // The table truncates at three. A span of five would reach two rows past
    // the last one rendered and leave the cell hanging below the table.
    const { container } = renderOption('mavedb', {
      consequence: {
        annotations: [
          annotation('mavedb', 'transcript', {
            assays: [
              mavedbAssay('a', 1, null),
              mavedbAssay('b', 2, null),
              mavedbAssay('c', 3, '10.1038/s41589-020-0480-6'),
              mavedbAssay('d', 4, null),
              mavedbAssay('e', 5, null)
            ]
          })
        ]
      }
    });

    const merged = container.querySelector(
      'td[rowspan]'
    ) as HTMLTableCellElement;
    expect(merged.getAttribute('rowspan')).toBe('3');
    // ...and the value is still the group's, even though the row carrying it is
    // itself below the fold.
    expect(screen.getByText('10.1038/s41589-020-0480-6')).toBeDefined();
  });

  it('escapes a # inside a value so it cannot end the URL early', () => {
    // Raw, the browser reads everything from the '#' as a fragment and never
    // sends it — so the rest of the URL is lost.
    //
    // The value is synthetic: MaveDB used to report an accession ending
    // `#<variant>`, and that is where this rule came from, but the plugin now
    // reports the bare score set and no live value carries a '#'. The rule is a
    // property of `interpolateUrl` rather than of MaveDB, and it is one half of
    // a pair — the other half (leave a '#' alone when the value IS the URL,
    // below) only makes sense against it — so it keeps its own test.
    renderOption('mavedb', {
      consequence: {
        annotations: [
          annotation('mavedb', 'transcript', {
            assays: [
              {
                urn: 'urn:mavedb:00000045-a-1#2010',
                experiment: 'urn:mavedb:00000045',
                doi: null,
                score: 1
              }
            ]
          })
        ]
      }
    });

    const href = screen
      .getByText('urn:mavedb:00000045-a-1#2010')
      .closest('a')
      ?.getAttribute('href');
    expect(href).toContain('%232010');
    expect(href).not.toContain('#');
    // The colons are still the source's own and stay as they are.
    expect(href).toContain('/score-sets/urn:mavedb:00000045-a-1');
  });

  it('leaves a # alone when the value IS the URL', () => {
    // The other half of the rule above, and it has to be the other half: a
    // template that is nothing but the placeholder means the parse resolved the
    // whole href, so a '#' in it is that URL's own structure. Geno2MP's variant
    // pages are fragment-routed, and escaping theirs sends every one of them to
    // the site's front page instead.
    renderOption('geno2mp', {
      allele: [
        annotation('geno2mp', 'allele', {
          hpo_profile_count: 107,
          url: 'https://geno2mp.gs.washington.edu/Geno2MP/#/variant/1/11022/G%3EA/snp'
        })
      ]
    });

    const href = screen.getByText('107').closest('a')?.getAttribute('href');
    expect(href).toBe(
      'https://geno2mp.gs.washington.edu/Geno2MP/#/variant/1/11022/G%3EA/snp'
    );
    expect(href).not.toContain('%23');
  });

  it('shows the count unlinked when its href is missing', () => {
    // A count still says something without somewhere to follow it to, so the
    // row must not vanish just because the URL did.
    renderOption('geno2mp', {
      allele: [
        annotation('geno2mp', 'allele', { hpo_profile_count: 42, url: null })
      ]
    });

    expect(screen.getByText('42')).toBeDefined();
    expect(screen.getByText('42').closest('a')).toBeNull();
  });

  it('shows the option heading even when only one of its blocks survives', () => {
    // No variant row, but the assays list survives — the "MaveDB" heading spans
    // both blocks, so it still shows.
    renderOption('mavedb', {
      consequence: {
        annotations: [
          annotation('mavedb', 'transcript', {
            protein_variant: null,
            assays: [{ urn: 'urn:x', accession: 'urn:x#1', score: 2 }]
          })
        ]
      }
    });
    expect(screen.getByText('MaveDB')).toBeDefined();
    expect(screen.getByText('urn:x')).toBeDefined();
    expect(screen.queryByText('Variant')).toBeNull();
  });

  // --- sub-option rows: Show-all enumeration (mutfunc) ----------------------

  it('sub-option rows: default view shows only the ones with a value', () => {
    renderOption('mutfunc', {
      consequence: {
        annotations: [
          annotation('mutfunc', 'transcript', {
            linear_motifs: 0.5,
            protein_interactions: null
          })
        ]
      }
      // showAll defaults false
    });
    expect(screen.getByText('mutfunc')).toBeDefined();
    expect(screen.getByText('Linear motifs')).toBeDefined();
    expect(screen.getByText('0.5')).toBeDefined();
    // an empty sub-option is dropped in the default view
    expect(screen.queryByText('Protein interactions')).toBeNull();
  });

  it('sub-option rows: Show-all lists selected ones (dash if empty), drops unselected', () => {
    renderOption('mutfunc', {
      consequence: {
        annotations: [
          annotation('mutfunc', 'transcript', {
            linear_motifs: 0.5, // selected + value
            protein_interactions: null, // selected + empty -> dash
            protein_structure: 0.9 // NOT selected, but has a value -> dropped
          })
        ]
      },
      showAll: true,
      subOptionRan: (id) => id === 'mutfunc_motif' || id === 'mutfunc_int'
    });
    expect(screen.getByText('Linear motifs')).toBeDefined();
    expect(screen.getByText('0.5')).toBeDefined();
    expect(screen.getByText('Protein interactions')).toBeDefined();
    expect(screen.getByText('—')).toBeDefined();
    // unselected, even with a value present (full-cache), stays hidden
    expect(screen.queryByText('Protein structure')).toBeNull();
    expect(screen.queryByText('0.9')).toBeNull();
  });

  // --- multi-cell list items: cell links, `label` prefix, absent cells -------
  // (OpenTargets: two list blocks under one option heading, one truncated.)

  it('renders OpenTargets as two tables, with the EFO term as the disease', () => {
    renderOption('opentargets', {
      allele: [
        annotation('opentargets', 'allele', {
          gwas_associations: [
            {
              disease: 'EFO_0000305',
              disease_label: 'breast carcinoma',
              gene_id: 'ENSG00000141510',
              l2g_score: 0.42,
              p_value: '3.32e-28',
              beta: 0.0125
            }
          ],
          qtl_associations: [
            {
              gene_id: 'ENSG00000012048',
              biosample: 'blood',
              p_value: '1.81e-22',
              beta: -0.794
            }
          ]
        })
      ]
    });
    expect(screen.getByText('OpenTargets')).toBeDefined(); // option-level heading
    expect(screen.getByText('GWAS gene associations')).toBeDefined();
    expect(screen.getByText('QTL gene associations')).toBeDefined();

    const headers = screen
      .getAllByRole('columnheader')
      .map((h) => h.textContent);
    expect(headers).toEqual([
      'Disease',
      'Gene',
      'Lead variant p-value',
      'beta coefficient',
      'Locus to Gene (L2G) Score',
      'BioSample',
      'Gene',
      'Lead variant p-value',
      'beta coefficient'
    ]);

    // the resolved EFO term, not the accession
    expect(screen.getByText('breast carcinoma')).toBeDefined();
    expect(screen.queryByText('EFO_0000305')).toBeNull();
    // p-value as published: mantissa and exponent joined, not re-rounded
    expect(screen.getByText('3.32e-28')).toBeDefined();
    expect(screen.getByText('1.81e-22')).toBeDefined();
    expect(screen.getByText('0.42')).toBeDefined();
    expect(screen.getByText('blood')).toBeDefined();
  });

  it('leaves the table cells unlinked', () => {
    const { container } = renderOption('opentargets', {
      allele: [
        annotation('opentargets', 'allele', {
          gwas_associations: [
            {
              disease: 'EFO_0000305',
              disease_label: 'breast carcinoma',
              gene_id: 'ENSG00000141510',
              l2g_score: 0.42,
              p_value: '3.32e-28',
              beta: 0.0125
            }
          ],
          qtl_associations: []
        })
      ]
    });
    expect(container.querySelectorAll('tbody a')).toHaveLength(0);
  });

  it('links the variant to its OpenTargets page, icon first', () => {
    renderOption('opentargets', {
      allele: [
        annotation('opentargets', 'allele', {
          gwas_associations: [],
          qtl_associations: [
            { gene_id: 'ENSG_A', biosample: 'blood', p_value: null, beta: null }
          ]
        })
      ],
      openTargetsVariantId: '1_230710048_A_G'
    });
    expect(screen.getByText('Variant link')).toBeDefined();
    const link = screen.getByText('1_230710048_A_G').closest('a');
    expect(link?.getAttribute('href')).toBe(
      'https://platform.opentargets.org/variant/1_230710048_A_G'
    );
    expect(link?.getAttribute('target')).toBe('_blank');
    // the link sits on its own line under the heading rather than being
    // pushed to the far edge as the value half of a label/value row
    expect(link?.closest('[class*="row"]')?.className).toMatch(/plainRow/);
  });

  it('renders nothing at all when the variant has no OpenTargets data', () => {
    // The link is built from the variant's own coordinates, so without a gate
    // it would appear on every variant in the results whether OpenTargets had
    // anything to say about it or not.
    const { container } = renderOption('opentargets', {
      allele: [],
      openTargetsVariantId: '1_230710048_A_G'
    });
    expect(container.innerHTML).toBe('');
  });

  it('drops the variant link when the allele could not be resolved', () => {
    renderOption('opentargets', {
      allele: [
        annotation('opentargets', 'allele', {
          gwas_associations: [],
          qtl_associations: [
            { gene_id: 'ENSG_A', biosample: 'blood', p_value: null, beta: null }
          ]
        })
      ]
    });
    expect(screen.queryByText('Variant link')).toBeNull();
  });

  it('leaves a table cell empty when its value is absent', () => {
    renderOption('opentargets', {
      allele: [
        annotation('opentargets', 'allele', {
          gwas_associations: [
            {
              disease: 'EFO_1',
              disease_label: 'a disease',
              gene_id: 'ENSG_A',
              l2g_score: null,
              p_value: null,
              beta: null
            }
          ],
          qtl_associations: []
        })
      ]
    });
    // the row still renders; the cells with nothing in them are simply blank
    expect(screen.getByText('a disease')).toBeDefined();
    expect(screen.getByText('ENSG_A')).toBeDefined();
  });

  it('truncates the GWAS table at visible_count (3)', () => {
    renderOption('opentargets', {
      allele: [
        annotation('opentargets', 'allele', {
          gwas_associations: [1, 2, 3, 4].map((n) => ({
            disease: `EFO_${n}`,
            disease_label: `disease ${n}`,
            gene_id: `ENSG_${n}`,
            l2g_score: null,
            p_value: null,
            beta: null
          })),
          qtl_associations: []
        })
      ]
    });
    expect(screen.getByText('disease 3')).toBeDefined();
    expect(screen.queryByText('disease 4')).toBeNull();
    expect(screen.getByText('+ 1 more')).toBeDefined();
  });

  // --- conditional (`when`) + group + list-as-rows (ClinVar) ----------------

  // The germline data is served under Phenotypes now: its blocks sit in that
  // option and gate on the data (`when: present`), so there is no sub-option to
  // select. Only the structural custom is still a sub-option of the master.
  const clinvarSvSelected = (id: string) => id === 'clinvar_sv';

  test('ClinVar: one Classification line per classification type', () => {
    const { container } = renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'reviewed_by_expert_panel',
                rating_scale: 'clinvar_aggregate',
                supporting: 39,
                submissions: 44
              },
              {
                type: 'SomaticClinicalImpact',
                classification: 'Tier_I_-_Strong',
                review_status: 'criteria_provided,_single_submitter',
                rating_scale: 'clinvar_somatic',
                supporting: 9,
                submissions: 12
              }
            ]
          })
        ]
      }
    });
    expect(screen.getByText('Classification')).toBeDefined();

    // Each line names its type, its classification and its review status, and
    // counts the submissions asserting that classification.
    expect(screen.getByText('Germline')).toBeDefined();
    expect(screen.getByText('Pathogenic')).toBeDefined();
    expect(screen.getByText('reviewed by expert panel')).toBeDefined();
    expect(
      screen.getByText(
        '39/44 submission(s) contribute to aggregate classification'
      )
    ).toBeDefined();
    // Shown as three words though the data says "SomaticClinicalImpact" — that
    // spelling is the key the submission join matches on, so it stays put.
    expect(screen.getByText('Somatic Clinical Impact')).toBeDefined();
    expect(screen.queryByText('SomaticClinicalImpact')).toBeNull();
    expect(screen.getByText('Tier I - Strong')).toBeDefined();
    expect(
      screen.getByText(
        '9/12 submission(s) contribute to aggregate classification'
      )
    ).toBeDefined();

    // Germline reads on the aggregate scale (expert panel = 3), somatic on its
    // own (single submitter = 1) — the scales are not interchangeable.
    expect(screen.getByRole('img', { name: '3 out of 4' })).toBeDefined();
    expect(screen.getByRole('img', { name: '1 out of 4' })).toBeDefined();

    // The stack takes its own lines beneath the label, indented: opposite the
    // label there is only a fraction of the panel's width, and four columns of
    // content wrapped into it.
    const stacks = container.querySelectorAll('[class*="stackedRowValue"]');
    // Two blocks: the germline line under its label, the somatic ones on their
    // own further down, directly above the table they describe.
    expect(stacks.length).toBe(2);
    const labelled = stacks[0].parentElement;
    expect(labelled?.className).toMatch(/stackedRow/);
    expect(labelled?.firstElementChild?.textContent).toContain(
      'Classification'
    );
    // The somatic stack carries no label of its own.
    expect(stacks[1].parentElement?.className).toMatch(/standaloneStack/);

    // no conditions, so no conditions table
    expect(screen.queryByText('Condition')).toBeNull();
  });

  test('ClinVar: the stacked lines share columns, keeping empty slots', () => {
    // The lines read as a small table, so every cell of every line is a direct
    // child of one grid — a line that packed its own cells would start each
    // column wherever its own text happened to end.
    const { container } = renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Oncogenicity',
                classification: 'Oncogenic',
                review_status: 'criteria_provided,_single_submitter',
                rating_scale: 'clinvar_aggregate',
                supporting: 1,
                submissions: 1
              },
              {
                // no review status: its cell renders nothing but must still hold
                // its column, or this line's later cells would drift
                type: 'SomaticClinicalImpact',
                classification: 'Tier_I_-_Strong',
                review_status: null,
                rating_scale: 'clinvar_somatic',
                supporting: 2,
                submissions: 3
              }
            ]
          })
        ]
      }
    });
    // Both are somatic, so both land in the one stack below the germline table.
    const grid = container.querySelector(
      '[class*="stackedGrid"]'
    ) as HTMLElement;
    expect(grid).toBeTruthy();
    // Four cells per line, two lines, every slot filled even when empty.
    expect(grid.style.getPropertyValue('--stacked-columns')).toBe('4');
    expect(grid.children.length).toBe(8);
    // The line with no review status still holds that cell, empty.
    expect(grid.children[6].textContent).toBe('');
    expect(grid.children[3].textContent).toContain(
      '1/1 submission(s) contribute'
    );
  });

  test('ClinVar: a derived classification no submitter asserts shows no count', () => {
    // "Conflicting classifications of pathogenicity" is ClinVar's own summary of
    // the submissions, not any submitter's word, so nothing matches it verbatim.
    // "(0 of 12)" would read as a measure of support; it is a fact about wording.
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Conflicting_classifications_of_pathogenicity'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Conflicting_classifications_of_pathogenicity',
                review_status: 'criteria_provided,_conflicting_classifications',
                rating_scale: 'clinvar_aggregate',
                supporting: 0,
                submissions: 12
              }
            ]
          })
        ]
      }
    });
    expect(
      screen.getByText('Conflicting classifications of pathogenicity')
    ).toBeDefined();
    expect(screen.queryByText(/of 12/)).toBeNull();
  });

  test('ClinVar: a classification packing two terms reads as a list', () => {
    // The enriched VCF joins them with '+', which used to show through.
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification:
                  'Conflicting_classifications_of_pathogenicity+risk_factor',
                review_status: 'criteria_provided,_conflicting_classifications',
                rating_scale: 'clinvar_aggregate',
                supporting: 0,
                submissions: 12
              }
            ]
          })
        ]
      }
    });
    expect(
      screen.getByText(
        'Conflicting classifications of pathogenicity, risk factor'
      )
    ).toBeDefined();
  });

  test('ClinVar renders nothing without an annotation', () => {
    // The germline group gates on the data (`when: present`), so a variant
    // ClinVar knows nothing about gets no ClinVar section at all.
    const { container } = renderOption('phenotypes', {});
    expect(container.innerHTML).toBe('');
  });

  test('the ClinVar option carries only the structural block now', () => {
    // The germline data moved to Phenotypes, so a germline annotation renders
    // nothing here however the sub-options are set — it is not this option's
    // to draw any more.
    const { container } = renderOption('clinvar', {
      subOptionRan: clinvarSvSelected,
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            conflicting_breakdown: []
          })
        ]
      }
    });
    expect(container.innerHTML).toBe('');
  });

  test('ClinVar short: a linked variant-id row above the significance', () => {
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            id: '12345',
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'no_assertion_criteria_provided',
                rating_scale: 'clinvar_aggregate',
                supporting: 1,
                submissions: 1
              }
            ]
          })
        ]
      }
    });
    expect(screen.getByText('ClinVar variant ID')).toBeDefined();
    // the id is a link out to its NCBI ClinVar variation page
    const link = screen.getByRole('link', { name: /12345/ });
    expect(link.getAttribute('href')).toBe(
      'https://www.ncbi.nlm.nih.gov/clinvar/variation/12345/'
    );
  });

  test('ClinVar short: the variant-id row drops when there is no id', () => {
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            conflicting_breakdown: []
          })
        ]
      }
    });
    expect(screen.queryByText('ClinVar variant ID')).toBeNull();
  });

  test('ClinVar: the conditions table — linked condition, counted classifications, stacked records', () => {
    const { container } = renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            id: '440915',
            significance: ['Conflicting_classifications_of_pathogenicity'],
            review_status: 'criteria_provided,_conflicting_classifications',
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'no_assertion_criteria_provided',
                rating_scale: 'clinvar_aggregate',
                supporting: 1,
                submissions: 1
              }
            ],
            records: [
              {
                names: [
                  {
                    name: 'Parkinsonism-dystonia_3,_childhood-onset',
                    ids: 'MONDO:MONDO:0030676,MedGen:C5676913',
                    id_url: 'https://www.ncbi.nlm.nih.gov/medgen/C5676913',
                    id_curie: 'MedGen:C5676913'
                  }
                ],
                classification_type: 'Germline',
                classifications: [
                  { classification: 'Pathogenic', count: 3 },
                  { classification: 'Uncertain_significance', count: 1 }
                ],
                rcv: 'RCV001836831'
              },
              {
                // A second RCV covering the same condition is its own row now:
                // an RCV *is* the aggregate, so it cannot share one.
                names: [
                  {
                    name: 'Parkinsonism-dystonia_3,_childhood-onset',
                    ids: 'MONDO:MONDO:0030676,MedGen:C5676913',
                    id_url: 'https://www.ncbi.nlm.nih.gov/medgen/C5676913',
                    id_curie: 'MedGen:C5676913'
                  }
                ],
                classification_type: 'Germline',
                classifications: [{ classification: 'Benign', count: 1 }],
                rcv: 'RCV006249379'
              },
              {
                // ClinVar has no usable ontology id for this one, so the name
                // must still show — as plain text, not a dead link
                names: [
                  {
                    name: 'WARS2-related_disorder',
                    ids: null,
                    id_url: null,
                    id_curie: null
                  }
                ],
                classification_type: 'Germline',
                classifications: [],
                rcv: null
              }
            ]
          })
        ]
      }
    });
    // The conditions are split by classification type, but neither table names
    // itself: the classification lines above each say which it is, and a
    // heading repeating them said nothing the position did not. ("Germline"
    // does appear on the page — as the classification line's type — so this
    // has to look at headings, not at text.)
    const headings = Array.from(
      container.querySelectorAll('[class*="optionLabel"]')
    ).map((h) => h.textContent);
    expect(headings).not.toContain('Germline');
    expect(headings).not.toContain('Somatic');
    expect(headings).not.toContain('Conditions');

    // The table still sits a step in, under the Classification above it. Two
    // indent wrappers, not one — the ClinVar group already indents everything
    // it holds, so counting is what tells the block's own step from its
    // parent's.
    const table = screen.getByRole('table');
    let indents = 0;
    for (
      let node = table.parentElement;
      node && node !== container;
      node = node.parentElement
    ) {
      if (/indented/.test(node.className)) {
        indents += 1;
      }
    }
    expect(indents).toBe(2);

    // The classification leads, then the condition it is about, then the record.
    const headers = screen.getAllByRole('columnheader');
    expect(headers.map((h) => h.textContent?.slice(0, 14))).toEqual([
      'Classification',
      'Condition',
      'ClinVar record'
    ]);

    // The classification header carries the one note that says something the
    // table cannot show for itself. What a row expands to is not it -- the
    // chevron says that already.
    const notes = headers[0].querySelectorAll('[class*="columnNote"]');
    expect(notes.length).toBe(1);
    // The line about light text is itself in that light text.
    expect(notes[0].className).toMatch(/columnNoteMuted/);
    expect(notes[0].textContent).toContain('not contributing');

    const [linked] = screen.getAllByRole('link', {
      name: /Parkinsonism-dystonia 3, childhood-onset/
    });
    expect(linked.getAttribute('href')).toBe(
      'https://www.ncbi.nlm.nih.gov/medgen/C5676913'
    );

    // classifications carry their submitter counts
    expect(screen.getByText('Pathogenic (3)')).toBeDefined();
    expect(screen.getByText('Uncertain significance (1)')).toBeDefined();

    // each RCV is its own row, linked to its own ClinVar page
    const rcv = screen.getByRole('link', { name: /RCV006249379/ });
    expect(rcv.getAttribute('href')).toBe(
      'https://www.ncbi.nlm.nih.gov/clinvar/RCV006249379/'
    );
    // An accession is one thing: its icon must not be left on the line above.
    // The condition beside it is prose, so it must still be free to wrap —
    // which is why this is declared per item and not a rule for every link.
    expect(rcv.className).toMatch(/nowrap/);
    expect(linked.className).not.toMatch(/nowrap/);
    expect(screen.getByRole('link', { name: /RCV001836831/ })).toBeDefined();

    // the id-less condition shows its name, unlinked
    expect(
      screen.getByRole('cell', { name: 'WARS2-related disorder' })
    ).toBeDefined();
    expect(
      screen.queryByRole('link', { name: /WARS2-related disorder/ })
    ).toBeNull();
  });

  test('ClinVar: one row per finding, with its conditions stacked in the cell', () => {
    // ClinVar files one submission against several conditions at once, so five
    // rows could be one classification by one submitter under five disease
    // names — identical in every column but the condition. The parse collapses
    // them (see the `collapse` post-op); this is the cell that results.
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            id: '387010',
            significance: ['Likely_benign'],
            review_status:
              'criteria_provided,_multiple_submitters,_no_conflicts',
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Likely_benign',
                review_status:
                  'criteria_provided,_multiple_submitters,_no_conflicts',
                rating_scale: 'clinvar_aggregate'
              }
            ],
            records: [
              {
                names: [
                  {
                    name: 'Epidermolysis_bullosa_simplex_with_nail_dystrophy',
                    id_url: 'https://www.ncbi.nlm.nih.gov/medgen/C4225309'
                  },
                  {
                    name: 'Epidermolysis_bullosa_simplex,_Ogna_type',
                    id_url: 'https://www.ncbi.nlm.nih.gov/medgen/C0432317'
                  }
                ],
                classification_type: 'Germline',
                classifications: [
                  { classification: 'Likely_benign', count: 1 }
                ],
                rcv: 'RCV000648657'
              }
            ]
          })
        ]
      }
    });

    // One body row, not two.
    const rows = screen.getAllByRole('row');
    const bodyRows = rows.filter((r) => r.querySelectorAll('td').length > 0);
    expect(bodyRows.length).toBe(1);

    // ...carrying both conditions, each linked in its own right.
    const first = screen.getByRole('link', {
      name: /Epidermolysis bullosa simplex with nail dystrophy/
    });
    const second = screen.getByRole('link', {
      name: /Epidermolysis bullosa simplex, Ogna type/
    });
    expect(first.getAttribute('href')).toBe(
      'https://www.ncbi.nlm.nih.gov/medgen/C4225309'
    );
    expect(second.getAttribute('href')).toBe(
      'https://www.ncbi.nlm.nih.gov/medgen/C0432317'
    );
    // ...and the classification and record are stated once between them.
    expect(screen.getAllByText('Likely benign (1)').length).toBe(1);
    expect(screen.getAllByRole('link', { name: /RCV000648657/ }).length).toBe(
      1
    );
  });

  test('ClinVar: the review status shows its star rating and cites ClinVar', async () => {
    const { container } = renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status:
                  'criteria_provided,_multiple_submitters,_no_conflicts',
                rating_scale: 'clinvar_aggregate',
                supporting: 3,
                submissions: 5
              }
            ],
            rcv: null
          })
        ]
      }
    });
    // The wording stays — the stars summarise it, they don't replace it.
    expect(
      screen.getByText('criteria provided, multiple submitters, no conflicts')
    ).toBeDefined();
    expect(screen.getByRole('img', { name: '2 out of 4' })).toBeDefined();

    // The (?) beside the label points at ClinVar's own account of the
    // classification terms. (QuestionButton is a div with an onClick, so there
    // is no button role to query.)
    await userEvent.click(
      container.querySelector('[class*="questionButton"]') as HTMLElement
    );
    expect(
      screen.getByText(/For more detail regarding ClinVar's clinical/)
    ).toBeDefined();
    const link = screen.getByRole('link', {
      name: /ClinVar clinical significance/
    });
    expect(link.getAttribute('href')).toBe(
      'https://www.ncbi.nlm.nih.gov/clinvar/docs/clinsig/'
    );
  });

  test('ClinVar: a review status the scale does not know shows no rating', () => {
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'some_status_clinvar_has_not_published_yet',
                rating_scale: 'clinvar_aggregate',
                supporting: 3,
                submissions: 5
              }
            ],
            rcv: null
          })
        ]
      }
    });
    expect(
      screen.getByText('some status clinvar has not published yet')
    ).toBeDefined();
    // No stars rather than none-of-four: an unrated term is not a zero rating.
    expect(screen.queryByRole('img', { name: /out of 4/ })).toBeNull();
  });

  test('ClinVar: a submission is rated on the submission scale, not the aggregate one', async () => {
    // "no classification for the individual variant" is an aggregate-only term:
    // ClinVar's scale for a single submission does not list it. So the same
    // wording earns four empty stars at the top and none in the detail — which
    // is what fails if the two scales are ever crossed.
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'no_classification_for_the_individual_variant',
                rating_scale: 'clinvar_aggregate',
                supporting: 3,
                submissions: 5
              }
            ],
            records: [
              {
                names: [
                  {
                    name: 'WARS2-related_disorder',
                    ids: null,
                    id_url: null
                  }
                ],
                classification_type: 'Germline',
                classifications: [
                  {
                    classification: 'Pathogenic',
                    count: 1,
                    submitters: [
                      {
                        submitter: 'Baylor_Genetics',
                        date_last_evaluated: '2022-05-05',
                        review_status:
                          'no_classification_for_the_individual_variant'
                      }
                    ]
                  }
                ],
                rcv: null
              }
            ]
          })
        ]
      }
    });
    expect(screen.getByRole('img', { name: '0 out of 4' })).toBeDefined();

    await userEvent.click(
      screen.getByRole('button', { expanded: false, name: /Pathogenic \(1\)/ })
    );
    expect(screen.getByText('Baylor Genetics')).toBeDefined();
    // Still only the aggregate row's rating — the submission has none.
    expect(screen.getAllByRole('img', { name: /out of 4/ }).length).toBe(1);
  });

  test('ClinVar: a rated submission shows its own stars in the detail', async () => {
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'no_assertion_criteria_provided',
                rating_scale: 'clinvar_aggregate',
                supporting: 1,
                submissions: 1
              }
            ],
            records: [
              {
                names: [
                  {
                    name: 'WARS2-related_disorder',
                    ids: null,
                    id_url: null
                  }
                ],
                classification_type: 'Germline',
                classifications: [
                  {
                    classification: 'Pathogenic',
                    count: 1,
                    submitters: [
                      {
                        submitter: 'Baylor_Genetics',
                        date_last_evaluated: '2022-05-05',
                        review_status: 'criteria_provided,_single_submitter'
                      }
                    ]
                  }
                ],
                rcv: null
              }
            ]
          })
        ]
      }
    });
    await userEvent.click(
      screen.getByRole('button', { expanded: false, name: /Pathogenic \(1\)/ })
    );
    expect(screen.getByRole('img', { name: '1 out of 4' })).toBeDefined();
  });

  test('ClinVar: each classification expands to its own submitters', async () => {
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'no_assertion_criteria_provided',
                rating_scale: 'clinvar_aggregate',
                supporting: 1,
                submissions: 1
              }
            ],
            records: [
              {
                names: [
                  {
                    name: 'Parkinsonism-dystonia_3,_childhood-onset',
                    ids: null,
                    id_url: null
                  }
                ],
                classification_type: 'Germline',
                classifications: [
                  {
                    classification: 'Pathogenic',
                    count: 2,
                    submitters: [
                      {
                        submitter: 'Institute_of_Human_Genetics',
                        date_last_evaluated: '2023-12-01',
                        review_status: 'criteria_provided,_single_submitter'
                      },
                      {
                        submitter: 'Broad_Center_for_Mendelian_Genomics',
                        date_last_evaluated: '2025-01-09',
                        review_status: 'criteria_provided,_single_submitter'
                      }
                    ]
                  },
                  {
                    classification: 'Uncertain_significance',
                    count: 1,
                    submitters: [
                      {
                        submitter: 'Baylor_Genetics',
                        date_last_evaluated: '2022-05-05',
                        review_status: 'criteria_provided,_single_submitter'
                      }
                    ]
                  }
                ],
                rcv: null
              }
            ]
          })
        ]
      }
    });

    // Collapsed: both summaries show, no submitter does.
    expect(screen.getByText('Pathogenic (2)')).toBeDefined();
    expect(screen.getByText('Uncertain significance (1)')).toBeDefined();
    expect(screen.queryByText('Institute of Human Genetics')).toBeNull();
    expect(screen.queryByText('Baylor Genetics')).toBeNull();

    await userEvent.click(
      screen.getByRole('button', { expanded: false, name: /Pathogenic \(2\)/ })
    );

    // Expanded: a line per submitter, with the fields chosen for the detail —
    // and only the ones behind *this* count. The other classification stays
    // shut, which is the whole point of expanding per classification.
    expect(screen.getByText('Institute of Human Genetics')).toBeDefined();
    expect(
      screen.getByText('Broad Center for Mendelian Genomics')
    ).toBeDefined();
    expect(screen.getByText('2025-01-09')).toBeDefined();
    expect(screen.queryByText('Baylor Genetics')).toBeNull();

    await userEvent.click(
      screen.getByRole('button', {
        expanded: false,
        name: /Uncertain significance \(1\)/
      })
    );
    expect(screen.getByText('Baylor Genetics')).toBeDefined();
  });

  test("ClinVar: a submitter's cited publications each link out", async () => {
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'no_assertion_criteria_provided',
                rating_scale: 'clinvar_aggregate',
                supporting: 1,
                submissions: 1
              }
            ],
            records: [
              {
                names: [
                  {
                    name: 'CLAPO_syndrome',
                    ids: null,
                    id_url: null
                  }
                ],
                classification_type: 'Germline',
                classifications: [
                  {
                    classification: 'Pathogenic',
                    count: 2,
                    submitters: [
                      {
                        submitter: '3billion',
                        date_last_evaluated: '2022-05-04',
                        review_status: 'criteria_provided,_single_submitter',
                        // ClinVar packs a submission's citations into one value
                        pmid: '22729224+25599672'
                      },
                      {
                        submitter: 'Baylor_Genetics',
                        date_last_evaluated: '2022-05-05',
                        review_status: 'criteria_provided,_single_submitter',
                        pmid: null
                      }
                    ]
                  }
                ],
                rcv: null
              }
            ]
          })
        ]
      }
    });
    await userEvent.click(
      screen.getByRole('button', { expanded: false, name: /Pathogenic \(2\)/ })
    );

    // Each PMID is its own paper, so each is its own link.
    const first = screen.getByRole('link', { name: /22729224/ });
    expect(first.getAttribute('href')).toBe(
      'https://europepmc.org/article/MED/22729224'
    );
    expect(
      screen.getByRole('link', { name: /25599672/ }).getAttribute('href')
    ).toBe('https://europepmc.org/article/MED/25599672');
    // A submission citing nothing adds no links of its own.
    expect(screen.getAllByRole('link').length).toBe(2);
  });

  test('ClinVar: a submission counting toward the aggregate is set apart', async () => {
    // Contributing submissions sort first, so the emphasised one leads.
    const { container } = renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'no_assertion_criteria_provided',
                rating_scale: 'clinvar_aggregate',
                supporting: 1,
                submissions: 1
              }
            ],
            records: [
              {
                names: [
                  {
                    name: 'CLAPO_syndrome',
                    ids: null,
                    id_url: null
                  }
                ],
                classification_type: 'Germline',
                classifications: [
                  {
                    classification: 'Pathogenic',
                    count: 2,
                    submitters: [
                      {
                        submitter: 'Counted_Lab',
                        date_last_evaluated: '2024-01-01',
                        review_status: 'criteria_provided,_single_submitter',
                        contributes: 1
                      },
                      {
                        submitter: 'Uncounted_Lab',
                        date_last_evaluated: '2020-01-01',
                        review_status: 'no_assertion_criteria_provided',
                        contributes: 0
                      }
                    ]
                  }
                ],
                rcv: null
              }
            ]
          })
        ]
      }
    });
    await userEvent.click(
      screen.getByRole('button', { expanded: false, name: /Pathogenic \(2\)/ })
    );

    const counted = screen.getByText('Counted Lab').closest('div');
    const uncounted = screen.getByText('Uncounted Lab').closest('div');
    expect(counted?.className).toMatch(/emphasisedDetailRow/);
    expect(uncounted?.className).not.toMatch(/emphasisedDetailRow/);
    // Both still render — a submission that does not count is not hidden.
    expect(
      container.querySelectorAll('[class*="expandedDetailRow"]').length
    ).toBe(2);
  });

  test('ClinVar: a classification with no submitters offers nothing to expand', () => {
    renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'no_assertion_criteria_provided',
                rating_scale: 'clinvar_aggregate',
                supporting: 1,
                submissions: 1
              }
            ],
            records: [
              {
                names: [
                  {
                    name: 'WARS2-related_disorder',
                    ids: null,
                    id_url: null
                  }
                ],
                classification_type: 'Germline',
                classifications: [
                  { classification: 'Pathogenic', count: 1, submitters: [] }
                ],
                rcv: null
              }
            ]
          })
        ]
      }
    });
    expect(screen.getByText('Pathogenic (1)')).toBeDefined();
    // no control, rather than one that opens onto nothing
    expect(screen.queryByRole('button', { name: /Pathogenic/ })).toBeNull();
  });

  test('ClinVar structural variants: a headed significance + origin block', () => {
    renderOption('clinvar', {
      subOptionRan: clinvarSvSelected,
      allele: [
        annotation('clinvar_sv', 'allele', {
          significance: ['Pathogenic'],
          origin: ['germline']
        })
      ]
    });
    expect(screen.getByText('Structural variant')).toBeDefined();
    expect(screen.getByText('Clinical significance')).toBeDefined();
    expect(screen.getByText('Pathogenic')).toBeDefined();
    expect(screen.getByText('Origin')).toBeDefined();
    // humanize_join replaces underscores with spaces (ClinVar origin terms are
    // lowercase, e.g. "germline", "de_novo" -> "de novo").
    expect(screen.getByText('germline')).toBeDefined();
  });

  // --- view gating + list-as-rows + row/item link builder + count (ProtVar) --

  test('ProtVar default view: headed per-pocket / interface rows, links', () => {
    renderOption('protvar', {
      consequence: {
        annotations: [
          annotation('protvar', 'transcript', {
            structure_stability_score: 1.23,
            pockets: [
              { pocket_id: '1', score: 0.5 },
              { pocket_id: '2', score: null } // no score, still renders + links
            ],
            interaction_interfaces: [{ partner: 'P12345', score: 0.9 }]
          })
        ]
      },
      protvarUrl: 'https://protvar.example/x'
    });
    expect(screen.getByText('ProtVar')).toBeDefined(); // option heading
    // The names match Show all's exactly -- the two views used to disagree
    // ("Stability" vs "Protein Structure Stability", and the lists were
    // unheaded), so the same value was labelled differently either side of a
    // toggle.
    expect(screen.getByText('Protein Structure Stability')).toBeDefined();
    expect(screen.getByText('1.23')).toBeDefined();
    expect(screen.getByText('Protein Pockets')).toBeDefined();
    expect(
      screen.getByText('Protein-Protein Interaction Interface')
    ).toBeDefined();
    // templated item labels, the detail Show all replaces with a count
    expect(screen.getByText('Pocket 1')).toBeDefined();
    expect(screen.getByText('0.5')).toBeDefined();
    expect(screen.getByText('Pocket 2')).toBeDefined();
    expect(screen.getByText('Interface P12345')).toBeDefined();
    // the ProtVar builder link (same href) is on every row. Now that both views
    // share their labels this count is what proves the Show-all block is gated
    // out: were it also rendering, its three rows would each add a link.
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
    expect(links[0].getAttribute('href')).toBe('https://protvar.example/x');
  });

  test('ProtVar Show-all view: the same itemised detail as the default view', () => {
    renderOption('protvar', {
      consequence: {
        annotations: [
          annotation('protvar', 'transcript', {
            structure_stability_score: 1.23,
            pockets: [
              { pocket_id: '1', score: 0.5 },
              { pocket_id: '2', score: 1 }
            ],
            interaction_interfaces: [] // none -> dash, no link
          })
        ]
      },
      showAll: true,
      subOptionRan: () => true, // all three ProtVar sub-options ran
      protvarUrl: 'https://protvar.example/x'
    });
    expect(screen.getByText('Protein Structure Stability')).toBeDefined();
    expect(screen.getByText('1.23')).toBeDefined();
    // Pockets itemise here exactly as they do by default -- Show all used to
    // collapse them to a count ("2"), so the same variant read differently
    // either side of the toggle.
    expect(screen.getByText('Protein Pockets')).toBeDefined();
    expect(screen.getByText('Pocket 1')).toBeDefined();
    expect(screen.getByText('0.5')).toBeDefined();
    expect(screen.getByText('Pocket 2')).toBeDefined();
    // ...but a sub-option that ran and found nothing still earns its dash,
    // which is the whole point of Show all.
    expect(
      screen.getByText('Protein-Protein Interaction Interface')
    ).toBeDefined();
    expect(screen.getByText('—')).toBeDefined();
    // one link per value: stability + the two pockets. The dash carries none.
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  test('ProtVar Show-all view: an unselected sub-option is dropped, not dashed', () => {
    renderOption('protvar', {
      consequence: {
        annotations: [
          annotation('protvar', 'transcript', {
            structure_stability_score: 1.23,
            pockets: [],
            interaction_interfaces: []
          })
        ]
      },
      showAll: true,
      // only stability ran; the empty-list dash rows must respect that gate,
      // or Show all would advertise sub-options the user never selected.
      subOptionRan: (id: string) => id === 'protvar_stability',
      protvarUrl: 'https://protvar.example/x'
    });
    expect(screen.getByText('Protein Structure Stability')).toBeDefined();
    expect(screen.queryByText('Protein Pockets')).toBeNull();
    expect(
      screen.queryByText('Protein-Protein Interaction Interface')
    ).toBeNull();
  });

  test('ProtVar: builder link on a row and on list items', () => {
    renderOption('protvar', {
      consequence: {
        annotations: [
          annotation('protvar', 'transcript', {
            structure_stability_score: 1.23,
            pockets: [{ pocket_id: 'P34', energy: 2, score: 0.324 }]
          })
        ]
      },
      protvarUrl: 'https://www.ebi.ac.uk/ProtVar/query?chromosome=1',
      subOptionRan: () => true
    });
    const scoreLink = screen.getByText('0.324').closest('a');
    expect(scoreLink?.getAttribute('href')).toBe(
      'https://www.ebi.ac.uk/ProtVar/query?chromosome=1'
    );
  });

  // --- app_popup link builder (protein) -------------------------------------

  test('protein: the id as an in-app "View in" popup trigger (a button)', () => {
    renderOption('protein', {
      consequence: {
        annotations: [
          annotation('protein', 'transcript', {
            ensembl_protein_id: 'ENSP00000269305'
          })
        ],
        stable_id: 'ENST00000357654'
      } as unknown as PredictedTranscriptConsequence,
      genomeId: 'homo_sapiens_GCA_000001405_29'
    });
    expect(screen.getByText('Protein ID')).toBeDefined();
    // the app_popup builder wraps the id in the popup trigger button
    const trigger = screen.getByText('ENSP00000269305').closest('button');
    expect(trigger).not.toBeNull();
  });

  test('protein: plain id (no popup) when the consequence has no gene', () => {
    renderOption('protein', {
      consequence: {
        annotations: [
          annotation('protein', 'transcript', {
            ensembl_protein_id: 'ENSP00000269305'
          })
        ]
      }
    });
    expect(screen.getByText('ENSP00000269305').closest('button')).toBeNull();
  });

  test('protein: renders nothing without an id', () => {
    const { container } = renderOption('protein', {
      consequence: {
        annotations: [
          annotation('protein', 'transcript', { ensembl_protein_id: null })
        ]
      }
    });
    expect(container.innerHTML).toBe('');
  });

  // --- IntAct: view + when coalesce + count + sub-option counts --------------
});

test('IntAct: the interactions table is in the default view, not behind Show all', () => {
  renderOption('intact', {
    consequence: {
      annotations: [
        annotation('intact', 'transcript', {
          interactions: [
            { interaction_ac: 'EBI-1', feature_type: 'mutation' },
            { interaction_ac: 'EBI-2', feature_type: 'mutation decreasing' }
          ]
        })
      ]
    }
    // deliberately no showAll
  });
  expect(screen.getByText('IntAct')).toBeDefined();
  expect(screen.getByText('EBI-1')).toBeDefined();
  expect(screen.getByText('mutation decreasing')).toBeDefined();
  expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(
    ['Interaction AC', 'Feature Type']
  );
});

describe('IntAct interactions table', () => {
  // Two entries of a real IntAct return. The columns are parallel and
  // positional; each object here is one zipped interaction.
  const interactions = [
    {
      interaction_ac: 'EBI-27104114',
      feature_type: 'mutation',
      interaction_participants: 'uniprotkb:P00520_and_uniprotkb:P37840',
      feature_short_label: 'P37840:p.Ala53Thr',
      ap_ac: 'uniprotkb:P37840',
      pmid: '27348587',
      feature_ac: 'EBI-27104121'
    },
    {
      interaction_ac: 'EBI-8841537',
      feature_type: 'mutation',
      interaction_participants: 'intact:EBI-999_and_uniprotkb:P37840',
      feature_short_label: 'P37840:p.Ala53Thr',
      ap_ac: 'EBI-not-a-uniprot-id',
      pmid: '12059041',
      feature_ac: 'EBI-8841557'
    }
  ];

  const renderIntact = (subOptionRan: () => boolean = () => true) =>
    renderOption('intact', {
      consequence: {
        annotations: [annotation('intact', 'transcript', { interactions })]
      },
      showAll: true,
      subOptionRan
    });

  it('links each identifier to its own resource', () => {
    renderIntact();

    expect(
      screen.getByText('EBI-27104114').closest('a')?.getAttribute('href')
    ).toBe('https://www.ebi.ac.uk/intact/details/interaction/EBI-27104114');
    expect(
      screen.getByText('27348587').closest('a')?.getAttribute('href')
    ).toBe('https://europepmc.org/article/MED/27348587');
  });

  it('splits packed participants into a link each, without the prefix', () => {
    renderIntact();

    // "uniprotkb:P00520_and_uniprotkb:P37840" is two accessions, not one.
    expect(screen.getByText('P00520').closest('a')?.getAttribute('href')).toBe(
      'https://www.uniprot.org/uniprotkb/P00520/entry'
    );
    expect(
      screen.getAllByText('P37840')[0].closest('a')?.getAttribute('href')
    ).toBe('https://www.uniprot.org/uniprotkb/P37840/entry');
  });

  it('stacks a split column one value per line, in the cell container', () => {
    renderIntact();

    // The participants share one cell and each takes a line of it, rather than
    // running on inline: an inline run makes the column claim the width of all
    // its values at once, which squeezed the accession beside it until it broke
    // mid-id. They stack in the same container a cell of `items` uses.
    const cell = screen.getByText('P00520').closest('td');
    const stack = cell?.firstElementChild;

    expect(stack?.className).toMatch(/cellItems/);
    expect(stack?.querySelectorAll('a').length).toBeGreaterThan(1);

    // ...and no separator text was left between them.
    expect(cell?.textContent).toBe('P00520P37840');
  });

  it('leaves values without the uniprotkb prefix as plain text', () => {
    renderIntact();

    // A participant that is not a UniProt accession must not be linked to
    // UniProt, and neither must an affected protein that carries no prefix.
    expect(screen.getByText(/intact:EBI-999/)).toBeTruthy();
    expect(screen.queryByText('EBI-999')).toBeNull();
    expect(screen.getByText(/EBI-not-a-uniprot-id/).closest('a')).toBeNull();
  });

  it('drops columns whose sub-option did not run', () => {
    // Only the always-emitted columns; the four sub-option columns go.
    renderIntact(() => false);

    const headers = screen
      .getAllByRole('columnheader')
      .map((h) => h.textContent);
    expect(headers).toEqual(['Interaction AC', 'Feature Type']);
    expect(screen.queryByText('27348587')).toBeNull();
  });

  it('lifts an invariant column out of the table, keeping a varying one in', () => {
    // In this data every interaction shares one feature short label, but the
    // affected proteins differ — so the first is lifted and the second is not.
    renderIntact();

    expect(
      screen.getAllByRole('columnheader').map((h) => h.textContent)
    ).toEqual([
      'Interaction AC',
      'Feature Type',
      'Interaction Participants',
      'Affected Protein',
      'PubMed Links'
    ]);
    // shown once, above the table, rather than on every row
    expect(screen.getAllByText('P37840:p.Ala53Thr')).toHaveLength(1);
  });

  it('keeps every column when all of them vary', () => {
    renderOption('intact', {
      consequence: {
        annotations: [
          annotation('intact', 'transcript', {
            interactions: [
              { ...interactions[0], feature_short_label: 'P37840:p.Ala53Thr' },
              { ...interactions[1], feature_short_label: 'P37840:p.Glu46Lys' }
            ]
          })
        ]
      },
      showAll: true,
      subOptionRan: () => true
    });

    expect(
      screen.getAllByRole('columnheader').map((h) => h.textContent)
    ).toEqual([
      'Interaction AC',
      'Feature Type',
      'Interaction Participants',
      'Feature short label',
      'Affected Protein',
      'PubMed Links'
    ]);
  });

  it('lifts a linked column with its link intact', () => {
    renderOption('intact', {
      consequence: {
        annotations: [
          annotation('intact', 'transcript', {
            // one shared affected protein across both interactions
            interactions: interactions.map((i) => ({
              ...i,
              ap_ac: 'uniprotkb:P37840'
            }))
          })
        ]
      },
      showAll: true,
      subOptionRan: () => true
    });

    const headers = screen
      .getAllByRole('columnheader')
      .map((h) => h.textContent);
    expect(headers).not.toContain('Affected Protein');
    // the lifted value keeps the prefix stripping and the UniProt link
    const lifted = screen.getAllByText('P37840').find((el) => el.closest('a'));
    expect(lifted?.closest('a')?.getAttribute('href')).toBe(
      'https://www.uniprot.org/uniprotkb/P37840/entry'
    );
  });
  /**
   * The option's help hangs on whatever turns out to be its visible title, and
   * that node differs by option shape. These pin all four shapes, because the
   * anchor is claimed at render time rather than decided up front.
   */
});

describe('option help on the results heading', () => {
  const help: OptionHelp = {
    description: 'What this annotation means.',
    links: [{ href: 'https://example.org/source' }]
  };

  const openHelp = async (container: HTMLElement) => {
    const button = container.querySelector(
      '[class*="questionButton"]'
    ) as HTMLElement;
    expect(button).toBeDefined();
    await userEvent.click(button);
  };

  it('hangs it on a block heading (SpliceAI)', async () => {
    const { container } = renderOption('spliceai', {
      consequence: {
        annotations: [
          annotation('spliceai', 'transcript', {
            symbol: 'BRCA2',
            events: [{ event: 'DG', delta: 0.9, position: 12 }]
          })
        ]
      },
      help
    });
    expect(screen.getByText('SpliceAI')).toBeDefined();
    await openHelp(container);
    expect(screen.getByText(/What this annotation means/)).toBeDefined();
  });

  it('hangs it on an option-level heading (ProtVar)', async () => {
    const { container } = renderOption('protvar', {
      consequence: {
        annotations: [
          annotation('protvar', 'transcript', {
            pockets: [{ pocket_id: '1', energy: 2, score: 3 }]
          })
        ]
      },
      help
    });
    expect(screen.getByText('ProtVar')).toBeDefined();
    await openHelp(container);
    expect(screen.getByText(/What this annotation means/)).toBeDefined();
  });

  it('hangs it on the title row of a headingless option (REVEL)', async () => {
    const { container } = renderOption('revel', {
      consequence: {
        annotations: [annotation('revel', 'transcript', { score: 0.42 })]
      },
      help
    });
    await openHelp(container);
    expect(screen.getByText(/What this annotation means/)).toBeDefined();
  });

  // The whole reason the anchor is claimed rather than assigned: ClinVar's
  // two shapes are different blocks and only one of them draws.
  it('follows ClinVar to whichever of its shapes drew', async () => {
    const { container } = renderOption('phenotypes', {
      consequence: {
        annotations: [
          annotation('clinvar', 'transcript', {
            significance: ['Pathogenic'],
            classification_summary: [
              {
                type: 'Germline',
                classification: 'Pathogenic',
                review_status: 'reviewed_by_expert_panel',
                rating_scale: 'clinvar_aggregate',
                supporting: 3,
                submissions: 4
              }
            ]
          })
        ]
      },
      help
    });
    await openHelp(container);
    expect(screen.getByText(/What this annotation means/)).toBeDefined();
  });

  it('claims once, so a nested heading does not repeat it', async () => {
    const { container } = renderOption('phenotypes', {
      allele: [
        annotation('phenotype_data', 'allele', {
          phenotypes: [
            {
              type: 'Gene',
              source: 'GenCC',
              phenotype: 'Li-Fraumeni_syndrome',
              id: 'ENSG00000141510',
              risk_allele: null
            },
            {
              type: 'Variation',
              source: 'ClinVar',
              phenotype: 'BREAST_CANCER',
              id: 'rs699',
              risk_allele: null
            }
          ]
        })
      ],
      help
    });
    expect(
      container.querySelectorAll('[class*="questionButton"]')
    ).toHaveLength(1);
  });

  it('renders exactly as before when the option has no help', () => {
    const { container } = renderOption('revel', {
      consequence: {
        annotations: [annotation('revel', 'transcript', { score: 0.42 })]
      }
    });
    expect(
      container.querySelectorAll('[class*="questionButton"]')
    ).toHaveLength(0);
  });
});

describe('table column alignment', () => {
  /**
   * The house rule is by data type: numbers right so a column of figures lines
   * up on its digits, text left. Derived from the format, so a spec normally
   * says nothing — `align` is only for a number the source publishes as a
   * string (OpenTargets' p-value).
   */
  const alignmentOf = (container: HTMLElement, selector: string) =>
    [...container.querySelectorAll(selector)].map((cell) =>
      cell.className.includes('alignRight') ? 'right' : 'left'
    );

  it('right-aligns numeric columns and their headers (SpliceAI deltas)', () => {
    const { container } = renderOption('spliceai', {
      consequence: {
        annotations: [
          annotation('spliceai', 'transcript', {
            symbol: 'BRCA2',
            events: [{ event: 'DG', delta: 0.9, position: 12 }]
          })
        ]
      }
    });
    // Splicing event | ΔS | ΔP
    expect(alignmentOf(container, 'th')).toEqual(['left', 'right', 'right']);
    expect(alignmentOf(container, 'tbody tr:first-child td')).toEqual([
      'left',
      'right',
      'right'
    ]);
  });

  it('right-aligns a p-value stated by `align`, not by its format', () => {
    const { container } = renderOption('opentargets', {
      allele: [
        annotation('opentargets', 'allele', {
          gwas_associations: [
            {
              disease: 'EFO_1',
              disease_label: 'a disease',
              gene_id: 'ENSG_A',
              l2g_score: 0.42,
              p_value: '3.32e-28',
              beta: 0.0125
            }
          ],
          qtl_associations: []
        })
      ],
      openTargetsVariantId: '1_1_A_G'
    });
    // Disease | Gene | Lead variant p-value | beta coefficient | L2G
    expect(alignmentOf(container, 'th')).toEqual([
      'left',
      'left',
      'right',
      'right',
      'right'
    ]);
    expect(alignmentOf(container, 'tbody tr:first-child td')).toEqual([
      'left',
      'left',
      'right',
      'right',
      'right'
    ]);
  });
});

/**
 * A `map_rows` block draws one row per vocabulary entry rather than naming its
 * fields up front, because an allele frequency's populations are a dict chosen
 * per submission. These cover the three fields that steer it: `vocabulary`
 * (which shipped list supplies the rows), `scope` (which slice of it), and
 * `overall_from` (where the "" entry reads, since the all-ancestry figure sits
 * beside the dict rather than inside it).
 */
describe('map_rows: rows from a shipped vocabulary', () => {
  // As the response ships it: one list covering every source, each entry
  // naming the source it belongs to. The "" population is the source's
  // all-ancestry figure.
  const afPopulations: VocabularyEntry[] = [
    { scope: 'gnomad_exomes', code: '', label: 'All' },
    { scope: 'gnomad_genomes', code: '', label: 'All' },
    {
      scope: 'gnomad_genomes',
      code: 'grpmax',
      label: 'Maximum across all groups'
    },
    { scope: 'all_of_us', code: '', label: 'All' },
    { scope: 'all_of_us', code: 'max', label: 'Maximum subpopulation' }
  ];

  const genomes = (data: Record<string, unknown>) => ({
    allele: [annotation('gnomad_genomes', 'allele', data)],
    vocabularies: { af_populations: afPopulations }
  });

  it('reads the "" entry from overall_from, beside the dict rather than in it', () => {
    renderOption(
      'gnomad_genomes',
      genomes({
        overall: 0.0114171,
        populations: { grpmax: 0.03 }
      })
    );
    // Both rows come from the same vocabulary, but by different routes: "All"
    // via `overall_from`, the rest by key from the populations dict.
    expect(screen.getByText('All')).toBeDefined();
    expect(screen.getByText('0.01142')).toBeDefined();
    expect(screen.getByText('Maximum across all groups')).toBeDefined();
    expect(screen.getByText('0.03')).toBeDefined();
  });

  it('draws only its own scope, though one vocabulary covers every source', () => {
    renderOption(
      'gnomad_genomes',
      genomes({
        overall: 0.0114171,
        populations: { grpmax: 0.03 }
      })
    );
    // gnomAD Exomes and All of Us are in the same list. Their rows belong to
    // their own blocks, so this one must not draw them — and "Maximum
    // subpopulation" is All of Us's label, not a variant of this block's.
    expect(screen.queryByText('Maximum subpopulation')).toBeNull();
    // Two rows drawn: this source's "" and its one population.
    expect(screen.getAllByText('All')).toHaveLength(1);
  });

  it('draws nothing when the vocabulary it names was not shipped', () => {
    // The block asks for `af_populations`; the job shipped something else. No
    // rows can be discovered, so the block is absent rather than empty.
    const { container } = renderOption('gnomad_genomes', {
      allele: [
        annotation('gnomad_genomes', 'allele', {
          overall: 0.0114171,
          populations: { grpmax: 0.03 }
        })
      ],
      vocabularies: { something_else: afPopulations }
    });
    expect(container.textContent).toBe('');
  });

  it('drops a population the variant has no value for', () => {
    renderOption(
      'gnomad_genomes',
      genomes({
        overall: 0.0114171,
        populations: {}
      })
    );
    // Selected, but this variant has no figure for it: the default view omits
    // the row entirely rather than showing an empty one.
    expect(screen.getByText('All')).toBeDefined();
    expect(screen.queryByText('Maximum across all groups')).toBeNull();
  });

  it('lists that population with a dash under "Show all"', () => {
    renderOption('gnomad_genomes', {
      ...genomes({ overall: 0.0114171, populations: {} }),
      showAll: true
    });
    // Every entry in the vocabulary was selected — that is what being there
    // means — so "Show all" accounts for it rather than hiding it.
    expect(screen.getByText('Maximum across all groups')).toBeDefined();
    expect(screen.getByText('—')).toBeDefined();
  });
});
