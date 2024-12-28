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

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

// This should be a dense region containing genes competing for the same location,
// and necessitating bumping

const regionOverview = {
  region_name: '17',
  coordinate_system: 'chromosome',
  locations: [
    {
      start: 58490566,
      end: 58699001
    }
  ],
  selected_gene_index: 3,
  genes: [
    {
      stable_id: 'ENSG00000299242.1',
      unversioned_stable_id: 'ENSG00000299242',
      biotype: 'lncRNA',
      name: {
        value: 'novel transcript, antisense to HSF5 and MTMR4'
      },
      start: 58487238,
      end: 58493164,
      strand: 'forward',
      representative_transcript: {
        exons: [
          {
            start: 58487260,
            end: 58487405
          },
          {
            start: 58492865,
            end: 58493164
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 58487260
        },
        {
          position: 58488500
        }
      ],
      merged_exons: [
        {
          start: 58487260,
          end: 58487405
        },
        {
          start: 58488500,
          end: 58488804
        },
        {
          start: 58490892,
          end: 58492040
        },
        {
          start: 58492865,
          end: 58493164
        }
      ],
      cds_counts: []
    },
    {
      symbol: 'MTMR4',
      stable_id: 'ENSG00000108389.10',
      unversioned_stable_id: 'ENSG00000108389',
      biotype: 'protein_coding',
      name: {
        value: 'myotubularin related protein 4',
        source: 'HGNC Symbol',
        accession: 'HGNC:7452',
        url: 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:7452'
      },
      start: 58489529,
      end: 58517905,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58489537,
            end: 58491840
          },
          {
            start: 58492511,
            end: 58492599
          },
          {
            start: 58492842,
            end: 58492952
          },
          {
            start: 58494932,
            end: 58496330
          },
          {
            start: 58503744,
            end: 58503898
          },
          {
            start: 58504050,
            end: 58504220
          },
          {
            start: 58504303,
            end: 58504488
          },
          {
            start: 58504779,
            end: 58504974
          },
          {
            start: 58505472,
            end: 58505583
          },
          {
            start: 58506743,
            end: 58506871
          },
          {
            start: 58507123,
            end: 58507319
          },
          {
            start: 58508161,
            end: 58508274
          },
          {
            start: 58508468,
            end: 58508564
          },
          {
            start: 58508681,
            end: 58508841
          },
          {
            start: 58511429,
            end: 58511511
          },
          {
            start: 58512390,
            end: 58512506
          },
          {
            start: 58512852,
            end: 58512941
          },
          {
            start: 58514363,
            end: 58514638
          }
        ],
        cds: [
          {
            start: 58491663,
            end: 58491840
          },
          {
            start: 58492511,
            end: 58492599
          },
          {
            start: 58492842,
            end: 58492952
          },
          {
            start: 58494932,
            end: 58496330
          },
          {
            start: 58503744,
            end: 58503898
          },
          {
            start: 58504050,
            end: 58504220
          },
          {
            start: 58504303,
            end: 58504488
          },
          {
            start: 58504779,
            end: 58504974
          },
          {
            start: 58505472,
            end: 58505583
          },
          {
            start: 58506743,
            end: 58506871
          },
          {
            start: 58507123,
            end: 58507319
          },
          {
            start: 58508161,
            end: 58508274
          },
          {
            start: 58508468,
            end: 58508564
          },
          {
            start: 58508681,
            end: 58508841
          },
          {
            start: 58511429,
            end: 58511511
          },
          {
            start: 58512390,
            end: 58512506
          },
          {
            start: 58512852,
            end: 58512941
          },
          {
            start: 58514363,
            end: 58514407
          }
        ]
      },
      tss: [
        {
          position: 58514638
        },
        {
          position: 58517851
        },
        {
          position: 58517905
        }
      ],
      merged_exons: [
        {
          start: 58489529,
          end: 58491840
        },
        {
          start: 58492511,
          end: 58492599
        },
        {
          start: 58492842,
          end: 58492952
        },
        {
          start: 58494932,
          end: 58496330
        },
        {
          start: 58503744,
          end: 58503898
        },
        {
          start: 58504050,
          end: 58504220
        },
        {
          start: 58504303,
          end: 58504488
        },
        {
          start: 58504779,
          end: 58504974
        },
        {
          start: 58505472,
          end: 58505583
        },
        {
          start: 58506743,
          end: 58506871
        },
        {
          start: 58507123,
          end: 58507319
        },
        {
          start: 58508161,
          end: 58508274
        },
        {
          start: 58508468,
          end: 58508564
        },
        {
          start: 58508681,
          end: 58508841
        },
        {
          start: 58511429,
          end: 58511511
        },
        {
          start: 58512390,
          end: 58512506
        },
        {
          start: 58512852,
          end: 58512941
        },
        {
          start: 58514363,
          end: 58514638
        },
        {
          start: 58516580,
          end: 58516618
        },
        {
          start: 58517817,
          end: 58517905
        }
      ],
      cds_counts: [
        {
          start: 58491663,
          end: 58491840,
          count: 1
        },
        {
          start: 58492511,
          end: 58492599,
          count: 1
        },
        {
          start: 58492842,
          end: 58492952,
          count: 1
        },
        {
          start: 58494932,
          end: 58496330,
          count: 1
        },
        {
          start: 58503744,
          end: 58503898,
          count: 1
        },
        {
          start: 58504050,
          end: 58504220,
          count: 0.6667
        },
        {
          start: 58504303,
          end: 58504488,
          count: 1
        },
        {
          start: 58504779,
          end: 58504974,
          count: 1
        },
        {
          start: 58505472,
          end: 58505583,
          count: 1
        },
        {
          start: 58506743,
          end: 58506871,
          count: 1
        },
        {
          start: 58507123,
          end: 58507319,
          count: 1
        },
        {
          start: 58508161,
          end: 58508274,
          count: 1
        },
        {
          start: 58508468,
          end: 58508564,
          count: 1
        },
        {
          start: 58508681,
          end: 58508841,
          count: 1
        },
        {
          start: 58511429,
          end: 58511511,
          count: 1
        },
        {
          start: 58512390,
          end: 58512506,
          count: 1
        },
        {
          start: 58512852,
          end: 58512941,
          count: 1
        },
        {
          start: 58514363,
          end: 58514407,
          count: 0.3333
        },
        {
          start: 58516580,
          end: 58516582,
          count: 0.6667
        }
      ]
    },
    {
      symbol: 'SEPTIN4',
      stable_id: 'ENSG00000108387.16',
      unversioned_stable_id: 'ENSG00000108387',
      biotype: 'protein_coding',
      name: {
        value: 'septin 4',
        source: 'HGNC Symbol',
        accession: 'HGNC:9165',
        url: 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:9165'
      },
      start: 58520250,
      end: 58544368,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58520256,
            end: 58520485
          },
          {
            start: 58520743,
            end: 58520842
          },
          {
            start: 58520998,
            end: 58521160
          },
          {
            start: 58521254,
            end: 58521350
          },
          {
            start: 58521545,
            end: 58521646
          },
          {
            start: 58521736,
            end: 58521853
          },
          {
            start: 58521967,
            end: 58522101
          },
          {
            start: 58525078,
            end: 58525201
          },
          {
            start: 58525695,
            end: 58525781
          },
          {
            start: 58526220,
            end: 58526313
          },
          {
            start: 58526682,
            end: 58526978
          },
          {
            start: 58540666,
            end: 58540673
          },
          {
            start: 58541922,
            end: 58541966
          },
          {
            start: 58542626,
            end: 58544328
          }
        ],
        cds: [
          {
            start: 58520426,
            end: 58520485
          },
          {
            start: 58520743,
            end: 58520842
          },
          {
            start: 58520998,
            end: 58521160
          },
          {
            start: 58521254,
            end: 58521350
          },
          {
            start: 58521545,
            end: 58521646
          },
          {
            start: 58521736,
            end: 58521853
          },
          {
            start: 58521967,
            end: 58522101
          },
          {
            start: 58525078,
            end: 58525201
          },
          {
            start: 58525695,
            end: 58525781
          },
          {
            start: 58526220,
            end: 58526313
          },
          {
            start: 58526682,
            end: 58526978
          },
          {
            start: 58540666,
            end: 58540673
          },
          {
            start: 58541922,
            end: 58541966
          },
          {
            start: 58542626,
            end: 58544186
          }
        ]
      },
      tss: [
        {
          position: 58527144
        },
        {
          position: 58527981
        },
        {
          position: 58529279
        },
        {
          position: 58529303
        },
        {
          position: 58529351
        },
        {
          position: 58532046
        },
        {
          position: 58532050
        },
        {
          position: 58532054
        },
        {
          position: 58540818
        },
        {
          position: 58544328
        },
        {
          position: 58544368
        }
      ],
      merged_exons: [
        {
          start: 58520250,
          end: 58520485
        },
        {
          start: 58520743,
          end: 58521160
        },
        {
          start: 58521254,
          end: 58521350
        },
        {
          start: 58521545,
          end: 58522101
        },
        {
          start: 58525078,
          end: 58525201
        },
        {
          start: 58525695,
          end: 58525781
        },
        {
          start: 58526220,
          end: 58526313
        },
        {
          start: 58526682,
          end: 58526978
        },
        {
          start: 58527142,
          end: 58527144
        },
        {
          start: 58527826,
          end: 58527981
        },
        {
          start: 58529115,
          end: 58529351
        },
        {
          start: 58531961,
          end: 58532054
        },
        {
          start: 58539112,
          end: 58539208
        },
        {
          start: 58540666,
          end: 58540818
        },
        {
          start: 58541587,
          end: 58541966
        },
        {
          start: 58542626,
          end: 58544368
        }
      ],
      cds_counts: [
        {
          start: 58520426,
          end: 58520485,
          count: 0.6923
        },
        {
          start: 58520743,
          end: 58520770,
          count: 0.6923
        },
        {
          start: 58520771,
          end: 58520789,
          count: 0.7692
        },
        {
          start: 58520790,
          end: 58520842,
          count: 0.6923
        },
        {
          start: 58520998,
          end: 58521160,
          count: 0.7692
        },
        {
          start: 58521254,
          end: 58521350,
          count: 0.7692
        },
        {
          start: 58521545,
          end: 58521646,
          count: 0.7692
        },
        {
          start: 58521736,
          end: 58521853,
          count: 0.7692
        },
        {
          start: 58521882,
          end: 58521966,
          count: 0.1538
        },
        {
          start: 58521967,
          end: 58522101,
          count: 0.9231
        },
        {
          start: 58525078,
          end: 58525201,
          count: 0.9231
        },
        {
          start: 58525695,
          end: 58525781,
          count: 0.9231
        },
        {
          start: 58526220,
          end: 58526229,
          count: 0.9231
        },
        {
          start: 58526230,
          end: 58526313,
          count: 0.8462
        },
        {
          start: 58526682,
          end: 58526978,
          count: 0.6154
        },
        {
          start: 58527142,
          end: 58527144,
          count: 0.0769
        },
        {
          start: 58529115,
          end: 58529174,
          count: 0.2308
        },
        {
          start: 58531961,
          end: 58531963,
          count: 0.2308
        },
        {
          start: 58539112,
          end: 58539208,
          count: 0.1538
        },
        {
          start: 58540666,
          end: 58540673,
          count: 0.3077
        },
        {
          start: 58540674,
          end: 58540701,
          count: 0.0769
        },
        {
          start: 58541815,
          end: 58541921,
          count: 0.0769
        },
        {
          start: 58541922,
          end: 58541966,
          count: 0.1538
        },
        {
          start: 58542626,
          end: 58544186,
          count: 0.1538
        }
      ]
    },
    {
      symbol: 'TEX14',
      stable_id: 'ENSG00000121101.16',
      unversioned_stable_id: 'ENSG00000121101',
      biotype: 'protein_coding',
      name: {
        value: 'testis expressed 14, intercellular bridge forming factor',
        source: 'HGNC Symbol',
        accession: 'HGNC:11737',
        url: 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:11737'
      },
      start: 58556678,
      end: 58692055,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58556678,
            end: 58557047
          },
          {
            start: 58557799,
            end: 58557850
          },
          {
            start: 58559453,
            end: 58559562
          },
          {
            start: 58561520,
            end: 58561612
          },
          {
            start: 58564869,
            end: 58564968
          },
          {
            start: 58565747,
            end: 58565824
          },
          {
            start: 58569192,
            end: 58569260
          },
          {
            start: 58570385,
            end: 58570484
          },
          {
            start: 58571921,
            end: 58572126
          },
          {
            start: 58573181,
            end: 58573308
          },
          {
            start: 58574187,
            end: 58574249
          },
          {
            start: 58577375,
            end: 58577456
          },
          {
            start: 58579665,
            end: 58579731
          },
          {
            start: 58584500,
            end: 58584600
          },
          {
            start: 58585801,
            end: 58586082
          },
          {
            start: 58587581,
            end: 58587666
          },
          {
            start: 58587896,
            end: 58588021
          },
          {
            start: 58593555,
            end: 58593661
          },
          {
            start: 58598876,
            end: 58599666
          },
          {
            start: 58601806,
            end: 58601956
          },
          {
            start: 58602400,
            end: 58602590
          },
          {
            start: 58604978,
            end: 58605129
          },
          {
            start: 58611161,
            end: 58611339
          },
          {
            start: 58613421,
            end: 58613544
          },
          {
            start: 58615232,
            end: 58615345
          },
          {
            start: 58616175,
            end: 58616305
          },
          {
            start: 58617538,
            end: 58617619
          },
          {
            start: 58621650,
            end: 58621786
          },
          {
            start: 58622847,
            end: 58623012
          },
          {
            start: 58630440,
            end: 58630554
          },
          {
            start: 58651866,
            end: 58652002
          },
          {
            start: 58691939,
            end: 58692045
          }
        ],
        cds: [
          {
            start: 58557011,
            end: 58557047
          },
          {
            start: 58557799,
            end: 58557850
          },
          {
            start: 58559453,
            end: 58559562
          },
          {
            start: 58561520,
            end: 58561612
          },
          {
            start: 58564869,
            end: 58564968
          },
          {
            start: 58565747,
            end: 58565824
          },
          {
            start: 58569192,
            end: 58569260
          },
          {
            start: 58570385,
            end: 58570484
          },
          {
            start: 58571921,
            end: 58572126
          },
          {
            start: 58573181,
            end: 58573308
          },
          {
            start: 58574187,
            end: 58574249
          },
          {
            start: 58577375,
            end: 58577456
          },
          {
            start: 58579665,
            end: 58579731
          },
          {
            start: 58584500,
            end: 58584600
          },
          {
            start: 58585801,
            end: 58586082
          },
          {
            start: 58587581,
            end: 58587666
          },
          {
            start: 58587896,
            end: 58588021
          },
          {
            start: 58593555,
            end: 58593661
          },
          {
            start: 58598876,
            end: 58599666
          },
          {
            start: 58601806,
            end: 58601956
          },
          {
            start: 58602400,
            end: 58602590
          },
          {
            start: 58604978,
            end: 58605129
          },
          {
            start: 58611161,
            end: 58611339
          },
          {
            start: 58613421,
            end: 58613544
          },
          {
            start: 58615232,
            end: 58615345
          },
          {
            start: 58616175,
            end: 58616305
          },
          {
            start: 58617538,
            end: 58617619
          },
          {
            start: 58621650,
            end: 58621786
          },
          {
            start: 58622847,
            end: 58623012
          },
          {
            start: 58630440,
            end: 58630554
          },
          {
            start: 58651866,
            end: 58652001
          }
        ]
      },
      tss: [
        {
          position: 58692023
        },
        {
          position: 58692045
        },
        {
          position: 58692055
        }
      ],
      merged_exons: [
        {
          start: 58556678,
          end: 58557047
        },
        {
          start: 58557799,
          end: 58557850
        },
        {
          start: 58559453,
          end: 58559562
        },
        {
          start: 58561520,
          end: 58561612
        },
        {
          start: 58564869,
          end: 58564968
        },
        {
          start: 58565747,
          end: 58565824
        },
        {
          start: 58569192,
          end: 58569260
        },
        {
          start: 58570385,
          end: 58570484
        },
        {
          start: 58571921,
          end: 58572126
        },
        {
          start: 58573181,
          end: 58573308
        },
        {
          start: 58574187,
          end: 58574249
        },
        {
          start: 58577375,
          end: 58577456
        },
        {
          start: 58579665,
          end: 58579731
        },
        {
          start: 58581611,
          end: 58581730
        },
        {
          start: 58584500,
          end: 58584600
        },
        {
          start: 58585801,
          end: 58586082
        },
        {
          start: 58587581,
          end: 58587666
        },
        {
          start: 58587896,
          end: 58588021
        },
        {
          start: 58593555,
          end: 58593661
        },
        {
          start: 58598876,
          end: 58599666
        },
        {
          start: 58601806,
          end: 58601956
        },
        {
          start: 58602400,
          end: 58602590
        },
        {
          start: 58604978,
          end: 58605129
        },
        {
          start: 58611161,
          end: 58611339
        },
        {
          start: 58613421,
          end: 58613544
        },
        {
          start: 58615232,
          end: 58615345
        },
        {
          start: 58616175,
          end: 58616323
        },
        {
          start: 58617538,
          end: 58617619
        },
        {
          start: 58621650,
          end: 58621786
        },
        {
          start: 58622847,
          end: 58623012
        },
        {
          start: 58630440,
          end: 58630554
        },
        {
          start: 58651866,
          end: 58652002
        },
        {
          start: 58691939,
          end: 58692055
        }
      ],
      cds_counts: [
        {
          start: 58557011,
          end: 58557047,
          count: 1
        },
        {
          start: 58557799,
          end: 58557850,
          count: 1
        },
        {
          start: 58559453,
          end: 58559562,
          count: 1
        },
        {
          start: 58561520,
          end: 58561612,
          count: 1
        },
        {
          start: 58564869,
          end: 58564968,
          count: 1
        },
        {
          start: 58565747,
          end: 58565824,
          count: 1
        },
        {
          start: 58569192,
          end: 58569260,
          count: 1
        },
        {
          start: 58570385,
          end: 58570484,
          count: 1
        },
        {
          start: 58571921,
          end: 58572126,
          count: 1
        },
        {
          start: 58573181,
          end: 58573308,
          count: 1
        },
        {
          start: 58574187,
          end: 58574249,
          count: 1
        },
        {
          start: 58577375,
          end: 58577456,
          count: 1
        },
        {
          start: 58579665,
          end: 58579731,
          count: 1
        },
        {
          start: 58581611,
          end: 58581730,
          count: 0.6667
        },
        {
          start: 58584500,
          end: 58584600,
          count: 1
        },
        {
          start: 58585801,
          end: 58586082,
          count: 1
        },
        {
          start: 58587581,
          end: 58587666,
          count: 1
        },
        {
          start: 58587896,
          end: 58588021,
          count: 1
        },
        {
          start: 58593555,
          end: 58593661,
          count: 1
        },
        {
          start: 58598876,
          end: 58599666,
          count: 1
        },
        {
          start: 58601806,
          end: 58601956,
          count: 1
        },
        {
          start: 58602400,
          end: 58602590,
          count: 1
        },
        {
          start: 58604978,
          end: 58605129,
          count: 1
        },
        {
          start: 58611161,
          end: 58611339,
          count: 1
        },
        {
          start: 58613421,
          end: 58613544,
          count: 1
        },
        {
          start: 58615232,
          end: 58615345,
          count: 1
        },
        {
          start: 58616175,
          end: 58616305,
          count: 1
        },
        {
          start: 58616306,
          end: 58616323,
          count: 0.3333
        },
        {
          start: 58617538,
          end: 58617619,
          count: 1
        },
        {
          start: 58621650,
          end: 58621786,
          count: 1
        },
        {
          start: 58622847,
          end: 58623012,
          count: 1
        },
        {
          start: 58630440,
          end: 58630554,
          count: 1
        },
        {
          start: 58651866,
          end: 58652001,
          count: 1
        }
      ]
    },
    {
      stable_id: 'ENSG00000290039.2',
      unversioned_stable_id: 'ENSG00000290039',
      biotype: 'lncRNA',
      name: {
        value: 'novel transcript'
      },
      start: 58658901,
      end: 58659313,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58658901,
            end: 58659313
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 58659313
        }
      ],
      merged_exons: [
        {
          start: 58658901,
          end: 58659313
        }
      ],
      cds_counts: []
    },
    {
      symbol: 'IGBP1C',
      stable_id: 'ENSG00000266826.3',
      unversioned_stable_id: 'ENSG00000266826',
      biotype: 'protein_coding',
      name: {
        value: 'IGBP1 family member C',
        source: 'HGNC Symbol',
        accession: 'HGNC:43611',
        url: 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:43611'
      },
      start: 58660424,
      end: 58692045,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58660424,
            end: 58661829
          },
          {
            start: 58691939,
            end: 58692045
          }
        ],
        cds: [
          {
            start: 58660577,
            end: 58661599
          }
        ]
      },
      tss: [
        {
          position: 58692045
        }
      ],
      merged_exons: [
        {
          start: 58660424,
          end: 58661829
        },
        {
          start: 58691939,
          end: 58692045
        }
      ],
      cds_counts: [
        {
          start: 58660577,
          end: 58661599,
          count: 1
        }
      ]
    },
    {
      symbol: 'RAD51C',
      stable_id: 'ENSG00000108384.16',
      unversioned_stable_id: 'ENSG00000108384',
      biotype: 'protein_coding',
      name: {
        value: 'RAD51 paralog C',
        source: 'HGNC Symbol',
        accession: 'HGNC:9820',
        url: 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:9820'
      },
      start: 58692573,
      end: 58735611,
      strand: 'forward',
      representative_transcript: {
        exons: [
          {
            start: 58692602,
            end: 58692788
          },
          {
            start: 58694931,
            end: 58695189
          },
          {
            start: 58696693,
            end: 58696859
          },
          {
            start: 58703196,
            end: 58703329
          },
          {
            start: 58709859,
            end: 58709990
          },
          {
            start: 58720746,
            end: 58720812
          },
          {
            start: 58724040,
            end: 58724100
          },
          {
            start: 58732484,
            end: 58732544
          },
          {
            start: 58734118,
            end: 58735611
          }
        ],
        cds: [
          {
            start: 58692644,
            end: 58692788
          },
          {
            start: 58694931,
            end: 58695189
          },
          {
            start: 58696693,
            end: 58696859
          },
          {
            start: 58703196,
            end: 58703329
          },
          {
            start: 58709859,
            end: 58709990
          },
          {
            start: 58720746,
            end: 58720812
          },
          {
            start: 58724040,
            end: 58724100
          },
          {
            start: 58732484,
            end: 58732544
          },
          {
            start: 58734118,
            end: 58734222
          }
        ]
      },
      tss: [
        {
          position: 58692573
        },
        {
          position: 58692596
        },
        {
          position: 58692602
        },
        {
          position: 58692628
        },
        {
          position: 58692882
        }
      ],
      merged_exons: [
        {
          start: 58692573,
          end: 58692788
        },
        {
          start: 58692882,
          end: 58693118
        },
        {
          start: 58694931,
          end: 58695336
        },
        {
          start: 58696693,
          end: 58696859
        },
        {
          start: 58703196,
          end: 58703329
        },
        {
          start: 58709859,
          end: 58709990
        },
        {
          start: 58720746,
          end: 58720812
        },
        {
          start: 58724040,
          end: 58724100
        },
        {
          start: 58730186,
          end: 58730307
        },
        {
          start: 58732484,
          end: 58735611
        }
      ],
      cds_counts: [
        {
          start: 58692644,
          end: 58692788,
          count: 0.5714
        },
        {
          start: 58694931,
          end: 58695136,
          count: 0.5714
        },
        {
          start: 58695137,
          end: 58695189,
          count: 1
        },
        {
          start: 58695190,
          end: 58695193,
          count: 0.1429
        },
        {
          start: 58696693,
          end: 58696859,
          count: 0.8571
        },
        {
          start: 58703196,
          end: 58703329,
          count: 0.8571
        },
        {
          start: 58709859,
          end: 58709990,
          count: 0.8571
        },
        {
          start: 58720746,
          end: 58720812,
          count: 0.8571
        },
        {
          start: 58724040,
          end: 58724100,
          count: 0.7143
        },
        {
          start: 58730186,
          end: 58730307,
          count: 0.1429
        },
        {
          start: 58732484,
          end: 58732544,
          count: 0.7143
        },
        {
          start: 58732545,
          end: 58732559,
          count: 0.2857
        },
        {
          start: 58734118,
          end: 58734131,
          count: 0.5714
        },
        {
          start: 58734132,
          end: 58734181,
          count: 0.4286
        },
        {
          start: 58734182,
          end: 58734222,
          count: 0.2857
        }
      ]
    }
  ],
  regulatory_features: {
    feature_types: {
      promoter: {
        label: 'Promoter',
        track_index: 0,
        color: '#d90000'
      },
      open_chromatin_region: {
        label: 'Open chromatin',
        track_index: 0,
        color: '#b7c0c8'
      },
      emar: {
        label: 'EMAR',
        track_index: 1,
        color: '#004d40',
        description: 'Epigenetically-modified accessible region'
      },
      ctcf: {
        label: 'CTCF',
        track_index: 2,
        color: '#8ef4f8',
        description: 'CCCTC-binding factor'
      },
      enhancer: {
        label: 'Enhancer',
        track_index: 0,
        color: '#f8c041'
      }
    },
    data: [
      {
        id: 'ENSR00001754304',
        feature_type: 'emar',
        start: 58492433,
        end: 58492941,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754305',
        feature_type: 'emar',
        start: 58504880,
        end: 58505407,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_C7RQR',
        feature_type: 'enhancer',
        start: 58513306,
        end: 58514627,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754307',
        feature_type: 'emar',
        start: 58513306,
        end: 58515298,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T84D',
        feature_type: 'promoter',
        start: 58514628,
        end: 58515128,
        strand: 'independent',
        extended_start: 58514629,
        extended_end: 58515298,
        associated_genes: ['ENSG00000108389']
      },
      {
        id: 'ENSR17_C7RR2',
        feature_type: 'enhancer',
        start: 58516725,
        end: 58517840,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754310',
        feature_type: 'emar',
        start: 58516725,
        end: 58519978,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_BFLK7',
        feature_type: 'promoter',
        start: 58517841,
        end: 58518820,
        strand: 'independent',
        extended_start: 58517842,
        extended_end: 58518820,
        associated_genes: ['ENSG00000108389', 'ENSG00000264672']
      },
      {
        id: 'ENSR17_5HQLZQ',
        feature_type: 'ctcf',
        start: 58518225,
        end: 58518246,
        strand: 'forward',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HQM2T',
        feature_type: 'ctcf',
        start: 58518462,
        end: 58518483,
        strand: 'reverse',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HQM47',
        feature_type: 'ctcf',
        start: 58518756,
        end: 58518777,
        strand: 'reverse',
        associated_genes: []
      },
      {
        id: 'ENSR17_C7RR6',
        feature_type: 'enhancer',
        start: 58518821,
        end: 58519978,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754313',
        feature_type: 'emar',
        start: 58520576,
        end: 58521334,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HQMM8',
        feature_type: 'ctcf',
        start: 58521999,
        end: 58522020,
        strand: 'forward',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T87D',
        feature_type: 'promoter',
        start: 58525078,
        end: 58525511,
        strand: 'independent',
        extended_start: 58525079,
        extended_end: 58525511,
        associated_genes: ['ENSG00000264672']
      },
      {
        id: 'ENSR00001754314',
        feature_type: 'emar',
        start: 58525078,
        end: 58525743,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754315',
        feature_type: 'emar',
        start: 58527370,
        end: 58527698,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T883',
        feature_type: 'enhancer',
        start: 58527370,
        end: 58527698,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_83PGGF',
        feature_type: 'promoter',
        start: 58527971,
        end: 58528225,
        strand: 'independent',
        extended_start: 58527972,
        extended_end: 58528225,
        associated_genes: ['ENSG00000108387']
      },
      {
        id: 'ENSR00001754316',
        feature_type: 'emar',
        start: 58528021,
        end: 58528225,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HQNPZ',
        feature_type: 'ctcf',
        start: 58528427,
        end: 58528448,
        strand: 'reverse',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HQNX7',
        feature_type: 'ctcf',
        start: 58529554,
        end: 58529575,
        strand: 'forward',
        associated_genes: []
      },
      {
        id: 'ENSR17_BFLM5',
        feature_type: 'enhancer',
        start: 58531145,
        end: 58532035,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754318',
        feature_type: 'emar',
        start: 58531145,
        end: 58532918,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T89F',
        feature_type: 'promoter',
        start: 58532036,
        end: 58532544,
        strand: 'independent',
        extended_start: 58532037,
        extended_end: 58532918,
        associated_genes: ['ENSG00000108387']
      },
      {
        id: 'ENSR00001754321',
        feature_type: 'emar',
        start: 58534429,
        end: 58534789,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T8B4',
        feature_type: 'enhancer',
        start: 58534429,
        end: 58534789,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754323',
        feature_type: 'emar',
        start: 58534895,
        end: 58535790,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_BFLMM',
        feature_type: 'enhancer',
        start: 58534895,
        end: 58535790,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754325',
        feature_type: 'emar',
        start: 58539227,
        end: 58539335,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_75FXDR',
        feature_type: 'enhancer',
        start: 58539227,
        end: 58539335,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HQQSX',
        feature_type: 'ctcf',
        start: 58540731,
        end: 58540752,
        strand: 'reverse',
        associated_genes: []
      },
      {
        id: 'ENSR00001754326',
        feature_type: 'emar',
        start: 58541221,
        end: 58541563,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T8D3',
        feature_type: 'enhancer',
        start: 58541221,
        end: 58541563,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HQQZ5',
        feature_type: 'ctcf',
        start: 58541417,
        end: 58541438,
        strand: 'reverse',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HQR3G',
        feature_type: 'ctcf',
        start: 58541925,
        end: 58541946,
        strand: 'reverse',
        associated_genes: []
      },
      {
        id: 'ENSR00001754328',
        feature_type: 'emar',
        start: 58556821,
        end: 58557197,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T8JK',
        feature_type: 'enhancer',
        start: 58556821,
        end: 58557197,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754329',
        feature_type: 'emar',
        start: 58565670,
        end: 58566209,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754330',
        feature_type: 'emar',
        start: 58575495,
        end: 58575924,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T8PZ',
        feature_type: 'enhancer',
        start: 58575495,
        end: 58575924,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754332',
        feature_type: 'emar',
        start: 58577049,
        end: 58577289,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_83PHHS',
        feature_type: 'enhancer',
        start: 58577049,
        end: 58577289,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754334',
        feature_type: 'emar',
        start: 58577626,
        end: 58578099,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T8QL',
        feature_type: 'enhancer',
        start: 58577626,
        end: 58578099,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HR27J',
        feature_type: 'ctcf',
        start: 58577797,
        end: 58577818,
        strand: 'reverse',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HR3NB',
        feature_type: 'ctcf',
        start: 58586385,
        end: 58586406,
        strand: 'forward',
        associated_genes: []
      },
      {
        id: 'ENSR00001754335',
        feature_type: 'emar',
        start: 58587592,
        end: 58588156,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HR3WX',
        feature_type: 'ctcf',
        start: 58587821,
        end: 58587842,
        strand: 'reverse',
        associated_genes: []
      },
      {
        id: 'ENSR00001754337',
        feature_type: 'emar',
        start: 58595359,
        end: 58595743,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T8XP',
        feature_type: 'enhancer',
        start: 58595359,
        end: 58595743,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754338',
        feature_type: 'emar',
        start: 58615147,
        end: 58615338,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754339',
        feature_type: 'emar',
        start: 58620873,
        end: 58621551,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_BFM54',
        feature_type: 'enhancer',
        start: 58620873,
        end: 58621551,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754340',
        feature_type: 'emar',
        start: 58627024,
        end: 58627183,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_83PJKP',
        feature_type: 'enhancer',
        start: 58627024,
        end: 58627183,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754342',
        feature_type: 'emar',
        start: 58630750,
        end: 58633244,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_D4WJM',
        feature_type: 'enhancer',
        start: 58630750,
        end: 58633244,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HRCGB',
        feature_type: 'ctcf',
        start: 58631745,
        end: 58631766,
        strand: 'forward',
        associated_genes: []
      },
      {
        id: 'ENSR00001754343',
        feature_type: 'emar',
        start: 58643101,
        end: 58643505,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T9GJ',
        feature_type: 'enhancer',
        start: 58643101,
        end: 58643505,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_C7S68',
        feature_type: 'enhancer',
        start: 58657862,
        end: 58659302,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754345',
        feature_type: 'emar',
        start: 58657862,
        end: 58659980,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T9M8',
        feature_type: 'promoter',
        start: 58659303,
        end: 58659803,
        strand: 'independent',
        extended_start: 58659304,
        extended_end: 58659980,
        associated_genes: ['ENSG00000290039']
      },
      {
        id: 'ENSR00001754348',
        feature_type: 'emar',
        start: 58665170,
        end: 58665763,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_BFMCG',
        feature_type: 'enhancer',
        start: 58665170,
        end: 58665763,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754350',
        feature_type: 'emar',
        start: 58666198,
        end: 58667472,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_C7S6S',
        feature_type: 'enhancer',
        start: 58666198,
        end: 58667472,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HRKH3',
        feature_type: 'ctcf',
        start: 58666900,
        end: 58666921,
        strand: 'forward',
        associated_genes: []
      },
      {
        id: 'ENSR00001754352',
        feature_type: 'emar',
        start: 58667966,
        end: 58668947,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_BFMCW',
        feature_type: 'enhancer',
        start: 58667966,
        end: 58668947,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754354',
        feature_type: 'emar',
        start: 58669303,
        end: 58669569,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T9Q4',
        feature_type: 'enhancer',
        start: 58669303,
        end: 58669569,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754355',
        feature_type: 'emar',
        start: 58677183,
        end: 58677616,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_9T9SF',
        feature_type: 'enhancer',
        start: 58677183,
        end: 58677616,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754357',
        feature_type: 'emar',
        start: 58679023,
        end: 58680283,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_C7S7Q',
        feature_type: 'enhancer',
        start: 58679023,
        end: 58680283,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HRMLZ',
        feature_type: 'ctcf',
        start: 58679412,
        end: 58679433,
        strand: 'reverse',
        associated_genes: []
      },
      {
        id: 'ENSR17_83PKTG',
        feature_type: 'open_chromatin_region',
        start: 58687020,
        end: 58687268,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_5HRNZ3',
        feature_type: 'ctcf',
        start: 58687204,
        end: 58687225,
        strand: 'forward',
        associated_genes: []
      },
      {
        id: 'ENSR17_75G6XH',
        feature_type: 'enhancer',
        start: 58691907,
        end: 58692012,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR00001754358',
        feature_type: 'emar',
        start: 58691907,
        end: 58693621,
        strand: 'independent',
        associated_genes: []
      },
      {
        id: 'ENSR17_BFMHD',
        feature_type: 'promoter',
        start: 58692013,
        end: 58692892,
        strand: 'independent',
        extended_start: 58692014,
        extended_end: 58692892,
        associated_genes: [
          'ENSG00000121101',
          'ENSG00000266826',
          'ENSG00000108384'
        ]
      },
      {
        id: 'ENSR17_5HRPWW',
        feature_type: 'ctcf',
        start: 58692789,
        end: 58692810,
        strand: 'forward',
        associated_genes: []
      },
      {
        id: 'ENSR17_BFMHH',
        feature_type: 'enhancer',
        start: 58692893,
        end: 58693621,
        strand: 'independent',
        associated_genes: []
      }
    ]
  },
  motif_features: [
    {
      id: 'ENSM00000389160',
      binding_matrix_id: 'ENSPFM0211',
      transcription_factors: ['GATA1'],
      score: 7.7022004,
      start: 58492696,
      end: 58492702,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389161',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 10.249665,
      start: 58492792,
      end: 58492800,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389162',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.7516904,
      start: 58495862,
      end: 58495876,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389163',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.2046523,
      start: 58502668,
      end: 58502682,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389164',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.710515,
      start: 58502668,
      end: 58502682,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389165',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 11.067174,
      start: 58504544,
      end: 58504557,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389166',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 11.374428,
      start: 58504544,
      end: 58504557,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389167',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 1.9306463,
      start: 58504744,
      end: 58504757,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389168',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 9.480776,
      start: 58504754,
      end: 58504765,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389169',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 10.092871,
      start: 58505177,
      end: 58505190,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389170',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 3.5686402,
      start: 58507181,
      end: 58507196,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389171',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 2.8723,
      start: 58507182,
      end: 58507196,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389172',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.261441,
      start: 58507250,
      end: 58507259,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389173',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 10.414638,
      start: 58507307,
      end: 58507316,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389174',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.1769705,
      start: 58507307,
      end: 58507316,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389175',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 8.128984,
      start: 58507537,
      end: 58507545,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389176',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 3.7555304,
      start: 58507622,
      end: 58507636,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389177',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -3.9827836,
      start: 58509918,
      end: 58509940,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389178',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -4.4168453,
      start: 58509918,
      end: 58509940,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389179',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 4.7805,
      start: 58510398,
      end: 58510409,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389180',
      binding_matrix_id: 'ENSPFM0359',
      transcription_factors: ['LEF1'],
      score: 5.750445,
      start: 58514211,
      end: 58514225,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389181',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 5.4369254,
      start: 58514238,
      end: 58514249,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389182',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 6.9337554,
      start: 58514280,
      end: 58514290,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389183',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 7.2333665,
      start: 58514685,
      end: 58514695,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389184',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 10.526498,
      start: 58514706,
      end: 58514716,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389185',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 7.745034,
      start: 58514882,
      end: 58514892,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389186',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 7.554611,
      start: 58514888,
      end: 58514898,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389187',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 5.972001,
      start: 58517096,
      end: 58517109,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389188',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 8.855435,
      start: 58517096,
      end: 58517111,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389189',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.0069647,
      start: 58517621,
      end: 58517634,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389190',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.165816,
      start: 58517621,
      end: 58517634,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389191',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 8.474191,
      start: 58517628,
      end: 58517638,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389192',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 6.465348,
      start: 58517672,
      end: 58517682,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389193',
      binding_matrix_id: 'ENSPFM0485',
      transcription_factors: ['RUNX3'],
      score: 10.94535,
      start: 58517765,
      end: 58517782,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389194',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 7.943656,
      start: 58517774,
      end: 58517782,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389195',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.044867,
      start: 58517858,
      end: 58517867,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389196',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.8503113,
      start: 58517858,
      end: 58517869,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389197',
      binding_matrix_id: 'ENSPFM0088',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 9.606112,
      start: 58517858,
      end: 58517869,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389198',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 7.074923,
      start: 58517978,
      end: 58517988,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389199',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 6.619856,
      start: 58518208,
      end: 58518219,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389200',
      binding_matrix_id: 'ENSPFM0088',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.546231,
      start: 58518208,
      end: 58518219,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389201',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 11.464141,
      start: 58518210,
      end: 58518219,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389202',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.5714755,
      start: 58518227,
      end: 58518243,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389203',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 11.464141,
      start: 58518285,
      end: 58518294,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389204',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.4038806,
      start: 58518285,
      end: 58518296,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389205',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 6.276869,
      start: 58518299,
      end: 58518309,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389206',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -1.9148103,
      start: 58518368,
      end: 58518381,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389207',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -5.712427,
      start: 58518368,
      end: 58518381,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389208',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.3385959,
      start: 58518464,
      end: 58518480,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389209',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 7.8229227,
      start: 58518739,
      end: 58518747,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389210',
      binding_matrix_id: 'ENSPFM0484',
      transcription_factors: ['RUNX3'],
      score: 7.031388,
      start: 58518739,
      end: 58518754,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389211',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 6.7420053,
      start: 58518758,
      end: 58518774,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389212',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.8421423,
      start: 58520119,
      end: 58520133,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389213',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.7601388,
      start: 58522001,
      end: 58522017,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389214',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.3966885,
      start: 58525709,
      end: 58525718,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389215',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 5.8119073,
      start: 58527038,
      end: 58527051,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389216',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 9.09982,
      start: 58527867,
      end: 58527880,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389217',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.276132,
      start: 58528015,
      end: 58528022,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389218',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 5.970228,
      start: 58528293,
      end: 58528306,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389219',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.954294,
      start: 58528346,
      end: 58528358,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389220',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.4690104,
      start: 58528429,
      end: 58528445,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389221',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 8.741175,
      start: 58528490,
      end: 58528502,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389222',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -3.6265306,
      start: 58528494,
      end: 58528516,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389223',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -4.4056935,
      start: 58528494,
      end: 58528516,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389224',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 7.5810475,
      start: 58528496,
      end: 58528509,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389225',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.5898783,
      start: 58529556,
      end: 58529572,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389226',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 6.8572254,
      start: 58532213,
      end: 58532222,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389227',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 8.428824,
      start: 58535522,
      end: 58535535,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389228',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 4.7653923,
      start: 58535528,
      end: 58535542,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389229',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 5.211652,
      start: 58535643,
      end: 58535658,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389230',
      binding_matrix_id: 'ENSPFM0287',
      transcription_factors: ['HNF4A'],
      score: 5.3628187,
      start: 58535643,
      end: 58535658,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389231',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 6.351431,
      start: 58535929,
      end: 58535942,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389232',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.717172,
      start: 58540733,
      end: 58540749,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389233',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.1413295,
      start: 58541419,
      end: 58541435,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389234',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.8143585,
      start: 58541927,
      end: 58541943,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389235',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 9.442636,
      start: 58557071,
      end: 58557084,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389236',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 5.8931355,
      start: 58557120,
      end: 58557133,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389237',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.7359304,
      start: 58562447,
      end: 58562461,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389238',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58565652,
      end: 58565659,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389239',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.713442,
      start: 58565660,
      end: 58565672,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389240',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -2.1552703,
      start: 58566075,
      end: 58566097,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389241',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -2.4886987,
      start: 58566075,
      end: 58566097,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389242',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 8.833308,
      start: 58566854,
      end: 58566868,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389243',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.9279056,
      start: 58570877,
      end: 58570891,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389244',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.532413,
      start: 58574381,
      end: 58574393,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389245',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 13.48715,
      start: 58574452,
      end: 58574467,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389246',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 9.337754,
      start: 58574458,
      end: 58574470,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389247',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.814371,
      start: 58574460,
      end: 58574467,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389248',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 7.3468456,
      start: 58574460,
      end: 58574475,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389249',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.192363,
      start: 58574598,
      end: 58574612,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389250',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.532413,
      start: 58574699,
      end: 58574711,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389251',
      binding_matrix_id: 'ENSPFM0186',
      transcription_factors: ['FOXA1'],
      score: 10.688479,
      start: 58576592,
      end: 58576602,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389252',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 4.943099,
      start: 58576797,
      end: 58576811,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389253',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.591851,
      start: 58576804,
      end: 58576815,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389254',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 7.6448655,
      start: 58576864,
      end: 58576875,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389255',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.051752,
      start: 58576935,
      end: 58576944,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389256',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 11.309961,
      start: 58577799,
      end: 58577815,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389257',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 7.5252314,
      start: 58577883,
      end: 58577896,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389258',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 11.080643,
      start: 58577889,
      end: 58577902,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389259',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 11.080643,
      start: 58577895,
      end: 58577908,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389260',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 5.032469,
      start: 58578244,
      end: 58578258,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389261',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.317656,
      start: 58586387,
      end: 58586403,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389262',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 6.9343204,
      start: 58587823,
      end: 58587839,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389263',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 8.187751,
      start: 58587850,
      end: 58587863,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389264',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.192363,
      start: 58588373,
      end: 58588387,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389265',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.192363,
      start: 58590185,
      end: 58590199,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389266',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.4312286,
      start: 58592309,
      end: 58592323,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389267',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 5.9588,
      start: 58596107,
      end: 58596121,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389268',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.5728495,
      start: 58596242,
      end: 58596256,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389269',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 5.1927886,
      start: 58599044,
      end: 58599058,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389270',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 5.223101,
      start: 58601618,
      end: 58601632,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389271',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.4136794,
      start: 58603778,
      end: 58603792,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389272',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.6594353,
      start: 58608925,
      end: 58608939,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389273',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 5.612625,
      start: 58609950,
      end: 58609964,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389274',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.192363,
      start: 58610810,
      end: 58610824,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389275',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.192363,
      start: 58613746,
      end: 58613760,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389276',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 6.1196556,
      start: 58615058,
      end: 58615071,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389277',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 2.2486598,
      start: 58616127,
      end: 58616138,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389278',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 3.476467,
      start: 58616182,
      end: 58616197,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389279',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 3.041661,
      start: 58616237,
      end: 58616250,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389280',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -5.5957522,
      start: 58616390,
      end: 58616403,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389281',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.40084,
      start: 58617828,
      end: 58617840,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389282',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 5.0291185,
      start: 58617844,
      end: 58617859,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389283',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 5.9426665,
      start: 58617845,
      end: 58617858,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389284',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 6.205129,
      start: 58618338,
      end: 58618352,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389285',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.192363,
      start: 58620573,
      end: 58620587,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389286',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.8241844,
      start: 58620964,
      end: 58620978,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389287',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 7.8229227,
      start: 58621256,
      end: 58621264,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389288',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 7.8657184,
      start: 58621392,
      end: 58621400,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389289',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 7.1152487,
      start: 58621460,
      end: 58621475,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389290',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 6.611627,
      start: 58621461,
      end: 58621474,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389291',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 3.9709,
      start: 58621471,
      end: 58621486,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389292',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.192363,
      start: 58622370,
      end: 58622384,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389293',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 9.801279,
      start: 58622688,
      end: 58622697,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389294',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.8904448,
      start: 58624929,
      end: 58624942,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389295',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.192363,
      start: 58625820,
      end: 58625834,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389296',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.196933,
      start: 58626078,
      end: 58626087,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389297',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.4058602,
      start: 58626078,
      end: 58626092,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389298',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 5.594346,
      start: 58627060,
      end: 58627074,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389299',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.550375,
      start: 58629108,
      end: 58629120,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389300',
      binding_matrix_id: 'ENSPFM0484',
      transcription_factors: ['RUNX3'],
      score: 8.370568,
      start: 58631678,
      end: 58631693,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389301',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.472036,
      start: 58631747,
      end: 58631763,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389302',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 7.747151,
      start: 58631756,
      end: 58631764,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389303',
      binding_matrix_id: 'ENSPFM0365',
      transcription_factors: ['MAX'],
      score: 4.7205057,
      start: 58631847,
      end: 58631863,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389304',
      binding_matrix_id: 'ENSPFM0365',
      transcription_factors: ['MAX'],
      score: 4.7512746,
      start: 58631847,
      end: 58631863,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389305',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.82149,
      start: 58631881,
      end: 58631892,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389306',
      binding_matrix_id: 'ENSPFM0446',
      transcription_factors: ['POU2F2'],
      score: 10.269204,
      start: 58632030,
      end: 58632043,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389307',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 6.7122273,
      start: 58632081,
      end: 58632091,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389308',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: 0.3119158,
      start: 58632471,
      end: 58632486,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389309',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: 1.8551872,
      start: 58632471,
      end: 58632486,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389310',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 8.341658,
      start: 58632943,
      end: 58632952,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389311',
      binding_matrix_id: 'ENSPFM0487',
      transcription_factors: ['RXRA'],
      score: -4.122894,
      start: 58636569,
      end: 58636582,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389312',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 3.602211,
      start: 58636587,
      end: 58636601,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389313',
      binding_matrix_id: 'ENSPFM0001',
      transcription_factors: ['IRF5', 'IRF4'],
      score: -0.1326704,
      start: 58641030,
      end: 58641044,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389314',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.4136794,
      start: 58642607,
      end: 58642621,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389315',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.4751525,
      start: 58642984,
      end: 58642998,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389316',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.1879425,
      start: 58646744,
      end: 58646753,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389317',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 6.490929,
      start: 58647774,
      end: 58647788,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389318',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.343167,
      start: 58651470,
      end: 58651484,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389319',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.505703,
      start: 58652035,
      end: 58652049,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389320',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.626088,
      start: 58652454,
      end: 58652468,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389321',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 8.616051,
      start: 58655124,
      end: 58655138,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389322',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 9.001541,
      start: 58656299,
      end: 58656308,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389323',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 4.8453965,
      start: 58658029,
      end: 58658043,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389324',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 6.687095,
      start: 58658029,
      end: 58658043,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389325',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.051427,
      start: 58658681,
      end: 58658692,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389326',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.550526,
      start: 58658903,
      end: 58658915,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389327',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 7.459193,
      start: 58658934,
      end: 58658943,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389328',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 4.20086,
      start: 58659034,
      end: 58659049,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389329',
      binding_matrix_id: 'ENSPFM0487',
      transcription_factors: ['RXRA'],
      score: -0.83090264,
      start: 58659042,
      end: 58659055,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389330',
      binding_matrix_id: 'ENSPFM0487',
      transcription_factors: ['RXRA'],
      score: -2.3206992,
      start: 58659042,
      end: 58659055,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389331',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 9.175526,
      start: 58659049,
      end: 58659057,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389332',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 8.663631,
      start: 58659242,
      end: 58659252,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389333',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 1.9149826,
      start: 58659402,
      end: 58659415,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389334',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 7.4547434,
      start: 58659419,
      end: 58659427,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389335',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 2.812971,
      start: 58659436,
      end: 58659451,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389336',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 11.242437,
      start: 58659915,
      end: 58659930,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389337',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 9.589325,
      start: 58659920,
      end: 58659932,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389338',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58659923,
      end: 58659930,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389339',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 9.135112,
      start: 58661818,
      end: 58661832,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389340',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.503635,
      start: 58666902,
      end: 58666918,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389341',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 10.186948,
      start: 58666916,
      end: 58666929,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389342',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 10.208073,
      start: 58666916,
      end: 58666929,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389343',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 6.0846753,
      start: 58667299,
      end: 58667314,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389344',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: 0.16673684,
      start: 58667523,
      end: 58667545,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389345',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -1.1722803,
      start: 58667523,
      end: 58667545,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389346',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 9.589325,
      start: 58669134,
      end: 58669146,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389347',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58669136,
      end: 58669143,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389348',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 11.242437,
      start: 58669136,
      end: 58669151,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389349',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -3.756312,
      start: 58669480,
      end: 58669502,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389350',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -3.9707866,
      start: 58669480,
      end: 58669502,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389351',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.532967,
      start: 58669516,
      end: 58669528,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389352',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58669518,
      end: 58669525,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389353',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 8.566069,
      start: 58669518,
      end: 58669533,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389354',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.07103,
      start: 58672199,
      end: 58672212,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389355',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.517753,
      start: 58672199,
      end: 58672212,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389356',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 5.236222,
      start: 58672325,
      end: 58672339,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389357',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.532967,
      start: 58674452,
      end: 58674464,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389358',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58674454,
      end: 58674461,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389359',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 10.83681,
      start: 58674454,
      end: 58674469,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389360',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.7645648,
      start: 58675070,
      end: 58675084,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389361',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.9746478,
      start: 58675748,
      end: 58675762,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389362',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.9746478,
      start: 58677325,
      end: 58677339,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389363',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 10.233935,
      start: 58677580,
      end: 58677592,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389364',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 9.149268,
      start: 58677677,
      end: 58677690,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389365',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -0.039133195,
      start: 58677752,
      end: 58677767,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389366',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 6.412079,
      start: 58677756,
      end: 58677769,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389367',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 8.166991,
      start: 58677926,
      end: 58677941,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389368',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.579825,
      start: 58677932,
      end: 58677944,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389369',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58677934,
      end: 58677941,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389370',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 11.242437,
      start: 58677934,
      end: 58677949,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389371',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 8.031087,
      start: 58678889,
      end: 58678898,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389372',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 7.589742,
      start: 58678989,
      end: 58679000,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389373',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.5267687,
      start: 58679414,
      end: 58679430,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389374',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 2.5173018,
      start: 58679446,
      end: 58679459,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389375',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.055267,
      start: 58679562,
      end: 58679571,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389376',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 8.208615,
      start: 58679593,
      end: 58679601,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389377',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.276132,
      start: 58679601,
      end: 58679608,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389378',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.7005825,
      start: 58679604,
      end: 58679615,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389379',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 8.317968,
      start: 58679736,
      end: 58679747,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389380',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 3.9587214,
      start: 58679762,
      end: 58679777,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389381',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 2.9124007,
      start: 58680088,
      end: 58680099,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389382',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 4.6718245,
      start: 58680143,
      end: 58680158,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389383',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.729056,
      start: 58680153,
      end: 58680166,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389384',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.987185,
      start: 58682045,
      end: 58682052,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389385',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 10.949976,
      start: 58682053,
      end: 58682065,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389386',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.987185,
      start: 58682055,
      end: 58682062,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389387',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 8.453786,
      start: 58682476,
      end: 58682491,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389388',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 7.7260017,
      start: 58682481,
      end: 58682493,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389389',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.276132,
      start: 58682484,
      end: 58682491,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389390',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.233618,
      start: 58684916,
      end: 58684930,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389391',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.1490273,
      start: 58685608,
      end: 58685622,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389392',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 5.5681853,
      start: 58687206,
      end: 58687222,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389393',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.162692,
      start: 58688457,
      end: 58688468,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389394',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 11.041203,
      start: 58690223,
      end: 58690232,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389395',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.624297,
      start: 58690223,
      end: 58690232,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389396',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.5433404,
      start: 58691199,
      end: 58691213,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389397',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.018192,
      start: 58692227,
      end: 58692239,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389398',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 2.207549,
      start: 58692229,
      end: 58692240,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389399',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 10.377909,
      start: 58692481,
      end: 58692493,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389400',
      binding_matrix_id: 'ENSPFM0088',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.8238425,
      start: 58692555,
      end: 58692566,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389401',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 4.8538876,
      start: 58692555,
      end: 58692568,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389402',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.4829545,
      start: 58692555,
      end: 58692569,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389403',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -0.3382031,
      start: 58692568,
      end: 58692583,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389404',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -0.4646913,
      start: 58692568,
      end: 58692583,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389405',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.10528,
      start: 58692569,
      end: 58692582,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389406',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.1405735,
      start: 58692569,
      end: 58692582,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389407',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 4.9813046,
      start: 58692622,
      end: 58692637,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389408',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 2.2812932,
      start: 58692644,
      end: 58692655,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389409',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.646335,
      start: 58692791,
      end: 58692807,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389410',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.253289,
      start: 58693310,
      end: 58693319,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389411',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 5.9246793,
      start: 58693975,
      end: 58693988,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389412',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.407374,
      start: 58693975,
      end: 58693988,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389413',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 8.427023,
      start: 58694361,
      end: 58694375,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389414',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.5822244,
      start: 58695435,
      end: 58695444,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389415',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.387174,
      start: 58697258,
      end: 58697267,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389416',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.822435,
      start: 58697392,
      end: 58697404,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389417',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -0.2330559,
      start: 58697394,
      end: 58697409,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389418',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -0.7185879,
      start: 58697394,
      end: 58697409,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389419',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 6.9763494,
      start: 58697792,
      end: 58697806,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389420',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 7.3782597,
      start: 58698404,
      end: 58698419,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389421',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.720717,
      start: 58698409,
      end: 58698421,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389422',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58698412,
      end: 58698419,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389423',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 8.594984,
      start: 58698412,
      end: 58698427,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389424',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 11.242437,
      start: 58698547,
      end: 58698562,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389425',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 9.589325,
      start: 58698552,
      end: 58698564,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389426',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58698555,
      end: 58698562,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389427',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.192363,
      start: 58698846,
      end: 58698860,
      strand: 'forward'
    }
  ]
} as OverviewRegion;

export default regionOverview;
