import Attributes from '../types/Attributes';

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
            isChecked: true,
            order: 1
          },
          {
            id: 'id',
            label: 'Gene stable ID',
            isChecked: true,
            order: 2
          },
          {
            id: 'version',
            label: 'Version',
            isChecked: false,
            order: 3
          },
          {
            id: 'source',
            label: 'Source (gene)',
            isChecked: false,
            order: 9
          },
          {
            id: 'biotype',
            label: 'Gene Biotype',
            isChecked: true,
            order: 5
          },
          {
            id: 'strand',
            label: 'Strand',
            isChecked: false,
            order: 8
          },
          {
            id: 'start',
            label: 'Gene Start',
            isChecked: true,
            order: 6
          },
          {
            id: 'end',
            label: 'Gene End',
            isChecked: true,
            order: 7
          },
          {
            id: 'chromosome',
            label: 'Gene chromosome',
            isChecked: true,
            order: 5
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
            isChecked: false,
            order: 1
          },
          {
            id: 'ncbi_id',
            label: 'NCBI gene ID',
            isChecked: false,
            order: 1
          },
          {
            id: 'HGNC',
            label: 'HGNC symbol',
            isChecked: false,
            order: 1
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
            id: 'biotype',
            label: 'Transcript Biotype',
            isChecked: false,
            order: 3
          },
          { id: 'go_domain', label: 'GO domain', isChecked: false, order: 10 },
          {
            id: 'gencode_basic_annotation',
            label: 'GENCODE basic annotation',
            isChecked: false,
            order: 9
          },
          {
            id: 'name',
            label: 'Transcript name',
            isChecked: true,
            order: 1
          },
          {
            id: 'transcripts.chromosome',
            label: 'Transcript chromosome',
            isChecked: true,
            order: 5
          },
          {
            id: 'id',
            label: 'Transcript stable ID',
            isChecked: true,
            order: 2
          },
          {
            id: 'Interpro',
            label: 'Interpro Domain ID',
            isChecked: false,
            order: 8
          },
          {
            id: 'start',
            label: 'Transcript Start',
            isChecked: false,
            order: 6
          },
          {
            id: 'end',
            label: 'Transcript End',
            isChecked: false,
            order: 7
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
            isChecked: false,
            order: 1
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
