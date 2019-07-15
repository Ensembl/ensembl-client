import Attribute, { Attributes } from '../types/Attributes';

const attributes: Attributes = {
  genes: {
    type: 'section',
    label: 'Genes',
    id: 'genes',
    content: [
      {
        type: 'checkbox_grid',
        label: '',
        id: 'default',
        options: [
          {
            id: 'name',
            label: 'Gene name',
            isChecked: true
          },
          {
            id: 'id',
            label: 'Gene stable ID',
            isChecked: true
          },
          {
            id: 'version',
            label: 'Version',
            isChecked: false
          },
          {
            id: 'strand',
            label: 'Strand',
            isChecked: false
          },
          {
            id: 'start',
            label: 'Gene start(bp)',
            isChecked: true
          },
          {
            id: 'end',
            label: 'Gene end (bp)',
            isChecked: true
          },
          {
            id: 'source',
            label: 'Source (gene)',
            isChecked: false
          },
          {
            id: 'biotype',
            label: 'Biotype',
            isChecked: true
          }
        ]
      },
      {
        type: 'checkbox_grid',
        label: 'External',
        id: 'external',
        options: [
          {
            id: 'gencode_basic_annotation',
            label: 'GENCODE basic annotation',
            isChecked: false
          },
          {
            id: 'uniparc_id',
            label: 'UniParc ID',
            isChecked: false
          },
          {
            id: 'ncbi_id',
            label: 'NCBI gene ID',
            isChecked: false
          },
          {
            id: 'HGNC',
            label: 'HGNC symbol',
            isChecked: false
          },
          { id: 'go_domain', label: 'GO domain', isChecked: false }
        ]
      }
    ]
  },
  transcripts: {
    type: 'section',
    label: 'Transcripts',
    id: 'transcripts',
    content: [
      {
        type: 'checkbox_grid',
        label: '',
        id: 'default',
        options: [
          {
            id: 'biotype',
            label: 'Biotype',
            isChecked: false
          },
          {
            id: 'name',
            label: 'Transcript name',
            isChecked: true
          },
          {
            id: 'id',
            label: 'Transcript stable ID',
            isChecked: true
          },
          {
            id: 'AGD_TRANSCRIPT',
            label: 'Ashbya Genome Database',
            isChecked: false
          },
          {
            id: 'type',
            label: 'Transcript Type',
            isChecked: false
          },
          {
            id: 'start',
            label: 'Start',
            isChecked: false
          },
          {
            id: 'end',
            label: 'End',
            isChecked: false
          },
          {
            id: 'Interpro',
            label: 'Interpro',
            isChecked: false
          }
        ]
      },
      {
        type: 'checkbox_grid',
        label: 'Microarray probes/probesets',
        id: 'Microarray probes/probesets',
        options: [
          {
            id: 'affy_hc_g110_probe',
            label: 'AFFY HC G110 probe',
            isChecked: false
          },
          {
            id: 'agilent_sureprint_g3_ge_8x60k_probe',
            label: 'AGILENT SurePrint G3 GE 8x60k probe',
            isChecked: false
          },
          {
            id: 'illumina_humanref_8_v3_probe',
            label: 'ILLUMINA HumanRef 8 V3 probe',
            isChecked: false
          },
          {
            id: 'affy_hta_2_0_probe',
            label: 'AFFY HTA 2 0 probe',
            isChecked: false
          },
          {
            id: 'codelink_codelink_probe',
            label: 'CODELINK CODELINK probe',
            isChecked: false
          },
          {
            id: 'go_domain',
            label: 'GO domain',
            isChecked: false
          }
        ]
      }
    ]
  },
  exons: {
    type: 'section',
    label: 'Transcripts',
    id: 'exons',
    content: []
  },
  sequences: {
    type: 'section',
    label: 'Sequence',
    id: 'sequences',
    content: [
      {
        type: 'checkbox_grid',
        label: '',
        id: 'default',
        options: [
          {
            id: 'cdna_sequence',
            label: 'cDNA Sequence',
            isChecked: false
          }
        ]
      }
    ]
  },
  location: {
    type: 'section',
    label: 'Transcripts',
    id: 'location',
    content: [
      {
        type: 'checkbox_grid',
        label: '',
        id: 'default',
        options: [
          {
            id: 'location.genomic_coordinates',
            label: 'Genomic coordinates',
            isChecked: false
          },
          {
            id: 'location.strand',
            label: 'Strand',
            isChecked: false
          },
          {
            id: 'location.start',
            label: 'Gene start',
            isChecked: false
          },
          {
            id: 'location.end',
            label: 'Gene end',
            isChecked: false
          }
        ]
      }
    ]
  },
  variation: {
    type: 'section',
    label: 'Variation',
    id: 'variation',
    content: [
      {
        type: 'section_group',
        id: 'default',
        label: '',
        content: [
          {
            type: 'section',
            label: 'Germline variation',
            id: 'germline',
            content: [
              {
                type: 'checkbox_grid',
                label: '',
                id: 'default',
                options: [
                  {
                    id: 'germline_variation.variant_name',
                    label: 'Variant name',
                    isChecked: false
                  },
                  {
                    id: 'germline_variation.variant_source',
                    label: 'Variant source',
                    isChecked: false
                  },
                  {
                    id: 'germline_variation.sift_code',
                    label: 'SIFT code',
                    isChecked: false
                  },
                  {
                    id: 'germline_variation.protein_allele',
                    label: 'Protein allele',
                    isChecked: false
                  },
                  {
                    id: 'germline_variation.polyphen_score',
                    label: 'PolyPhen score',
                    isChecked: false
                  }
                ]
              },
              {
                type: 'checkbox_grid',
                label: 'Location',
                id: 'location',
                options: [
                  {
                    id: 'germline_variation.distance_to_transcript',
                    label: 'Distance to transcript',
                    isChecked: false
                  },
                  {
                    id: 'germline_variation.cds_end',
                    label: 'CDS end',
                    isChecked: false
                  },
                  {
                    id:
                      'germline_variation.chromosomescaffold_position_start_bp',
                    label: 'Chromosome/scaffold position start (bp)',
                    isChecked: false
                  },
                  {
                    id: 'germline_variation.protein_location_aa',
                    label: 'Protein location (aa)',
                    isChecked: false
                  },
                  {
                    id: 'germline_variation.cds_start',
                    label: 'CDS start',
                    isChecked: false
                  }
                ]
              }
            ]
          },
          {
            type: 'section',
            label: 'Somatic variation',
            id: 'somatic',
            content: [
              {
                type: 'checkbox_grid',
                label: '',
                id: 'default',
                options: [
                  {
                    id: 'somatic_variation.variant_name',
                    label: 'Variant name',
                    isChecked: false
                  },
                  {
                    id: 'somatic_variation.variant_source',
                    label: 'Variant source',
                    isChecked: false
                  },
                  {
                    id: 'somatic_variation.sift_code',
                    label: 'SIFT code',
                    isChecked: false
                  },
                  {
                    id: 'somatic_variation.protein_allele',
                    label: 'Protein allele',
                    isChecked: false
                  },
                  {
                    id: 'somatic_variation.polyphen_score',
                    label: 'PolyPhen score',
                    isChecked: false
                  }
                ]
              },
              {
                type: 'checkbox_grid',
                label: 'Location',
                id: 'location',
                options: [
                  {
                    id: 'somatic_variation.distance_to_transcript',
                    label: 'Distance to transcript',
                    isChecked: false
                  },
                  {
                    id: 'somatic_variation.cds_end',
                    label: 'CDS end',
                    isChecked: false
                  },
                  {
                    id:
                      'somatic_variation.chromosomescaffold_position_start_bp',
                    label: 'Chromosome/scaffold position start (bp)',
                    isChecked: false
                  },
                  {
                    id: 'somatic_variation.protein_location_aa',
                    label: 'Protein location (aa)',
                    isChecked: false
                  },
                  {
                    id: 'somatic_variation.cds_start',
                    label: 'CDS start',
                    isChecked: false
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  phenotypes: {
    type: 'section',
    label: 'Phenotypes',
    id: 'phenotypes',
    content: []
  },
  protein: {
    type: 'section',
    label: 'Protein',
    id: 'protein',
    content: []
  },
  orthologues: {
    type: 'section',
    label: 'Orthologues',
    id: 'orthologues',
    content: []
  },
  paralogues: {
    type: 'section',
    label: 'Paralogues',
    id: 'paralogues',
    content: []
  }
};

export default attributes;
