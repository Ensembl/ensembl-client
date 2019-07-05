import { RadioOptions } from 'src/shared/radio/Radio';

export type Filter = {
  type: string;
  label: string;
  id?: string;
  content?: Filter[];
  options?: RadioOptions;
  selectedOptions?: string[];
};

export type Filters = {
  [key: string]: Filter;
};

const filters: Filters = {
  genes: {
    type: 'accordion_item',
    label: 'Genes & Transcripts',
    content: [
      {
        type: 'checkbox_with_selects',
        label: 'Gene source',
        id: 'genes.gene_source',
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
        type: 'checkbox_with_radios',
        label: 'GENCODE basic annotation',
        id: 'genes.gencode_basic_annotation',
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
        type: 'accordion',
        label: '',
        preExpanded: [],
        content: [
          {
            type: 'accordion_item',
            label: 'Gene type',
            id: 'gene_type',
            content: [
              {
                type: 'checkbox_grid',
                label: '',
                gridData: [
                  {
                    id: 'source',
                    label: 'Gene source',
                    isChecked: false
                  },
                  {
                    id: 'type',
                    label: 'Type',
                    isChecked: false
                  }
                ]
              }
            ]
          },
          {
            type: 'accordion_item',
            label: 'Transcript type',
            id: 'transcript_type',
            content: [
              {
                type: 'checkbox_grid',
                label: '',
                gridData: [
                  {
                    id: 'protein_coding',
                    label: 'Protein coding',
                    isChecked: false
                  },
                  {
                    id: 'type',
                    label: 'Type',
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
  regions: {
    type: 'accordion_item',
    label: 'Regions'
  },
  variants: {
    type: 'accordion_item',
    label: 'Variants'
  },
  phenotypes: {
    type: 'accordion_item',
    label: 'Phenotypes'
  },
  protein_and_domain_families: {
    type: 'accordion_item',
    label: 'Protein domains & families'
  },
  homologues: {
    type: 'accordion_item',
    label: 'Homologues'
  }
};

export default filters;
