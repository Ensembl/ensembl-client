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

import type { MetadataDimensions } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

const epigenomesMetadata = {
  age: {
    name: 'Age',
    values: [
      {
        unit: 'year',
        max_value: '72',
        min_value: '3'
      },
      {
        unit: 'unknown',
        max_value: 'unknown',
        min_value: 'unknown'
      },
      {
        unit: 'day',
        max_value: '147',
        min_value: '5'
      },
      {
        unit: 'week',
        max_value: '16',
        min_value: '12'
      }
    ]
  },
  sex: {
    name: 'Sex',
    values: ['female', 'male', 'unknown']
  },
  term: {
    name: 'Biosample term',
    values: [
      {
        name: 'small intestine',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002108'
      },
      {
        name: 'fibroblast of dermis',
        ontology: 'http://purl.obolibrary.org/obo/CL_0002551'
      },
      {
        name: 'AG04450',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0006270'
      },
      {
        name: 'GM06990',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002783'
      },
      {
        name: 'placenta',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001987'
      },
      {
        name: 'OCI-LY3',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0006710'
      },
      {
        name: 'esophagus squamous epithelium',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0006920'
      },
      {
        name: 'B cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000236'
      },
      {
        name: 'ACC112',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007070'
      },
      {
        name: 'tibial artery',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0007610'
      },
      {
        name: 'H9',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0003045'
      },
      {
        name: 'T-cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000084'
      },
      {
        name: 'H7',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0005904'
      },
      {
        name: 'lung',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002048'
      },
      {
        name: 'K562',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002067'
      },
      {
        name: 'HUES48',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007083'
      },
      {
        name: 'HUES6',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007086'
      },
      {
        name: 'SK-N-SH',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0003072'
      },
      {
        name: 'muscle of leg',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001383'
      },
      {
        name: 'skeletal muscle myoblast',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000515'
      },
      {
        name: 'DND-41',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007074'
      },
      {
        name: 'GM23338',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007950'
      },
      {
        name: 'bronchial epithelial cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0002328'
      },
      {
        name: 'spleen',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002106'
      },
      {
        name: 'endothelial cell of umbilical vein',
        ontology: 'http://purl.obolibrary.org/obo/CL_0002618'
      },
      {
        name: 'HUES64',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007089'
      },
      {
        name: 'fibroblast of lung',
        ontology: 'http://purl.obolibrary.org/obo/CL_0002553'
      },
      {
        name: 'breast epithelium',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0008367'
      },
      {
        name: 'NT2/D1',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0005236'
      },
      {
        name: 'iPS DF 6.9',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007098'
      },
      {
        name: 'OCI-LY1',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0005907'
      },
      {
        name: 'PC-9',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002847'
      },
      {
        name: 'neutrophil',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000775'
      },
      {
        name: 'mammary epithelial cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0002327'
      },
      {
        name: 'uterus',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000995'
      },
      {
        name: 'H1',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0003042'
      },
      {
        name: 'tibial nerve',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001323'
      },
      {
        name: 'mesendoderm',
        ontology: 'http://purl.obolibrary.org/obo/NTR_0000856'
      },
      {
        name: 'HEK293',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0001182'
      },
      {
        name: 'BJ',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002779'
      },
      {
        name: 'thoracic aorta',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001515'
      },
      {
        name: 'GM12878',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002784'
      },
      {
        name: 'A673',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002106'
      },
      {
        name: 'neural progenitor cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0011020'
      },
      {
        name: 'iPS-20b',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007108'
      },
      {
        name: 'trophoblast cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000351'
      },
      {
        name: 'stomach',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000945'
      },
      {
        name: 'cardiac muscle cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000746'
      },
      {
        name: 'iPS DF 19.11',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007096'
      },
      {
        name: 'GM23248',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0005723'
      },
      {
        name: 'adrenal gland',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002369'
      },
      {
        name: 'Caco-2',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0001099'
      },
      {
        name: 'vagina',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000996'
      },
      {
        name: 'OCI-LY7',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0006711'
      },
      {
        name: 'prostate gland',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002367'
      },
      {
        name: "Peyer's patch",
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001211'
      },
      {
        name: 'SK-N-MC',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002860'
      },
      {
        name: 'PC-3',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002074'
      },
      {
        name: 'psoas muscle',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0008450'
      },
      {
        name: 'MCF-7',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0001203'
      },
      {
        name: 'Karpas-422',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0005719'
      },
      {
        name: 'SU-DHL-6',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002357'
      },
      {
        name: 'testis',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000473'
      },
      {
        name: 'Panc1',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002713'
      },
      {
        name: 'hepatocyte',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000182'
      },
      {
        name: 'gastroesophageal sphincter',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0004550'
      },
      {
        name: 'neuronal stem cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000047'
      },
      {
        name: 'ascending aorta',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001496'
      },
      {
        name: 'DOHH2',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002167'
      },
      {
        name: 'mesenchymal stem cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000134'
      },
      {
        name: 'body of pancreas',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001150'
      },
      {
        name: 'ES-I3',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007076'
      },
      {
        name: 'keratinocyte',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000312'
      },
      {
        name: 'thymus',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002370'
      },
      {
        name: 'iPS-18a',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007105'
      },
      {
        name: 'brain',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000955'
      },
      {
        name: 'sigmoid colon',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001159'
      },
      {
        name: 'thyroid gland',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002046'
      },
      {
        name: 'NCI-H929',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0001221'
      },
      {
        name: 'KOPT-K1',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0006283'
      },
      {
        name: 'heart left ventricle',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002084'
      },
      {
        name: 'myotube',
        ontology: 'http://purl.obolibrary.org/obo/CL_0002372'
      },
      {
        name: 'esophagus muscularis mucosa',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0004648'
      },
      {
        name: 'gastrocnemius medialis',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0011907'
      },
      {
        name: 'fibroblast of mammary gland',
        ontology: 'http://purl.obolibrary.org/obo/CL_0002555'
      },
      {
        name: 'KMS-11',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0005694'
      },
      {
        name: 'kidney',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002113'
      },
      {
        name: 'A549',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0001086'
      },
      {
        name: 'osteoblast',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000062'
      },
      {
        name: 'heart',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000948'
      },
      {
        name: 'HCT116',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002824'
      },
      {
        name: 'upper lobe of left lung',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0008952'
      },
      {
        name: 'HepG2',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0001187'
      },
      {
        name: 'foreskin fibroblast',
        ontology: 'http://purl.obolibrary.org/obo/CL_1001608'
      },
      {
        name: 'right lobe of liver',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001114'
      },
      {
        name: 'right atrium auricular region',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0006631'
      },
      {
        name: 'mononuclear cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000842'
      },
      {
        name: 'kidney epithelial cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0002518'
      },
      {
        name: 'HeLa-S3',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0002791'
      },
      {
        name: 'natural killer cell',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000623'
      },
      {
        name: 'IMR-90',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0001196'
      },
      {
        name: 'muscle of trunk',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001774'
      },
      {
        name: 'MM.1S',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0005724'
      },
      {
        name: 'transverse colon',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001157'
      },
      {
        name: 'CD14-positive monocyte',
        ontology: 'http://purl.obolibrary.org/obo/CL_0001054'
      },
      {
        name: 'astrocyte',
        ontology: 'http://purl.obolibrary.org/obo/CL_0000127'
      },
      {
        name: 'large intestine',
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000059'
      },
      {
        name: 'Loucy',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007112'
      },
      {
        name: 'common myeloid progenitor, CD34-positive',
        ontology: 'http://purl.obolibrary.org/obo/CL_0001059'
      },
      {
        name: 'iPS-18c',
        ontology: 'http://purl.obolibrary.org/obo/EFO_0007107'
      }
    ]
  },
  material: {
    name: 'Biosample material',
    values: [
      'Primary Tissue',
      'Cell Line',
      'Primary Cell',
      'Primary Cell Culture'
    ]
  },
  life_stage: {
    name: 'Life stage',
    values: ['embryonic', 'adult', 'child', 'newborn', 'unknown']
  },
  organ_slims: {
    name: 'Organ',
    values: [
      {
        name: 'adrenal gland',
        terms: ['adrenal gland'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002369'
      },
      {
        name: 'arterial blood vessel',
        terms: ['ascending aorta', 'thoracic aorta', 'tibial artery'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0003509'
      },
      {
        name: 'blood',
        terms: [
          'B cell',
          'CD14-positive monocyte',
          'DND-41',
          'GM06990',
          'GM12878',
          'K562',
          'Karpas-422',
          'KOPT-K1',
          'Loucy',
          'MM.1S',
          'mononuclear cell',
          'natural killer cell',
          'neutrophil',
          'OCI-LY7',
          'T-cell'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000178'
      },
      {
        name: 'blood vessel',
        terms: [
          'ascending aorta',
          'endothelial cell of umbilical vein',
          'thoracic aorta',
          'tibial artery'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001981'
      },
      {
        name: 'bodily fluid',
        terms: [
          'B cell',
          'CD14-positive monocyte',
          'DND-41',
          'GM06990',
          'GM12878',
          'K562',
          'Karpas-422',
          'KOPT-K1',
          'Loucy',
          'MM.1S',
          'mononuclear cell',
          'natural killer cell',
          'neutrophil',
          'OCI-LY7',
          'T-cell'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0006314'
      },
      {
        name: 'bone element',
        terms: [
          'common myeloid progenitor, CD34-positive',
          'KMS-11',
          'NCI-H929',
          'OCI-LY1',
          'OCI-LY3'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001474'
      },
      {
        name: 'bone marrow',
        terms: [
          'common myeloid progenitor, CD34-positive',
          'NCI-H929',
          'OCI-LY1',
          'OCI-LY3'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002371'
      },
      {
        name: 'brain',
        terms: ['astrocyte', 'brain', 'SK-N-MC', 'SK-N-SH'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000955'
      },
      {
        name: 'breast',
        terms: ['breast epithelium'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000310'
      },
      {
        name: 'bronchus',
        terms: ['bronchial epithelial cell'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002185'
      },
      {
        name: 'colon',
        terms: ['Caco-2', 'HCT116', 'sigmoid colon', 'transverse colon'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001155'
      },
      {
        name: 'connective tissue',
        terms: [
          'AG04450',
          'BJ',
          'fibroblast of dermis',
          'fibroblast of lung',
          'fibroblast of mammary gland',
          'foreskin fibroblast',
          'GM23248',
          'IMR-90',
          'mesenchymal stem cell',
          'osteoblast'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002384'
      },
      {
        name: 'embryo',
        terms: [
          'ES-I3',
          'H1',
          'H7',
          'H9',
          'HUES48',
          'HUES6',
          'HUES64',
          'mesendoderm',
          'neuronal stem cell',
          'trophoblast cell'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000922'
      },
      {
        name: 'endocrine gland',
        terms: [
          'adrenal gland',
          'hepatocyte',
          'HepG2',
          'right lobe of liver',
          'thymus',
          'thyroid gland'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002368'
      },
      {
        name: 'epithelium',
        terms: [
          'ACC112',
          'breast epithelium',
          'bronchial epithelial cell',
          'endothelial cell of umbilical vein',
          'esophagus squamous epithelium',
          'HCT116',
          'HEK293',
          'HeLa-S3',
          'hepatocyte',
          'HepG2',
          'keratinocyte',
          'kidney epithelial cell',
          'mammary epithelial cell',
          'MCF-7',
          'NT2/D1',
          'Panc1',
          'SK-N-MC'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000483'
      },
      {
        name: 'esophagus',
        terms: ['esophagus muscularis mucosa', 'esophagus squamous epithelium'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001043'
      },
      {
        name: 'exocrine gland',
        terms: [
          'ACC112',
          'fibroblast of mammary gland',
          'hepatocyte',
          'HepG2',
          'mammary epithelial cell',
          'MCF-7',
          'right lobe of liver'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002365'
      },
      {
        name: 'extraembryonic component',
        terms: [
          'endothelial cell of umbilical vein',
          'placenta',
          'trophoblast cell'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0016887'
      },
      {
        name: 'gonad',
        terms: ['NT2/D1', 'testis'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000991'
      },
      {
        name: 'heart',
        terms: [
          'cardiac muscle cell',
          'heart',
          'heart left ventricle',
          'right atrium auricular region'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000948'
      },
      {
        name: 'immune organ',
        terms: ['OCI-LY3', 'spleen', 'thymus'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0005057'
      },
      {
        name: 'intestine',
        terms: [
          'Caco-2',
          'HCT116',
          'large intestine',
          "Peyer's patch",
          'sigmoid colon',
          'small intestine',
          'transverse colon'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000160'
      },
      {
        name: 'kidney',
        terms: ['HEK293', 'kidney', 'kidney epithelial cell'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002113'
      },
      {
        name: 'large intestine',
        terms: [
          'Caco-2',
          'HCT116',
          'large intestine',
          'sigmoid colon',
          'transverse colon'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000059'
      },
      {
        name: 'limb',
        terms: [
          'gastrocnemius medialis',
          'GM23248',
          'muscle of leg',
          'tibial artery',
          'tibial nerve'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002101'
      },
      {
        name: 'liver',
        terms: ['hepatocyte', 'HepG2', 'right lobe of liver'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002107'
      },
      {
        name: 'lung',
        terms: [
          'A549',
          'AG04450',
          'bronchial epithelial cell',
          'fibroblast of lung',
          'IMR-90',
          'lung',
          'PC-9',
          'upper lobe of left lung'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002048'
      },
      {
        name: 'lymph node',
        terms: ['Karpas-422', 'KOPT-K1', 'OCI-LY3'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000029'
      },
      {
        name: 'lymphoid tissue',
        terms: ["Peyer's patch"],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001744'
      },
      {
        name: 'mammary gland',
        terms: [
          'fibroblast of mammary gland',
          'mammary epithelial cell',
          'MCF-7'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001911'
      },
      {
        name: 'mouth',
        terms: ['ACC112'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000165'
      },
      {
        name: 'musculature of body',
        terms: [
          'A673',
          'cardiac muscle cell',
          'esophagus muscularis mucosa',
          'gastrocnemius medialis',
          'gastroesophageal sphincter',
          'muscle of leg',
          'muscle of trunk',
          'myotube',
          'psoas muscle',
          'skeletal muscle myoblast'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000383'
      },
      {
        name: 'nerve',
        terms: ['tibial nerve'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001021'
      },
      {
        name: 'pancreas',
        terms: ['body of pancreas', 'Panc1'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001264'
      },
      {
        name: 'penis',
        terms: ['BJ', 'foreskin fibroblast', 'iPS DF 19.11', 'iPS DF 6.9'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000989'
      },
      {
        name: 'placenta',
        terms: ['endothelial cell of umbilical vein', 'placenta'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001987'
      },
      {
        name: 'prostate gland',
        terms: ['PC-3', 'prostate gland'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002367'
      },
      {
        name: 'skin of body',
        terms: [
          'BJ',
          'fibroblast of dermis',
          'foreskin fibroblast',
          'GM23248',
          'GM23338',
          'iPS-18a',
          'iPS-18c',
          'iPS-20b',
          'iPS DF 19.11',
          'iPS DF 6.9',
          'keratinocyte'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002097'
      },
      {
        name: 'skin of prepuce of penis',
        terms: ['iPS DF 19.11', 'iPS DF 6.9'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001471'
      },
      {
        name: 'small intestine',
        terms: ['small intestine'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002108'
      },
      {
        name: 'spinal cord',
        terms: ['astrocyte'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002240'
      },
      {
        name: 'spleen',
        terms: ['spleen'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002106'
      },
      {
        name: 'stomach',
        terms: ['gastroesophageal sphincter', 'stomach'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000945'
      },
      {
        name: 'testis',
        terms: ['NT2/D1', 'testis'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000473'
      },
      {
        name: 'thymus',
        terms: ['thymus'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002370'
      },
      {
        name: 'thyroid gland',
        terms: ['thyroid gland'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002046'
      },
      {
        name: 'uterus',
        terms: ['HeLa-S3', 'uterus'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000995'
      },
      {
        name: 'vagina',
        terms: ['vagina'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000996'
      },
      {
        name: 'vasculature',
        terms: [
          'ascending aorta',
          'endothelial cell of umbilical vein',
          'thoracic aorta',
          'tibial artery'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002049'
      },
      {
        name: 'vein',
        terms: ['endothelial cell of umbilical vein'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001638'
      }
    ]
  },
  system_slims: {
    name: 'System',
    values: [
      {
        name: 'central nervous system',
        terms: [
          'astrocyte',
          'brain',
          'neural progenitor cell',
          'neuronal stem cell',
          'SK-N-MC',
          'SK-N-SH'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001017'
      },
      {
        name: 'circulatory system',
        terms: [
          'ascending aorta',
          'cardiac muscle cell',
          'endothelial cell of umbilical vein',
          'heart',
          'heart left ventricle',
          'right atrium auricular region',
          'thoracic aorta',
          'tibial artery'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001009'
      },
      {
        name: 'digestive system',
        terms: [
          'ACC112',
          'Caco-2',
          'esophagus muscularis mucosa',
          'esophagus squamous epithelium',
          'gastroesophageal sphincter',
          'HCT116',
          'hepatocyte',
          'HepG2',
          'large intestine',
          "Peyer's patch",
          'right lobe of liver',
          'sigmoid colon',
          'small intestine',
          'spleen',
          'stomach',
          'transverse colon'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001007'
      },
      {
        name: 'endocrine system',
        terms: [
          'adrenal gland',
          'hepatocyte',
          'HepG2',
          'Panc1',
          'right lobe of liver',
          'thymus',
          'thyroid gland'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000949'
      },
      {
        name: 'excretory system',
        terms: ['HEK293', 'kidney', 'kidney epithelial cell'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_8450002'
      },
      {
        name: 'exocrine system',
        terms: [
          'ACC112',
          'fibroblast of mammary gland',
          'hepatocyte',
          'HepG2',
          'mammary epithelial cell',
          'MCF-7',
          'right lobe of liver'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002330'
      },
      {
        name: 'immune system',
        terms: [
          'B cell',
          'CD14-positive monocyte',
          'common myeloid progenitor, CD34-positive',
          'DND-41',
          'DOHH2',
          'GM06990',
          'GM12878',
          'K562',
          'Karpas-422',
          'KOPT-K1',
          'Loucy',
          'MM.1S',
          'mononuclear cell',
          'natural killer cell',
          'NCI-H929',
          'neutrophil',
          'OCI-LY1',
          'OCI-LY3',
          'OCI-LY7',
          "Peyer's patch",
          'spleen',
          'SU-DHL-6',
          'T-cell',
          'thymus'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002405'
      },
      {
        name: 'integumental system',
        terms: [
          'fibroblast of dermis',
          'fibroblast of mammary gland',
          'foreskin fibroblast',
          'GM23248',
          'GM23338',
          'iPS-18a',
          'iPS-18c',
          'iPS-20b',
          'iPS DF 19.11',
          'iPS DF 6.9',
          'keratinocyte',
          'mammary epithelial cell',
          'MCF-7'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0002416'
      },
      {
        name: 'musculature',
        terms: [
          'A673',
          'cardiac muscle cell',
          'esophagus muscularis mucosa',
          'gastrocnemius medialis',
          'gastroesophageal sphincter',
          'muscle of leg',
          'muscle of trunk',
          'myotube',
          'psoas muscle',
          'skeletal muscle myoblast'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001015'
      },
      {
        name: 'peripheral nervous system',
        terms: ['tibial nerve'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000010'
      },
      {
        name: 'reproductive system',
        terms: [
          'BJ',
          'endothelial cell of umbilical vein',
          'foreskin fibroblast',
          'HeLa-S3',
          'iPS DF 19.11',
          'iPS DF 6.9',
          'NT2/D1',
          'PC-3',
          'placenta',
          'prostate gland',
          'testis',
          'uterus',
          'vagina'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0000990'
      },
      {
        name: 'respiratory system',
        terms: [
          'A549',
          'AG04450',
          'bronchial epithelial cell',
          'fibroblast of lung',
          'IMR-90',
          'lung',
          'PC-9',
          'upper lobe of left lung'
        ],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001004'
      },
      {
        name: 'skeletal system',
        terms: ['KMS-11', 'NCI-H929', 'OCI-LY1', 'OCI-LY3', 'osteoblast'],
        ontology: 'http://purl.obolibrary.org/obo/UBERON_0001434'
      }
    ]
  },
  assay_type: {
    name: 'Assay type',
    values: ['ATAC-seq', 'DNase-seq', 'ChIP-seq']
  },
  assay_target: {
    name: 'Assay target',
    values: [
      'H3K27me3',
      'H3K4me3',
      'H3K27ac',
      'open chromatin',
      'H3K4me1',
      'CTCF'
    ]
  },
  assay_target_type: {
    name: 'Assay target type',
    values: ['transcription factor', 'histone', 'open chromatin']
  }
} as MetadataDimensions;

export default epigenomesMetadata;
