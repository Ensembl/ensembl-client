export type Attribute = {
  isChecked: boolean;
  id: string;
  label: string;
};

export type Attributes = {
  [key: string]: Attribute;
};

const attributes = {
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
            label: 'Gene symbol',
            isChecked: false
          },
          {
            id: 'id',
            label: 'Gene stable ID',
            isChecked: false
          },
          {
            id: 'id_version',
            label: 'Gene stable ID version',
            isChecked: false
          },
          {
            id: 'Superfamily',
            label: 'Superfamily',
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
            isChecked: false
          },
          {
            id: 'end',
            label: 'Gene end (bp)',
            isChecked: false
          },
          {
            id: 'UniParc',
            label: 'UniParc',
            isChecked: false
          },
          {
            id: 'source',
            label: 'Source (gene)',
            isChecked: false
          },
          {
            id: 'BioGRID',
            label: 'BioGRID',
            isChecked: false
          },
          {
            id: 'Smart',
            label: 'Smart',
            isChecked: false
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
            id: 'transcripts.biotype',
            label: 'Biotype',
            isChecked: true
          },
          {
            id: 'transcripts.name',
            label: 'Transcript name',
            isChecked: true
          },
          {
            id: 'transcripts.id',
            label: 'Transcript stable ID',
            isChecked: true
          },
          {
            id: 'transcripts.AGD_TRANSCRIPT',
            label: 'Ashbya Genome Database',
            isChecked: false
          },
          {
            id: 'transcripts.type',
            label: 'Transcript Type',
            isChecked: false
          },
          {
            id: 'transcripts.UniGene',
            label: 'UniGene',
            isChecked: false
          },
          {
            id: 'transcripts.Pfam',
            label: 'Pfam',
            isChecked: false
          },
          {
            id: 'transcripts.HGNC_trans_name',
            label: 'HGNC_trans_name',
            isChecked: false
          },
          {
            id: 'transcripts.start',
            label: 'Start',
            isChecked: false
          },
          {
            id: 'transcripts.end',
            label: 'End',
            isChecked: false
          },
          {
            id: 'transcripts.Interpro',
            label: 'Interpro',
            isChecked: false
          },
          {
            id: 'transcripts.Smart',
            label: 'Smart',
            isChecked: false
          },
          {
            id: 'transcripts.analysis',
            label: 'Analysis',
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
            id: 'transcripts.affy_hc_g110_probe',
            label: 'AFFY HC G110 probe',
            isChecked: false
          },
          {
            id: 'transcripts.agilent_sureprint_g3_ge_8x60k_probe',
            label: 'AGILENT SurePrint G3 GE 8x60k probe',
            isChecked: false
          },
          {
            id: 'transcripts.illumina_humanref_8_v3_probe',
            label: 'ILLUMINA HumanRef 8 V3 probe',
            isChecked: false
          },
          {
            id: 'transcripts.affy_hta_2_0_probe',
            label: 'AFFY HTA 2 0 probe',
            isChecked: false
          },
          {
            id: 'transcripts.codelink_codelink_probe',
            label: 'CODELINK CODELINK probe',
            isChecked: false
          },
          {
            id: 'transcripts.go_domain',
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
    content: []
  },
  sequence: {
    type: 'section',
    label: 'Sequence',
    content: []
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
    content: []
  },
  protein: {
    type: 'section',
    label: 'Protein',
    content: []
  },
  orthologues: {
    type: 'section',
    label: 'Orthologues',
    content: []
  },
  paralogues: {
    type: 'section',
    label: 'Paralogues',
    content: []
  }
};

export default attributes;
