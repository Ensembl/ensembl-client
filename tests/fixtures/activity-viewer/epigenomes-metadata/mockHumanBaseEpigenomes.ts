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

import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';

const epigenomes = [
  {
    id: '87b1816b-a042-47ed-bf13-db6d845ad200',
    material: 'primary tissue',
    term: 'adrenal gland',
    sex: 'male',
    life_stage: 'adult',
    age: '54 y',
    organs: ['adrenal gland', 'endocrine gland'],
    systems: ['endocrine system']
  },
  {
    id: '8a23cb9a-a4ca-4567-9463-121fd7d1975b',
    material: 'primary cell culture',
    term: 'ectodermal cell',
    sex: 'male',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: []
  },
  {
    id: '7e506565-0865-4ee9-ae72-b32baf661049',
    material: 'primary cell culture',
    term: 'myotube',
    sex: 'male, unknown',
    life_stage: 'adult, unknown',
    organs: ['musculature of body'],
    systems: ['musculature']
  },
  {
    id: 'c633596b-455f-4dd2-819a-a7fcd0d6f36e',
    material: 'primary tissue',
    term: 'gastrocnemius medialis',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['musculature of body', 'limb'],
    systems: ['musculature']
  },
  {
    id: 'd621a2f4-9964-4fb3-ae4d-a7fcfa40c15a',
    material: 'primary tissue',
    term: 'breast epithelium',
    sex: 'female',
    life_stage: 'adult',
    age: '51 y',
    organs: ['epithelium', 'breast'],
    systems: []
  },
  {
    id: '765f269a-fd78-404e-b3a3-4f0e84ee7323',
    material: 'primary tissue',
    term: 'tibial artery',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['vasculature', 'limb', 'blood vessel', 'arterial blood vessel'],
    systems: ['circulatory system']
  },
  {
    id: '73490b60-18a7-4586-9001-5c2b86ca2975',
    material: 'primary tissue',
    term: 'esophagus squamous epithelium',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['epithelium', 'esophagus'],
    systems: ['digestive system']
  },
  {
    id: '4f95562b-b683-4605-b065-096d59245530',
    material: 'primary cell',
    term: 'fibroblast of dermis',
    sex: 'female, unknown',
    life_stage: 'adult, unknown',
    organs: ['skin of body', 'connective tissue'],
    systems: ['integumental system']
  },
  {
    id: 'a6f3ab8b-04a5-4923-b7dd-fbf779a919ba',
    material: 'primary tissue',
    term: 'thyroid gland',
    sex: 'female',
    life_stage: 'adult',
    age: '51 y',
    organs: ['thyroid gland', 'endocrine gland'],
    systems: ['endocrine system']
  },
  {
    id: '0e2b0e70-5b95-4253-9602-8f17b13ae6e1',
    material: 'cell line',
    term: 'OCI-LY7',
    sex: 'male',
    life_stage: 'adult',
    age: '48 y',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: 'c25147dd-1ee6-4d43-965e-c5bae48b5aea',
    material: 'primary cell',
    term: 'neutrophil',
    sex: 'unknown',
    life_stage: 'unknown',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '2fbe1b30-d786-4079-93d4-ea33ca12fed3',
    material: 'primary cell',
    term: 'CD14-positive monocyte',
    sex: 'female',
    life_stage: 'unknown',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '765b76a3-a2ea-4024-bd64-50123b52de39',
    material: 'primary tissue',
    term: 'uterus',
    sex: 'female',
    life_stage: 'adult',
    age: '51 y',
    organs: ['uterus'],
    systems: ['reproductive system']
  },
  {
    id: '8736fa2d-5747-43eb-a182-f3606f522722',
    material: 'primary tissue',
    term: 'placenta',
    sex: 'female, male',
    life_stage: 'embryonic',
    age: '85-113 dpf',
    organs: ['extraembryonic component', 'placenta'],
    systems: ['reproductive system']
  },
  {
    id: '2c5af571-fd08-4599-b7b9-b814fbc6c9af',
    material: 'cell line',
    term: 'MCF-7',
    sex: 'female',
    life_stage: 'adult',
    age: '69 y',
    organs: ['exocrine gland', 'epithelium', 'mammary gland'],
    systems: ['exocrine system', 'integumental system']
  },
  {
    id: '19e12a58-8e53-45f7-a5fe-6c9c0804f6b0',
    material: 'primary tissue',
    term: 'testis',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['testis', 'gonad'],
    systems: ['reproductive system']
  },
  {
    id: '0faa3844-a9f5-4b0b-bb0f-79be7f0436db',
    material: 'primary tissue',
    term: 'transverse colon',
    sex: 'female',
    life_stage: 'adult',
    age: '51 y',
    organs: ['large intestine', 'intestine', 'colon'],
    systems: ['digestive system']
  },
  {
    id: '33da29f8-e417-42f5-acc1-9a381be60e08',
    material: 'primary tissue',
    term: 'ascending aorta',
    sex: 'female',
    life_stage: 'adult',
    age: '51 y',
    organs: ['vasculature', 'blood vessel', 'arterial blood vessel'],
    systems: ['circulatory system']
  },
  {
    id: '3fbfdc66-69f3-4399-83f5-41a69a9aec8b',
    material: 'primary cell',
    term: 'mammary epithelial cell',
    sex: 'female',
    life_stage: 'adult, unknown',
    organs: ['exocrine gland', 'epithelium', 'mammary gland'],
    systems: ['exocrine system', 'integumental system']
  },
  {
    id: 'bd6885e2-48e7-4ed9-aa26-3dd05e9dcee2',
    material: 'primary tissue',
    term: 'stomach',
    sex: 'female',
    life_stage: 'adult',
    age: '51 y',
    organs: ['stomach'],
    systems: ['digestive system']
  },
  {
    id: '6e5c499f-1f8f-4425-8eb7-b8299c3ea5ad',
    material: 'primary tissue',
    term: 'thyroid gland',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['thyroid gland', 'endocrine gland'],
    systems: ['endocrine system']
  },
  {
    id: 'a453ac05-2647-4182-9d28-1a48331cd1c5',
    material: 'cell line',
    term: 'A549',
    sex: 'male',
    life_stage: 'adult',
    age: '58 y',
    organs: ['lung'],
    systems: ['respiratory system']
  },
  {
    id: '987b577f-9747-44d2-a2b6-37caf3ddea0c',
    material: 'cell line',
    term: 'KOPT-K1',
    sex: 'unknown',
    life_stage: 'unknown',
    organs: ['blood', 'lymph node', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: 'c845fad2-3fd2-4050-a928-696e4e56711d',
    material: 'primary cell',
    term: 'astrocyte',
    sex: 'unknown',
    life_stage: 'unknown',
    organs: ['spinal cord', 'brain'],
    systems: ['central nervous system']
  },
  {
    id: '2a3833d2-79d5-44da-8470-153fbec2b598',
    material: 'primary tissue',
    term: 'body of pancreas',
    sex: 'male',
    life_stage: 'adult',
    age: '54 y',
    organs: ['pancreas'],
    systems: []
  },
  {
    id: 'b3e350b0-6bad-40ed-8a37-4b1f29b4d297',
    material: 'primary tissue',
    term: 'psoas muscle',
    sex: 'male',
    life_stage: 'adult, child',
    age: '3-34 y',
    organs: ['musculature of body'],
    systems: ['musculature']
  },
  {
    id: '11bca137-d2c2-4536-8c0e-5332cb6eece3',
    material: 'cell line',
    term: 'IMR-90',
    sex: 'female',
    life_stage: 'embryonic',
    age: '16 w',
    organs: ['lung', 'connective tissue'],
    systems: ['respiratory system']
  },
  {
    id: 'ac38e953-dc38-4046-aded-2e068d144c6c',
    material: 'cell line',
    term: 'HEK293',
    sex: 'female',
    life_stage: 'embryonic',
    organs: ['kidney', 'epithelium'],
    systems: ['excretory system']
  },
  {
    id: '87cdd343-cea1-4abc-9689-9f8bbcd344c2',
    material: 'cell line',
    term: 'GM06990',
    sex: 'female',
    life_stage: 'unknown',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '55f6985b-798e-4baa-ba35-87a8f3b5b72e',
    material: 'primary cell culture',
    term: 'neural progenitor cell',
    sex: 'female',
    life_stage: 'embryonic',
    age: '5 dpf',
    organs: [],
    systems: ['central nervous system']
  },
  {
    id: '40d2a365-ab29-4eb7-a99b-aa5125f0a576',
    material: 'primary tissue',
    term: 'heart',
    sex: 'male, unknown',
    life_stage: 'embryonic',
    age: '91-105 dpf',
    organs: ['heart'],
    systems: ['circulatory system']
  },
  {
    id: '5b2ccc06-f9f9-4f6f-b78b-6542a69e37ba',
    material: 'primary cell culture',
    term: 'mesenchymal stem cell',
    sex: 'male',
    life_stage: 'embryonic',
    organs: ['connective tissue'],
    systems: []
  },
  {
    id: 'd71ea762-7b0c-4cf8-bff8-e8e751072cf6',
    material: 'cell line',
    term: 'ES-I3',
    sex: 'female',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: []
  },
  {
    id: '89a7ca86-6ffa-4ee3-9818-2cf591a5c8f4',
    material: 'primary tissue',
    term: 'spleen',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['spleen', 'immune organ'],
    systems: ['immune system', 'digestive system']
  },
  {
    id: 'b32713e8-a581-49ed-b255-b958ce243552',
    material: 'primary tissue',
    term: 'muscle of leg',
    sex: 'female, male',
    life_stage: 'embryonic',
    age: '96-127 dpf',
    organs: ['musculature of body', 'limb'],
    systems: ['musculature']
  },
  {
    id: '11910d38-a3a4-4017-9965-836e4000ba49',
    material: 'primary cell',
    term: 'CD14-positive monocyte',
    sex: 'female, male',
    life_stage: 'adult',
    age: '21-37 y',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: 'a5fa742a-5417-424d-aa24-8c9719604af2',
    material: 'primary cell culture',
    term: 'cardiac muscle cell',
    sex: 'unknown',
    life_stage: 'embryonic',
    organs: ['musculature of body', 'heart'],
    systems: ['circulatory system', 'musculature']
  },
  {
    id: 'f4f4c7e2-bb73-4f00-ba7b-99d5439334a2',
    material: 'primary tissue',
    term: 'sigmoid colon',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['large intestine', 'intestine', 'colon'],
    systems: ['digestive system']
  },
  {
    id: '231042a5-3824-4b28-ae75-8ddfddff324e',
    material: 'primary cell',
    term: 'kidney epithelial cell',
    sex: 'unknown',
    life_stage: 'unknown',
    organs: ['kidney', 'epithelium'],
    systems: ['excretory system']
  },
  {
    id: 'bf83be8e-1b43-4bd8-bb07-983938333ca2',
    material: 'primary tissue',
    term: 'spleen',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['spleen', 'immune organ'],
    systems: ['immune system', 'digestive system']
  },
  {
    id: 'a31cded0-877a-42dd-8b93-a6d36373b90f',
    material: 'primary cell',
    term: 'foreskin fibroblast',
    sex: 'male',
    life_stage: 'newborn',
    organs: ['penis', 'skin of body', 'connective tissue'],
    systems: ['reproductive system', 'integumental system']
  },
  {
    id: 'ba3dc2a1-3c68-46eb-916e-3bb0e8c23f27',
    material: 'primary tissue',
    term: 'breast epithelium',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['epithelium', 'breast'],
    systems: []
  },
  {
    id: 'c399bbf9-89ba-4473-b4d9-70015369a538',
    material: 'primary cell culture',
    term: 'hepatocyte',
    sex: 'female',
    life_stage: 'embryonic',
    age: '5 dpf',
    organs: ['liver', 'exocrine gland', 'epithelium', 'endocrine gland'],
    systems: ['exocrine system', 'digestive system', 'endocrine system']
  },
  {
    id: '999dd12f-5796-45bd-befb-8dda738f6166',
    material: 'primary tissue',
    term: "Peyer's patch",
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['intestine', 'lymphoid tissue'],
    systems: ['immune system', 'digestive system']
  },
  {
    id: '4afaa24e-e248-4200-854d-d18546969076',
    material: 'primary tissue',
    term: 'stomach',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['stomach'],
    systems: ['digestive system']
  },
  {
    id: 'a6b6cd04-02f1-47a3-bafa-00534d41ef32',
    material: 'cell line',
    term: 'DND-41',
    sex: 'male',
    life_stage: 'child',
    age: '13 y',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '74949d88-913a-4b58-a2a9-25d5c082707d',
    material: 'primary cell',
    term: 'common myeloid progenitor, CD34-positive',
    sex: 'male',
    life_stage: 'adult',
    age: '42 y',
    organs: ['bone marrow', 'bone element'],
    systems: ['immune system']
  },
  {
    id: '857b68a6-7dee-4d78-ad1d-8d1ac6f990af',
    material: 'cell line',
    term: 'NCI-H929',
    sex: 'female',
    life_stage: 'adult',
    age: '62 y',
    organs: ['bone marrow', 'bone element'],
    systems: ['immune system', 'skeletal system']
  },
  {
    id: 'aa0395c0-ddd3-409c-8cff-262c3f881fb3',
    material: 'cell line',
    term: 'PC-9',
    sex: 'unknown',
    life_stage: 'unknown',
    organs: ['lung'],
    systems: ['respiratory system']
  },
  {
    id: 'b3d909dc-f3b3-42f2-95c7-8ffa4d913976',
    material: 'cell line',
    term: 'HeLa-S3',
    sex: 'female',
    life_stage: 'adult',
    age: '31 y',
    organs: ['epithelium', 'uterus'],
    systems: ['reproductive system']
  },
  {
    id: 'b2c2a866-895f-4b8d-95bf-a891364afb93',
    material: 'primary tissue',
    term: 'brain',
    sex: 'female, male',
    life_stage: 'embryonic',
    age: '120-122 dpf',
    organs: ['brain'],
    systems: ['central nervous system']
  },
  {
    id: 'c3062a72-ae57-43ba-b1b1-dc14fbc1d9a9',
    material: 'cell line',
    term: 'HUES64',
    sex: 'male',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: []
  },
  {
    id: 'cdedf405-c924-48a7-b3f3-8f88b92d3b67',
    material: 'primary tissue',
    term: 'prostate gland',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['prostate gland'],
    systems: ['reproductive system']
  },
  {
    id: '60a0c6f2-aa42-4850-98b5-b12fae819ae5',
    material: 'primary tissue',
    term: 'sigmoid colon',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['large intestine', 'intestine', 'colon'],
    systems: ['digestive system']
  },
  {
    id: 'b1a162ae-ae62-4dd1-9f7d-facb8ced27d9',
    material: 'cell line',
    term: 'iPS DF 6.9',
    sex: 'male',
    life_stage: 'newborn',
    organs: ['penis', 'skin of body', 'skin of prepuce of penis'],
    systems: ['reproductive system', 'integumental system']
  },
  {
    id: '9ca1940e-29dc-4efd-9174-b52e087b7d6c',
    material: 'cell line',
    term: 'Caco-2',
    sex: 'male',
    life_stage: 'adult',
    age: '72 y',
    organs: ['large intestine', 'intestine', 'colon'],
    systems: ['digestive system']
  },
  {
    id: 'df51b786-7a39-4efb-b32a-c542958fb14e',
    material: 'primary cell',
    term: 'fibroblast of lung',
    sex: 'female, male',
    life_stage: 'adult, child',
    age: '11-45 y',
    organs: ['lung', 'connective tissue'],
    systems: ['respiratory system']
  },
  {
    id: '2e0b1f30-f13e-40e3-baf2-59c89812e27f',
    material: 'primary tissue',
    term: 'heart left ventricle',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['heart'],
    systems: ['circulatory system']
  },
  {
    id: 'f9e3999a-53ed-4a60-b3c0-258285f5ad46',
    material: 'primary cell',
    term: 'skeletal muscle myoblast',
    sex: 'male, unknown',
    life_stage: 'adult, unknown',
    organs: ['musculature of body'],
    systems: ['musculature']
  },
  {
    id: '311440db-d1ba-4145-8216-9c2d56b20b47',
    material: 'cell line',
    term: 'DOHH2',
    sex: 'male',
    life_stage: 'adult',
    age: '60 y',
    organs: [],
    systems: ['immune system']
  },
  {
    id: 'b96b5920-0222-471a-a907-2fbb4c588ef4',
    material: 'primary cell',
    term: 'osteoblast',
    sex: 'unknown',
    life_stage: 'unknown',
    organs: ['connective tissue'],
    systems: ['skeletal system']
  },
  {
    id: 'fd57401b-cf40-4703-bc2c-7996c20dcd43',
    material: 'primary cell',
    term: 'fibroblast of mammary gland',
    sex: 'female',
    life_stage: 'unknown',
    organs: ['exocrine gland', 'connective tissue', 'mammary gland'],
    systems: ['exocrine system', 'integumental system']
  },
  {
    id: '2ee1ea3d-f4ff-4ea4-88cd-c7c12f852eb4',
    material: 'primary tissue',
    term: 'adrenal gland',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['adrenal gland', 'endocrine gland'],
    systems: ['endocrine system']
  },
  {
    id: '1d8bae17-7354-434c-8b20-37894abad74c',
    material: 'primary tissue',
    term: 'upper lobe of left lung',
    sex: 'female',
    life_stage: 'adult',
    age: '51 y',
    organs: ['lung'],
    systems: ['respiratory system']
  },
  {
    id: 'dfd3d1fd-af6f-47a4-8178-01eb82ec37cb',
    material: 'primary cell culture',
    term: 'neuron',
    sex: 'female',
    life_stage: 'embryonic',
    age: '5 dpf',
    organs: [],
    systems: ['peripheral nervous system', 'central nervous system']
  },
  {
    id: 'c4d9abbb-b537-434a-b03a-8900f87e6730',
    material: 'primary cell',
    term: 'B cell',
    sex: 'female',
    life_stage: 'adult',
    age: '27-43 y',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '3893365d-980a-46df-9abe-38a61b2785b9',
    material: 'primary cell',
    term: 'common myeloid progenitor, CD34-positive',
    sex: 'unknown',
    life_stage: 'unknown',
    organs: ['bone marrow', 'bone element'],
    systems: ['immune system']
  },
  {
    id: '8e5bc05a-3cfb-43d3-a1cc-95e4f9a25643',
    material: 'cell line',
    term: 'iPS-18c',
    sex: 'female',
    life_stage: 'adult',
    age: '48 y',
    organs: ['skin of body'],
    systems: ['integumental system']
  },
  {
    id: '609ce081-1470-4d56-bc6f-2e68cddeb41e',
    material: 'primary cell culture',
    term: 'neuronal stem cell',
    sex: 'female',
    life_stage: 'embryonic',
    age: '5 dpf',
    organs: ['embryo'],
    systems: ['central nervous system']
  },
  {
    id: 'a44e48d8-2ac4-41cb-bad3-370d933afdfd',
    material: 'primary tissue',
    term: 'stomach',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['stomach'],
    systems: ['digestive system']
  },
  {
    id: '6857c901-9c9e-43b8-af3f-e7e852b1a39b',
    material: 'cell line',
    term: 'GM12878',
    sex: 'female',
    life_stage: 'adult',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '068d8c2e-2ef8-4c03-abd2-4bcbf26de19a',
    material: 'cell line',
    term: 'NT2/D1',
    sex: 'male',
    life_stage: 'unknown',
    age: '22 y',
    organs: ['testis', 'epithelium', 'gonad'],
    systems: ['reproductive system']
  },
  {
    id: '26817e2c-1c07-44d9-8f57-773cc244a768',
    material: 'primary tissue',
    term: 'heart left ventricle',
    sex: 'female',
    life_stage: 'adult',
    age: '51 y',
    organs: ['heart'],
    systems: ['circulatory system']
  },
  {
    id: 'b9362c59-00cb-436c-828b-373fb6b30ed1',
    material: 'primary tissue',
    term: 'adrenal gland',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['adrenal gland', 'endocrine gland'],
    systems: ['endocrine system']
  },
  {
    id: '4ce1b7af-879d-4d57-8a5c-d2fdd688b840',
    material: 'cell line',
    term: 'K562',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '7ecfcf44-0022-4380-8370-9a1e0513005c',
    material: 'primary tissue',
    term: 'vagina',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['vagina'],
    systems: ['reproductive system']
  },
  {
    id: '2284dd9d-cd4e-4d6c-8aa0-2df5a2a6bd63',
    material: 'primary tissue',
    term: 'large intestine',
    sex: 'male',
    life_stage: 'embryonic',
    age: '108 dpf',
    organs: ['large intestine', 'intestine'],
    systems: ['digestive system']
  },
  {
    id: '9118d9a6-628e-4e63-9373-86fc755049ec',
    material: 'cell line',
    term: 'SK-N-MC',
    sex: 'female',
    life_stage: 'child',
    age: '14 y',
    organs: ['epithelium', 'brain'],
    systems: ['central nervous system']
  },
  {
    id: '30d3cc33-2dca-4cba-9609-91da0537c1b5',
    material: 'primary cell',
    term: 'natural killer cell',
    sex: 'male',
    life_stage: 'adult',
    age: '21-37 y',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '214ccdd4-cf1c-472c-ba9d-021d62967e3c',
    material: 'primary cell',
    term: 'B cell',
    sex: 'unknown',
    life_stage: 'unknown',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '2569c3c9-67b1-48a3-8cf1-83fc18908d48',
    material: 'primary tissue',
    term: 'gastrocnemius medialis',
    sex: 'male',
    life_stage: 'adult',
    age: '54 y',
    organs: ['musculature of body', 'limb'],
    systems: ['musculature']
  },
  {
    id: '8e5bc05a-3cfb-43d3-a1cc-95e4f9a25643',
    material: 'cell line',
    term: 'iPS-18a',
    sex: 'female',
    life_stage: 'adult',
    age: '48 y',
    organs: ['skin of body'],
    systems: ['integumental system']
  },
  {
    id: '4b0cd32e-f188-49e6-ad9a-f4aec87217b6',
    material: 'cell line',
    term: 'GM23248',
    sex: 'male',
    life_stage: 'adult',
    age: '53 y',
    organs: ['skin of body', 'connective tissue', 'limb'],
    systems: ['integumental system']
  },
  {
    id: '54818743-bc88-4fb5-991f-b0b0f3d7c39f',
    material: 'primary tissue',
    term: 'muscle of trunk',
    sex: 'female',
    life_stage: 'embryonic',
    age: '113-121 dpf',
    organs: ['musculature of body'],
    systems: ['musculature']
  },
  {
    id: '58c2e74c-827a-4bed-bdcb-693dd9129de3',
    material: 'cell line',
    term: 'HepG2',
    sex: 'male',
    life_stage: 'child',
    age: '15 y',
    organs: ['liver', 'exocrine gland', 'epithelium', 'endocrine gland'],
    systems: ['exocrine system', 'digestive system', 'endocrine system']
  },
  {
    id: '04069f77-1e88-4790-95d1-71aafe50b4a9',
    material: 'primary tissue',
    term: 'small intestine',
    sex: 'male',
    life_stage: 'embryonic',
    age: '108 dpf',
    organs: ['small intestine', 'intestine'],
    systems: ['digestive system']
  },
  {
    id: 'ae347bc3-181d-4e18-9827-bb78e9a0ded4',
    material: 'cell line',
    term: 'AG04450',
    sex: 'male',
    life_stage: 'embryonic',
    age: '12 w',
    organs: ['lung', 'connective tissue'],
    systems: ['respiratory system']
  },
  {
    id: 'd175529d-3d14-44f4-8bdd-f79bb10518e2',
    material: 'primary cell',
    term: 'bronchial epithelial cell',
    sex: 'unknown',
    life_stage: 'unknown',
    organs: ['lung', 'epithelium', 'bronchus'],
    systems: ['respiratory system']
  },
  {
    id: 'dc034b55-00dc-4661-95e9-e6ec0ed7c487',
    material: 'cell line',
    term: 'OCI-LY3',
    sex: 'male',
    life_stage: 'adult',
    age: '52 y',
    organs: ['lymph node', 'immune organ', 'bone marrow', 'bone element'],
    systems: ['immune system', 'skeletal system']
  },
  {
    id: '05bdc676-f933-4cf3-b667-577b20fbdd54',
    material: 'primary cell culture',
    term: 'mesodermal cell',
    sex: 'male',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: []
  },
  {
    id: 'd386af48-02a0-4eb2-9922-7ec9fd04d354',
    material: 'primary cell culture',
    term: 'mesendoderm',
    sex: 'male',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: []
  },
  {
    id: '83fe2d1d-2191-4b55-b236-cb1dd97b8c02',
    material: 'primary tissue',
    term: 'small intestine',
    sex: 'male',
    life_stage: 'child',
    age: '3 y',
    organs: ['small intestine', 'intestine'],
    systems: ['digestive system']
  },
  {
    id: 'afa7a377-5240-44ad-a30c-b31e884c9e92',
    material: 'primary tissue',
    term: 'upper lobe of left lung',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['lung'],
    systems: ['respiratory system']
  },
  {
    id: 'e0666124-9fa6-4af4-8cef-22ebd047bd74',
    material: 'cell line',
    term: 'GM23338',
    sex: 'male',
    life_stage: 'adult',
    age: '53 y',
    organs: ['skin of body'],
    systems: ['integumental system']
  },
  {
    id: 'd07ec897-b449-48cb-ab15-19b8230264a2',
    material: 'cell line',
    term: 'SK-N-SH',
    sex: 'female',
    life_stage: 'child',
    age: '4 y',
    organs: ['brain'],
    systems: ['central nervous system']
  },
  {
    id: 'c927fb39-0fef-4c18-baab-f11fb40d614a',
    material: 'primary cell',
    term: 'common myeloid progenitor, CD34-positive',
    sex: 'female, male',
    life_stage: 'adult',
    age: '27-36 y',
    organs: ['bone marrow', 'bone element'],
    systems: ['immune system']
  },
  {
    id: 'e17dc87f-8c82-4f68-8802-7b0424dc145a',
    material: 'primary tissue',
    term: 'esophagus squamous epithelium',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['epithelium', 'esophagus'],
    systems: ['digestive system']
  },
  {
    id: '4e8fec2c-4cd3-49c8-a07c-1cc34cff959a',
    material: 'primary cell culture',
    term: 'smooth muscle cell',
    sex: 'female',
    life_stage: 'embryonic',
    age: '5 dpf',
    organs: ['musculature of body'],
    systems: ['musculature']
  },
  {
    id: 'f32693a4-abef-4ef6-9595-d6aee3207620',
    material: 'cell line',
    term: 'iPS DF 19.11',
    sex: 'male',
    life_stage: 'newborn',
    organs: ['penis', 'skin of body', 'skin of prepuce of penis'],
    systems: ['reproductive system', 'integumental system']
  },
  {
    id: 'c81af853-e2c0-4f00-b9df-7db454313b8b',
    material: 'primary tissue',
    term: 'right lobe of liver',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['liver', 'exocrine gland', 'endocrine gland'],
    systems: ['exocrine system', 'digestive system', 'endocrine system']
  },
  {
    id: 'c6b8976c-ee83-4886-be11-a68afb6fddbc',
    material: 'cell line',
    term: 'H9',
    sex: 'female',
    life_stage: 'embryonic',
    age: '5 dpf',
    organs: ['embryo'],
    systems: []
  },
  {
    id: '337c3195-7ee0-4b7e-a98c-1525e0c2569c',
    material: 'primary tissue',
    term: 'thymus',
    sex: 'female, male',
    life_stage: 'embryonic',
    organs: ['thymus', 'immune organ', 'endocrine gland'],
    systems: ['immune system', 'endocrine system']
  },
  {
    id: 'e63a070c-9bd9-494f-b08d-318be3204112',
    material: 'primary cell culture',
    term: 'neural cell',
    sex: 'male',
    life_stage: 'embryonic',
    organs: [],
    systems: ['peripheral nervous system', 'central nervous system']
  },
  {
    id: '44185abc-d029-48f2-801a-965d05ba781e',
    material: 'cell line',
    term: 'BJ',
    sex: 'male',
    life_stage: 'newborn',
    organs: ['penis', 'skin of body', 'connective tissue'],
    systems: ['reproductive system']
  },
  {
    id: 'd23d450c-bbf6-4dcb-884f-e1892648da87',
    material: 'cell line',
    term: 'ACC112',
    sex: 'male',
    life_stage: 'adult',
    age: '70 y',
    organs: ['exocrine gland', 'epithelium', 'mouth'],
    systems: ['exocrine system', 'digestive system']
  },
  {
    id: '5ee9d0ab-7c3f-4a9c-960b-95a33a3202d2',
    material: 'primary cell',
    term: 'keratinocyte',
    sex: 'female',
    life_stage: 'unknown',
    organs: ['skin of body', 'epithelium'],
    systems: ['integumental system']
  },
  {
    id: 'eb84c666-0e65-4986-b7eb-53d8b901a54b',
    material: 'primary tissue',
    term: 'thoracic aorta',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['vasculature', 'blood vessel', 'arterial blood vessel'],
    systems: ['circulatory system']
  },
  {
    id: '886efc16-b881-4dbf-a1ae-e8ed86ffd3ed',
    material: 'primary cell',
    term: 'B cell',
    sex: 'male',
    life_stage: 'adult',
    age: '21-37 y',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '851d489f-9a85-4013-a6de-2906bd45ad5d',
    material: 'primary tissue',
    term: 'lung',
    sex: 'female, unknown',
    life_stage: 'embryonic',
    age: '82-120 dpf',
    organs: ['lung'],
    systems: ['respiratory system']
  },
  {
    id: 'c556db29-d3b1-45c8-ba4c-ace1752e3271',
    material: 'primary tissue',
    term: 'esophagus muscularis mucosa',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['musculature of body', 'esophagus'],
    systems: ['digestive system', 'musculature']
  },
  {
    id: '207ed572-d7f5-416c-9d19-9f0710e2b091',
    material: 'cell line',
    term: 'KMS-11',
    sex: 'female',
    life_stage: 'adult',
    age: '67 y',
    organs: ['bone element'],
    systems: ['skeletal system']
  },
  {
    id: '4b955c2f-f5f6-47e0-9d4a-0d3761e68175',
    material: 'primary tissue',
    term: 'thyroid gland',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['thyroid gland', 'endocrine gland'],
    systems: ['endocrine system']
  },
  {
    id: 'ccc20e32-7d33-4026-bf88-67683c5d72ce',
    material: 'cell line',
    term: 'HUES6',
    sex: 'female',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: []
  },
  {
    id: 'ad03da16-c76c-47ee-8de6-bee9b008b6ec',
    material: 'primary cell',
    term: 'endothelial cell of umbilical vein',
    sex: 'unknown',
    life_stage: 'newborn',
    organs: [
      'vasculature',
      'extraembryonic component',
      'blood vessel',
      'vein',
      'epithelium',
      'placenta'
    ],
    systems: ['circulatory system', 'reproductive system']
  },
  {
    id: '3c9c429d-aa8c-4a9e-9a33-ca300691211b',
    material: 'cell line',
    term: 'MM.1S',
    sex: 'female',
    life_stage: 'adult',
    age: '42 y',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '5ba96a63-c4b1-41da-aa68-b9cadd3a1711',
    material: 'cell line',
    term: 'Loucy',
    sex: 'female',
    life_stage: 'adult',
    age: '38 y',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '10b8e163-2350-41d3-9733-15cb2a317ccc',
    material: 'cell line',
    term: 'H7',
    sex: 'female',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: []
  },
  {
    id: '5a59c8fd-8410-40a1-bb6c-a587a15a7638',
    material: 'primary tissue',
    term: 'esophagus muscularis mucosa',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['musculature of body', 'esophagus'],
    systems: ['digestive system', 'musculature']
  },
  {
    id: '4ab69b8e-9a06-43ea-b91c-4a6b8f64fbd4',
    material: 'primary cell culture',
    term: 'neuronal stem cell',
    sex: 'male',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: ['central nervous system']
  },
  {
    id: '2665043c-de6f-439f-9c83-a8b1ccac74b9',
    material: 'primary cell',
    term: 'keratinocyte',
    sex: 'female',
    life_stage: 'unknown',
    organs: ['skin of body', 'epithelium'],
    systems: ['integumental system']
  },
  {
    id: 'a8883962-3d67-4566-9888-47770e259d56',
    material: 'primary tissue',
    term: 'body of pancreas',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['pancreas'],
    systems: []
  },
  {
    id: '7fef43ae-62ff-4b80-b2c9-33955faae3f9',
    material: 'primary cell culture',
    term: 'trophoblast cell',
    sex: 'male',
    life_stage: 'embryonic',
    organs: ['embryo', 'extraembryonic component'],
    systems: []
  },
  {
    id: '9b9081b6-c43d-46d8-b711-6e0407d0231e',
    material: 'primary cell culture',
    term: 'endodermal cell',
    sex: 'male',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: []
  },
  {
    id: 'd809007c-c4db-4068-8f73-0143f6285607',
    material: 'primary tissue',
    term: 'thoracic aorta',
    sex: 'male',
    life_stage: 'adult',
    age: '54 y',
    organs: ['vasculature', 'blood vessel', 'arterial blood vessel'],
    systems: ['circulatory system']
  },
  {
    id: 'bc65d3ed-3cab-4aad-ae80-c1bf9df43d6e',
    material: 'primary cell',
    term: 'fibroblast of lung',
    sex: 'female, male, unknown',
    life_stage: 'adult, child, unknown',
    organs: ['lung', 'connective tissue'],
    systems: ['respiratory system']
  },
  {
    id: '3c4ce9d8-f01e-4574-8914-f8461b47fb0c',
    material: 'primary tissue',
    term: 'tibial artery',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['vasculature', 'limb', 'blood vessel', 'arterial blood vessel'],
    systems: ['circulatory system']
  },
  {
    id: '90c4cdb3-eb0b-4153-9c85-1364a418778b',
    material: 'primary tissue',
    term: 'adrenal gland',
    sex: 'male, unknown',
    life_stage: 'embryonic',
    age: '96-97 dpf',
    organs: ['adrenal gland', 'endocrine gland'],
    systems: ['endocrine system']
  },
  {
    id: '5ea354bf-128b-4726-b2f1-aa0251d7b0df',
    material: 'primary tissue',
    term: 'tibial nerve',
    sex: 'male',
    life_stage: 'adult',
    age: '54 y',
    organs: ['nerve', 'limb'],
    systems: ['peripheral nervous system']
  },
  {
    id: 'c7573501-9a00-445a-97c2-3af6b8a1e93d',
    material: 'cell line',
    term: 'iPS-20b',
    sex: 'male',
    life_stage: 'adult',
    age: '55 y',
    organs: ['skin of body'],
    systems: ['integumental system']
  },
  {
    id: '2cf5da5f-3c66-4548-bb86-72364fac1e3b',
    material: 'cell line',
    term: 'A673',
    sex: 'female',
    life_stage: 'child',
    age: '15 y',
    organs: ['musculature of body'],
    systems: ['musculature']
  },
  {
    id: 'f834a762-a654-4bb4-a721-e7a70c877c9f',
    material: 'primary tissue',
    term: 'stomach',
    sex: 'female, male, unknown',
    life_stage: 'embryonic',
    organs: ['stomach'],
    systems: ['digestive system']
  },
  {
    id: '0d8d65cf-fe97-42a3-8834-7125e716fb78',
    material: 'cell line',
    term: 'PC-3',
    sex: 'male',
    life_stage: 'adult',
    age: '62 y',
    organs: ['prostate gland'],
    systems: ['reproductive system']
  },
  {
    id: 'ebcb05c4-e5ce-4e11-b211-0c3ba7dda5c6',
    material: 'primary tissue',
    term: 'thyroid gland',
    sex: 'male',
    life_stage: 'adult',
    age: '54 y',
    organs: ['thyroid gland', 'endocrine gland'],
    systems: ['endocrine system']
  },
  {
    id: 'b0339af6-7bd3-4879-b53f-3960b27fa8af',
    material: 'primary tissue',
    term: 'gastrocnemius medialis',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['musculature of body', 'limb'],
    systems: ['musculature']
  },
  {
    id: '64d3e4fc-de50-4b7a-951d-7c9ac12f1135',
    material: 'primary cell',
    term: 'T-cell',
    sex: 'unknown',
    life_stage: 'unknown',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '1eef7744-55e1-463a-838b-cf31e303da21',
    material: 'cell line',
    term: 'H1',
    sex: 'male',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: []
  },
  {
    id: '60aca063-ad9e-439a-849b-93d229b8cf98',
    material: 'primary tissue',
    term: 'kidney',
    sex: 'female',
    life_stage: 'embryonic',
    age: '120 dpf',
    organs: ['kidney'],
    systems: ['excretory system']
  },
  {
    id: '8976faa9-e7e0-4504-b494-485781e77f7f',
    material: 'primary tissue',
    term: 'body of pancreas',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['pancreas'],
    systems: []
  },
  {
    id: 'ca93a53b-150a-4223-b953-ea26f3a32890',
    material: 'cell line',
    term: 'HCT116',
    sex: 'male',
    life_stage: 'adult',
    age: '48 y',
    organs: ['large intestine', 'epithelium', 'intestine', 'colon'],
    systems: ['digestive system']
  },
  {
    id: 'f9320394-0fc7-4a01-a4bb-17d812715180',
    material: 'primary tissue',
    term: 'right atrium auricular region',
    sex: 'female',
    life_stage: 'adult',
    age: '51 y',
    organs: ['heart'],
    systems: ['circulatory system']
  },
  {
    id: 'bea2858a-9193-478b-87ec-b06727fcd321',
    material: 'primary tissue',
    term: 'tibial nerve',
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['nerve', 'limb'],
    systems: ['peripheral nervous system']
  },
  {
    id: '645d13bf-46cd-489f-b0e2-5a1d716922a1',
    material: 'primary cell',
    term: 'mononuclear cell',
    sex: 'male',
    life_stage: 'unknown',
    organs: ['blood', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '815a564d-2ae4-45fd-b0e0-47c5cd5df420',
    material: 'cell line',
    term: 'Karpas-422',
    sex: 'female',
    life_stage: 'adult',
    age: '72 y',
    organs: ['blood', 'lymph node', 'bodily fluid'],
    systems: ['immune system']
  },
  {
    id: '5f8b5a13-13b9-4b7f-8207-2b86480e0e86',
    material: 'primary tissue',
    term: "Peyer's patch",
    sex: 'male',
    life_stage: 'adult',
    age: '37 y',
    organs: ['intestine', 'lymphoid tissue'],
    systems: ['immune system', 'digestive system']
  },
  {
    id: '4ceba745-be0c-4458-bb0d-406722773043',
    material: 'primary tissue',
    term: 'ascending aorta',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['vasculature', 'blood vessel', 'arterial blood vessel'],
    systems: ['circulatory system']
  },
  {
    id: 'ffeaa6fa-a321-4a1d-8396-41f109a3e9dc',
    material: 'primary tissue',
    term: 'esophagus muscularis mucosa',
    sex: 'female',
    life_stage: 'adult',
    age: '51 y',
    organs: ['musculature of body', 'esophagus'],
    systems: ['digestive system', 'musculature']
  },
  {
    id: 'c333a3a9-e928-4d12-bb39-377303980f50',
    material: 'cell line',
    term: 'HUES48',
    sex: 'female',
    life_stage: 'embryonic',
    organs: ['embryo'],
    systems: []
  },
  {
    id: '59f81e88-4b47-4041-8a90-36354f807d0c',
    material: 'cell line',
    term: 'OCI-LY1',
    sex: 'male',
    life_stage: 'adult',
    age: '44 y',
    organs: ['bone marrow', 'bone element'],
    systems: ['immune system', 'skeletal system']
  },
  {
    id: 'b8830ce9-f325-4d6c-a165-bd0a7ccd7a73',
    material: 'cell line',
    term: 'Panc1',
    sex: 'male',
    life_stage: 'adult',
    age: '56 y',
    organs: ['epithelium', 'pancreas'],
    systems: ['endocrine system']
  },
  {
    id: '51d5fa1b-faee-4d7b-b4bc-a6c3b8495aa9',
    material: 'primary tissue',
    term: 'gastroesophageal sphincter',
    sex: 'female',
    life_stage: 'adult',
    age: '53 y',
    organs: ['musculature of body', 'stomach'],
    systems: ['digestive system', 'musculature']
  },
  {
    id: 'd2254ba9-b1e6-451b-8876-b1185cea37a7',
    material: 'cell line',
    term: 'SU-DHL-6',
    sex: 'male',
    life_stage: 'adult',
    age: '43 y',
    organs: [],
    systems: ['immune system']
  }
] as Epigenome[];

export default epigenomes;
