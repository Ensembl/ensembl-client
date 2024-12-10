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

import type { EpigenomeMetadataDimensionsResponse } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

const epigenomesMetadata = {
  species_name: 'Homo sapiens',
  assemblies: ['GRCh38'],
  filter_layout: [
    ['term'],
    ['organs'],
    ['sex'],
    ['life_stage'],
    ['material', 'systems']
  ],
  table_header_order: [
    'term',
    'sex',
    'life_stage',
    'age',
    'organs',
    'systems',
    'material'
  ],
  dimensions: {
    material: {
      name: 'Biosample material',
      collapsible: true,
      filterable: true,
      zero_counts_visible: true,
      type: 'categorical',
      values: [
        'cell line',
        'primary cell',
        'primary cell culture',
        'primary tissue'
      ],
      default_values: []
    },
    term: {
      name: 'Biosample term',
      collapsible: false,
      filterable: true,
      zero_counts_visible: false,
      type: 'categorical_with_ontology',
      values: [
        {
          name: 'A549',
          ontology: {
            curie: 'EFO:0001086',
            url: 'https://purl.obolibrary.org/obo/EFO_0001086'
          }
        },
        {
          name: 'A673',
          ontology: {
            curie: 'EFO:0002106',
            url: 'https://purl.obolibrary.org/obo/EFO_0002106'
          }
        },
        {
          name: 'ACC112',
          ontology: {
            curie: 'EFO:0007070',
            url: 'https://purl.obolibrary.org/obo/EFO_0007070'
          }
        },
        {
          name: 'adrenal gland',
          ontology: {
            curie: 'UBERON:0002369',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002369'
          }
        },
        {
          name: 'AG04450',
          ontology: {
            curie: 'EFO:0006270',
            url: 'https://purl.obolibrary.org/obo/EFO_0006270'
          }
        },
        {
          name: 'ascending aorta',
          ontology: {
            curie: 'UBERON:0001496',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001496'
          }
        },
        {
          name: 'astrocyte',
          ontology: {
            curie: 'CL:0000127',
            url: 'https://purl.obolibrary.org/obo/CL_0000127'
          }
        },
        {
          name: 'B cell',
          ontology: {
            curie: 'CL:0000236',
            url: 'https://purl.obolibrary.org/obo/CL_0000236'
          }
        },
        {
          name: 'BJ',
          ontology: {
            curie: 'EFO:0002779',
            url: 'https://purl.obolibrary.org/obo/EFO_0002779'
          }
        },
        {
          name: 'body of pancreas',
          ontology: {
            curie: 'UBERON:0001150',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001150'
          }
        },
        {
          name: 'brain',
          ontology: {
            curie: 'UBERON:0000955',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000955'
          }
        },
        {
          name: 'breast epithelium',
          ontology: {
            curie: 'UBERON:0008367',
            url: 'https://purl.obolibrary.org/obo/UBERON_0008367'
          }
        },
        {
          name: 'bronchial epithelial cell',
          ontology: {
            curie: 'CL:0002328',
            url: 'https://purl.obolibrary.org/obo/CL_0002328'
          }
        },
        {
          name: 'Caco-2',
          ontology: {
            curie: 'EFO:0001099',
            url: 'https://purl.obolibrary.org/obo/EFO_0001099'
          }
        },
        {
          name: 'cardiac muscle cell',
          ontology: {
            curie: 'CL:0000746',
            url: 'https://purl.obolibrary.org/obo/CL_0000746'
          }
        },
        {
          name: 'CD14-positive monocyte',
          ontology: {
            curie: 'CL:0001054',
            url: 'https://purl.obolibrary.org/obo/CL_0001054'
          }
        },
        {
          name: 'common myeloid progenitor, CD34-positive',
          ontology: {
            curie: 'CL:0001059',
            url: 'https://purl.obolibrary.org/obo/CL_0001059'
          }
        },
        {
          name: 'DND-41',
          ontology: {
            curie: 'EFO:0007074',
            url: 'https://purl.obolibrary.org/obo/EFO_0007074'
          }
        },
        {
          name: 'DOHH2',
          ontology: {
            curie: 'EFO:0002167',
            url: 'https://purl.obolibrary.org/obo/EFO_0002167'
          }
        },
        {
          name: 'ectodermal cell',
          ontology: {
            curie: 'CL:0000221',
            url: 'https://purl.obolibrary.org/obo/CL_0000221'
          }
        },
        {
          name: 'endodermal cell',
          ontology: {
            curie: 'CL:0000223',
            url: 'https://purl.obolibrary.org/obo/CL_0000223'
          }
        },
        {
          name: 'endothelial cell of umbilical vein',
          ontology: {
            curie: 'CL:0002618',
            url: 'https://purl.obolibrary.org/obo/CL_0002618'
          }
        },
        {
          name: 'ES-I3',
          ontology: {
            curie: 'EFO:0007076',
            url: 'https://purl.obolibrary.org/obo/EFO_0007076'
          }
        },
        {
          name: 'esophagus muscularis mucosa',
          ontology: {
            curie: 'UBERON:0004648',
            url: 'https://purl.obolibrary.org/obo/UBERON_0004648'
          }
        },
        {
          name: 'esophagus squamous epithelium',
          ontology: {
            curie: 'UBERON:0006920',
            url: 'https://purl.obolibrary.org/obo/UBERON_0006920'
          }
        },
        {
          name: 'fibroblast of dermis',
          ontology: {
            curie: 'CL:0002551',
            url: 'https://purl.obolibrary.org/obo/CL_0002551'
          }
        },
        {
          name: 'fibroblast of lung',
          ontology: {
            curie: 'CL:0002553',
            url: 'https://purl.obolibrary.org/obo/CL_0002553'
          }
        },
        {
          name: 'fibroblast of mammary gland',
          ontology: {
            curie: 'CL:0002555',
            url: 'https://purl.obolibrary.org/obo/CL_0002555'
          }
        },
        {
          name: 'foreskin fibroblast',
          ontology: {
            curie: 'CL:1001608',
            url: 'https://purl.obolibrary.org/obo/CL_1001608'
          }
        },
        {
          name: 'gastrocnemius medialis',
          ontology: {
            curie: 'UBERON:0011907',
            url: 'https://purl.obolibrary.org/obo/UBERON_0011907'
          }
        },
        {
          name: 'gastroesophageal sphincter',
          ontology: {
            curie: 'UBERON:0004550',
            url: 'https://purl.obolibrary.org/obo/UBERON_0004550'
          }
        },
        {
          name: 'GM06990',
          ontology: {
            curie: 'EFO:0002783',
            url: 'https://purl.obolibrary.org/obo/EFO_0002783'
          }
        },
        {
          name: 'GM12878',
          ontology: {
            curie: 'EFO:0002784',
            url: 'https://purl.obolibrary.org/obo/EFO_0002784'
          }
        },
        {
          name: 'GM23248',
          ontology: {
            curie: 'EFO:0005723',
            url: 'https://purl.obolibrary.org/obo/EFO_0005723'
          }
        },
        {
          name: 'GM23338',
          ontology: {
            curie: 'EFO:0007950',
            url: 'https://purl.obolibrary.org/obo/EFO_0007950'
          }
        },
        {
          name: 'H1',
          ontology: {
            curie: 'EFO:0003042',
            url: 'https://purl.obolibrary.org/obo/EFO_0003042'
          }
        },
        {
          name: 'H7',
          ontology: {
            curie: 'EFO:0005904',
            url: 'https://purl.obolibrary.org/obo/EFO_0005904'
          }
        },
        {
          name: 'H9',
          ontology: {
            curie: 'EFO:0003045',
            url: 'https://purl.obolibrary.org/obo/EFO_0003045'
          }
        },
        {
          name: 'HCT116',
          ontology: {
            curie: 'EFO:0002824',
            url: 'https://purl.obolibrary.org/obo/EFO_0002824'
          }
        },
        {
          name: 'heart',
          ontology: {
            curie: 'UBERON:0000948',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000948'
          }
        },
        {
          name: 'heart left ventricle',
          ontology: {
            curie: 'UBERON:0002084',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002084'
          }
        },
        {
          name: 'HEK293',
          ontology: {
            curie: 'EFO:0001182',
            url: 'https://purl.obolibrary.org/obo/EFO_0001182'
          }
        },
        {
          name: 'HeLa-S3',
          ontology: {
            curie: 'EFO:0002791',
            url: 'https://purl.obolibrary.org/obo/EFO_0002791'
          }
        },
        {
          name: 'hepatocyte',
          ontology: {
            curie: 'CL:0000182',
            url: 'https://purl.obolibrary.org/obo/CL_0000182'
          }
        },
        {
          name: 'HepG2',
          ontology: {
            curie: 'EFO:0001187',
            url: 'https://purl.obolibrary.org/obo/EFO_0001187'
          }
        },
        {
          name: 'HUES48',
          ontology: {
            curie: 'EFO:0007083',
            url: 'https://purl.obolibrary.org/obo/EFO_0007083'
          }
        },
        {
          name: 'HUES6',
          ontology: {
            curie: 'EFO:0007086',
            url: 'https://purl.obolibrary.org/obo/EFO_0007086'
          }
        },
        {
          name: 'HUES64',
          ontology: {
            curie: 'EFO:0007089',
            url: 'https://purl.obolibrary.org/obo/EFO_0007089'
          }
        },
        {
          name: 'IMR-90',
          ontology: {
            curie: 'EFO:0001196',
            url: 'https://purl.obolibrary.org/obo/EFO_0001196'
          }
        },
        {
          name: 'iPS-18a',
          ontology: {
            curie: 'EFO:0007105',
            url: 'https://purl.obolibrary.org/obo/EFO_0007105'
          }
        },
        {
          name: 'iPS-18c',
          ontology: {
            curie: 'EFO:0007107',
            url: 'https://purl.obolibrary.org/obo/EFO_0007107'
          }
        },
        {
          name: 'iPS-20b',
          ontology: {
            curie: 'EFO:0007108',
            url: 'https://purl.obolibrary.org/obo/EFO_0007108'
          }
        },
        {
          name: 'iPS DF 19.11',
          ontology: {
            curie: 'EFO:0007096',
            url: 'https://purl.obolibrary.org/obo/EFO_0007096'
          }
        },
        {
          name: 'iPS DF 6.9',
          ontology: {
            curie: 'EFO:0007098',
            url: 'https://purl.obolibrary.org/obo/EFO_0007098'
          }
        },
        {
          name: 'K562',
          ontology: {
            curie: 'EFO:0002067',
            url: 'https://purl.obolibrary.org/obo/EFO_0002067'
          }
        },
        {
          name: 'Karpas-422',
          ontology: {
            curie: 'EFO:0005719',
            url: 'https://purl.obolibrary.org/obo/EFO_0005719'
          }
        },
        {
          name: 'keratinocyte',
          ontology: {
            curie: 'CL:0000312',
            url: 'https://purl.obolibrary.org/obo/CL_0000312'
          }
        },
        {
          name: 'kidney',
          ontology: {
            curie: 'UBERON:0002113',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002113'
          }
        },
        {
          name: 'kidney epithelial cell',
          ontology: {
            curie: 'CL:0002518',
            url: 'https://purl.obolibrary.org/obo/CL_0002518'
          }
        },
        {
          name: 'KMS-11',
          ontology: {
            curie: 'EFO:0005694',
            url: 'https://purl.obolibrary.org/obo/EFO_0005694'
          }
        },
        {
          name: 'KOPT-K1',
          ontology: {
            curie: 'EFO:0006283',
            url: 'https://purl.obolibrary.org/obo/EFO_0006283'
          }
        },
        {
          name: 'large intestine',
          ontology: {
            curie: 'UBERON:0000059',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000059'
          }
        },
        {
          name: 'Loucy',
          ontology: {
            curie: 'EFO:0007112',
            url: 'https://purl.obolibrary.org/obo/EFO_0007112'
          }
        },
        {
          name: 'lung',
          ontology: {
            curie: 'UBERON:0002048',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002048'
          }
        },
        {
          name: 'mammary epithelial cell',
          ontology: {
            curie: 'CL:0002327',
            url: 'https://purl.obolibrary.org/obo/CL_0002327'
          }
        },
        {
          name: 'MCF-7',
          ontology: {
            curie: 'EFO:0001203',
            url: 'https://purl.obolibrary.org/obo/EFO_0001203'
          }
        },
        {
          name: 'mesenchymal stem cell',
          ontology: {
            curie: 'CL:0000134',
            url: 'https://purl.obolibrary.org/obo/CL_0000134'
          }
        },
        {
          name: 'mesendoderm',
          ontology: {
            curie: 'NTR:0000856',
            url: 'https://purl.obolibrary.org/obo/NTR_0000856'
          }
        },
        {
          name: 'mesodermal cell',
          ontology: {
            curie: 'CL:0000222',
            url: 'https://purl.obolibrary.org/obo/CL_0000222'
          }
        },
        {
          name: 'MM.1S',
          ontology: {
            curie: 'EFO:0005724',
            url: 'https://purl.obolibrary.org/obo/EFO_0005724'
          }
        },
        {
          name: 'mononuclear cell',
          ontology: {
            curie: 'CL:0000842',
            url: 'https://purl.obolibrary.org/obo/CL_0000842'
          }
        },
        {
          name: 'muscle of leg',
          ontology: {
            curie: 'UBERON:0001383',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001383'
          }
        },
        {
          name: 'muscle of trunk',
          ontology: {
            curie: 'UBERON:0001774',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001774'
          }
        },
        {
          name: 'myotube',
          ontology: {
            curie: 'CL:0002372',
            url: 'https://purl.obolibrary.org/obo/CL_0002372'
          }
        },
        {
          name: 'natural killer cell',
          ontology: {
            curie: 'CL:0000623',
            url: 'https://purl.obolibrary.org/obo/CL_0000623'
          }
        },
        {
          name: 'NCI-H929',
          ontology: {
            curie: 'EFO:0001221',
            url: 'https://purl.obolibrary.org/obo/EFO_0001221'
          }
        },
        {
          name: 'neural cell',
          ontology: {
            curie: 'CL:0002319',
            url: 'https://purl.obolibrary.org/obo/CL_0002319'
          }
        },
        {
          name: 'neural progenitor cell',
          ontology: {
            curie: 'CL:0011020',
            url: 'https://purl.obolibrary.org/obo/CL_0011020'
          }
        },
        {
          name: 'neuron',
          ontology: {
            curie: 'CL:0000540',
            url: 'https://purl.obolibrary.org/obo/CL_0000540'
          }
        },
        {
          name: 'neuronal stem cell',
          ontology: {
            curie: 'CL:0000047',
            url: 'https://purl.obolibrary.org/obo/CL_0000047'
          }
        },
        {
          name: 'neutrophil',
          ontology: {
            curie: 'CL:0000775',
            url: 'https://purl.obolibrary.org/obo/CL_0000775'
          }
        },
        {
          name: 'NT2/D1',
          ontology: {
            curie: 'EFO:0005236',
            url: 'https://purl.obolibrary.org/obo/EFO_0005236'
          }
        },
        {
          name: 'OCI-LY1',
          ontology: {
            curie: 'EFO:0005907',
            url: 'https://purl.obolibrary.org/obo/EFO_0005907'
          }
        },
        {
          name: 'OCI-LY3',
          ontology: {
            curie: 'EFO:0006710',
            url: 'https://purl.obolibrary.org/obo/EFO_0006710'
          }
        },
        {
          name: 'OCI-LY7',
          ontology: {
            curie: 'EFO:0006711',
            url: 'https://purl.obolibrary.org/obo/EFO_0006711'
          }
        },
        {
          name: 'osteoblast',
          ontology: {
            curie: 'CL:0000062',
            url: 'https://purl.obolibrary.org/obo/CL_0000062'
          }
        },
        {
          name: 'Panc1',
          ontology: {
            curie: 'EFO:0002713',
            url: 'https://purl.obolibrary.org/obo/EFO_0002713'
          }
        },
        {
          name: 'PC-3',
          ontology: {
            curie: 'EFO:0002074',
            url: 'https://purl.obolibrary.org/obo/EFO_0002074'
          }
        },
        {
          name: 'PC-9',
          ontology: {
            curie: 'EFO:0002847',
            url: 'https://purl.obolibrary.org/obo/EFO_0002847'
          }
        },
        {
          name: "Peyer's patch",
          ontology: {
            curie: 'UBERON:0001211',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001211'
          }
        },
        {
          name: 'placenta',
          ontology: {
            curie: 'UBERON:0001987',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001987'
          }
        },
        {
          name: 'prostate gland',
          ontology: {
            curie: 'UBERON:0002367',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002367'
          }
        },
        {
          name: 'psoas muscle',
          ontology: {
            curie: 'UBERON:0008450',
            url: 'https://purl.obolibrary.org/obo/UBERON_0008450'
          }
        },
        {
          name: 'right atrium auricular region',
          ontology: {
            curie: 'UBERON:0006631',
            url: 'https://purl.obolibrary.org/obo/UBERON_0006631'
          }
        },
        {
          name: 'right lobe of liver',
          ontology: {
            curie: 'UBERON:0001114',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001114'
          }
        },
        {
          name: 'sigmoid colon',
          ontology: {
            curie: 'UBERON:0001159',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001159'
          }
        },
        {
          name: 'skeletal muscle myoblast',
          ontology: {
            curie: 'CL:0000515',
            url: 'https://purl.obolibrary.org/obo/CL_0000515'
          }
        },
        {
          name: 'SK-N-MC',
          ontology: {
            curie: 'EFO:0002860',
            url: 'https://purl.obolibrary.org/obo/EFO_0002860'
          }
        },
        {
          name: 'SK-N-SH',
          ontology: {
            curie: 'EFO:0003072',
            url: 'https://purl.obolibrary.org/obo/EFO_0003072'
          }
        },
        {
          name: 'small intestine',
          ontology: {
            curie: 'UBERON:0002108',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002108'
          }
        },
        {
          name: 'smooth muscle cell',
          ontology: {
            curie: 'CL:0000192',
            url: 'https://purl.obolibrary.org/obo/CL_0000192'
          }
        },
        {
          name: 'spleen',
          ontology: {
            curie: 'UBERON:0002106',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002106'
          }
        },
        {
          name: 'stomach',
          ontology: {
            curie: 'UBERON:0000945',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000945'
          }
        },
        {
          name: 'SU-DHL-6',
          ontology: {
            curie: 'EFO:0002357',
            url: 'https://purl.obolibrary.org/obo/EFO_0002357'
          }
        },
        {
          name: 'T-cell',
          ontology: {
            curie: 'CL:0000084',
            url: 'https://purl.obolibrary.org/obo/CL_0000084'
          }
        },
        {
          name: 'testis',
          ontology: {
            curie: 'UBERON:0000473',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000473'
          }
        },
        {
          name: 'thoracic aorta',
          ontology: {
            curie: 'UBERON:0001515',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001515'
          }
        },
        {
          name: 'thymus',
          ontology: {
            curie: 'UBERON:0002370',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002370'
          }
        },
        {
          name: 'thyroid gland',
          ontology: {
            curie: 'UBERON:0002046',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002046'
          }
        },
        {
          name: 'tibial artery',
          ontology: {
            curie: 'UBERON:0007610',
            url: 'https://purl.obolibrary.org/obo/UBERON_0007610'
          }
        },
        {
          name: 'tibial nerve',
          ontology: {
            curie: 'UBERON:0001323',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001323'
          }
        },
        {
          name: 'transverse colon',
          ontology: {
            curie: 'UBERON:0001157',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001157'
          }
        },
        {
          name: 'trophoblast cell',
          ontology: {
            curie: 'CL:0000351',
            url: 'https://purl.obolibrary.org/obo/CL_0000351'
          }
        },
        {
          name: 'upper lobe of left lung',
          ontology: {
            curie: 'UBERON:0008952',
            url: 'https://purl.obolibrary.org/obo/UBERON_0008952'
          }
        },
        {
          name: 'uterus',
          ontology: {
            curie: 'UBERON:0000995',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000995'
          }
        },
        {
          name: 'vagina',
          ontology: {
            curie: 'UBERON:0000996',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000996'
          }
        }
      ],
      default_values: []
    },
    sex: {
      name: 'Sex',
      collapsible: true,
      filterable: true,
      zero_counts_visible: false,
      type: 'categorical',
      values: [
        'female',
        'female, male',
        'female, male, unknown',
        'female, unknown',
        'male',
        'male, unknown',
        'unknown'
      ],
      default_values: []
    },
    life_stage: {
      name: 'Life stage',
      collapsible: true,
      filterable: true,
      zero_counts_visible: false,
      type: 'categorical',
      values: [
        'adult',
        'adult, child',
        'adult, child, unknown',
        'adult, unknown',
        'child',
        'embryonic',
        'newborn',
        'unknown'
      ],
      default_values: ['adult', 'child']
    },
    age: {
      name: 'Age',
      collapsible: true,
      filterable: false,
      zero_counts_visible: false,
      type: 'categorical_with_description',
      values: [
        {
          name: '108 dpf',
          description: '108 days post fertilization'
        },
        {
          name: '113-121 dpf',
          description: '{113,115,120,121} days post fertilization'
        },
        {
          name: '11-45 y',
          description: '{11,45} years'
        },
        {
          name: '120-122 dpf',
          description: '{120,122} days post fertilization'
        },
        {
          name: '120 dpf',
          description: '120 days post fertilization'
        },
        {
          name: '12 w',
          description: '12 weeks'
        },
        {
          name: '13 y',
          description: '13 years'
        },
        {
          name: '14 y',
          description: '14 years'
        },
        {
          name: '15 y',
          description: '15 years'
        },
        {
          name: '16 w',
          description: '16 weeks'
        },
        {
          name: '21-37 y',
          description: '{21,34,37} years'
        },
        {
          name: '21-37 y',
          description: '{21,37} years'
        },
        {
          name: '22 y',
          description: '22 years'
        },
        {
          name: '27-36 y',
          description: '{27,33,36} years'
        },
        {
          name: '27-43 y',
          description: '{27,43} years'
        },
        {
          name: '31 y',
          description: '31 years'
        },
        {
          name: '3-34 y',
          description: '{3,34} years'
        },
        {
          name: '37 y',
          description: '37 years'
        },
        {
          name: '38 y',
          description: '38 years'
        },
        {
          name: '3 y',
          description: '3 years'
        },
        {
          name: '42 y',
          description: '42 years'
        },
        {
          name: '43 y',
          description: '43 years'
        },
        {
          name: '44 y',
          description: '44 years'
        },
        {
          name: '48 y',
          description: '48 years'
        },
        {
          name: '4 y',
          description: '4 years'
        },
        {
          name: '51 y',
          description: '51 years'
        },
        {
          name: '52 y',
          description: '52 years'
        },
        {
          name: '53 y',
          description: '53 years'
        },
        {
          name: '54 y',
          description: '54 years'
        },
        {
          name: '55 y',
          description: '55 years'
        },
        {
          name: '56 y',
          description: '56 years'
        },
        {
          name: '58 y',
          description: '58 years'
        },
        {
          name: '5 dpf',
          description: '5 days post fertilization'
        },
        {
          name: '60 y',
          description: '60 years'
        },
        {
          name: '62 y',
          description: '62 years'
        },
        {
          name: '67 y',
          description: '67 years'
        },
        {
          name: '69 y',
          description: '69 years'
        },
        {
          name: '70 y',
          description: '70 years'
        },
        {
          name: '72 y',
          description: '72 years'
        },
        {
          name: '82-120 dpf',
          description: '{82,85,96,101,120} days post fertilization'
        },
        {
          name: '85-113 dpf',
          description: '{85,91,108,113} days post fertilization'
        },
        {
          name: '91-105 dpf',
          description: '{91,96,101,105} days post fertilization'
        },
        {
          name: '96-127 dpf',
          description:
            '{96,97,101,104,105,110,113,115,127} days post fertilization'
        },
        {
          name: '96-97 dpf',
          description: '{96,97} days post fertilization'
        }
      ],
      default_values: []
    },
    organs: {
      name: 'Organ',
      collapsible: false,
      filterable: true,
      zero_counts_visible: false,
      type: 'categorical_with_ontology',
      values: [
        {
          name: 'adrenal gland',
          ontology: {
            curie: 'UBERON:0002369',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002369'
          }
        },
        {
          name: 'arterial blood vessel',
          ontology: {
            curie: 'UBERON:0003509',
            url: 'https://purl.obolibrary.org/obo/UBERON_0003509'
          }
        },
        {
          name: 'blood',
          ontology: {
            curie: 'UBERON:0000178',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000178'
          }
        },
        {
          name: 'blood vessel',
          ontology: {
            curie: 'UBERON:0001981',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001981'
          }
        },
        {
          name: 'bodily fluid',
          ontology: {
            curie: 'UBERON:0006314',
            url: 'https://purl.obolibrary.org/obo/UBERON_0006314'
          }
        },
        {
          name: 'bone element',
          ontology: {
            curie: 'UBERON:0001474',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001474'
          }
        },
        {
          name: 'bone marrow',
          ontology: {
            curie: 'UBERON:0002371',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002371'
          }
        },
        {
          name: 'brain',
          ontology: {
            curie: 'UBERON:0000955',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000955'
          }
        },
        {
          name: 'breast',
          ontology: {
            curie: 'UBERON:0000310',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000310'
          }
        },
        {
          name: 'bronchus',
          ontology: {
            curie: 'UBERON:0002185',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002185'
          }
        },
        {
          name: 'colon',
          ontology: {
            curie: 'UBERON:0001155',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001155'
          }
        },
        {
          name: 'connective tissue',
          ontology: {
            curie: 'UBERON:0002384',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002384'
          }
        },
        {
          name: 'embryo',
          ontology: {
            curie: 'UBERON:0000922',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000922'
          }
        },
        {
          name: 'endocrine gland',
          ontology: {
            curie: 'UBERON:0002368',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002368'
          }
        },
        {
          name: 'epithelium',
          ontology: {
            curie: 'UBERON:0000483',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000483'
          }
        },
        {
          name: 'esophagus',
          ontology: {
            curie: 'UBERON:0001043',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001043'
          }
        },
        {
          name: 'exocrine gland',
          ontology: {
            curie: 'UBERON:0002365',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002365'
          }
        },
        {
          name: 'entire extraembryonic component',
          ontology: {
            curie: 'UBERON:0016887',
            url: 'https://purl.obolibrary.org/obo/UBERON_0016887'
          }
        },
        {
          name: 'gonad',
          ontology: {
            curie: 'UBERON:0000991',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000991'
          }
        },
        {
          name: 'heart',
          ontology: {
            curie: 'UBERON:0000948',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000948'
          }
        },
        {
          name: 'immune organ',
          ontology: {
            curie: 'UBERON:0005057',
            url: 'https://purl.obolibrary.org/obo/UBERON_0005057'
          }
        },
        {
          name: 'intestine',
          ontology: {
            curie: 'UBERON:0000160',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000160'
          }
        },
        {
          name: 'kidney',
          ontology: {
            curie: 'UBERON:0002113',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002113'
          }
        },
        {
          name: 'large intestine',
          ontology: {
            curie: 'UBERON:0000059',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000059'
          }
        },
        {
          name: 'limb',
          ontology: {
            curie: 'UBERON:0002101',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002101'
          }
        },
        {
          name: 'liver',
          ontology: {
            curie: 'UBERON:0002107',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002107'
          }
        },
        {
          name: 'lung',
          ontology: {
            curie: 'UBERON:0002048',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002048'
          }
        },
        {
          name: 'lymph node',
          ontology: {
            curie: 'UBERON:0000029',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000029'
          }
        },
        {
          name: 'lymphoid tissue',
          ontology: {
            curie: 'UBERON:0001744',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001744'
          }
        },
        {
          name: 'mammary gland',
          ontology: {
            curie: 'UBERON:0001911',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001911'
          }
        },
        {
          name: 'mouth',
          ontology: {
            curie: 'UBERON:0000165',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000165'
          }
        },
        {
          name: 'musculature of body',
          ontology: {
            curie: 'UBERON:0000383',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000383'
          }
        },
        {
          name: 'nerve',
          ontology: {
            curie: 'UBERON:0001021',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001021'
          }
        },
        {
          name: 'pancreas',
          ontology: {
            curie: 'UBERON:0001264',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001264'
          }
        },
        {
          name: 'penis',
          ontology: {
            curie: 'UBERON:0000989',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000989'
          }
        },
        {
          name: 'placenta',
          ontology: {
            curie: 'UBERON:0001987',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001987'
          }
        },
        {
          name: 'prostate gland',
          ontology: {
            curie: 'UBERON:0002367',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002367'
          }
        },
        {
          name: 'skin of body',
          ontology: {
            curie: 'UBERON:0002097',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002097'
          }
        },
        {
          name: 'skin of prepuce of penis',
          ontology: {
            curie: 'UBERON:0001471',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001471'
          }
        },
        {
          name: 'small intestine',
          ontology: {
            curie: 'UBERON:0002108',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002108'
          }
        },
        {
          name: 'spinal cord',
          ontology: {
            curie: 'UBERON:0002240',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002240'
          }
        },
        {
          name: 'spleen',
          ontology: {
            curie: 'UBERON:0002106',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002106'
          }
        },
        {
          name: 'stomach',
          ontology: {
            curie: 'UBERON:0000945',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000945'
          }
        },
        {
          name: 'testis',
          ontology: {
            curie: 'UBERON:0000473',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000473'
          }
        },
        {
          name: 'thymus',
          ontology: {
            curie: 'UBERON:0002370',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002370'
          }
        },
        {
          name: 'thyroid gland',
          ontology: {
            curie: 'UBERON:0002046',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002046'
          }
        },
        {
          name: 'uterus',
          ontology: {
            curie: 'UBERON:0000995',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000995'
          }
        },
        {
          name: 'vagina',
          ontology: {
            curie: 'UBERON:0000996',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000996'
          }
        },
        {
          name: 'vasculature',
          ontology: {
            curie: 'UBERON:0002049',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002049'
          }
        },
        {
          name: 'vein',
          ontology: {
            curie: 'UBERON:0001638',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001638'
          }
        }
      ],
      default_values: []
    },
    systems: {
      name: 'System',
      collapsible: false,
      filterable: true,
      zero_counts_visible: true,
      type: 'categorical_with_ontology',
      values: [
        {
          name: 'central nervous system',
          ontology: {
            curie: 'UBERON:0001017',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001017'
          }
        },
        {
          name: 'circulatory system',
          ontology: {
            curie: 'UBERON:0001009',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001009'
          }
        },
        {
          name: 'digestive system',
          ontology: {
            curie: 'UBERON:0001007',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001007'
          }
        },
        {
          name: 'endocrine system',
          ontology: {
            curie: 'UBERON:0000949',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000949'
          }
        },
        {
          name: 'excretory system',
          ontology: {
            curie: 'UBERON:8450002',
            url: 'https://purl.obolibrary.org/obo/UBERON_8450002'
          }
        },
        {
          name: 'exocrine system',
          ontology: {
            curie: 'UBERON:0002330',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002330'
          }
        },
        {
          name: 'immune system',
          ontology: {
            curie: 'UBERON:0002405',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002405'
          }
        },
        {
          name: 'integumental system',
          ontology: {
            curie: 'UBERON:0002416',
            url: 'https://purl.obolibrary.org/obo/UBERON_0002416'
          }
        },
        {
          name: 'musculature',
          ontology: {
            curie: 'UBERON:0001015',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001015'
          }
        },
        {
          name: 'peripheral nervous system',
          ontology: {
            curie: 'UBERON:0000010',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000010'
          }
        },
        {
          name: 'reproductive system',
          ontology: {
            curie: 'UBERON:0000990',
            url: 'https://purl.obolibrary.org/obo/UBERON_0000990'
          }
        },
        {
          name: 'respiratory system',
          ontology: {
            curie: 'UBERON:0001004',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001004'
          }
        },
        {
          name: 'skeletal system',
          ontology: {
            curie: 'UBERON:0001434',
            url: 'https://purl.obolibrary.org/obo/UBERON_0001434'
          }
        }
      ],
      default_values: []
    }
  }
} as EpigenomeMetadataDimensionsResponse;

export default epigenomesMetadata;
