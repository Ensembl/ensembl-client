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
                  { label: 'LRG_gene', value: 'LRG_gene', isSelected: false },
                  {
                    label: 'transcribed_processed_pseudogene',
                    value: 'transcribed_processed_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'rRNA_pseudogene',
                    value: 'rRNA_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'IG_V_pseudogene',
                    value: 'IG_V_pseudogene',
                    isSelected: false
                  },
                  { label: 'IG_V_gene', value: 'IG_V_gene', isSelected: false },
                  { label: 'TR_V_gene', value: 'TR_V_gene', isSelected: false },
                  {
                    label: 'transcribed_unitary_pseudogene',
                    value: 'transcribed_unitary_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'unitary_pseudogene',
                    value: 'unitary_pseudogene',
                    isSelected: false
                  },
                  { label: 'TR_J_gene', value: 'TR_J_gene', isSelected: false },
                  { label: 'rRNA', value: 'rRNA', isSelected: false },
                  {
                    label: 'polymorphic_pseudogene',
                    value: 'polymorphic_pseudogene',
                    isSelected: false
                  },
                  { label: 'IG_D_gene', value: 'IG_D_gene', isSelected: false },
                  { label: 'scaRNA', value: 'scaRNA', isSelected: false },
                  {
                    label: 'TR_V_pseudogene',
                    value: 'TR_V_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'pseudogene',
                    value: 'pseudogene',
                    isSelected: false
                  },
                  { label: 'IG_J_gene', value: 'IG_J_gene', isSelected: false },
                  { label: 'IG_C_gene', value: 'IG_C_gene', isSelected: false },
                  { label: 'Mt_tRNA', value: 'Mt_tRNA', isSelected: false },
                  {
                    label: 'IG_C_pseudogene',
                    value: 'IG_C_pseudogene',
                    isSelected: false
                  },
                  { label: 'TR_C_gene', value: 'TR_C_gene', isSelected: false },
                  { label: 'ribozyme', value: 'ribozyme', isSelected: false },
                  { label: 'sRNA', value: 'sRNA', isSelected: false },
                  {
                    label: 'IG_J_pseudogene',
                    value: 'IG_J_pseudogene',
                    isSelected: false
                  },
                  { label: 'TR_D_gene', value: 'TR_D_gene', isSelected: false },
                  {
                    label: 'TR_J_pseudogene',
                    value: 'TR_J_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'translated_processed_pseudogene',
                    value: 'translated_processed_pseudogene',
                    isSelected: false
                  },
                  { label: 'Mt_rRNA', value: 'Mt_rRNA', isSelected: false },
                  {
                    label: 'translated_unprocessed_pseudogene',
                    value: 'translated_unprocessed_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'IG_pseudogene',
                    value: 'IG_pseudogene',
                    isSelected: false
                  },
                  { label: 'scRNA', value: 'scRNA', isSelected: false },
                  { label: 'vaultRNA', value: 'vaultRNA', isSelected: false }
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
                  { label: 'snoRNA', value: 'snoRNA', isSelected: false },
                  { label: 'LRG_gene', value: 'LRG_gene', isSelected: false },
                  {
                    label: 'transcribed_processed_pseudogene',
                    value: 'transcribed_processed_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'rRNA_pseudogene',
                    value: 'rRNA_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'IG_V_pseudogene',
                    value: 'IG_V_pseudogene',
                    isSelected: false
                  },
                  { label: 'IG_V_gene', value: 'IG_V_gene', isSelected: false },
                  { label: 'TR_V_gene', value: 'TR_V_gene', isSelected: false },
                  {
                    label: 'transcribed_unitary_pseudogene',
                    value: 'transcribed_unitary_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'unitary_pseudogene',
                    value: 'unitary_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'polymorphic_pseudogene',
                    value: 'polymorphic_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'non_stop_decay',
                    value: 'non_stop_decay',
                    isSelected: false
                  },
                  { label: 'TR_J_gene', value: 'TR_J_gene', isSelected: false },
                  { label: 'rRNA', value: 'rRNA', isSelected: false },
                  { label: 'IG_D_gene', value: 'IG_D_gene', isSelected: false },
                  {
                    label: 'pseudogene',
                    value: 'pseudogene',
                    isSelected: false
                  },
                  { label: 'scaRNA', value: 'scaRNA', isSelected: false },
                  {
                    label: 'TR_V_pseudogene',
                    value: 'TR_V_pseudogene',
                    isSelected: false
                  },
                  { label: 'IG_C_gene', value: 'IG_C_gene', isSelected: false },
                  { label: 'IG_J_gene', value: 'IG_J_gene', isSelected: false },
                  { label: 'Mt_tRNA', value: 'Mt_tRNA', isSelected: false },
                  {
                    label: 'IG_C_pseudogene',
                    value: 'IG_C_pseudogene',
                    isSelected: false
                  },
                  { label: 'TR_C_gene', value: 'TR_C_gene', isSelected: false },
                  { label: 'ribozyme', value: 'ribozyme', isSelected: false },
                  { label: 'sRNA', value: 'sRNA', isSelected: false },
                  {
                    label: 'IG_J_pseudogene',
                    value: 'IG_J_pseudogene',
                    isSelected: false
                  },
                  { label: 'TR_D_gene', value: 'TR_D_gene', isSelected: false },
                  {
                    label: 'TR_J_pseudogene',
                    value: 'TR_J_pseudogene',
                    isSelected: false
                  },
                  { label: 'Mt_rRNA', value: 'Mt_rRNA', isSelected: false },
                  {
                    label: 'translated_unprocessed_pseudogene',
                    value: 'translated_unprocessed_pseudogene',
                    isSelected: false
                  },
                  {
                    label: 'translated_processed_pseudogene',
                    value: 'translated_processed_pseudogene',
                    isSelected: false
                  },
                  { label: 'vaultRNA', value: 'vaultRNA', isSelected: false },
                  { label: 'scRNA', value: 'scRNA', isSelected: false },
                  {
                    label: 'IG_pseudogene',
                    value: 'IG_pseudogene',
                    isSelected: false
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
  protein_and_domain_families: {
    type: 'section',
    label: 'Protein domains & families',
    id: 'protein_and_domain_families'
  },
  homologues: {
    type: 'section',
    label: 'Homologues',
    id: 'homologues'
  }
};

export default filters;
