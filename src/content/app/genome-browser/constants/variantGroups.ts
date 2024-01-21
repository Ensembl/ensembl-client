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

const variantGroups = [
  {
    id: 1,
    label: 'Protein altering variant',
    variant_types: [
      {
        label: 'frameshift_variant',
        so_accession_id: 'SO:0001589',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001589'
      },
      {
        label: 'inframe_deletion',
        so_accession_id: 'SO:0001822',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001822'
      },
      {
        label: 'inframe_insertion',
        so_accession_id: 'SO:0001821',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001821'
      },
      {
        label: 'missense_variant',
        so_accession_id: 'SO:0001583',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001583'
      },
      {
        label: 'protein_altering_variant',
        so_accession_id: 'SO:0001818',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001818'
      },
      {
        label: 'start_lost',
        so_accession_id: 'SO:0002012',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0002012'
      },
      {
        label: 'stop_gained',
        so_accession_id: 'SO:0001587',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001587'
      },
      {
        label: 'stop_lost',
        so_accession_id: 'SO:0001578',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001578'
      }
    ]
  },
  {
    id: 2,
    label: 'Splicing variant',
    variant_types: [
      {
        label: 'splice_acceptor_variant',
        so_accession_id: 'SO:0001574',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001574'
      },
      {
        label: 'splice_donor_5th_base_variant',
        so_accession_id: 'SO:0001787',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001787'
      },
      {
        label: 'splice_donor_region_variant',
        so_accession_id: 'SO:0002170',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0002170'
      },
      {
        label: 'splice_donor_variant',
        so_accession_id: 'SO:0001575',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001575'
      },
      {
        label: 'splice_polypyrimidine_tract_variant',
        so_accession_id: 'SO:0002169',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0002169'
      },
      {
        label: 'splice_region_variant',
        so_accession_id: 'SO:0001630',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001630'
      }
    ]
  },
  {
    id: 3,
    label: 'Transcript variant',
    variant_types: [
      {
        label: '3_prime_UTR_variant',
        so_accession_id: 'SO:0001624',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001624'
      },
      {
        label: '5_prime_UTR_variant',
        so_accession_id: 'SO:0001623',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001623'
      },
      {
        label: 'coding_sequence_variant',
        so_accession_id: 'SO:0001580',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001580'
      },
      {
        label: 'incomplete_terminal_codon_variant',
        so_accession_id: 'SO:0001626',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001626'
      },
      {
        label: 'intron_variant',
        so_accession_id: 'SO:0001627',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001627'
      },
      {
        label: 'mature_miRNA_variant',
        so_accession_id: 'SO:0001620',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001620'
      },
      {
        label: 'NMD_transcript_variant',
        so_accession_id: 'SO:0001621',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001621'
      },
      {
        label: 'non_coding_transcript_exon_variant',
        so_accession_id: 'SO:0001792',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001792'
      },
      {
        label: 'non_coding_transcript_variant',
        so_accession_id: 'SO:0001619',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001619'
      },
      {
        label: 'start_retained_variant',
        so_accession_id: 'SO:0002019',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0002019'
      },
      {
        label: 'stop_retained_variant',
        so_accession_id: 'SO:0001567',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001567'
      },
      {
        label: 'synonymous_variant',
        so_accession_id: 'SO:0001819',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001819'
      }
    ]
  },
  {
    id: 4,
    label: 'Regulatory region variant',
    variant_types: [
      {
        label: 'regulatory_region_variant',
        so_accession_id: 'SO:0001566',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001566'
      },
      {
        label: 'TF_binding_site_variant',
        so_accession_id: 'SO:0001782',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001782'
      }
    ]
  },
  {
    id: 5,
    label: 'Intergenic variant',
    variant_types: [
      {
        label: 'downstream_gene_variant',
        so_accession_id: 'SO:0001632',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001632'
      },
      {
        label: 'intergenic_variant',
        so_accession_id: 'SO:0001628',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001628'
      },
      {
        label: 'upstream_gene_variant',
        so_accession_id: 'SO:0001631',
        url: 'http://www.sequenceontology.org/miso/current_svn/term/SO:0001631'
      }
    ]
  }
];

export type VariantGroups = typeof variantGroups;
export default variantGroups;
