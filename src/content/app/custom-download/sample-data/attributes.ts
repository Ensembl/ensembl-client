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

import { Attributes } from '../types/Attributes';

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
            id: 'chromosome',
            label: 'Gene chromosome',
            isChecked: true
          },
          {
            id: 'biotype',
            label: 'Gene Biotype',
            isChecked: true
          },
          {
            id: 'start',
            label: 'Gene Start',
            isChecked: true
          },
          {
            id: 'end',
            label: 'Gene End',
            isChecked: true
          },
          {
            id: 'strand',
            label: 'Strand',
            isChecked: false
          },
          {
            id: 'source',
            label: 'Source (gene)',
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
          }
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
            id: 'biotype',
            label: 'Transcript Biotype',
            isChecked: false
          },
          {
            id: 'chromosome',
            label: 'Transcript chromosome',
            isChecked: true
          },

          {
            id: 'start',
            label: 'Transcript Start',
            isChecked: false
          },
          {
            id: 'end',
            label: 'Transcript End',
            isChecked: false
          },
          {
            id: 'Interpro',
            label: 'Interpro Domain ID',
            isChecked: false
          },
          {
            id: 'gencode_basic_annotation',
            label: 'GENCODE basic annotation',
            isChecked: false
          },
          { id: 'go_domain', label: 'GO domain', isChecked: false }
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
  paralogues: {
    type: 'section',
    label: 'Paralogues',
    id: 'paralogues',
    content: []
  }
};

export default attributes;
