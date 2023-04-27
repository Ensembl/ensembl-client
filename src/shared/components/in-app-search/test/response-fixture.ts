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

import type { SearchResults } from 'src/shared/types/search-api/search-results';

// response from the API queried with the string BRCA2
export const brca2SearchResults = {
  meta: {
    total_hits: 12,
    page: 1,
    per_page: 10
  },
  matches: [
    {
      type: 'Gene',
      stable_id: 'ENSG00000139618.17',
      unversioned_stable_id: 'ENSG00000139618',
      biotype: 'protein_coding',
      symbol: 'BRCA2',
      name: 'BRCA2 DNA repair associated ',
      genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
      transcript_count: 10,
      slice: {
        location: {
          start: 32315086,
          end: 32400268
        },
        region: {
          name: '13'
        },
        strand: {
          code: 'forward'
        }
      }
    },
    {
      type: 'Gene',
      stable_id: 'ENSG00000158636.16',
      unversioned_stable_id: 'ENSG00000158636',
      biotype: 'protein_coding',
      symbol: 'EMSY',
      name: 'EMSY transcriptional repressor, BRCA2 interacting ',
      genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
      transcript_count: 18,
      slice: {
        location: {
          start: 76444923,
          end: 76553025
        },
        region: {
          name: '11'
        },
        strand: {
          code: 'forward'
        }
      }
    },
    {
      type: 'Gene',
      stable_id: 'ENSG00000083093.5',
      unversioned_stable_id: 'ENSG00000083093',
      biotype: 'protein_coding',
      symbol: 'PALB2',
      name: 'partner and localizer of BRCA2 ',
      genome_id: '3704ceb1-948d-11ec-a39d-005056b38ce3',
      transcript_count: 6,
      slice: {
        location: {
          start: 23614488,
          end: 23652631
        },
        region: {
          name: '16'
        },
        strand: {
          code: 'reverse'
        }
      }
    },
    {
      type: 'Gene',
      stable_id: 'ENSG00000170037.9',
      unversioned_stable_id: 'ENSG00000170037',
      biotype: 'protein_coding',
      symbol: 'CNTROB',
      name: 'centrobin, centrosomal BRCA2 interacting protein ',
      genome_id: '3704ceb1-948d-11ec-a39d-005056b38ce3',
      transcript_count: 16,
      slice: {
        location: {
          start: 7835419,
          end: 7853236
        },
        region: {
          name: '17'
        },
        strand: {
          code: 'forward'
        }
      }
    },
    {
      type: 'Gene',
      stable_id: 'ENSG00000083093.10',
      unversioned_stable_id: 'ENSG00000083093',
      biotype: 'protein_coding',
      symbol: 'PALB2',
      name: 'partner and localizer of BRCA2 ',
      genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
      transcript_count: 6,
      slice: {
        location: {
          start: 23603160,
          end: 23641310
        },
        region: {
          name: '16'
        },
        strand: {
          code: 'reverse'
        }
      }
    },
    {
      type: 'Gene',
      stable_id: 'ENSG00000107949.12',
      unversioned_stable_id: 'ENSG00000107949',
      biotype: 'protein_coding',
      symbol: 'BCCIP',
      name: 'BRCA2 and CDKN1A interacting protein ',
      genome_id: '3704ceb1-948d-11ec-a39d-005056b38ce3',
      transcript_count: 6,
      slice: {
        location: {
          start: 127512115,
          end: 127542264
        },
        region: {
          name: '10'
        },
        strand: {
          code: 'forward'
        }
      }
    },
    {
      type: 'Gene',
      stable_id: 'ENSG00000251667.1',
      unversioned_stable_id: 'ENSG00000251667',
      biotype: 'processed_pseudogene',
      symbol: 'BRCC3P1',
      name: 'BRCA1/BRCA2-containing complex subunit 3 pseudogene 1 ',
      genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
      transcript_count: 1,
      slice: {
        location: {
          start: 176308063,
          end: 176309013
        },
        region: {
          name: '5'
        },
        strand: {
          code: 'forward'
        }
      }
    },
    {
      type: 'Gene',
      stable_id: 'ENSG00000107949.17',
      unversioned_stable_id: 'ENSG00000107949',
      biotype: 'protein_coding',
      symbol: 'BCCIP',
      name: 'BRCA2 and CDKN1A interacting protein ',
      genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
      transcript_count: 5,
      slice: {
        location: {
          start: 125823546,
          end: 125853695
        },
        region: {
          name: '10'
        },
        strand: {
          code: 'forward'
        }
      }
    },
    {
      type: 'Gene',
      stable_id: 'ENSG00000185515.10',
      unversioned_stable_id: 'ENSG00000185515',
      biotype: 'protein_coding',
      symbol: 'BRCC3',
      name: 'BRCA1/BRCA2-containing complex, subunit 3 ',
      genome_id: '3704ceb1-948d-11ec-a39d-005056b38ce3',
      transcript_count: 8,
      slice: {
        location: {
          start: 154299695,
          end: 154351349
        },
        region: {
          name: 'X'
        },
        strand: {
          code: 'forward'
        }
      }
    },
    {
      type: 'Gene',
      stable_id: 'ENSG00000269884.1',
      unversioned_stable_id: 'ENSG00000269884',
      biotype: 'protein_coding',
      symbol: 'BRCC3',
      name: 'BRCA1/BRCA2-containing complex, subunit 3 ',
      genome_id: '3704ceb1-948d-11ec-a39d-005056b38ce3',
      transcript_count: 8,
      slice: {
        location: {
          start: 154239888,
          end: 154291542
        },
        region: {
          name: 'HG1497_PATCH'
        },
        strand: {
          code: 'forward'
        }
      }
    }
  ]
} as SearchResults;
