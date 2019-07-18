import { Filters } from 'src/content/app/custom-download/types/Filters';

const filters: Filters = {
  genes: {
    type: 'section',
    id: 'genes',
    label: 'Genes & Transcripts',
    content: [
      {
        type: 'select_multiple',
        label: 'Gene source',
        id: 'gene_source',
        options: [
          {
            value: 'ensembl',
            label: 'Ensembl',
            isSelected: false
          },
          {
            value: 'ensembl_havana',
            label: 'Ensembl Havana',
            isSelected: false
          },
          {
            value: 'havana',
            label: 'Havana',
            isSelected: false
          },
          {
            value: 'insdc',
            label: 'INSDC',
            isSelected: false
          },
          {
            value: 'mirbase',
            label: 'Mirbase',
            isSelected: false
          }
        ],
        selectedOptions: []
      },

      {
        type: 'select_one',
        label: 'GENCODE basic annotation',
        id: 'gencode_basic_annotation',
        options: [
          {
            value: 'include',
            label: 'Include'
          },
          {
            value: 'exclude',
            label: 'Exclude'
          }
        ]
      },

      {
        type: 'section_group',
        label: '',
        id: 'default',
        content: [
          {
            type: 'section',
            label: 'Gene type',
            id: 'gene_type',
            content: [
              {
                type: 'select_multiple',
                label: 'Biotype',
                id: 'biotype',
                options: [
                  {
                    label: 'protein_coding',
                    value: 'protein_coding',
                    isSelected: false
                  },
                  { label: 'lncRNA', value: 'lncRNA', isSelected: false },
                  {
                    label: 'processed_pseudogene',
                    value: 'processed_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'unprocessed_pseudogene',
                    value: 'unprocessed_pseudogene',
                    isSelected: false
                  },
                  { label: 'misc_RNA', value: 'misc_RNA', isSelected: false },
                  { label: 'snRNA', value: 'snRNA', isSelected: false },
                  { label: 'miRNA', value: 'miRNA', isSelected: false },
                  { label: 'TEC', value: 'TEC', isSelected: false },
                  {
                    label: 'transcribed_unprocessed_pseudogene',
                    value: 'transcribed_unprocessed_pseudogene',
                    isSelected: false
                  },
                  { label: 'snoRNA', value: 'snoRNA', isSelected: false },
                  { label: 'LRG_gene', value: 'LRG_gene', isSelected: false }
                ]
              }
            ]
          },
          {
            type: 'section',
            label: 'Transcript type',
            id: 'transcript_type',
            content: [
              {
                type: 'select_multiple',
                label: 'Biotype',
                id: 'biotype',
                options: [
                  {
                    label: 'protein_coding',
                    value: 'protein_coding',
                    isSelected: false
                  },
                  { label: 'lncRNA', value: 'lncRNA', isSelected: false },
                  {
                    label: 'retained_intron',
                    value: 'retained_intron',
                    isSelected: false
                  },
                  {
                    label: 'nonsense_mediated_decay',
                    value: 'nonsense_mediated_decay',
                    isSelected: false
                  },
                  {
                    label: 'processed_pseudogene',
                    value: 'processed_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'unprocessed_pseudogene',
                    value: 'unprocessed_pseudogene',
                    isSelected: false
                  },
                  { label: 'misc_RNA', value: 'misc_RNA', isSelected: false },
                  { label: 'snRNA', value: 'snRNA', isSelected: false },
                  { label: 'miRNA', value: 'miRNA', isSelected: false },
                  { label: 'TEC', value: 'TEC', isSelected: false },
                  {
                    label: 'transcribed_unprocessed_pseudogene',
                    value: 'transcribed_unprocessed_pseudogene',
                    isSelected: false
                  },
                  { label: 'snoRNA', value: 'snoRNA', isSelected: false }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  regions: {
    type: 'section',
    label: 'Regions',
    id: 'regions'
  },
  variants: {
    type: 'section',
    label: 'Variants',
    id: 'variants'
  },
  phenotypes: {
    type: 'section',
    label: 'Phenotypes',
    id: 'phenotypes'
  },
  proteins: {
    type: 'section',
    label: 'Protein domains & families',
    id: 'protein_and_domain_families',
    content: [
      {
        type: 'section_group',
        label: '',
        id: 'default',
        content: [
          {
            type: 'section',
            label: 'Upload family or domain IDs',
            id: 'family_or_domain_ids',
            content: [
              {
                type: 'paste_or_upload',
                label: 'Limit to genes',
                id: 'limit_to_genes'
              }
            ]
          }
        ]
      }
    ]
  },
  homologues: {
    type: 'section',
    label: 'Homologues',
    id: 'homologues'
  }
};

export default filters;
