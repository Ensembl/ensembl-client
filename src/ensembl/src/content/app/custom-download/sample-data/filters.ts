import { RadioOptions } from 'src/shared/radio/Radio';
import { Option } from 'src/shared/select/Select';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

export type Filter = {
  type: string;
  label: string;
  id: string;
  content?: Filter[];
  options?: RadioOptions | Option[] | CheckboxGridOption[];
  selectedOptions?: string[];
  selectedOption?: string;
};

export type Filters = {
  [key: string]: Filter;
};

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
        preExpanded: [],
        content: [
          {
            type: 'section',
            label: 'Gene type',
            id: 'gene_type',
            content: [
              {
                type: 'checkbox_grid',
                label: '',
                id: 'default',
                options: [
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
            type: 'section',
            label: 'Transcript type',
            id: 'transcript_type',
            content: [
              {
                type: 'checkbox_grid',
                label: '',
                id: 'default',
                options: [
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
    type: 'section',
    label: 'Regions'
  },
  variants: {
    type: 'section',
    label: 'Variants'
  },
  phenotypes: {
    type: 'section',
    label: 'Phenotypes'
  },
  protein_and_domain_families: {
    type: 'section',
    label: 'Protein domains & families'
  },
  homologues: {
    type: 'section',
    label: 'Homologues'
  }
};

export default filters;
