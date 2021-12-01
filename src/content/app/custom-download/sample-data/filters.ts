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

import { Attributes } from 'src/content/app/custom-download/types/Attributes';

const filters: Attributes = {
  genes: {
    type: 'section',
    id: 'genes',
    label: 'Genes & Transcripts',
    content: [
      {
        type: 'checkbox_grid',
        label: 'Gene biotype',
        id: 'biotype',
        options: [
          {
            label: 'protein_coding',
            id: 'protein_coding',
            isChecked: false
          },
          { label: 'lncRNA', id: 'lncRNA', isChecked: false },
          {
            label: 'processed_pseudogene',
            id: 'processed_pseudogene',
            isChecked: false
          },
          {
            label: 'unprocessed_pseudogene',
            id: 'unprocessed_pseudogene',
            isChecked: false
          },
          { label: 'misc_RNA', id: 'misc_RNA', isChecked: false },
          { label: 'snRNA', id: 'snRNA', isChecked: false },
          { label: 'miRNA', id: 'miRNA', isChecked: false },
          { label: 'TEC', id: 'TEC', isChecked: false },
          {
            label: 'transcribed_unprocessed_pseudogene',
            id: 'transcribed_unprocessed_pseudogene',
            isChecked: false
          },
          { label: 'snoRNA', id: 'snoRNA', isChecked: false },
          { label: 'LRG_gene', id: 'LRG_gene', isChecked: false }
        ]
      },
      {
        type: 'checkbox_grid',
        label: 'Transcripts biotype',
        id: 'transcripts.biotype',
        options: [
          {
            label: 'protein_coding',
            id: 'protein_coding',
            isChecked: false
          },
          { label: 'lncRNA', id: 'lncRNA', isChecked: false },
          {
            label: 'retained_intron',
            id: 'retained_intron',
            isChecked: false
          },
          {
            label: 'nonsense_mediated_decay',
            id: 'nonsense_mediated_decay',
            isChecked: false
          },
          {
            label: 'processed_pseudogene',
            id: 'processed_pseudogene',
            isChecked: false
          },
          {
            label: 'unprocessed_pseudogene',
            id: 'unprocessed_pseudogene',
            isChecked: false
          },
          { label: 'misc_RNA', id: 'misc_RNA', isChecked: false },
          { label: 'snRNA', id: 'snRNA', isChecked: false },
          { label: 'miRNA', id: 'miRNA', isChecked: false },
          { label: 'TEC', id: 'TEC', isChecked: false },
          {
            label: 'transcribed_unprocessed_pseudogene',
            id: 'transcribed_unprocessed_pseudogene',
            isChecked: false
          },
          { label: 'snoRNA', id: 'snoRNA', isChecked: false }
        ]
      },
      {
        type: 'select_multiple',
        label: 'Gene source',
        id: 'gene_source',
        disabled: true,
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
        label: 'Gencode basic annotation',
        id: 'gencode_basic_annotation',
        disabled: true,
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
        type: 'paste_or_upload',
        label: 'Limit by ID list',
        id: 'limit_to_genes'
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
    content: []
  },
  homologues: {
    type: 'section',
    label: 'Homologues',
    id: 'homologues',
    content: []
  }
};

export default filters;
