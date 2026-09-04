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

import VepResultsAnnotationDetail from './VepResultsAnnotationDetail';
import { displaySpecFixture } from './displaySpec.fixture';

import type {
  Annotation,
  AlternativeVariantAllele,
  PredictedTranscriptConsequence,
  PredictedIntergenicConsequence
} from 'src/content/app/tools/vep/types/vepResultsResponse';
import type {
  FormPanel,
  FormPanelOption
} from 'src/content/app/tools/vep/types/vepFormConfig';

const option = (
  id: string,
  label: string,
  category?: string
): FormPanelOption => ({
  id,
  label,
  type: 'boolean',
  default: false,
  category
});

const transcriptAnnotation = (
  plugin: string,
  data: Record<string, unknown>
): Annotation => ({ plugin, scope: 'transcript', data });

const alleleAnnotation = (
  plugin: string,
  data: Record<string, unknown>
): Annotation => ({ plugin, scope: 'allele', data });

const panels: FormPanel[] = [
  {
    id: 'hgvs_panel',
    label: 'HGVS notation',
    options: [option('hgvs', 'HGVS')]
  },
  {
    id: 'representation',
    label: 'Variant representation',
    options: [option('spdi', 'SPDI')]
  }
];

const afPanels: FormPanel[] = [
  {
    id: 'allele_frequencies',
    label: 'Allele frequencies',
    options: [
      option('gnomad_exomes', 'gnomAD Exomes v4.1.1'),
      option('gnomad_genomes', 'gnomAD Genomes v4.1.1'),
      option('allofus', 'NIH All of Us'),
      option('gnomad_sv', 'gnomAD SV v4.1'),
      option('gnomad_cnv', 'gnomAD CNV v4.1')
    ]
  }
];

const pathogenicityPanels: FormPanel[] = [
  {
    id: 'pathogenicity',
    label: 'Variant Impact Predictions',
    options: [
      option('revel', 'REVEL'),
      option('alphamissense', 'AlphaMissense'),
      option('cadd', 'CADD'),
      option('spliceai', 'SpliceAI'),
      option('eve', 'EVE')
    ]
  }
];

const transcriptConsequence: PredictedTranscriptConsequence = {
  feature_type: 'transcript',
  stable_id: 'ENST00000390337.1',
  gene_stable_id: 'ENSG00000141510.16',
  gene_symbol: 'TP53',
  is_canonical: true,
  biotype: 'protein_coding',
  strand: 'forward',
  consequences: ['missense_variant'],
  annotations: [
    transcriptAnnotation('hgvs', {
      genomic: null,
      transcript: 'c.123A>G',
      protein: 'p.Lys41Arg'
    })
  ]
};

const intergenicConsequence: PredictedIntergenicConsequence = {
  feature_type: null,
  consequences: ['intergenic_variant']
};

const makeAllele = (
  overrides: Partial<AlternativeVariantAllele> = {}
): AlternativeVariantAllele => ({
  allele_sequence: 'C',
  allele_type: 'SNV',
  predicted_molecular_consequences: [transcriptConsequence],
  annotations: [alleleAnnotation('hgvsg', { genomic: '19:g.7676154A>G' })],
  ...overrides
});

const withAnnotations = (
  annotations: Annotation[]
): PredictedTranscriptConsequence => ({
  ...transcriptConsequence,
  annotations: [...(transcriptConsequence.annotations ?? []), ...annotations]
});

const phenotypePanels: FormPanel[] = [
  {
    id: 'representation',
    label: 'Variant representation',
    options: [option('spdi', 'SPDI')]
  },
  {
    id: 'phenotype_and_disease_associations',
    label: 'Phenotype & disease associations',
    options: [option('phenotypes', 'Phenotypes')]
  }
];

afterEach(cleanup);

describe('VepResultsAnnotationDetail', () => {
  it('renders only populated annotations in the default view', () => {
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele()}
        parameters={{ hgvs: true, hgvsg: true }}
        panels={panels}
        display={displaySpecFixture}
      />
    );

    // Transcript-level HGVS values are shown
    expect(screen.getByText('c.123A>G')).toBeDefined();
    expect(screen.getByText('p.Lys41Arg')).toBeDefined();

    // This version of VEP intentionally hides HGVSg variant representation
    // even where the hgvsg param ran, because it is needed for the ProtVar link
    expect(screen.queryByText('19:g.7676154A>G')).toBeNull();
    // SPDI returned nothing and this is not "Show all", so it is absent.
    expect(screen.queryByText('SPDI')).toBeNull();
  });

  it('shows nothing for HGVS when only the hidden hgvsg param ran', () => {
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele()}
        parameters={{ hgvsg: true }} // forced on for ProtVar, HGVSc/p not chosen
        panels={panels}
        display={displaySpecFixture}
      />
    );

    // This version of VEP intentionally hides HGVSg variant representation
    expect(screen.queryByText('19:g.7676154A>G')).toBeNull();
    expect(screen.queryByText('HGVS')).toBeNull();
    expect(screen.queryByText('c.123A>G')).toBeNull();
    expect(screen.queryByText('p.Lys41Arg')).toBeNull();
  });

  it('does not show HGVSg when only the hgvs param is selected', () => {
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele()}
        parameters={{ hgvs: true }} // HGVSc/p selected, HGVSg not
        panels={panels}
        display={displaySpecFixture}
      />
    );

    expect(screen.getByText('c.123A>G')).toBeDefined();
    expect(screen.queryByText('19:g.7676154A>G')).toBeNull();
  });

  it('reveals a dash for options that ran but returned nothing in "Show all"', async () => {
    const user = userEvent.setup();
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele()}
        // both options ran for the submission; only hgvsg produced a value
        parameters={{ hgvsg: true, spdi: true }}
        panels={panels}
        display={displaySpecFixture}
      />
    );

    expect(screen.queryByText('SPDI')).toBeNull();

    await user.click(screen.getByText('Show all')); // the "Show all" toggle

    // SPDI now appears as a run-but-empty row with a dash.
    expect(screen.getByText('SPDI')).toBeDefined();
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('surfaces allele-level fields for an intergenic variant with no transcript consequence', () => {
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={intergenicConsequence}
        allele={makeAllele({
          annotations: [
            alleleAnnotation('hgvsg', { genomic: '19:g.7676154A>G' }),
            alleleAnnotation('spdi', { spdi: 'NC_000019.10:7676153:A:G' })
          ]
        })}
        parameters={{ hgvsg: true, spdi: true }}
        panels={panels}
        display={displaySpecFixture}
      />
    );

    // In this version of VEP, HGVSg variant representation is intentionally hidden
    expect(screen.queryByText('19:g.7676154A>G')).toBeNull();
    expect(screen.getByText('NC_000019.10:7676153:A:G')).toBeDefined();
  });

  it('hides a no-result AF source in the default view, surfacing it as a dash in Show all', async () => {
    const user = userEvent.setup();
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele()} // no frequency annotations
        parameters={{ gnomad_exomes: true }} // selected, but no data for this variant
        panels={afPanels}
        display={displaySpecFixture}
      />
    );

    // Default view: a source with no data is hidden, like every other option.
    expect(screen.queryByText('gnomAD Exomes v4.1.1')).toBeNull();
    expect(screen.queryByText('—')).toBeNull();

    await user.click(screen.getByText('Show all')); // the "Show all" toggle

    // Now it appears, as a dash.
    expect(screen.getByText('gnomAD Exomes v4.1.1')).toBeDefined();
    expect(screen.getByText('—')).toBeDefined();
    // a source that was not selected still does not appear
    expect(screen.queryByText('NIH All of Us')).toBeNull();
  });

  it('breaks a no-data AF source into its selected populations (dashes) in "Show all"', async () => {
    const user = userEvent.setup();
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele()} // no frequency annotations
        parameters={{ gnomad_exomes: true }}
        panels={afPanels}
        display={displaySpecFixture}
        availableAfSources={[
          {
            key: 'gnomAD_exomes_AF',
            source: 'gnomad_exomes',
            population: '',
            label: 'All'
          },
          {
            key: 'gnomAD_exomes_AF_afr',
            source: 'gnomad_exomes',
            population: 'afr',
            label: 'African & African-American'
          },
          {
            key: 'gnomAD_exomes_AF_nfe_XX',
            source: 'gnomad_exomes',
            population: 'nfe_XX',
            label: 'Non-Finnish European · Female'
          }
        ]}
      />
    );

    // Default view: a source with no data is hidden entirely.
    expect(screen.queryByText('gnomAD Exomes v4.1.1')).toBeNull();
    expect(screen.queryByText('—')).toBeNull();

    await user.click(screen.getByText('Show all')); // the "Show all" toggle

    // Now the source appears, one dash row per selected population, each labelled
    // by the backend-supplied source label; the overall AF is "All".
    expect(screen.getByText('gnomAD Exomes v4.1.1')).toBeDefined();
    expect(screen.getByText('All')).toBeDefined();
    expect(screen.getByText('African & African-American')).toBeDefined();
    expect(screen.getByText('Non-Finnish European · Female')).toBeDefined();
    expect(screen.getAllByText('—')).toHaveLength(3);
  });

  it('calls onCollapse when the bottom close control is clicked', async () => {
    const user = userEvent.setup();
    const onCollapse = vi.fn();
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele()}
        parameters={{}}
        panels={panels}
        display={displaySpecFixture}
        onCollapse={onCollapse}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Hide annotations' }));
    expect(onCollapse).toHaveBeenCalledTimes(1);
  });

  describe('pathogenicity predictions (flat plugin entries)', () => {
    it('renders REVEL, AlphaMissense and CADD from their own plugins', () => {
      render(
        <VepResultsAnnotationDetail
          genomeId="grch38"
          consequence={withAnnotations([
            transcriptAnnotation('revel', { score: 0.123 }),
            transcriptAnnotation('alphamissense', {
              classification: 'likely_pathogenic',
              score: 0.9876
            })
          ])}
          allele={makeAllele({
            annotations: [alleleAnnotation('cadd', { phred: 23.4, raw: 4.21 })]
          })}
          parameters={{ revel: true, alphamissense: true, cadd: true }}
          panels={pathogenicityPanels}
          display={displaySpecFixture}
        />
      );

      expect(screen.getByText('REVEL')).toBeDefined();
      expect(screen.getByText('0.123')).toBeDefined();
      // expected formatting: score first, pretty-printed classification in brackets
      expect(screen.getByText('0.9876 (likely pathogenic)')).toBeDefined();
      // CADD is allele-scoped
      expect(screen.getByText('CADD (PHRED)')).toBeDefined();
      expect(screen.getByText('23.4')).toBeDefined();
    });

    it('does not render an option that was not selected, even with data present', () => {
      render(
        <VepResultsAnnotationDetail
          genomeId="grch38"
          consequence={transcriptConsequence}
          allele={makeAllele({
            annotations: [alleleAnnotation('cadd', { phred: 23.4, raw: 4.21 })]
          })}
          parameters={{}} // CADD not selected
          panels={pathogenicityPanels}
          display={displaySpecFixture}
        />
      );

      expect(screen.queryByText('CADD (PHRED)')).toBeNull();
      expect(screen.queryByText('23.4')).toBeNull();
    });

    it('renders the SpliceAI gene symbol and the ΔS/ΔP event table', () => {
      render(
        <VepResultsAnnotationDetail
          genomeId="grch38"
          consequence={withAnnotations([
            transcriptAnnotation('spliceai', {
              symbol: 'TP53',
              ds_acceptor_gain: 0.01,
              ds_acceptor_loss: 0.02,
              ds_donor_gain: 0.03,
              ds_donor_loss: 0.04,
              dp_acceptor_gain: 11,
              dp_acceptor_loss: 12,
              dp_donor_gain: 13,
              dp_donor_loss: null
            })
          ])}
          allele={makeAllele()}
          parameters={{ spliceai: true }}
          panels={pathogenicityPanels}
          display={displaySpecFixture}
        />
      );

      expect(screen.getByText('SpliceAI')).toBeDefined();
      // The gene is deliberately not shown: it duplicates the transcript's own
      // gene, which the row this panel expands from already carries.
      expect(screen.queryByText('Gene')).toBeNull();
      expect(screen.queryByText('TP53')).toBeNull();
      // the deltas render as a table: Splicing event | ΔS | ΔP, one row per event
      expect(
        screen.getByRole('columnheader', { name: 'Splicing event' })
      ).toBeDefined();
      expect(screen.getByRole('columnheader', { name: 'ΔS' })).toBeDefined();
      expect(screen.getByRole('columnheader', { name: 'ΔP' })).toBeDefined();
      const acceptorGain = screen
        .getByRole('cell', { name: 'Acceptor gain' })
        .closest('tr') as HTMLElement;
      expect(
        within(acceptorGain).getByRole('cell', { name: '0.01' })
      ).toBeDefined();
      expect(
        within(acceptorGain).getByRole('cell', { name: '11' })
      ).toBeDefined();
      // a missing delta position leaves that cell empty rather than dashing
      const donorLoss = screen
        .getByRole('cell', { name: 'Donor loss' })
        .closest('tr') as HTMLElement;
      expect(
        within(donorLoss).getByRole('cell', { name: '0.04' })
      ).toBeDefined();
      expect(screen.queryByText('—')).toBeNull();
    });

    it('renders EVE and popEVE, which share one option but are two plugins', () => {
      render(
        <VepResultsAnnotationDetail
          genomeId="grch38"
          consequence={withAnnotations([
            transcriptAnnotation('eve', {
              classification: 'likely_benign',
              score: 0.0854
            }),
            transcriptAnnotation('popeve', {
              score: -1.23,
              eve: null,
              esm1v: null,
              pop_adjusted_eve: 0.42,
              pop_adjusted_esm1v: null,
              gene: 'TP53',
              protein: null,
              mutant: null,
              gap_frequency: 0.6
            })
          ])}
          allele={makeAllele()}
          parameters={{ eve: true }}
          panels={pathogenicityPanels}
          display={displaySpecFixture}
        />
      );

      expect(screen.getByText('EVE')).toBeDefined();
      expect(screen.getByText('0.0854 (likely benign)')).toBeDefined();
      expect(screen.getByText('popEVE')).toBeDefined();
      expect(screen.getByText('-1.23')).toBeDefined();
      expect(screen.getByText('Population-adjusted EVE')).toBeDefined();
      expect(screen.getByText('0.42')).toBeDefined();
      expect(screen.getByText('Gap frequency')).toBeDefined();
      expect(screen.getByText('0.6')).toBeDefined();
    });
  });

  describe('allele frequencies (three flat sources)', () => {
    it('renders each source separately, with the All of Us max subpopulation', () => {
      render(
        <VepResultsAnnotationDetail
          genomeId="grch38"
          consequence={transcriptConsequence}
          allele={makeAllele({
            annotations: [
              alleleAnnotation('gnomad_exomes', {
                overall: 0.4861,
                populations: { afr: 0.1234 }
              }),
              alleleAnnotation('gnomad_genomes', {
                overall: 0.5,
                populations: {}
              }),
              alleleAnnotation('all_of_us', {
                overall: 0.0002,
                populations: { max: 0.000167 },
                // the backend decodes the max-subpopulation code to a label
                max_subpopulation: 'eur',
                max_subpopulation_label: 'European'
              })
            ]
          })}
          parameters={{
            gnomad_exomes: true,
            gnomad_genomes: true,
            allofus: true
          }}
          panels={afPanels}
          display={displaySpecFixture}
          // population rows are labelled from the metadata's AF sources (the same
          // selected columns each variant's populations are drawn from)
          availableAfSources={[
            {
              key: 'gnomAD_exomes_AF',
              source: 'gnomad_exomes',
              population: '',
              label: 'All'
            },
            {
              key: 'gnomAD_exomes_AF_afr',
              source: 'gnomad_exomes',
              population: 'afr',
              label: 'African & African-American'
            },
            {
              key: 'gnomAD_genomes_AF',
              source: 'gnomad_genomes',
              population: '',
              label: 'All'
            },
            {
              key: 'AoU_gvs_all_af',
              source: 'all_of_us',
              population: '',
              label: 'All'
            },
            {
              key: 'AoU_gvs_max_af',
              source: 'all_of_us',
              population: 'max',
              label: 'Maximum subpopulation'
            }
          ]}
        />
      );

      expect(screen.getByText('gnomAD Exomes v4.1.1')).toBeDefined();
      expect(screen.getByText('0.4861')).toBeDefined();
      expect(screen.getByText('African & African-American')).toBeDefined();
      expect(screen.getByText('0.1234')).toBeDefined();

      expect(screen.getByText('gnomAD Genomes v4.1.1')).toBeDefined();
      expect(screen.getByText('0.5')).toBeDefined();

      expect(screen.getByText('NIH All of Us')).toBeDefined();
      expect(screen.getByText('Maximum subpopulation')).toBeDefined();
      // the max AF names the subpopulation it came from, in brackets
      expect(screen.getByText('0.000167 (European)')).toBeDefined();
    });

    it('renders a source with populations but a gated overall, and no "All" row', () => {
      render(
        <VepResultsAnnotationDetail
          genomeId="grch38"
          consequence={transcriptConsequence}
          allele={makeAllele({
            annotations: [
              // the overall all-ancestry option has not been selected,
              // leaving only a selected sub-population
              alleleAnnotation('gnomad_genomes', {
                overall: null,
                populations: { eas_XX: 0.0333 }
              })
            ]
          })}
          parameters={{ gnomad_genomes: true }}
          panels={afPanels}
          display={displaySpecFixture}
          availableAfSources={[
            {
              key: 'gnomAD_genomes_AF_eas_XX',
              source: 'gnomad_genomes',
              population: 'eas_XX',
              label: 'East Asian · XX'
            }
          ]}
        />
      );

      // the block still shows (populations are present) with the selected value
      expect(screen.getByText('gnomAD Genomes v4.1.1')).toBeDefined();
      expect(screen.getByText('East Asian · XX')).toBeDefined();
      expect(screen.getByText('0.0333')).toBeDefined();
      // ...but there is no all-ancestry "All" row
      expect(screen.queryByText('All')).toBeNull();
    });

    it('does not render an AF source that was not selected, even with data present', () => {
      render(
        <VepResultsAnnotationDetail
          genomeId="grch38"
          consequence={transcriptConsequence}
          allele={makeAllele({
            annotations: [
              alleleAnnotation('gnomad_exomes', {
                overall: 0.4861,
                populations: {}
              })
            ]
          })}
          parameters={{}} // gnomAD exomes not selected
          panels={afPanels}
          display={displaySpecFixture}
          availableAfSources={[
            {
              key: 'gnomAD_exomes_AF',
              source: 'gnomad_exomes',
              population: '',
              label: 'All'
            }
          ]}
        />
      );

      expect(screen.queryByText('gnomAD Exomes v4.1.1')).toBeNull();
      expect(screen.queryByText('0.4861')).toBeNull();
    });
  });

  it('renders the NMD escape prediction (transcript-scoped, humanized)', () => {
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={withAnnotations([
          transcriptAnnotation('nmd', { prediction: 'NMD_escaping_variant' })
        ])}
        allele={makeAllele()}
        parameters={{ nmd: true }}
        panels={[
          {
            id: 'genes_and_transcripts',
            label: 'Genes & transcripts',
            options: [option('nmd', 'NMD')]
          }
        ]}
        display={displaySpecFixture}
      />
    );

    expect(screen.getByText('NMD')).toBeDefined();
    expect(screen.getByText('NMD escaping variant')).toBeDefined();
  });

  it('renders the ClinPred score (transcript-scoped)', () => {
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={withAnnotations([
          transcriptAnnotation('clinpred', { score: 0.9213 })
        ])}
        allele={makeAllele()}
        parameters={{ clinpred: true }}
        panels={[
          {
            id: 'pathogenicity',
            label: 'Variant Impact Predictions',
            options: [option('clinpred', 'ClinPred')]
          }
        ]}
        display={displaySpecFixture}
      />
    );

    expect(screen.getByText('ClinPred')).toBeDefined();
    expect(screen.getByText('0.9213')).toBeDefined();
  });

  it('renders GENCODE Promoters (allele-scoped: region + feature id)', () => {
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele({
          annotations: [
            alleleAnnotation('gencode_promoter', {
              region: '1:108559100-108560099',
              feature_id: 'ENSG00000162636_promoter_window'
            })
          ]
        })}
        parameters={{ gencode_promoters: true }}
        panels={[
          {
            id: 'regulatory',
            label: 'Regulatory',
            options: [option('gencode_promoters', 'GENCODE promoter')]
          }
        ]}
        display={displaySpecFixture}
      />
    );

    expect(screen.getByText('GENCODE promoter')).toBeDefined();
    expect(screen.getByText('1:108559100-108560099')).toBeDefined();
    expect(screen.getByText('ENSG00000162636_promoter_window')).toBeDefined();
  });

  it('renders the gnomAD SV block (id + type + population AFs)', () => {
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele({
          annotations: [
            alleleAnnotation('gnomad_sv', {
              id: 'gnomAD-SV_v3_DEL_chr1_3c282d6b',
              svtype: 'DEL',
              overall: 0.00568,
              populations: { afr: 0.01834 }
            })
          ]
        })}
        parameters={{ gnomad_sv: true }}
        panels={afPanels}
        display={displaySpecFixture}
        availableAfSources={[
          {
            key: 'gnomAD_SV_AF',
            source: 'gnomad_sv',
            population: '',
            label: 'All'
          },
          {
            key: 'gnomAD_SV_AF_afr',
            source: 'gnomad_sv',
            population: 'afr',
            label: 'African & African-American'
          }
        ]}
      />
    );

    expect(screen.getByText('gnomAD SV v4.1')).toBeDefined();
    expect(screen.getByText('gnomAD-SV_v3_DEL_chr1_3c282d6b')).toBeDefined();
    expect(screen.getByText('DEL')).toBeDefined();
    expect(screen.getByText('0.00568')).toBeDefined();
    expect(screen.getByText('African & African-American')).toBeDefined();
    expect(screen.getByText('0.01834')).toBeDefined();
  });

  it('renders the gnomAD CNV block (sample frequencies)', () => {
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele({
          annotations: [
            alleleAnnotation('gnomad_cnv', {
              id: 'variant_is_80_1844__DEL',
              svtype: 'DEL',
              overall: 0.00306,
              populations: { remaining: 0.0012 }
            })
          ]
        })}
        parameters={{ gnomad_cnv: true }}
        panels={afPanels}
        display={displaySpecFixture}
        availableAfSources={[
          {
            key: 'gnomAD_CNV_SF',
            source: 'gnomad_cnv',
            population: '',
            label: 'All'
          },
          {
            key: 'gnomAD_CNV_SF_remaining',
            source: 'gnomad_cnv',
            population: 'remaining',
            label: 'Remaining'
          }
        ]}
      />
    );

    expect(screen.getByText('gnomAD CNV v4.1')).toBeDefined();
    expect(screen.getByText('variant_is_80_1844__DEL')).toBeDefined();
    expect(screen.getByText('DEL')).toBeDefined();
    expect(screen.getByText('Remaining')).toBeDefined();
    expect(screen.getByText('0.0012')).toBeDefined();
  });

  it('renders gene-associated phenotypes from the consequence, not the allele', () => {
    render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={{
          ...transcriptConsequence,
          annotations: [
            ...(transcriptConsequence.annotations ?? []),
            transcriptAnnotation('phenotype_gene', {
              phenotypes: [
                {
                  type: 'Gene',
                  source: 'ClinVar',
                  phenotype: 'Li-Fraumeni_syndrome',
                  id: 'ENSG00000141510',
                  risk_allele: null
                }
              ]
            })
          ]
        }}
        allele={makeAllele({ annotations: [] })}
        parameters={{ phenotypes: true }}
        panels={[
          {
            id: 'phenotypes_panel',
            label: 'Phenotypes',
            options: [option('phenotypes', 'Phenotypes')]
          }
        ]}
        display={displaySpecFixture}
      />
    );

    expect(screen.getByText('Gene associated')).toBeDefined(); // sub-heading
    expect(screen.getByText('ClinVar')).toBeDefined();
    expect(screen.getByText('Li-Fraumeni syndrome')).toBeDefined();
  });
});

describe('panel order', () => {
  it('renders allele frequencies in the position its panel holds', () => {
    const orderedPanels: FormPanel[] = [
      {
        id: 'variant_representations',
        label: 'Variant representations',
        options: [option('spdi', 'SPDI')]
      },
      {
        id: 'allele_frequencies',
        label: 'Allele frequencies',
        // The AF panel carries its sources as ordinary options now, and they
        // render through the display spec like any other — so the panel needs
        // one for its section to exist at all.
        options: [option('gnomad_exomes', 'gnomAD Exomes v4.1.1')]
      },
      {
        id: 'genes_and_transcripts',
        label: 'Genes & transcripts',
        options: [option('hgvs', 'HGVS')]
      }
    ];
    const { container } = render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele({
          annotations: [
            alleleAnnotation('spdi', { spdi: 'NC_000019.10:7676153:A:G' }),
            alleleAnnotation('gnomad_exomes', {
              overall: 0.42,
              populations: []
            })
          ]
        })}
        parameters={{ hgvs: true, spdi: true, gnomad_exomes: true }}
        panels={orderedPanels}
        display={displaySpecFixture}
        availableAfSources={[
          {
            key: 'gnomAD_exomes_AF',
            source: 'gnomad_exomes',
            population: '',
            label: 'All'
          }
        ]}
      />
    );
    const headings = [
      ...container.querySelectorAll('[class*="sectionTitle"]')
    ].map((el) => el.textContent);
    const af = headings.indexOf('Allele frequencies');
    const genes = headings.indexOf('Genes & transcripts');
    expect(af).toBeGreaterThan(-1);
    expect(genes).toBeGreaterThan(-1);
    // between the two panels, not after both
    expect(af).toBeLessThan(genes);
  });
});

/**
 * Selector for the sections of annotations that are displayed in columns
 */
const COLUMNED_SECTIONS = '[class*="sections"]:not([class*="fullWidth"])';

const columnedSections = (container: HTMLElement) =>
  container.querySelector(COLUMNED_SECTIONS) as HTMLElement;

describe('VepResultsAnnotationDetail columns', () => {
  it('does not count a frequencies panel that renders nothing', () => {
    const { container } = render(
      <VepResultsAnnotationDetail
        genomeId="grch38"
        consequence={transcriptConsequence}
        allele={makeAllele({
          annotations: [alleleAnnotation('spdi', { spdi: '1:230710047:A:G' })]
        })}
        parameters={{ spdi: true }}
        panels={[
          {
            id: 'representation',
            label: 'Variant representation',
            options: [option('spdi', 'SPDI')]
          },
          {
            id: 'allele_frequencies',
            label: 'Allele frequencies',
            options: [option('gnomad_sv', 'gnomAD SV v4.1')]
          }
        ]}
        display={displaySpecFixture}
      />
    );

    // One section renders, so one section is drawn — the empty panel adds none.
    expect(container.querySelectorAll('[class*="sectionTitle"]').length).toBe(
      1
    );
    expect(columnedSections(container).children.length).toBe(1);
  });

  describe('the full-width phenotypes section', () => {
    const renderWithPhenotypes = () =>
      render(
        <VepResultsAnnotationDetail
          genomeId="grch38"
          consequence={withAnnotations([
            {
              plugin: 'clinvar',
              scope: 'transcript',
              data: {
                id: '13652',
                significance: ['Pathogenic'],
                conflicting_breakdown: [],
                classification_summary: [
                  {
                    type: 'Germline',
                    classification: 'Pathogenic',
                    review_status: 'reviewed_by_expert_panel',
                    rating_scale: 'clinvar_aggregate',
                    supporting: 1,
                    submissions: 44
                  }
                ],
                conditions: []
              }
            }
          ])}
          allele={makeAllele({
            annotations: [
              alleleAnnotation('spdi', { spdi: 'NC_000019.10:7676153:A:G' })
            ]
          })}
          parameters={{ phenotypes: true, spdi: true }}
          panels={phenotypePanels}
          display={displaySpecFixture}
        />
      );

    it('sits outside the column flow, not in it', () => {
      const { container } = renderWithPhenotypes();

      // This section sits inside the full-width sections area
      const heading = screen.getByText('Phenotype & disease associations');
      expect(heading.closest('[class*="fullWidthSections"]')).toBeTruthy();

      // Whereas the other panel stays in the columns
      const columns = columnedSections(container);
      expect(columns.contains(heading)).toBe(false);
      expect(columns.textContent).toContain('Variant representation');
      expect(columns.textContent).not.toContain('ClinVar');
    });
  });
});
