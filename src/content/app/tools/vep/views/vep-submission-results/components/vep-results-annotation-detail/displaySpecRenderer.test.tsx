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
import { displaySpecFixture } from './displaySpec.fixture';

import type { Annotation } from 'src/content/app/tools/vep/types/vepResultsResponse';
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
    consequence?: Annotation[];
    allele?: Annotation[];
    spec?: DisplaySpec;
    showAll?: boolean;
    subOptionRan?: (optionId: string, defaultValue: boolean) => boolean;
    protvarUrl?: string;
    genomeId?: string;
    help?: OptionHelp;
    openTargetsVariantId?: string;
    // extra typed fields the consequence carries for a link builder (the
    // protein popup reads gene_stable_id off the consequence).
    geneStableId?: string;
  }
) =>
  render(
    <>
      {renderDisplayOption({
        option: optionSpec(optionId),
        spec: entities.spec ?? spec,
        consequence: {
          annotations: entities.consequence ?? [],
          gene_stable_id: entities.geneStableId
        } as AnnotatedEntity,
        allele: { annotations: entities.allele ?? [] },
        showAll: entities.showAll,
        subOptionRan: entities.subOptionRan,
        protvarUrl: entities.protvarUrl,
        genomeId: entities.genomeId,
        help: entities.help,
        openTargetsVariantId: entities.openTargetsVariantId
      })}
    </>
  );

afterEach(cleanup);

describe('renderDisplayOption', () => {
  /**
   * The point of shipping `plugin_scopes` rather than authoring the scope on
   * each row: the same reference resolves against the allele or the transcript
   * consequence purely on the parsing plugin's say-so.
   */
  it('reads an allele-scoped plugin from the allele, not the consequence', () => {
    renderOption('cadd', {
      allele: [annotation('cadd', 'allele', { phred: 24.6, raw: 3.21 })],
      // a same-named entry on the consequence must be ignored
      consequence: [annotation('cadd', 'transcript', { phred: 99, raw: 88 })]
    });
    // Both CADD scores (PHRED and RAW) render, read from the allele.
    expect(screen.getByText('24.6')).toBeDefined();
    expect(screen.getByText('3.21')).toBeDefined();
    expect(screen.queryByText('99')).toBeNull();
    expect(screen.queryByText('88')).toBeNull();
  });

  it('reads a transcript-scoped plugin from the consequence', () => {
    renderOption('loeuf', {
      consequence: [annotation('loeuf', 'transcript', { score: 0.123 })],
      allele: [annotation('loeuf', 'allele', { score: 9 })]
    });
    expect(screen.getByText('0.123')).toBeDefined();
    expect(screen.queryByText('9')).toBeNull();
  });

  /**
   * `requires` is what keeps SpliceAI's event table from rendering for a variant
   * the plugin said nothing about.
   */
  it('renders nothing for a block whose required plugin produced no annotation', () => {
    const { container } = renderOption('spliceai', {});
    expect(container.innerHTML).toBe('');
  });

  it('renders the SpliceAI event table once the required plugin is present', () => {
    renderOption('spliceai', {
      consequence: [
        annotation('spliceai', 'transcript', {
          symbol: null,
          ds_acceptor_gain: 0
        })
      ]
    });
    expect(screen.getByText('SpliceAI')).toBeDefined();
    // The absent gene symbol drops its row; the table still renders.
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
      consequence: [
        annotation('eve', 'transcript', {
          classification: 'likely_pathogenic',
          score: 0.812
        }),
        annotation('popeve', 'transcript', {
          score: -3.21,
          gap_frequency: 0.07
        })
      ]
    });
    expect(screen.getByText('EVE')).toBeDefined();
    expect(screen.getByText('0.812 (likely pathogenic)')).toBeDefined();
    expect(screen.getByText('popEVE')).toBeDefined();
    expect(screen.getByText('Gap frequency')).toBeDefined();
  });

  /** A row's help can cite a source: the recommended gap-frequency threshold is
   * the popEVE authors', so the help says where to read it. */
  it("renders a help row's cited source as a link", async () => {
    const { container } = renderOption('eve', {
      consequence: [
        annotation('popeve', 'transcript', {
          score: -3.21,
          gap_frequency: 0.07
        })
      ]
    });
    // The help sits behind the (?) control, so open it first. QuestionButton is
    // a div with an onClick rather than a <button>, so there is no button role
    // to query here.
    const questionButton = container.querySelector(
      '[class*="questionButton"]'
    ) as HTMLElement;
    expect(questionButton).toBeDefined();
    await userEvent.click(questionButton);
    expect(screen.getByText(/Authors recommend filtering/)).toBeDefined();
    const link = screen.getByRole('link', { name: /popEVE paper/ });
    expect(link.getAttribute('href')).toBe(
      'https://www.nature.com/articles/s41588-025-02400-1'
    );
    // opened in a new tab, and without handing the referrer to the target
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  /** A composed value needs its classification; a lone score is not a value. */
  it('drops a composed row that has a score but no classification', () => {
    const { container } = renderOption('alphamissense', {
      consequence: [
        annotation('alphamissense', 'transcript', {
          classification: null,
          score: 0.5
        })
      ]
    });
    expect(container.innerHTML).toBe('');
  });

  it('renders a composed row without its score', () => {
    renderOption('alphamissense', {
      consequence: [
        annotation('alphamissense', 'transcript', {
          classification: 'likely_benign',
          score: null
        })
      ]
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
      consequence: [
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
      consequence: [
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
      consequence: [
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
    renderOption('phenotypes', {
      allele: [
        annotation('phenotype_data', 'allele', {
          phenotypes: [
            phenotype({
              type: 'Gene',
              source: 'GenCC',
              phenotype: 'Li-Fraumeni_syndrome',
              id: 'ENSG00000141510'
            }),
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
    // The two phenotype tables divide the list exhaustively — one takes `Gene`,
    // the other everything else — so a type the pipeline starts emitting is
    // still shown. It no longer gets a heading of its own (the sections are
    // named in the spec now, not built from the data), but being filed under
    // "Variant associated" beats vanishing between two tables that each name
    // what they want.
    expect(screen.getByText('Melanoma')).toBeDefined();
    expect(screen.getByText('Variant associated')).toBeDefined();
    expect(screen.queryByText('Gene associated')).toBeNull();
  });

  it('gives ClinVar associations their own table with a Classification column', () => {
    renderOption('phenotypes', {
      allele: [
        annotation('phenotype_data', 'allele', {
          phenotypes: [
            phenotype({
              type: 'Variation',
              source: 'NHGRI-EBI_GWAS_catalog',
              phenotype: 'Atrial_fibrillation',
              risk_allele: 'A'
            })
          ],
          // parsed into their own target: only ClinVar carries a significance
          clinvar_phenotypes: [
            {
              ...phenotype({
                type: 'Variation',
                source: 'ClinVar',
                phenotype: 'Autosomal_dominant_Parkinson_disease_1',
                risk_allele: 'T'
              }),
              clinvar_clin_sig: 'pathogenic'
            }
          ]
        })
      ]
    });
    // the GWAS rows get a headed section; the ClinVar table is unheaded, its
    // source carried by the column label instead
    expect(screen.getByText('Variant associated')).toBeDefined();
    expect(screen.queryByText('ClinVar')).toBeNull();
    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(2);
    // the GWAS table keeps Phenotype | Source; the ClinVar one names its source
    // in the Phenotype header and swaps Source for Classification, since every
    // row of it is ClinVar anyway
    expect(
      within(tables[0])
        .getAllByRole('columnheader')
        .map((c) => c.textContent)
    ).toEqual(['Phenotype', 'Source']);
    expect(
      within(tables[1])
        .getAllByRole('columnheader')
        .map((c) => c.textContent)
    ).toEqual(['Phenotype (ClinVar)', 'Classification']);
    expect(screen.getByRole('cell', { name: 'pathogenic' })).toBeDefined();
    // `indent` puts the unheaded ClinVar table in the same indent container a
    // heading gives its children, so it lines up with the headed table beside it
    // rather than standing a step out from it.
    const depth = (table: HTMLElement) => {
      let steps = 0;
      for (let el = table.parentElement; el; el = el.parentElement) {
        if (el.className.includes('optionChildren')) steps += 1;
      }
      return steps;
    };
    // the count is asserted, not just the equality, so an empty class name
    // (0 === 0) cannot pass this vacuously
    expect(depth(tables[0])).toBeGreaterThan(1);
    expect(depth(tables[1])).toEqual(depth(tables[0]));
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
      allele: [
        annotation('phenotype_data', 'allele', {
          phenotypes: [
            ...genes,
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
      consequence: [
        annotation('go', 'transcript', {
          // one aspect, so this exercises truncation rather than grouping
          go_terms: [1, 2, 3, 4, 5].map((n) => ({
            id: `GO:${n}`,
            name: `term ${n}`,
            namespace: 'biological_process'
          }))
        })
      ]
    });
    // visible_count is 3: the first three show, the rest hide behind "+ 2 more".
    expect(screen.getByText('term 3')).toBeDefined();
    expect(screen.queryByText('term 4')).toBeNull();
    expect(screen.getByText('+ 2 more')).toBeDefined();
  });

  it('renders nothing for an empty list', () => {
    const { container } = renderOption('go', {
      consequence: [annotation('go', 'transcript', { go_terms: [] })]
    });
    expect(container.innerHTML).toBe('');
  });

  // --- option-level heading spanning multiple blocks (MaveDB) ---------------

  it('wraps a multi-block option under one option-level heading', () => {
    renderOption('mavedb', {
      consequence: [
        annotation('mavedb', 'transcript', {
          protein_variant: 'p.Arg72Pro',
          assays: [
            { urn: 'urn:mavedb:1', score: 1.234 },
            { urn: 'urn:mavedb:2', score: -0.5 }
          ]
        })
      ]
    });
    expect(screen.getByText('MaveDB')).toBeDefined(); // the option heading
    expect(screen.getByText('p.Arg72Pro')).toBeDefined(); // rows block
    const link = screen.getByText('urn:mavedb:1').closest('a'); // list block
    expect(link?.getAttribute('href')).toBe(
      'https://www.mavedb.org/score-sets/urn:mavedb:1'
    );
    expect(screen.getByText('1.234')).toBeDefined();
  });

  it('shows the option heading even when only one of its blocks survives', () => {
    // No variant row, but the assays list survives — the "MaveDB" heading spans
    // both blocks, so it still shows.
    renderOption('mavedb', {
      consequence: [
        annotation('mavedb', 'transcript', {
          protein_variant: null,
          assays: [{ urn: 'urn:x', score: 2 }]
        })
      ]
    });
    expect(screen.getByText('MaveDB')).toBeDefined();
    expect(screen.getByText('urn:x')).toBeDefined();
    expect(screen.queryByText('Variant')).toBeNull();
  });

  // --- sub-option rows: Show-all enumeration (mutfunc) ----------------------

  it('sub-option rows: default view shows only the ones with a value', () => {
    renderOption('mutfunc', {
      consequence: [
        annotation('mutfunc', 'transcript', {
          linear_motifs: 0.5,
          protein_interactions: null
        })
      ]
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
      consequence: [
        annotation('mutfunc', 'transcript', {
          linear_motifs: 0.5, // selected + value
          protein_interactions: null, // selected + empty -> dash
          protein_structure: 0.9 // NOT selected, but has a value -> dropped
        })
      ],
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
      'Disease association',
      'Target Gene',
      'Lead variant p-value',
      'beta',
      'Locus to Gene (L2G) Score',
      'BioSample',
      'Target Gene',
      'Lead variant p-value',
      'beta'
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
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    // the icon precedes the text inside the anchor — the house rule for every
    // link, so it needs no class of its own
    expect(link?.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    // and the link sits on its own line under the heading rather than being
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

  // Short and structural variants are independent sub-options under the ClinVar
  // master; each block gates on its own sub-option via `requires_selected`.
  const clinvarShortSelected = (id: string) => id === 'clinvar_short';
  const clinvarSvSelected = (id: string) => id === 'clinvar_sv';

  it('ClinVar without a conflicting breakdown: a bare significance row', () => {
    renderOption('clinvar', {
      subOptionRan: clinvarShortSelected,
      allele: [
        annotation('clinvar', 'allele', {
          significance: ['Pathogenic'],
          conflicting_breakdown: []
        })
      ]
    });
    // `when: empty` picks the bare-row block; the humanize_join formats it
    expect(screen.getByText('Clinical significance')).toBeDefined();
    expect(screen.getByText('Pathogenic')).toBeDefined();
    // the headed / breakdown shape is gated out
    expect(screen.queryByText('Classification')).toBeNull();
  });

  it('ClinVar with a conflicting breakdown: the term stays on the significance row, over a table of per-class counts', () => {
    renderOption('clinvar', {
      subOptionRan: clinvarShortSelected,
      allele: [
        annotation('clinvar', 'allele', {
          significance: ['Conflicting_classifications_of_pathogenicity'],
          conflicting_breakdown: [
            { significance: 'Likely_benign', count: 3 },
            { significance: 'Pathogenic', count: 1 }
          ]
        })
      ]
    });
    // The conflicting case uses the same labelled row as the plain one, so the
    // term reads on the significance line rather than a line below it. The
    // label appears once, as a row label -- not as a heading with the value
    // orphaned underneath.
    const label = screen.getByText('Clinical significance');
    const term = screen.getByText(
      'Conflicting classifications of pathogenicity'
    );
    expect(screen.getAllByText('Clinical significance').length).toBe(1);
    expect(label.parentElement).toBe(term.parentElement);
    // the only "Classification" in the block is the breakdown table's column
    expect(screen.getAllByText('Classification').length).toBe(1);
    // the breakdown renders as a table: header columns then a row per class
    // (the class humanised) with its count
    expect(
      screen.getByRole('columnheader', { name: 'Classification' })
    ).toBeDefined();
    expect(
      screen.getByRole('columnheader', { name: 'Submitters reporting' })
    ).toBeDefined();
    const likelyBenignRow = screen
      .getByRole('cell', { name: 'Likely benign' })
      .closest('tr') as HTMLElement;
    expect(
      within(likelyBenignRow).getByRole('cell', { name: '3' })
    ).toBeDefined();
    const pathogenicRow = screen
      .getByRole('cell', { name: 'Pathogenic' })
      .closest('tr') as HTMLElement;
    expect(
      within(pathogenicRow).getByRole('cell', { name: '1' })
    ).toBeDefined();
  });

  it('ClinVar renders nothing without an annotation', () => {
    const { container } = renderOption('clinvar', {
      subOptionRan: clinvarShortSelected
    });
    expect(container.innerHTML).toBe('');
  });

  it('ClinVar short block is hidden when only the structural sub-option ran', () => {
    // The short annotation is present (dev-data leak), but short was not
    // selected — `requires_selected` keeps it out of the view.
    const { container } = renderOption('clinvar', {
      subOptionRan: clinvarSvSelected,
      allele: [
        annotation('clinvar', 'allele', {
          significance: ['Pathogenic'],
          conflicting_breakdown: []
        })
      ]
    });
    expect(container.innerHTML).toBe('');
  });

  it('ClinVar short: a linked variant-id row above the significance', () => {
    renderOption('clinvar', {
      subOptionRan: clinvarShortSelected,
      allele: [
        annotation('clinvar', 'allele', {
          id: '12345',
          significance: ['Pathogenic'],
          conflicting_breakdown: []
        })
      ]
    });
    expect(screen.getByText('ClinVar variant ID')).toBeDefined();
    // the id is a link out to its NCBI ClinVar variation page
    const link = screen.getByRole('link', { name: /12345/ });
    expect(link.getAttribute('href')).toBe(
      'https://www.ncbi.nlm.nih.gov/clinvar/variation/12345/'
    );
  });

  it('ClinVar short: the variant-id row drops when there is no id', () => {
    renderOption('clinvar', {
      subOptionRan: clinvarShortSelected,
      allele: [
        annotation('clinvar', 'allele', {
          significance: ['Pathogenic'],
          conflicting_breakdown: []
        })
      ]
    });
    expect(screen.queryByText('ClinVar variant ID')).toBeNull();
  });

  it('ClinVar structural variants: a headed significance + origin block', () => {
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

  it('ProtVar default view: headed per-pocket / interface rows, links', () => {
    renderOption('protvar', {
      consequence: [
        annotation('protvar', 'transcript', {
          structure_stability_score: 1.23,
          pockets: [
            { pocket_id: '1', score: 0.5 },
            { pocket_id: '2', score: null } // no score, still renders + links
          ],
          interaction_interfaces: [{ partner: 'P12345', score: 0.9 }]
        })
      ],
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
    const links = screen.getAllByLabelText('View in ProtVar');
    expect(links).toHaveLength(4);
    expect(links[0].getAttribute('href')).toBe('https://protvar.example/x');
  });

  it('ProtVar Show-all view: the same itemised detail as the default view', () => {
    renderOption('protvar', {
      consequence: [
        annotation('protvar', 'transcript', {
          structure_stability_score: 1.23,
          pockets: [
            { pocket_id: '1', score: 0.5 },
            { pocket_id: '2', score: 1 }
          ],
          interaction_interfaces: [] // none -> dash, no link
        })
      ],
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
    expect(screen.getAllByLabelText('View in ProtVar')).toHaveLength(3);
  });

  it('ProtVar Show-all view: an unselected sub-option is dropped, not dashed', () => {
    renderOption('protvar', {
      consequence: [
        annotation('protvar', 'transcript', {
          structure_stability_score: 1.23,
          pockets: [],
          interaction_interfaces: []
        })
      ],
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

  // --- app_popup link builder (protein) -------------------------------------

  it('protein: the id as an in-app "View in" popup trigger (a button)', () => {
    renderOption('protein', {
      consequence: [
        annotation('protein', 'transcript', {
          ensembl_protein_id: 'ENSP00000269305'
        })
      ],
      genomeId: 'homo_sapiens_GCA_000001405_29',
      geneStableId: 'ENSG00000141510'
    });
    expect(screen.getByText('Protein ID')).toBeDefined();
    // the app_popup builder wraps the id in the popup trigger button
    const trigger = screen.getByText('ENSP00000269305').closest('button');
    expect(trigger).not.toBeNull();
  });

  it('protein: plain id (no popup) when the consequence has no gene', () => {
    renderOption('protein', {
      consequence: [
        annotation('protein', 'transcript', {
          ensembl_protein_id: 'ENSP00000269305'
        })
      ]
      // no geneStableId -> the builder falls back to plain text
    });
    expect(screen.getByText('ENSP00000269305').closest('button')).toBeNull();
  });

  it('protein: renders nothing without an id', () => {
    const { container } = renderOption('protein', {
      consequence: [
        annotation('protein', 'transcript', { ensembl_protein_id: null })
      ]
    });
    expect(container.innerHTML).toBe('');
  });

  // --- IntAct: view + when coalesce + count + sub-option counts --------------
});

it('IntAct: the interactions table is in the default view, not behind Show all', () => {
  renderOption('intact', {
    consequence: [
      annotation('intact', 'transcript', {
        interactions: [
          { interaction_ac: 'EBI-1', feature_type: 'mutation' },
          { interaction_ac: 'EBI-2', feature_type: 'mutation decreasing' }
        ]
      })
    ]
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
      consequence: [annotation('intact', 'transcript', { interactions })],
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
    ).toBe('http://europepmc.org/abstract/MED/27348587');
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
      consequence: [
        annotation('intact', 'transcript', {
          interactions: [
            { ...interactions[0], feature_short_label: 'P37840:p.Ala53Thr' },
            { ...interactions[1], feature_short_label: 'P37840:p.Glu46Lys' }
          ]
        })
      ],
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
      consequence: [
        annotation('intact', 'transcript', {
          // one shared affected protein across both interactions
          interactions: interactions.map((i) => ({
            ...i,
            ap_ac: 'uniprotkb:P37840'
          }))
        })
      ],
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
      consequence: [
        annotation('spliceai', 'transcript', {
          symbol: 'BRCA2',
          events: [{ event: 'DG', delta: 0.9, position: 12 }]
        })
      ],
      help
    });
    expect(screen.getByText('SpliceAI')).toBeDefined();
    await openHelp(container);
    expect(screen.getByText(/What this annotation means/)).toBeDefined();
  });

  it('hangs it on an option-level heading (ProtVar)', async () => {
    const { container } = renderOption('protvar', {
      consequence: [
        annotation('protvar', 'transcript', {
          pockets: [{ pocket_id: '1', energy: 2, score: 3 }]
        })
      ],
      help
    });
    expect(screen.getByText('ProtVar')).toBeDefined();
    await openHelp(container);
    expect(screen.getByText(/What this annotation means/)).toBeDefined();
  });

  it('hangs it on the title row of a headingless option (REVEL)', async () => {
    const { container } = renderOption('revel', {
      consequence: [annotation('revel', 'transcript', { score: 0.42 })],
      help
    });
    await openHelp(container);
    expect(screen.getByText(/What this annotation means/)).toBeDefined();
  });

  // The whole reason the anchor is claimed rather than assigned: ClinVar's
  // two shapes are different blocks and only one of them draws.
  it('follows ClinVar to whichever of its two shapes drew', async () => {
    const { container } = renderOption('clinvar', {
      subOptionRan: (id: string) => id === 'clinvar_short',
      allele: [
        annotation('clinvar', 'allele', {
          significance: ['Pathogenic'],
          conflicting_breakdown: []
        })
      ],
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
      consequence: [annotation('revel', 'transcript', { score: 0.42 })]
    });
    expect(
      container.querySelectorAll('[class*="questionButton"]')
    ).toHaveLength(0);
  });
});

describe('the link icon always leads its text', () => {
  /**
   * The house rule: every link renders as icon, gap, then the blue clickable
   * text. Asserted across the link kinds rather than one at a time, because
   * they are built in four separate places (a row value, a table cell, a split
   * cell's parts, and a named builder) and drifted apart once already.
   */
  /** The first child element of every anchor that has text — `svg` when the
   *  icon leads, which is what each test asserts. */
  const firstChildOfEachLink = (container: HTMLElement) =>
    [...container.querySelectorAll('a')]
      .filter((anchor) => (anchor.textContent ?? '').trim())
      .map((anchor) => anchor.firstElementChild?.tagName.toLowerCase());

  it('in a list item link (GO terms)', () => {
    const { container } = renderOption('go', {
      consequence: [
        annotation('go', 'transcript', {
          go_terms: [
            {
              id: 'GO:0006355',
              name: 'regulation of transcription',
              namespace: 'biological_process'
            }
          ]
        })
      ]
    });
    expect(firstChildOfEachLink(container)).toEqual(['svg']);
  });

  it('in a named builder link (the OpenTargets variant)', () => {
    const { container } = renderOption('opentargets', {
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
    expect(firstChildOfEachLink(container)).toEqual(['svg']);
  });

  it('in a builder link on a row and on list items (ProtVar)', () => {
    // ProtVar's was the last icon still trailing: it rendered as a bare icon
    // beside the score rather than leading it, on both shapes it appears in.
    const { container } = renderOption('protvar', {
      consequence: [
        annotation('protvar', 'transcript', {
          structure_stability_score: 1.23,
          pockets: [{ pocket_id: 'P34', energy: 2, score: 0.324 }]
        })
      ],
      protvarUrl: 'https://www.ebi.ac.uk/ProtVar/query?chromosome=1',
      subOptionRan: () => true
    });
    expect(firstChildOfEachLink(container)).toEqual(['svg', 'svg']);
    // the score is the link text, not a bare icon next to it
    const scoreLink = screen.getByText('0.324').closest('a');
    expect(scoreLink?.getAttribute('href')).toBe(
      'https://www.ebi.ac.uk/ProtVar/query?chromosome=1'
    );
  });

  it('in a table cell link (IntAct)', () => {
    const { container } = renderOption('intact', {
      consequence: [
        annotation('intact', 'transcript', {
          interactions: [
            {
              interaction_ac: 'EBI-1234',
              feature_ac: 'EBI-5678',
              feature_short_label: 'x',
              feature_annotation: 'y',
              ap_ac: 'uniprotkb:P37840',
              interaction_participants: 'z',
              pmid: '12345678'
            }
          ]
        })
      ],
      showAll: true,
      subOptionRan: () => true
    });
    const firstChildren = firstChildOfEachLink(container);
    expect(firstChildren.length).toBeGreaterThan(0);
    expect(firstChildren).toEqual(firstChildren.map(() => 'svg'));
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
      consequence: [
        annotation('spliceai', 'transcript', {
          symbol: 'BRCA2',
          events: [{ event: 'DG', delta: 0.9, position: 12 }]
        })
      ]
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
    // Disease association | Target Gene | Lead variant p-value | beta | L2G
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

  it('right-aligns a count (ClinVar submitters)', () => {
    const { container } = renderOption('clinvar', {
      subOptionRan: (id: string) => id === 'clinvar_short',
      allele: [
        annotation('clinvar', 'allele', {
          significance: ['Conflicting_classifications_of_pathogenicity'],
          conflicting_breakdown: [
            { significance: 'Likely_benign', count: 3 },
            { significance: 'Pathogenic', count: 1 }
          ]
        })
      ]
    });
    // Classification | Submitters reporting
    expect(alignmentOf(container, 'th')).toEqual(['left', 'right']);
  });
});
