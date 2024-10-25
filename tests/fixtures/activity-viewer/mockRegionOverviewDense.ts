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
      start: 58190566,
      end: 58699001
    }
  ],
  selected_gene_index: 3,
  genes: [
    {
      symbol: 'EPX',
      stable_id: 'ENSG00000121053.6',
      unversioned_stable_id: 'ENSG00000121053',
      biotype: 'protein_coding',
      start: 58192726,
      end: 58205174,
      strand: 'forward',
      representative_transcript: {
        exons: [
          {
            start: 58192726,
            end: 58192922
          },
          {
            start: 58193038,
            end: 58193131
          },
          {
            start: 58193371,
            end: 58193546
          },
          {
            start: 58193714,
            end: 58193831
          },
          {
            start: 58193963,
            end: 58194092
          },
          {
            start: 58194964,
            end: 58195170
          },
          {
            start: 58196939,
            end: 58197257
          },
          {
            start: 58199040,
            end: 58199200
          },
          {
            start: 58199539,
            end: 58199794
          },
          {
            start: 58200225,
            end: 58200395
          },
          {
            start: 58203081,
            end: 58203318
          },
          {
            start: 58204222,
            end: 58204434
          },
          {
            start: 58204736,
            end: 58205174
          }
        ],
        cds: [
          {
            start: 58192847,
            end: 58192922
          },
          {
            start: 58193038,
            end: 58193131
          },
          {
            start: 58193371,
            end: 58193546
          },
          {
            start: 58193714,
            end: 58193831
          },
          {
            start: 58193963,
            end: 58194092
          },
          {
            start: 58194964,
            end: 58195170
          },
          {
            start: 58196939,
            end: 58197257
          },
          {
            start: 58199040,
            end: 58199200
          },
          {
            start: 58199539,
            end: 58199794
          },
          {
            start: 58200225,
            end: 58200395
          },
          {
            start: 58203081,
            end: 58203318
          },
          {
            start: 58204222,
            end: 58204423
          }
        ]
      },
      tss: [
        {
          position: 58192726
        }
      ],
      merged_exons: [
        {
          start: 58192726,
          end: 58192922
        },
        {
          start: 58193038,
          end: 58193131
        },
        {
          start: 58193371,
          end: 58193546
        },
        {
          start: 58193714,
          end: 58193831
        },
        {
          start: 58193963,
          end: 58194092
        },
        {
          start: 58194964,
          end: 58195170
        },
        {
          start: 58196939,
          end: 58197257
        },
        {
          start: 58199040,
          end: 58199200
        },
        {
          start: 58199539,
          end: 58199794
        },
        {
          start: 58200225,
          end: 58200395
        },
        {
          start: 58203081,
          end: 58203318
        },
        {
          start: 58204222,
          end: 58204434
        },
        {
          start: 58204736,
          end: 58205174
        }
      ],
      cds_counts: [
        {
          start: 58192847,
          end: 58192922,
          count: 1
        },
        {
          start: 58193038,
          end: 58193131,
          count: 1
        },
        {
          start: 58193371,
          end: 58193546,
          count: 1
        },
        {
          start: 58193714,
          end: 58193831,
          count: 1
        },
        {
          start: 58193963,
          end: 58194092,
          count: 1
        },
        {
          start: 58194964,
          end: 58195170,
          count: 1
        },
        {
          start: 58196939,
          end: 58197257,
          count: 1
        },
        {
          start: 58199040,
          end: 58199200,
          count: 1
        },
        {
          start: 58199539,
          end: 58199794,
          count: 1
        },
        {
          start: 58200225,
          end: 58200395,
          count: 1
        },
        {
          start: 58203081,
          end: 58203318,
          count: 1
        },
        {
          start: 58204222,
          end: 58204423,
          count: 1
        }
      ]
    },
    {
      stable_id: 'ENSG00000278627.1',
      unversioned_stable_id: 'ENSG00000278627',
      biotype: 'lncRNA',
      start: 58202352,
      end: 58203003,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58202352,
            end: 58203003
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 58203003
        }
      ],
      merged_exons: [
        {
          start: 58202352,
          end: 58203003
        }
      ],
      cds_counts: []
    },
    {
      symbol: 'MKS1',
      stable_id: 'ENSG00000011143.19',
      unversioned_stable_id: 'ENSG00000011143',
      biotype: 'protein_coding',
      start: 58205441,
      end: 58219605,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58205441,
            end: 58206170
          },
          {
            start: 58206283,
            end: 58206380
          },
          {
            start: 58206465,
            end: 58206547
          },
          {
            start: 58207085,
            end: 58207218
          },
          {
            start: 58207894,
            end: 58208001
          },
          {
            start: 58208105,
            end: 58208174
          },
          {
            start: 58208513,
            end: 58208583
          },
          {
            start: 58210659,
            end: 58210724
          },
          {
            start: 58210980,
            end: 58211022
          },
          {
            start: 58212378,
            end: 58212434
          },
          {
            start: 58212982,
            end: 58213090
          },
          {
            start: 58213765,
            end: 58213869
          },
          {
            start: 58214259,
            end: 58214387
          },
          {
            start: 58214741,
            end: 58214838
          },
          {
            start: 58216088,
            end: 58216243
          },
          {
            start: 58216666,
            end: 58216736
          },
          {
            start: 58218620,
            end: 58218729
          },
          {
            start: 58219151,
            end: 58219255
          }
        ],
        cds: [
          {
            start: 58206079,
            end: 58206170
          },
          {
            start: 58206283,
            end: 58206380
          },
          {
            start: 58206465,
            end: 58206547
          },
          {
            start: 58207085,
            end: 58207218
          },
          {
            start: 58207894,
            end: 58208001
          },
          {
            start: 58208105,
            end: 58208174
          },
          {
            start: 58208513,
            end: 58208583
          },
          {
            start: 58210659,
            end: 58210724
          },
          {
            start: 58210980,
            end: 58211022
          },
          {
            start: 58212378,
            end: 58212434
          },
          {
            start: 58212982,
            end: 58213090
          },
          {
            start: 58213765,
            end: 58213869
          },
          {
            start: 58214259,
            end: 58214387
          },
          {
            start: 58214741,
            end: 58214838
          },
          {
            start: 58216088,
            end: 58216243
          },
          {
            start: 58216666,
            end: 58216736
          },
          {
            start: 58218620,
            end: 58218729
          },
          {
            start: 58219151,
            end: 58219230
          }
        ]
      },
      tss: [
        {
          position: 58219255
        },
        {
          position: 58219605
        }
      ],
      merged_exons: [
        {
          start: 58205441,
          end: 58206170
        },
        {
          start: 58206283,
          end: 58206380
        },
        {
          start: 58206465,
          end: 58206547
        },
        {
          start: 58207085,
          end: 58207218
        },
        {
          start: 58207561,
          end: 58208001
        },
        {
          start: 58208105,
          end: 58208174
        },
        {
          start: 58208513,
          end: 58208583
        },
        {
          start: 58208654,
          end: 58208893
        },
        {
          start: 58210659,
          end: 58210724
        },
        {
          start: 58210980,
          end: 58211022
        },
        {
          start: 58212378,
          end: 58212434
        },
        {
          start: 58212982,
          end: 58213090
        },
        {
          start: 58213765,
          end: 58213869
        },
        {
          start: 58214259,
          end: 58214387
        },
        {
          start: 58214741,
          end: 58214838
        },
        {
          start: 58215465,
          end: 58216243
        },
        {
          start: 58216666,
          end: 58216736
        },
        {
          start: 58218620,
          end: 58218729
        },
        {
          start: 58219151,
          end: 58219255
        },
        {
          start: 58219462,
          end: 58219605
        }
      ],
      cds_counts: [
        {
          start: 58205990,
          end: 58206078,
          count: 1
        },
        {
          start: 58206079,
          end: 58206170,
          count: 4
        },
        {
          start: 58206283,
          end: 58206380,
          count: 5
        },
        {
          start: 58206465,
          end: 58206547,
          count: 3
        },
        {
          start: 58207085,
          end: 58207218,
          count: 4
        },
        {
          start: 58207704,
          end: 58207729,
          count: 1
        },
        {
          start: 58207754,
          end: 58207893,
          count: 1
        },
        {
          start: 58207894,
          end: 58208001,
          count: 7
        },
        {
          start: 58208105,
          end: 58208174,
          count: 7
        },
        {
          start: 58208513,
          end: 58208583,
          count: 7
        },
        {
          start: 58208886,
          end: 58208893,
          count: 1
        },
        {
          start: 58210659,
          end: 58210724,
          count: 8
        },
        {
          start: 58210980,
          end: 58211022,
          count: 8
        },
        {
          start: 58212378,
          end: 58212434,
          count: 8
        },
        {
          start: 58212982,
          end: 58213090,
          count: 8
        },
        {
          start: 58213765,
          end: 58213869,
          count: 8
        },
        {
          start: 58214259,
          end: 58214387,
          count: 7
        },
        {
          start: 58214741,
          end: 58214826,
          count: 8
        },
        {
          start: 58214827,
          end: 58214838,
          count: 7
        },
        {
          start: 58216040,
          end: 58216087,
          count: 1
        },
        {
          start: 58216088,
          end: 58216243,
          count: 8
        },
        {
          start: 58216666,
          end: 58216736,
          count: 8
        },
        {
          start: 58218620,
          end: 58218729,
          count: 8
        },
        {
          start: 58219151,
          end: 58219230,
          count: 8
        }
      ]
    },
    {
      symbol: 'LPO',
      stable_id: 'ENSG00000167419.11',
      unversioned_stable_id: 'ENSG00000167419',
      biotype: 'protein_coding',
      start: 58218548,
      end: 58268518,
      strand: 'forward',
      representative_transcript: {
        exons: [
          {
            start: 58238584,
            end: 58238739
          },
          {
            start: 58242978,
            end: 58243055
          },
          {
            start: 58243994,
            end: 58244081
          },
          {
            start: 58247478,
            end: 58247638
          },
          {
            start: 58249060,
            end: 58249177
          },
          {
            start: 58249566,
            end: 58249695
          },
          {
            start: 58250415,
            end: 58250621
          },
          {
            start: 58252182,
            end: 58252506
          },
          {
            start: 58254811,
            end: 58254971
          },
          {
            start: 58264722,
            end: 58264974
          },
          {
            start: 58266153,
            end: 58266326
          },
          {
            start: 58267349,
            end: 58267586
          },
          {
            start: 58267787,
            end: 58268518
          }
        ],
        cds: [
          {
            start: 58242980,
            end: 58243055
          },
          {
            start: 58243994,
            end: 58244081
          },
          {
            start: 58247478,
            end: 58247638
          },
          {
            start: 58249060,
            end: 58249177
          },
          {
            start: 58249566,
            end: 58249695
          },
          {
            start: 58250415,
            end: 58250621
          },
          {
            start: 58252182,
            end: 58252506
          },
          {
            start: 58254811,
            end: 58254971
          },
          {
            start: 58264722,
            end: 58264974
          },
          {
            start: 58266153,
            end: 58266326
          },
          {
            start: 58267349,
            end: 58267586
          },
          {
            start: 58267787,
            end: 58267994
          }
        ]
      },
      tss: [
        {
          position: 58218548
        },
        {
          position: 58238426
        },
        {
          position: 58238584
        },
        {
          position: 58238591
        }
      ],
      merged_exons: [
        {
          start: 58218548,
          end: 58218817
        },
        {
          start: 58237737,
          end: 58237834
        },
        {
          start: 58238426,
          end: 58238739
        },
        {
          start: 58242978,
          end: 58243055
        },
        {
          start: 58243994,
          end: 58244081
        },
        {
          start: 58247478,
          end: 58247638
        },
        {
          start: 58249060,
          end: 58249177
        },
        {
          start: 58249566,
          end: 58249695
        },
        {
          start: 58250415,
          end: 58250621
        },
        {
          start: 58252182,
          end: 58252506
        },
        {
          start: 58254811,
          end: 58254971
        },
        {
          start: 58264722,
          end: 58264974
        },
        {
          start: 58266153,
          end: 58266326
        },
        {
          start: 58267349,
          end: 58267586
        },
        {
          start: 58267787,
          end: 58268518
        }
      ],
      cds_counts: [
        {
          start: 58242980,
          end: 58243055,
          count: 3
        },
        {
          start: 58243994,
          end: 58244081,
          count: 1
        },
        {
          start: 58247478,
          end: 58247490,
          count: 1
        },
        {
          start: 58247491,
          end: 58247638,
          count: 2
        },
        {
          start: 58249060,
          end: 58249177,
          count: 4
        },
        {
          start: 58249566,
          end: 58249695,
          count: 4
        },
        {
          start: 58250415,
          end: 58250621,
          count: 4
        },
        {
          start: 58252182,
          end: 58252506,
          count: 4
        },
        {
          start: 58254811,
          end: 58254971,
          count: 4
        },
        {
          start: 58264722,
          end: 58264974,
          count: 4
        },
        {
          start: 58266153,
          end: 58266326,
          count: 4
        },
        {
          start: 58267349,
          end: 58267586,
          count: 4
        },
        {
          start: 58267787,
          end: 58267994,
          count: 4
        }
      ]
    },
    {
      stable_id: 'ENSG00000287337.1',
      unversioned_stable_id: 'ENSG00000287337',
      biotype: 'lncRNA',
      start: 58219375,
      end: 58233479,
      strand: 'forward',
      representative_transcript: {
        exons: [
          {
            start: 58219375,
            end: 58220059
          },
          {
            start: 58232660,
            end: 58233479
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 58219375
        }
      ],
      merged_exons: [
        {
          start: 58219375,
          end: 58220059
        },
        {
          start: 58232660,
          end: 58233479
        }
      ],
      cds_counts: []
    },
    {
      stable_id: 'ENSG00000286788.1',
      unversioned_stable_id: 'ENSG00000286788',
      biotype: 'lncRNA',
      start: 58241164,
      end: 58247385,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58241164,
            end: 58244515
          },
          {
            start: 58245169,
            end: 58247385
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 58247385
        }
      ],
      merged_exons: [
        {
          start: 58241164,
          end: 58244515
        },
        {
          start: 58245169,
          end: 58247385
        }
      ],
      cds_counts: []
    },
    {
      symbol: 'MPO',
      stable_id: 'ENSG00000005381.9',
      unversioned_stable_id: 'ENSG00000005381',
      biotype: 'protein_coding',
      start: 58269855,
      end: 58280935,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58269855,
            end: 58270863
          },
          {
            start: 58271655,
            end: 58271892
          },
          {
            start: 58272748,
            end: 58272918
          },
          {
            start: 58273414,
            end: 58273669
          },
          {
            start: 58275542,
            end: 58275702
          },
          {
            start: 58277827,
            end: 58278145
          },
          {
            start: 58279008,
            end: 58279214
          },
          {
            start: 58279297,
            end: 58279426
          },
          {
            start: 58279523,
            end: 58279646
          },
          {
            start: 58279839,
            end: 58280014
          },
          {
            start: 58280366,
            end: 58280459
          },
          {
            start: 58280605,
            end: 58280935
          }
        ],
        cds: [
          {
            start: 58270656,
            end: 58270863
          },
          {
            start: 58271655,
            end: 58271892
          },
          {
            start: 58272748,
            end: 58272918
          },
          {
            start: 58273414,
            end: 58273669
          },
          {
            start: 58275542,
            end: 58275702
          },
          {
            start: 58277827,
            end: 58278145
          },
          {
            start: 58279008,
            end: 58279214
          },
          {
            start: 58279297,
            end: 58279426
          },
          {
            start: 58279523,
            end: 58279646
          },
          {
            start: 58279839,
            end: 58280014
          },
          {
            start: 58280366,
            end: 58280459
          },
          {
            start: 58280605,
            end: 58280758
          }
        ]
      },
      tss: [
        {
          position: 58280935
        }
      ],
      merged_exons: [
        {
          start: 58269855,
          end: 58270863
        },
        {
          start: 58271655,
          end: 58271892
        },
        {
          start: 58272748,
          end: 58272918
        },
        {
          start: 58273414,
          end: 58273669
        },
        {
          start: 58275542,
          end: 58275702
        },
        {
          start: 58277827,
          end: 58278145
        },
        {
          start: 58279008,
          end: 58279214
        },
        {
          start: 58279297,
          end: 58279426
        },
        {
          start: 58279523,
          end: 58279646
        },
        {
          start: 58279839,
          end: 58280014
        },
        {
          start: 58280366,
          end: 58280459
        },
        {
          start: 58280605,
          end: 58280935
        }
      ],
      cds_counts: [
        {
          start: 58270656,
          end: 58270863,
          count: 1
        },
        {
          start: 58271655,
          end: 58271892,
          count: 1
        },
        {
          start: 58272748,
          end: 58272918,
          count: 1
        },
        {
          start: 58273414,
          end: 58273669,
          count: 1
        },
        {
          start: 58275542,
          end: 58275702,
          count: 1
        },
        {
          start: 58277827,
          end: 58278145,
          count: 1
        },
        {
          start: 58279008,
          end: 58279214,
          count: 1
        },
        {
          start: 58279297,
          end: 58279426,
          count: 1
        },
        {
          start: 58279523,
          end: 58279646,
          count: 1
        },
        {
          start: 58279839,
          end: 58280014,
          count: 1
        },
        {
          start: 58280366,
          end: 58280459,
          count: 1
        },
        {
          start: 58280605,
          end: 58280758,
          count: 1
        }
      ]
    },
    {
      symbol: 'TSPOAP1',
      stable_id: 'ENSG00000005379.17',
      unversioned_stable_id: 'ENSG00000005379',
      biotype: 'protein_coding',
      start: 58301228,
      end: 58328795,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58301231,
            end: 58302447
          },
          {
            start: 58304338,
            end: 58304399
          },
          {
            start: 58305061,
            end: 58305171
          },
          {
            start: 58305387,
            end: 58305458
          },
          {
            start: 58305540,
            end: 58305643
          },
          {
            start: 58305833,
            end: 58305865
          },
          {
            start: 58306342,
            end: 58306413
          },
          {
            start: 58306800,
            end: 58306968
          },
          {
            start: 58307611,
            end: 58307762
          },
          {
            start: 58307842,
            end: 58307941
          },
          {
            start: 58308541,
            end: 58309380
          },
          {
            start: 58309967,
            end: 58310158
          },
          {
            start: 58310512,
            end: 58310751
          },
          {
            start: 58310836,
            end: 58311213
          },
          {
            start: 58311571,
            end: 58311722
          },
          {
            start: 58311892,
            end: 58312722
          },
          {
            start: 58316023,
            end: 58316132
          },
          {
            start: 58316425,
            end: 58316540
          },
          {
            start: 58318280,
            end: 58318452
          },
          {
            start: 58319090,
            end: 58319294
          },
          {
            start: 58320109,
            end: 58320129
          },
          {
            start: 58320531,
            end: 58320581
          },
          {
            start: 58322308,
            end: 58322412
          },
          {
            start: 58322654,
            end: 58322776
          },
          {
            start: 58322950,
            end: 58323039
          },
          {
            start: 58323298,
            end: 58323381
          },
          {
            start: 58323468,
            end: 58323545
          },
          {
            start: 58324811,
            end: 58325002
          },
          {
            start: 58325534,
            end: 58325713
          },
          {
            start: 58326293,
            end: 58326421
          },
          {
            start: 58326683,
            end: 58326790
          },
          {
            start: 58327588,
            end: 58328795
          }
        ],
        cds: [
          {
            start: 58304370,
            end: 58304399
          },
          {
            start: 58305061,
            end: 58305171
          },
          {
            start: 58305387,
            end: 58305458
          },
          {
            start: 58305540,
            end: 58305643
          },
          {
            start: 58305833,
            end: 58305865
          },
          {
            start: 58306342,
            end: 58306413
          },
          {
            start: 58306800,
            end: 58306968
          },
          {
            start: 58307611,
            end: 58307762
          },
          {
            start: 58307842,
            end: 58307941
          },
          {
            start: 58308541,
            end: 58309380
          },
          {
            start: 58309967,
            end: 58310158
          },
          {
            start: 58310512,
            end: 58310751
          },
          {
            start: 58310836,
            end: 58311213
          },
          {
            start: 58311571,
            end: 58311722
          },
          {
            start: 58311892,
            end: 58312722
          },
          {
            start: 58316023,
            end: 58316132
          },
          {
            start: 58316425,
            end: 58316540
          },
          {
            start: 58318280,
            end: 58318452
          },
          {
            start: 58319090,
            end: 58319294
          },
          {
            start: 58320109,
            end: 58320129
          },
          {
            start: 58320531,
            end: 58320581
          },
          {
            start: 58322308,
            end: 58322412
          },
          {
            start: 58322654,
            end: 58322776
          },
          {
            start: 58322950,
            end: 58323039
          },
          {
            start: 58323298,
            end: 58323381
          },
          {
            start: 58323468,
            end: 58323545
          },
          {
            start: 58324811,
            end: 58325002
          },
          {
            start: 58325534,
            end: 58325713
          },
          {
            start: 58326293,
            end: 58326421
          },
          {
            start: 58326683,
            end: 58326790
          },
          {
            start: 58327588,
            end: 58327920
          }
        ]
      },
      tss: [
        {
          position: 58328760
        },
        {
          position: 58328795
        }
      ],
      merged_exons: [
        {
          start: 58301231,
          end: 58302447
        },
        {
          start: 58304338,
          end: 58304399
        },
        {
          start: 58305061,
          end: 58305171
        },
        {
          start: 58305387,
          end: 58305458
        },
        {
          start: 58305540,
          end: 58305643
        },
        {
          start: 58305833,
          end: 58305865
        },
        {
          start: 58306342,
          end: 58306413
        },
        {
          start: 58306800,
          end: 58306968
        },
        {
          start: 58307611,
          end: 58307762
        },
        {
          start: 58307842,
          end: 58307941
        },
        {
          start: 58308541,
          end: 58309380
        },
        {
          start: 58309967,
          end: 58310158
        },
        {
          start: 58310512,
          end: 58310751
        },
        {
          start: 58310836,
          end: 58311213
        },
        {
          start: 58311571,
          end: 58311722
        },
        {
          start: 58311892,
          end: 58312722
        },
        {
          start: 58316023,
          end: 58316132
        },
        {
          start: 58316425,
          end: 58316540
        },
        {
          start: 58318280,
          end: 58318452
        },
        {
          start: 58319090,
          end: 58319294
        },
        {
          start: 58320109,
          end: 58320129
        },
        {
          start: 58320531,
          end: 58320581
        },
        {
          start: 58322308,
          end: 58322412
        },
        {
          start: 58322654,
          end: 58322776
        },
        {
          start: 58322950,
          end: 58323039
        },
        {
          start: 58323298,
          end: 58323381
        },
        {
          start: 58323468,
          end: 58323545
        },
        {
          start: 58324811,
          end: 58325002
        },
        {
          start: 58325534,
          end: 58325713
        },
        {
          start: 58326293,
          end: 58326421
        },
        {
          start: 58326683,
          end: 58326790
        },
        {
          start: 58327588,
          end: 58328795
        }
      ],
      cds_counts: [
        {
          start: 58304370,
          end: 58304399,
          count: 2
        },
        {
          start: 58305061,
          end: 58305171,
          count: 2
        },
        {
          start: 58305387,
          end: 58305458,
          count: 2
        },
        {
          start: 58305540,
          end: 58305643,
          count: 2
        },
        {
          start: 58305833,
          end: 58305865,
          count: 2
        },
        {
          start: 58306342,
          end: 58306413,
          count: 2
        },
        {
          start: 58306800,
          end: 58306968,
          count: 2
        },
        {
          start: 58307611,
          end: 58307762,
          count: 2
        },
        {
          start: 58307842,
          end: 58307941,
          count: 2
        },
        {
          start: 58308541,
          end: 58309380,
          count: 2
        },
        {
          start: 58309967,
          end: 58310158,
          count: 2
        },
        {
          start: 58310512,
          end: 58310751,
          count: 2
        },
        {
          start: 58310836,
          end: 58311213,
          count: 2
        },
        {
          start: 58311571,
          end: 58311722,
          count: 2
        },
        {
          start: 58311892,
          end: 58312722,
          count: 2
        },
        {
          start: 58316023,
          end: 58316132,
          count: 2
        },
        {
          start: 58316425,
          end: 58316540,
          count: 2
        },
        {
          start: 58318280,
          end: 58318452,
          count: 2
        },
        {
          start: 58319090,
          end: 58319294,
          count: 2
        },
        {
          start: 58320109,
          end: 58320129,
          count: 2
        },
        {
          start: 58320531,
          end: 58320581,
          count: 2
        },
        {
          start: 58322308,
          end: 58322412,
          count: 2
        },
        {
          start: 58322654,
          end: 58322776,
          count: 2
        },
        {
          start: 58322950,
          end: 58323039,
          count: 2
        },
        {
          start: 58323298,
          end: 58323381,
          count: 2
        },
        {
          start: 58323468,
          end: 58323545,
          count: 2
        },
        {
          start: 58324811,
          end: 58325002,
          count: 2
        },
        {
          start: 58325534,
          end: 58325713,
          count: 1
        },
        {
          start: 58326293,
          end: 58326421,
          count: 2
        },
        {
          start: 58326683,
          end: 58326790,
          count: 2
        },
        {
          start: 58327588,
          end: 58327920,
          count: 2
        }
      ]
    },
    {
      symbol: 'TSPOAP1-AS1',
      stable_id: 'ENSG00000265148.8',
      unversioned_stable_id: 'ENSG00000265148',
      biotype: 'lncRNA',
      start: 58324472,
      end: 58415766,
      strand: 'forward',
      representative_transcript: {
        exons: [
          {
            start: 58337246,
            end: 58337679
          },
          {
            start: 58394906,
            end: 58395010
          },
          {
            start: 58415466,
            end: 58415766
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 58324472
        },
        {
          position: 58325450
        },
        {
          position: 58325576
        },
        {
          position: 58328938
        },
        {
          position: 58337201
        },
        {
          position: 58337203
        },
        {
          position: 58337246
        },
        {
          position: 58337308
        },
        {
          position: 58337336
        },
        {
          position: 58337358
        }
      ],
      merged_exons: [
        {
          start: 58324472,
          end: 58324627
        },
        {
          start: 58325450,
          end: 58325728
        },
        {
          start: 58325919,
          end: 58326036
        },
        {
          start: 58328050,
          end: 58328121
        },
        {
          start: 58328938,
          end: 58329074
        },
        {
          start: 58337201,
          end: 58337679
        },
        {
          start: 58339243,
          end: 58339447
        },
        {
          start: 58346280,
          end: 58346343
        },
        {
          start: 58351735,
          end: 58351914
        },
        {
          start: 58351999,
          end: 58353719
        },
        {
          start: 58394906,
          end: 58395010
        },
        {
          start: 58415466,
          end: 58415766
        }
      ],
      cds_counts: []
    },
    {
      symbol: 'MIR142HG',
      stable_id: 'ENSG00000265206.7',
      unversioned_stable_id: 'ENSG00000265206',
      biotype: 'lncRNA',
      start: 58330879,
      end: 58332524,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58330879,
            end: 58331262
          },
          {
            start: 58332470,
            end: 58332524
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 58332520
        },
        {
          position: 58332521
        },
        {
          position: 58332523
        },
        {
          position: 58332524
        }
      ],
      merged_exons: [
        {
          start: 58330879,
          end: 58332523
        },
        {
          start: 58332470,
          end: 58332524
        }
      ],
      cds_counts: []
    },
    {
      stable_id: 'ENSG00000302963.1',
      unversioned_stable_id: 'ENSG00000302963',
      biotype: 'lncRNA',
      start: 58335121,
      end: 58336025,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58335121,
            end: 58336025
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 58336025
        }
      ],
      merged_exons: [
        {
          start: 58335121,
          end: 58336025
        }
      ],
      cds_counts: []
    },
    {
      symbol: 'SUPT4H1',
      stable_id: 'ENSG00000213246.7',
      unversioned_stable_id: 'ENSG00000213246',
      biotype: 'protein_coding',
      start: 58345175,
      end: 58353093,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58345178,
            end: 58346313
          },
          {
            start: 58347188,
            end: 58347241
          },
          {
            start: 58347529,
            end: 58347584
          },
          {
            start: 58351402,
            end: 58351508
          },
          {
            start: 58352067,
            end: 58352201
          }
        ],
        cds: [
          {
            start: 58346246,
            end: 58346313
          },
          {
            start: 58347188,
            end: 58347241
          },
          {
            start: 58347529,
            end: 58347584
          },
          {
            start: 58351402,
            end: 58351508
          },
          {
            start: 58352067,
            end: 58352135
          }
        ]
      },
      tss: [
        {
          position: 58351661
        },
        {
          position: 58352201
        },
        {
          position: 58352423
        },
        {
          position: 58353093
        }
      ],
      merged_exons: [
        {
          start: 58345178,
          end: 58346313
        },
        {
          start: 58347188,
          end: 58347241
        },
        {
          start: 58347529,
          end: 58347584
        },
        {
          start: 58351402,
          end: 58351661
        },
        {
          start: 58352065,
          end: 58352423
        },
        {
          start: 58352951,
          end: 58353093
        }
      ],
      cds_counts: [
        {
          start: 58346246,
          end: 58346313,
          count: 4
        },
        {
          start: 58347188,
          end: 58347241,
          count: 4
        },
        {
          start: 58347529,
          end: 58347584,
          count: 4
        },
        {
          start: 58351402,
          end: 58351454,
          count: 4
        },
        {
          start: 58351455,
          end: 58351508,
          count: 3
        },
        {
          start: 58351509,
          end: 58351550,
          count: 1
        },
        {
          start: 58352067,
          end: 58352135,
          count: 2
        }
      ]
    },
    {
      symbol: 'RNF43',
      stable_id: 'ENSG00000108375.13',
      unversioned_stable_id: 'ENSG00000108375',
      biotype: 'protein_coding',
      start: 58353676,
      end: 58417595,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58353676,
            end: 58354986
          },
          {
            start: 58357468,
            end: 58358823
          },
          {
            start: 58360149,
            end: 58360251
          },
          {
            start: 58360783,
            end: 58360944
          },
          {
            start: 58362544,
            end: 58362648
          },
          {
            start: 58363275,
            end: 58363406
          },
          {
            start: 58363526,
            end: 58363600
          },
          {
            start: 58370911,
            end: 58371033
          },
          {
            start: 58415326,
            end: 58415962
          },
          {
            start: 58417017,
            end: 58417534
          }
        ],
        cds: [
          {
            start: 58354943,
            end: 58354986
          },
          {
            start: 58357468,
            end: 58358823
          },
          {
            start: 58360149,
            end: 58360251
          },
          {
            start: 58360783,
            end: 58360944
          },
          {
            start: 58362544,
            end: 58362648
          },
          {
            start: 58363275,
            end: 58363406
          },
          {
            start: 58363526,
            end: 58363600
          },
          {
            start: 58370911,
            end: 58371033
          },
          {
            start: 58415326,
            end: 58415577
          }
        ]
      },
      tss: [
        {
          position: 58402721
        },
        {
          position: 58415641
        },
        {
          position: 58417085
        },
        {
          position: 58417533
        },
        {
          position: 58417534
        },
        {
          position: 58417582
        }
      ],
      merged_exons: [
        {
          start: 58353676,
          end: 58354986
        },
        {
          start: 58356983,
          end: 58358823
        },
        {
          start: 58360149,
          end: 58360251
        },
        {
          start: 58360783,
          end: 58360944
        },
        {
          start: 58362544,
          end: 58362648
        },
        {
          start: 58363275,
          end: 58363406
        },
        {
          start: 58363526,
          end: 58363600
        },
        {
          start: 58370911,
          end: 58371033
        },
        {
          start: 58402640,
          end: 58402721
        },
        {
          start: 58415326,
          end: 58417582
        }
      ],
      cds_counts: [
        {
          start: 58354943,
          end: 58354986,
          count: 5
        },
        {
          start: 58357166,
          end: 58357467,
          count: 1
        },
        {
          start: 58357468,
          end: 58358823,
          count: 6
        },
        {
          start: 58360149,
          end: 58360251,
          count: 6
        },
        {
          start: 58360783,
          end: 58360944,
          count: 6
        },
        {
          start: 58362544,
          end: 58362648,
          count: 6
        },
        {
          start: 58363275,
          end: 58363406,
          count: 6
        },
        {
          start: 58363526,
          end: 58363594,
          count: 6
        },
        {
          start: 58363595,
          end: 58363600,
          count: 4
        },
        {
          start: 58370911,
          end: 58371033,
          count: 3
        },
        {
          start: 58415326,
          end: 58415577,
          count: 4
        }
      ]
    },
    {
      symbol: 'HSF5',
      stable_id: 'ENSG00000176160.11',
      unversioned_stable_id: 'ENSG00000176160',
      biotype: 'protein_coding',
      start: 58420167,
      end: 58488408,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 58420167,
            end: 58422430
          },
          {
            start: 58458768,
            end: 58458945
          },
          {
            start: 58462782,
            end: 58463303
          },
          {
            start: 58466885,
            end: 58466979
          },
          {
            start: 58479893,
            end: 58480267
          },
          {
            start: 58487725,
            end: 58488408
          }
        ],
        cds: [
          {
            start: 58422360,
            end: 58422430
          },
          {
            start: 58458768,
            end: 58458945
          },
          {
            start: 58462782,
            end: 58463303
          },
          {
            start: 58466885,
            end: 58466979
          },
          {
            start: 58479893,
            end: 58480267
          },
          {
            start: 58487725,
            end: 58488274
          }
        ]
      },
      tss: [
        {
          position: 58488408
        }
      ],
      merged_exons: [
        {
          start: 58420167,
          end: 58422430
        },
        {
          start: 58458768,
          end: 58458945
        },
        {
          start: 58462782,
          end: 58463303
        },
        {
          start: 58466885,
          end: 58466979
        },
        {
          start: 58479893,
          end: 58480267
        },
        {
          start: 58487725,
          end: 58488408
        }
      ],
      cds_counts: [
        {
          start: 58422360,
          end: 58422430,
          count: 1
        },
        {
          start: 58458768,
          end: 58458945,
          count: 1
        },
        {
          start: 58462782,
          end: 58463303,
          count: 1
        },
        {
          start: 58466885,
          end: 58466979,
          count: 1
        },
        {
          start: 58479893,
          end: 58480267,
          count: 1
        },
        {
          start: 58487725,
          end: 58488274,
          count: 1
        }
      ]
    },
    {
      stable_id: 'ENSG00000299242.1',
      unversioned_stable_id: 'ENSG00000299242',
      biotype: 'lncRNA',
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
          count: 3
        },
        {
          start: 58492511,
          end: 58492599,
          count: 3
        },
        {
          start: 58492842,
          end: 58492952,
          count: 3
        },
        {
          start: 58494932,
          end: 58496330,
          count: 3
        },
        {
          start: 58503744,
          end: 58503898,
          count: 3
        },
        {
          start: 58504050,
          end: 58504220,
          count: 2
        },
        {
          start: 58504303,
          end: 58504488,
          count: 3
        },
        {
          start: 58504779,
          end: 58504974,
          count: 3
        },
        {
          start: 58505472,
          end: 58505583,
          count: 3
        },
        {
          start: 58506743,
          end: 58506871,
          count: 3
        },
        {
          start: 58507123,
          end: 58507319,
          count: 3
        },
        {
          start: 58508161,
          end: 58508274,
          count: 3
        },
        {
          start: 58508468,
          end: 58508564,
          count: 3
        },
        {
          start: 58508681,
          end: 58508841,
          count: 3
        },
        {
          start: 58511429,
          end: 58511511,
          count: 3
        },
        {
          start: 58512390,
          end: 58512506,
          count: 3
        },
        {
          start: 58512852,
          end: 58512941,
          count: 3
        },
        {
          start: 58514363,
          end: 58514407,
          count: 1
        },
        {
          start: 58516580,
          end: 58516582,
          count: 2
        }
      ]
    },
    {
      symbol: 'SEPTIN4',
      stable_id: 'ENSG00000108387.16',
      unversioned_stable_id: 'ENSG00000108387',
      biotype: 'protein_coding',
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
          count: 9
        },
        {
          start: 58520743,
          end: 58520770,
          count: 9
        },
        {
          start: 58520771,
          end: 58520789,
          count: 10
        },
        {
          start: 58520790,
          end: 58520842,
          count: 9
        },
        {
          start: 58520998,
          end: 58521160,
          count: 10
        },
        {
          start: 58521254,
          end: 58521350,
          count: 10
        },
        {
          start: 58521545,
          end: 58521646,
          count: 10
        },
        {
          start: 58521736,
          end: 58521853,
          count: 10
        },
        {
          start: 58521882,
          end: 58521966,
          count: 2
        },
        {
          start: 58521967,
          end: 58522101,
          count: 12
        },
        {
          start: 58525078,
          end: 58525201,
          count: 12
        },
        {
          start: 58525695,
          end: 58525781,
          count: 12
        },
        {
          start: 58526220,
          end: 58526229,
          count: 12
        },
        {
          start: 58526230,
          end: 58526313,
          count: 11
        },
        {
          start: 58526682,
          end: 58526978,
          count: 8
        },
        {
          start: 58527142,
          end: 58527144,
          count: 1
        },
        {
          start: 58529115,
          end: 58529174,
          count: 3
        },
        {
          start: 58531961,
          end: 58531963,
          count: 3
        },
        {
          start: 58539112,
          end: 58539208,
          count: 2
        },
        {
          start: 58540666,
          end: 58540673,
          count: 4
        },
        {
          start: 58540674,
          end: 58540701,
          count: 1
        },
        {
          start: 58541815,
          end: 58541921,
          count: 1
        },
        {
          start: 58541922,
          end: 58541966,
          count: 2
        },
        {
          start: 58542626,
          end: 58544186,
          count: 2
        }
      ]
    },
    {
      symbol: 'TEX14',
      stable_id: 'ENSG00000121101.16',
      unversioned_stable_id: 'ENSG00000121101',
      biotype: 'protein_coding',
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
          count: 3
        },
        {
          start: 58557799,
          end: 58557850,
          count: 3
        },
        {
          start: 58559453,
          end: 58559562,
          count: 3
        },
        {
          start: 58561520,
          end: 58561612,
          count: 3
        },
        {
          start: 58564869,
          end: 58564968,
          count: 3
        },
        {
          start: 58565747,
          end: 58565824,
          count: 3
        },
        {
          start: 58569192,
          end: 58569260,
          count: 3
        },
        {
          start: 58570385,
          end: 58570484,
          count: 3
        },
        {
          start: 58571921,
          end: 58572126,
          count: 3
        },
        {
          start: 58573181,
          end: 58573308,
          count: 3
        },
        {
          start: 58574187,
          end: 58574249,
          count: 3
        },
        {
          start: 58577375,
          end: 58577456,
          count: 3
        },
        {
          start: 58579665,
          end: 58579731,
          count: 3
        },
        {
          start: 58581611,
          end: 58581730,
          count: 2
        },
        {
          start: 58584500,
          end: 58584600,
          count: 3
        },
        {
          start: 58585801,
          end: 58586082,
          count: 3
        },
        {
          start: 58587581,
          end: 58587666,
          count: 3
        },
        {
          start: 58587896,
          end: 58588021,
          count: 3
        },
        {
          start: 58593555,
          end: 58593661,
          count: 3
        },
        {
          start: 58598876,
          end: 58599666,
          count: 3
        },
        {
          start: 58601806,
          end: 58601956,
          count: 3
        },
        {
          start: 58602400,
          end: 58602590,
          count: 3
        },
        {
          start: 58604978,
          end: 58605129,
          count: 3
        },
        {
          start: 58611161,
          end: 58611339,
          count: 3
        },
        {
          start: 58613421,
          end: 58613544,
          count: 3
        },
        {
          start: 58615232,
          end: 58615345,
          count: 3
        },
        {
          start: 58616175,
          end: 58616305,
          count: 3
        },
        {
          start: 58616306,
          end: 58616323,
          count: 1
        },
        {
          start: 58617538,
          end: 58617619,
          count: 3
        },
        {
          start: 58621650,
          end: 58621786,
          count: 3
        },
        {
          start: 58622847,
          end: 58623012,
          count: 3
        },
        {
          start: 58630440,
          end: 58630554,
          count: 3
        },
        {
          start: 58651866,
          end: 58652001,
          count: 3
        }
      ]
    },
    {
      stable_id: 'ENSG00000290039.2',
      unversioned_stable_id: 'ENSG00000290039',
      biotype: 'lncRNA',
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
          count: 4
        },
        {
          start: 58694931,
          end: 58695136,
          count: 4
        },
        {
          start: 58695137,
          end: 58695189,
          count: 7
        },
        {
          start: 58695190,
          end: 58695193,
          count: 1
        },
        {
          start: 58696693,
          end: 58696859,
          count: 6
        },
        {
          start: 58703196,
          end: 58703329,
          count: 6
        },
        {
          start: 58709859,
          end: 58709990,
          count: 6
        },
        {
          start: 58720746,
          end: 58720812,
          count: 6
        },
        {
          start: 58724040,
          end: 58724100,
          count: 5
        },
        {
          start: 58730186,
          end: 58730307,
          count: 1
        },
        {
          start: 58732484,
          end: 58732544,
          count: 5
        },
        {
          start: 58732545,
          end: 58732559,
          count: 2
        },
        {
          start: 58734118,
          end: 58734131,
          count: 4
        },
        {
          start: 58734132,
          end: 58734181,
          count: 3
        },
        {
          start: 58734182,
          end: 58734222,
          count: 2
        }
      ]
    }
  ],
  regulatory_features: {
    feature_types: {
      ctcf: {
        label: 'CTCF',
        track_index: 2,
        color: '#8ef4f8',
        description: 'CCCTC-binding factor'
      },
      promoter: {
        label: 'Promoter',
        track_index: 0,
        color: '#d90000'
      },
      enhancer: {
        label: 'Enhancer',
        track_index: 0,
        color: '#f8c041'
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
      }
    },
    data: [
      {
        id: 'ENSR17_5HNKDZ',
        feature_type: 'ctcf',
        start: 58194054,
        end: 58194075,
        strand: 'reverse'
      },
      {
        id: 'ENSR00001754233',
        feature_type: 'emar',
        start: 58199956,
        end: 58200533,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HNLGH',
        feature_type: 'ctcf',
        start: 58200214,
        end: 58200235,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_5HNNBX',
        feature_type: 'ctcf',
        start: 58211110,
        end: 58211131,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_83P7QQ',
        feature_type: 'open_chromatin_region',
        start: 58215776,
        end: 58216006,
        strand: 'independent'
      },
      {
        id: 'ENSR17_75FFMJ',
        feature_type: 'promoter',
        start: 58218437,
        end: 58218558,
        strand: 'independent',
        extended_start: 58218438,
        extended_end: 58218558
      },
      {
        id: 'ENSR17_83P7SP',
        feature_type: 'promoter',
        start: 58219220,
        end: 58219385,
        strand: 'independent',
        extended_start: 58219221,
        extended_end: 58219385
      },
      {
        id: 'ENSR17_83P7SS',
        feature_type: 'enhancer',
        start: 58219386,
        end: 58219594,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HNPR4',
        feature_type: 'ctcf',
        start: 58219572,
        end: 58219593,
        strand: 'forward'
      },
      {
        id: 'ENSR17_9T4X2',
        feature_type: 'promoter',
        start: 58219595,
        end: 58220095,
        strand: 'independent',
        extended_start: 58219596,
        extended_end: 58220189
      },
      {
        id: 'ENSR00001754238',
        feature_type: 'emar',
        start: 58224399,
        end: 58224712,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T4ZD',
        feature_type: 'enhancer',
        start: 58224399,
        end: 58224712,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754240',
        feature_type: 'emar',
        start: 58231725,
        end: 58231957,
        strand: 'independent'
      },
      {
        id: 'ENSR17_83P84Z',
        feature_type: 'enhancer',
        start: 58231725,
        end: 58231957,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFK2W',
        feature_type: 'enhancer',
        start: 58232629,
        end: 58233233,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754244',
        feature_type: 'emar',
        start: 58233647,
        end: 58233822,
        strand: 'independent'
      },
      {
        id: 'ENSR17_83P864',
        feature_type: 'enhancer',
        start: 58233647,
        end: 58233822,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754245',
        feature_type: 'emar',
        start: 58242306,
        end: 58242522,
        strand: 'independent'
      },
      {
        id: 'ENSR17_83P8C4',
        feature_type: 'enhancer',
        start: 58242306,
        end: 58242522,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HNTNS',
        feature_type: 'ctcf',
        start: 58242408,
        end: 58242429,
        strand: 'reverse'
      },
      {
        id: 'ENSR00001754246',
        feature_type: 'emar',
        start: 58249068,
        end: 58250447,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HNWZ7',
        feature_type: 'ctcf',
        start: 58249832,
        end: 58249853,
        strand: 'reverse'
      },
      {
        id: 'ENSR00001754248',
        feature_type: 'emar',
        start: 58254792,
        end: 58255147,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T5B6',
        feature_type: 'open_chromatin_region',
        start: 58254792,
        end: 58255147,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HNXT8',
        feature_type: 'ctcf',
        start: 58255024,
        end: 58255045,
        strand: 'forward'
      },
      {
        id: 'ENSR00001754249',
        feature_type: 'emar',
        start: 58270531,
        end: 58270780,
        strand: 'independent'
      },
      {
        id: 'ENSR17_83P94B',
        feature_type: 'enhancer',
        start: 58277212,
        end: 58277416,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HP4ND',
        feature_type: 'ctcf',
        start: 58277307,
        end: 58277328,
        strand: 'reverse'
      },
      {
        id: 'ENSR00001754251',
        feature_type: 'emar',
        start: 58278703,
        end: 58279748,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754252',
        feature_type: 'emar',
        start: 58281804,
        end: 58281980,
        strand: 'independent'
      },
      {
        id: 'ENSR17_83P96X',
        feature_type: 'enhancer',
        start: 58281804,
        end: 58281980,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754253',
        feature_type: 'emar',
        start: 58284626,
        end: 58285062,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T5LS',
        feature_type: 'enhancer',
        start: 58284626,
        end: 58285062,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754254',
        feature_type: 'emar',
        start: 58304008,
        end: 58305111,
        strand: 'independent'
      },
      {
        id: 'ENSR17_C7R7M',
        feature_type: 'enhancer',
        start: 58304008,
        end: 58305111,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HP9DM',
        feature_type: 'ctcf',
        start: 58304797,
        end: 58304818,
        strand: 'reverse'
      },
      {
        id: 'ENSR00001754255',
        feature_type: 'emar',
        start: 58308194,
        end: 58308751,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HPB2P',
        feature_type: 'ctcf',
        start: 58308485,
        end: 58308506,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_5HPBRS',
        feature_type: 'ctcf',
        start: 58313042,
        end: 58313063,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_9T5XQ',
        feature_type: 'open_chromatin_region',
        start: 58315521,
        end: 58315776,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HPCDN',
        feature_type: 'ctcf',
        start: 58316464,
        end: 58316485,
        strand: 'forward'
      },
      {
        id: 'ENSR17_5HPCDZ',
        feature_type: 'ctcf',
        start: 58316533,
        end: 58316554,
        strand: 'reverse'
      },
      {
        id: 'ENSR00001754256',
        feature_type: 'emar',
        start: 58317134,
        end: 58318245,
        strand: 'independent'
      },
      {
        id: 'ENSR17_C7R8K',
        feature_type: 'enhancer',
        start: 58317134,
        end: 58318245,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HPCKQ',
        feature_type: 'ctcf',
        start: 58317558,
        end: 58317579,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_9T638',
        feature_type: 'promoter',
        start: 58323982,
        end: 58324482,
        strand: 'independent',
        extended_start: 58323817,
        extended_end: 58324482
      },
      {
        id: 'ENSR17_BFKJ9',
        feature_type: 'promoter',
        start: 58324960,
        end: 58325586,
        strand: 'independent',
        extended_start: 58324484,
        extended_end: 58325586
      },
      {
        id: 'ENSR17_83PB75',
        feature_type: 'promoter',
        start: 58328750,
        end: 58328948,
        strand: 'independent',
        extended_start: 58328751,
        extended_end: 58328948
      },
      {
        id: 'ENSR17_9T65N',
        feature_type: 'promoter',
        start: 58332510,
        end: 58333014,
        strand: 'independent',
        extended_start: 58332511,
        extended_end: 58334014
      },
      {
        id: 'ENSR17_C7R9S',
        feature_type: 'enhancer',
        start: 58334015,
        end: 58336014,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T66P',
        feature_type: 'promoter',
        start: 58336015,
        end: 58336515,
        strand: 'independent',
        extended_start: 58336016,
        extended_end: 58336613
      },
      {
        id: 'ENSR17_BFKKZ',
        feature_type: 'promoter',
        start: 58336711,
        end: 58337368,
        strand: 'independent',
        extended_start: 58336615,
        extended_end: 58337368
      },
      {
        id: 'ENSR00001754262',
        feature_type: 'emar',
        start: 58342038,
        end: 58342656,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFKLP',
        feature_type: 'enhancer',
        start: 58342038,
        end: 58342656,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754264',
        feature_type: 'emar',
        start: 58343473,
        end: 58345205,
        strand: 'independent'
      },
      {
        id: 'ENSR17_C7RBH',
        feature_type: 'enhancer',
        start: 58343473,
        end: 58345205,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754265',
        feature_type: 'emar',
        start: 58351380,
        end: 58353717,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T6C8',
        feature_type: 'promoter',
        start: 58351651,
        end: 58352151,
        strand: 'independent',
        extended_start: 58351652,
        extended_end: 58352190
      },
      {
        id: 'ENSR17_BFKN7',
        feature_type: 'promoter',
        start: 58352191,
        end: 58352913,
        strand: 'independent',
        extended_start: 58352192,
        extended_end: 58353082
      },
      {
        id: 'ENSR17_9T6CM',
        feature_type: 'promoter',
        start: 58353083,
        end: 58353583,
        strand: 'independent',
        extended_start: 58353084,
        extended_end: 58353717
      },
      {
        id: 'ENSR17_BFKPZ',
        feature_type: 'enhancer',
        start: 58364428,
        end: 58365131,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754271',
        feature_type: 'emar',
        start: 58376532,
        end: 58376903,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T6LF',
        feature_type: 'enhancer',
        start: 58376532,
        end: 58376903,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754273',
        feature_type: 'emar',
        start: 58377234,
        end: 58377762,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFKRS',
        feature_type: 'enhancer',
        start: 58377234,
        end: 58377762,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754275',
        feature_type: 'emar',
        start: 58381225,
        end: 58381597,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T6MQ',
        feature_type: 'enhancer',
        start: 58381225,
        end: 58381597,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754277',
        feature_type: 'emar',
        start: 58382395,
        end: 58383065,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFKSK',
        feature_type: 'enhancer',
        start: 58382395,
        end: 58383065,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754279',
        feature_type: 'emar',
        start: 58383955,
        end: 58384323,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T6NK',
        feature_type: 'enhancer',
        start: 58383955,
        end: 58384323,
        strand: 'independent'
      },
      {
        id: 'ENSR17_C7RFN',
        feature_type: 'enhancer',
        start: 58387720,
        end: 58389072,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754283',
        feature_type: 'emar',
        start: 58390955,
        end: 58392188,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754284',
        feature_type: 'emar',
        start: 58394544,
        end: 58394826,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T6RL',
        feature_type: 'enhancer',
        start: 58394544,
        end: 58394826,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754286',
        feature_type: 'emar',
        start: 58400052,
        end: 58400348,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T6T7',
        feature_type: 'enhancer',
        start: 58400052,
        end: 58400348,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFKXF',
        feature_type: 'enhancer',
        start: 58402026,
        end: 58402710,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T6TZ',
        feature_type: 'promoter',
        start: 58402711,
        end: 58403016,
        strand: 'independent',
        extended_start: 58402712,
        extended_end: 58403016
      },
      {
        id: 'ENSR00001754290',
        feature_type: 'emar',
        start: 58403215,
        end: 58403936,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFKXK',
        feature_type: 'enhancer',
        start: 58403215,
        end: 58403936,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HPWPF',
        feature_type: 'ctcf',
        start: 58405832,
        end: 58405853,
        strand: 'forward'
      },
      {
        id: 'ENSR00001754291',
        feature_type: 'emar',
        start: 58411410,
        end: 58411739,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T6ZH',
        feature_type: 'enhancer',
        start: 58411410,
        end: 58411739,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754293',
        feature_type: 'emar',
        start: 58412881,
        end: 58413260,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T6ZX',
        feature_type: 'enhancer',
        start: 58412881,
        end: 58413260,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754295',
        feature_type: 'emar',
        start: 58413830,
        end: 58414005,
        strand: 'independent'
      },
      {
        id: 'ENSR17_83PD2C',
        feature_type: 'enhancer',
        start: 58413830,
        end: 58414005,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754297',
        feature_type: 'emar',
        start: 58414349,
        end: 58415074,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFL27',
        feature_type: 'enhancer',
        start: 58414349,
        end: 58415074,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754298',
        feature_type: 'emar',
        start: 58415193,
        end: 58416105,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T72P',
        feature_type: 'promoter',
        start: 58415631,
        end: 58416105,
        strand: 'independent',
        extended_start: 58415632,
        extended_end: 58416105
      },
      {
        id: 'ENSR17_5HPZKJ',
        feature_type: 'ctcf',
        start: 58416661,
        end: 58416682,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_9T733',
        feature_type: 'enhancer',
        start: 58416789,
        end: 58417074,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754301',
        feature_type: 'emar',
        start: 58416789,
        end: 58418235,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFL2L',
        feature_type: 'promoter',
        start: 58417075,
        end: 58418072,
        strand: 'independent',
        extended_start: 58417076,
        extended_end: 58418235
      },
      {
        id: 'ENSR00001754302',
        feature_type: 'emar',
        start: 58447045,
        end: 58447988,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFL6X',
        feature_type: 'enhancer',
        start: 58447045,
        end: 58447988,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HQ6W5',
        feature_type: 'ctcf',
        start: 58447674,
        end: 58447695,
        strand: 'forward'
      },
      {
        id: 'ENSR00001754303',
        feature_type: 'emar',
        start: 58487309,
        end: 58488435,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HQFQ7',
        feature_type: 'ctcf',
        start: 58487647,
        end: 58487668,
        strand: 'forward'
      },
      {
        id: 'ENSR17_5HQFRR',
        feature_type: 'ctcf',
        start: 58487992,
        end: 58488013,
        strand: 'forward'
      },
      {
        id: 'ENSR17_75FT7Z',
        feature_type: 'promoter',
        start: 58488398,
        end: 58488510,
        strand: 'independent',
        extended_start: 58488399,
        extended_end: 58488510
      },
      {
        id: 'ENSR00001754304',
        feature_type: 'emar',
        start: 58492433,
        end: 58492941,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754305',
        feature_type: 'emar',
        start: 58504880,
        end: 58505407,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754307',
        feature_type: 'emar',
        start: 58513306,
        end: 58515298,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T84D',
        feature_type: 'promoter',
        start: 58514628,
        end: 58515128,
        strand: 'independent',
        extended_start: 58514629,
        extended_end: 58515298
      },
      {
        id: 'ENSR17_C7RR2',
        feature_type: 'enhancer',
        start: 58516725,
        end: 58517840,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754310',
        feature_type: 'emar',
        start: 58516725,
        end: 58519978,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFLK7',
        feature_type: 'promoter',
        start: 58517841,
        end: 58518820,
        strand: 'independent',
        extended_start: 58517842,
        extended_end: 58518820
      },
      {
        id: 'ENSR17_5HQLZQ',
        feature_type: 'ctcf',
        start: 58518225,
        end: 58518246,
        strand: 'forward'
      },
      {
        id: 'ENSR17_5HQM2T',
        feature_type: 'ctcf',
        start: 58518462,
        end: 58518483,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_5HQM47',
        feature_type: 'ctcf',
        start: 58518756,
        end: 58518777,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_C7RR6',
        feature_type: 'enhancer',
        start: 58518821,
        end: 58519978,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754313',
        feature_type: 'emar',
        start: 58520576,
        end: 58521334,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HQMM8',
        feature_type: 'ctcf',
        start: 58521999,
        end: 58522020,
        strand: 'forward'
      },
      {
        id: 'ENSR17_9T87D',
        feature_type: 'promoter',
        start: 58525078,
        end: 58525511,
        strand: 'independent',
        extended_start: 58525079,
        extended_end: 58525511
      },
      {
        id: 'ENSR00001754314',
        feature_type: 'emar',
        start: 58525078,
        end: 58525743,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754315',
        feature_type: 'emar',
        start: 58527370,
        end: 58527698,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T883',
        feature_type: 'enhancer',
        start: 58527370,
        end: 58527698,
        strand: 'independent'
      },
      {
        id: 'ENSR17_83PGGF',
        feature_type: 'promoter',
        start: 58527971,
        end: 58528225,
        strand: 'independent',
        extended_start: 58527972,
        extended_end: 58528225
      },
      {
        id: 'ENSR17_5HQNPZ',
        feature_type: 'ctcf',
        start: 58528427,
        end: 58528448,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_5HQNX7',
        feature_type: 'ctcf',
        start: 58529554,
        end: 58529575,
        strand: 'forward'
      },
      {
        id: 'ENSR17_BFLM5',
        feature_type: 'enhancer',
        start: 58531145,
        end: 58532035,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754318',
        feature_type: 'emar',
        start: 58531145,
        end: 58532918,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T89F',
        feature_type: 'promoter',
        start: 58532036,
        end: 58532544,
        strand: 'independent',
        extended_start: 58532037,
        extended_end: 58532918
      },
      {
        id: 'ENSR00001754321',
        feature_type: 'emar',
        start: 58534429,
        end: 58534789,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T8B4',
        feature_type: 'enhancer',
        start: 58534429,
        end: 58534789,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754323',
        feature_type: 'emar',
        start: 58534895,
        end: 58535790,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFLMM',
        feature_type: 'enhancer',
        start: 58534895,
        end: 58535790,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754325',
        feature_type: 'emar',
        start: 58539227,
        end: 58539335,
        strand: 'independent'
      },
      {
        id: 'ENSR17_75FXDR',
        feature_type: 'enhancer',
        start: 58539227,
        end: 58539335,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HQQSX',
        feature_type: 'ctcf',
        start: 58540731,
        end: 58540752,
        strand: 'reverse'
      },
      {
        id: 'ENSR00001754326',
        feature_type: 'emar',
        start: 58541221,
        end: 58541563,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T8D3',
        feature_type: 'enhancer',
        start: 58541221,
        end: 58541563,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HQQZ5',
        feature_type: 'ctcf',
        start: 58541417,
        end: 58541438,
        strand: 'reverse'
      },
      {
        id: 'ENSR00001754328',
        feature_type: 'emar',
        start: 58556821,
        end: 58557197,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T8JK',
        feature_type: 'enhancer',
        start: 58556821,
        end: 58557197,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754329',
        feature_type: 'emar',
        start: 58565670,
        end: 58566209,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754330',
        feature_type: 'emar',
        start: 58575495,
        end: 58575924,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T8PZ',
        feature_type: 'enhancer',
        start: 58575495,
        end: 58575924,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754332',
        feature_type: 'emar',
        start: 58577049,
        end: 58577289,
        strand: 'independent'
      },
      {
        id: 'ENSR17_83PHHS',
        feature_type: 'enhancer',
        start: 58577049,
        end: 58577289,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754334',
        feature_type: 'emar',
        start: 58577626,
        end: 58578099,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T8QL',
        feature_type: 'enhancer',
        start: 58577626,
        end: 58578099,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HR27J',
        feature_type: 'ctcf',
        start: 58577797,
        end: 58577818,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_5HR3NB',
        feature_type: 'ctcf',
        start: 58586385,
        end: 58586406,
        strand: 'forward'
      },
      {
        id: 'ENSR00001754335',
        feature_type: 'emar',
        start: 58587592,
        end: 58588156,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HR3WX',
        feature_type: 'ctcf',
        start: 58587821,
        end: 58587842,
        strand: 'reverse'
      },
      {
        id: 'ENSR00001754337',
        feature_type: 'emar',
        start: 58595359,
        end: 58595743,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T8XP',
        feature_type: 'enhancer',
        start: 58595359,
        end: 58595743,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754338',
        feature_type: 'emar',
        start: 58615147,
        end: 58615338,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754339',
        feature_type: 'emar',
        start: 58620873,
        end: 58621551,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFM54',
        feature_type: 'enhancer',
        start: 58620873,
        end: 58621551,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754340',
        feature_type: 'emar',
        start: 58627024,
        end: 58627183,
        strand: 'independent'
      },
      {
        id: 'ENSR17_83PJKP',
        feature_type: 'enhancer',
        start: 58627024,
        end: 58627183,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754342',
        feature_type: 'emar',
        start: 58630750,
        end: 58633244,
        strand: 'independent'
      },
      {
        id: 'ENSR17_D4WJM',
        feature_type: 'enhancer',
        start: 58630750,
        end: 58633244,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HRCGB',
        feature_type: 'ctcf',
        start: 58631745,
        end: 58631766,
        strand: 'forward'
      },
      {
        id: 'ENSR00001754343',
        feature_type: 'emar',
        start: 58643101,
        end: 58643505,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T9GJ',
        feature_type: 'enhancer',
        start: 58643101,
        end: 58643505,
        strand: 'independent'
      },
      {
        id: 'ENSR17_C7S68',
        feature_type: 'enhancer',
        start: 58657862,
        end: 58659302,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754345',
        feature_type: 'emar',
        start: 58657862,
        end: 58659980,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T9M8',
        feature_type: 'promoter',
        start: 58659303,
        end: 58659803,
        strand: 'independent',
        extended_start: 58659304,
        extended_end: 58659980
      },
      {
        id: 'ENSR00001754348',
        feature_type: 'emar',
        start: 58665170,
        end: 58665763,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFMCG',
        feature_type: 'enhancer',
        start: 58665170,
        end: 58665763,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754350',
        feature_type: 'emar',
        start: 58666198,
        end: 58667472,
        strand: 'independent'
      },
      {
        id: 'ENSR17_C7S6S',
        feature_type: 'enhancer',
        start: 58666198,
        end: 58667472,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HRKH3',
        feature_type: 'ctcf',
        start: 58666900,
        end: 58666921,
        strand: 'forward'
      },
      {
        id: 'ENSR00001754352',
        feature_type: 'emar',
        start: 58667966,
        end: 58668947,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFMCW',
        feature_type: 'enhancer',
        start: 58667966,
        end: 58668947,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754354',
        feature_type: 'emar',
        start: 58669303,
        end: 58669569,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T9Q4',
        feature_type: 'enhancer',
        start: 58669303,
        end: 58669569,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754355',
        feature_type: 'emar',
        start: 58677183,
        end: 58677616,
        strand: 'independent'
      },
      {
        id: 'ENSR17_9T9SF',
        feature_type: 'enhancer',
        start: 58677183,
        end: 58677616,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754357',
        feature_type: 'emar',
        start: 58679023,
        end: 58680283,
        strand: 'independent'
      },
      {
        id: 'ENSR17_C7S7Q',
        feature_type: 'enhancer',
        start: 58679023,
        end: 58680283,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HRMLZ',
        feature_type: 'ctcf',
        start: 58679412,
        end: 58679433,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_5HRNZ3',
        feature_type: 'ctcf',
        start: 58687204,
        end: 58687225,
        strand: 'forward'
      },
      {
        id: 'ENSR17_75G6XH',
        feature_type: 'enhancer',
        start: 58691907,
        end: 58692012,
        strand: 'independent'
      },
      {
        id: 'ENSR17_BFMHD',
        feature_type: 'promoter',
        start: 58692013,
        end: 58692892,
        strand: 'independent',
        extended_start: 58692014,
        extended_end: 58692892
      },
      {
        id: 'ENSR17_5HRPWW',
        feature_type: 'ctcf',
        start: 58692789,
        end: 58692810,
        strand: 'forward'
      },
      {
        id: 'ENSR17_BFMHH',
        feature_type: 'enhancer',
        start: 58692893,
        end: 58693621,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754232',
        feature_type: 'emar',
        start: 58193987,
        end: 58194143,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754242',
        feature_type: 'emar',
        start: 58232629,
        end: 58233233,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754250',
        feature_type: 'emar',
        start: 58277212,
        end: 58277416,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754257',
        feature_type: 'emar',
        start: 58323816,
        end: 58340481,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754269',
        feature_type: 'emar',
        start: 58364428,
        end: 58365131,
        strand: 'independent'
      },
      {
        id: 'ENSR17_C7RFX',
        feature_type: 'enhancer',
        start: 58390955,
        end: 58392188,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754287',
        feature_type: 'emar',
        start: 58402026,
        end: 58403016,
        strand: 'independent'
      },
      {
        id: 'ENSR17_C7RQR',
        feature_type: 'enhancer',
        start: 58513306,
        end: 58514627,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754316',
        feature_type: 'emar',
        start: 58528021,
        end: 58528225,
        strand: 'independent'
      },
      {
        id: 'ENSR17_5HQR3G',
        feature_type: 'ctcf',
        start: 58541925,
        end: 58541946,
        strand: 'reverse'
      },
      {
        id: 'ENSR17_83PKTG',
        feature_type: 'open_chromatin_region',
        start: 58687020,
        end: 58687268,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754358',
        feature_type: 'emar',
        start: 58691907,
        end: 58693621,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754235',
        feature_type: 'emar',
        start: 58218437,
        end: 58220189,
        strand: 'independent'
      },
      {
        id: 'ENSR00001754281',
        feature_type: 'emar',
        start: 58387720,
        end: 58389072,
        strand: 'independent'
      }
    ]
  },
  motif_features: [
    {
      id: 'ENSM00000388877',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 6.4512463,
      start: 58194056,
      end: 58194072,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388878',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 10.489159,
      start: 58200216,
      end: 58200232,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388879',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 3.2943368,
      start: 58203977,
      end: 58203992,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388880',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 6.325453,
      start: 58203977,
      end: 58203992,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388881',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 6.725776,
      start: 58211112,
      end: 58211128,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388882',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 11.616628,
      start: 58211670,
      end: 58211684,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388883',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 12.298468,
      start: 58211670,
      end: 58211684,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388884',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 7.7346735,
      start: 58211677,
      end: 58211688,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388885',
      binding_matrix_id: 'ENSPFM0614',
      transcription_factors: ['YY1'],
      score: 8.83752,
      start: 58219222,
      end: 58219232,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388886',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -2.8434324,
      start: 58219229,
      end: 58219242,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388887',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -8.548538,
      start: 58219229,
      end: 58219242,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388888',
      binding_matrix_id: 'ENSPFM0473',
      transcription_factors: ['RFX5'],
      score: 7.407455,
      start: 58219275,
      end: 58219290,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388889',
      binding_matrix_id: 'ENSPFM0473',
      transcription_factors: ['RFX5'],
      score: 7.672559,
      start: 58219275,
      end: 58219290,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388890',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 2.8876848,
      start: 58219436,
      end: 58219451,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388891',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 5.537239,
      start: 58219574,
      end: 58219590,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388892',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.6861234,
      start: 58219617,
      end: 58219629,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388893',
      binding_matrix_id: 'ENSPFM0024',
      transcription_factors: ['USF1', 'SREBF2'],
      score: 10.111977,
      start: 58230859,
      end: 58230868,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388894',
      binding_matrix_id: 'ENSPFM0024',
      transcription_factors: ['USF1', 'SREBF2'],
      score: 10.126095,
      start: 58230859,
      end: 58230868,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388895',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 10.072672,
      start: 58231018,
      end: 58231027,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388896',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -4.740052,
      start: 58232112,
      end: 58232134,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388897',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -4.886917,
      start: 58232112,
      end: 58232134,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388898',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 5.9333873,
      start: 58232818,
      end: 58232833,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388899',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 5.278541,
      start: 58232949,
      end: 58232962,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388900',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 5.3575244,
      start: 58232949,
      end: 58232962,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388901',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 1.7855575,
      start: 58233051,
      end: 58233064,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388902',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 5.1603537,
      start: 58233111,
      end: 58233126,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388903',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.938309,
      start: 58233185,
      end: 58233198,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388904',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 8.013604,
      start: 58233185,
      end: 58233198,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388905',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -4.740052,
      start: 58233923,
      end: 58233945,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388906',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -4.886917,
      start: 58233923,
      end: 58233945,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388907',
      binding_matrix_id: 'ENSPFM0211',
      transcription_factors: ['GATA1'],
      score: 7.7022004,
      start: 58236562,
      end: 58236568,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388908',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.053007,
      start: 58242410,
      end: 58242426,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388909',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 1.5254422,
      start: 58247992,
      end: 58248005,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388910',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 8.958564,
      start: 58249834,
      end: 58249850,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388911',
      binding_matrix_id: 'ENSPFM0365',
      transcription_factors: ['MAX'],
      score: 11.629716,
      start: 58249875,
      end: 58249891,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388912',
      binding_matrix_id: 'ENSPFM0365',
      transcription_factors: ['MAX'],
      score: 11.788979,
      start: 58249875,
      end: 58249891,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388913',
      binding_matrix_id: 'ENSPFM0287',
      transcription_factors: ['HNF4A'],
      score: 3.7658293,
      start: 58250366,
      end: 58250381,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388914',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 14.373947,
      start: 58250522,
      end: 58250537,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388915',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 4.303367,
      start: 58250523,
      end: 58250537,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388916',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 7.5402136,
      start: 58250524,
      end: 58250537,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388917',
      binding_matrix_id: 'ENSPFM0024',
      transcription_factors: ['USF1', 'SREBF2'],
      score: 7.866462,
      start: 58250746,
      end: 58250755,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388918',
      binding_matrix_id: 'ENSPFM0024',
      transcription_factors: ['USF1', 'SREBF2'],
      score: 7.902861,
      start: 58250746,
      end: 58250755,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388919',
      binding_matrix_id: 'ENSPFM0507',
      transcription_factors: ['SREBF2'],
      score: 6.0365634,
      start: 58250795,
      end: 58250806,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388920',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.317261,
      start: 58253259,
      end: 58253272,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388921',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.4320436,
      start: 58253259,
      end: 58253272,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388922',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 6.049384,
      start: 58255026,
      end: 58255042,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388923',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.297276,
      start: 58270688,
      end: 58270699,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388924',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.1879425,
      start: 58270690,
      end: 58270699,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388925',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.2717679,
      start: 58272556,
      end: 58272570,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388926',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 9.167964,
      start: 58273579,
      end: 58273587,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388927',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.145333,
      start: 58277309,
      end: 58277325,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388928',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 5.0896335,
      start: 58288274,
      end: 58288289,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388929',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 7.4929547,
      start: 58290064,
      end: 58290078,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388930',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.023213,
      start: 58290071,
      end: 58290082,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388931',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 8.32329,
      start: 58304510,
      end: 58304522,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388932',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.1765854,
      start: 58304799,
      end: 58304815,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388933',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 8.687828,
      start: 58308487,
      end: 58308503,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388934',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 6.7062364,
      start: 58313044,
      end: 58313060,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388935',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: 4.6158586,
      start: 58313849,
      end: 58313862,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388936',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: 4.773121,
      start: 58313849,
      end: 58313862,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388937',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.358096,
      start: 58316466,
      end: 58316482,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388938',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.273475,
      start: 58316535,
      end: 58316551,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388939',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.9982624,
      start: 58317560,
      end: 58317576,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388940',
      binding_matrix_id: 'ENSPFM0484',
      transcription_factors: ['RUNX3'],
      score: 10.160817,
      start: 58317654,
      end: 58317669,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388941',
      binding_matrix_id: 'ENSPFM0351',
      transcription_factors: ['IRF3'],
      score: 7.461352,
      start: 58317846,
      end: 58317866,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388942',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -6.5134096,
      start: 58324081,
      end: 58324094,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388943',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 7.6180615,
      start: 58324784,
      end: 58324793,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388944',
      binding_matrix_id: 'ENSPFM0446',
      transcription_factors: ['POU2F2'],
      score: 9.942792,
      start: 58325447,
      end: 58325460,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388945',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.6375544,
      start: 58326366,
      end: 58326380,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388946',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 6.8011026,
      start: 58327225,
      end: 58327234,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388947',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 7.343908,
      start: 58327368,
      end: 58327380,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388948',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 8.250774,
      start: 58327370,
      end: 58327385,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388949',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 6.807279,
      start: 58327480,
      end: 58327489,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388950',
      binding_matrix_id: 'ENSPFM0088',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 8.532318,
      start: 58327603,
      end: 58327614,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388951',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 4.147572,
      start: 58327603,
      end: 58327616,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388952',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 5.1715384,
      start: 58328850,
      end: 58328863,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388953',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.620899,
      start: 58329005,
      end: 58329017,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388954',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 10.58335,
      start: 58329015,
      end: 58329027,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388955',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 4.4364347,
      start: 58329270,
      end: 58329281,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388956',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 4.220921,
      start: 58329393,
      end: 58329404,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388957',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 5.983669,
      start: 58329514,
      end: 58329527,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388958',
      binding_matrix_id: 'ENSPFM0427',
      transcription_factors: ['NRF1'],
      score: 12.5216,
      start: 58329784,
      end: 58329795,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388959',
      binding_matrix_id: 'ENSPFM0427',
      transcription_factors: ['NRF1'],
      score: 12.777228,
      start: 58329784,
      end: 58329795,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388960',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 9.904549,
      start: 58329888,
      end: 58329896,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388961',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 7.8865967,
      start: 58330048,
      end: 58330059,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388962',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.819458,
      start: 58330095,
      end: 58330104,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388963',
      binding_matrix_id: 'ENSPFM0447',
      transcription_factors: ['POU2F2'],
      score: 9.4579525,
      start: 58330127,
      end: 58330140,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388964',
      binding_matrix_id: 'ENSPFM0447',
      transcription_factors: ['POU2F2'],
      score: 9.504649,
      start: 58330127,
      end: 58330140,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388965',
      binding_matrix_id: 'ENSPFM0446',
      transcription_factors: ['POU2F2'],
      score: 8.659487,
      start: 58330129,
      end: 58330142,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388966',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 6.1574893,
      start: 58330155,
      end: 58330166,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388967',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 8.0165415,
      start: 58330188,
      end: 58330199,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388968',
      binding_matrix_id: 'ENSPFM0446',
      transcription_factors: ['POU2F2'],
      score: 11.023552,
      start: 58330252,
      end: 58330265,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388969',
      binding_matrix_id: 'ENSPFM0447',
      transcription_factors: ['POU2F2'],
      score: 9.302225,
      start: 58330332,
      end: 58330345,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388970',
      binding_matrix_id: 'ENSPFM0447',
      transcription_factors: ['POU2F2'],
      score: 9.302495,
      start: 58330332,
      end: 58330345,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388971',
      binding_matrix_id: 'ENSPFM0447',
      transcription_factors: ['POU2F2'],
      score: 8.42697,
      start: 58330444,
      end: 58330457,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388972',
      binding_matrix_id: 'ENSPFM0447',
      transcription_factors: ['POU2F2'],
      score: 8.448918,
      start: 58330444,
      end: 58330457,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388973',
      binding_matrix_id: 'ENSPFM0365',
      transcription_factors: ['MAX'],
      score: 2.9753962,
      start: 58330825,
      end: 58330841,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388974',
      binding_matrix_id: 'ENSPFM0365',
      transcription_factors: ['MAX'],
      score: 3.0723135,
      start: 58330825,
      end: 58330841,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388975',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.336842,
      start: 58331078,
      end: 58331089,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388976',
      binding_matrix_id: 'ENSPFM0320',
      transcription_factors: ['PAX5'],
      score: 4.3991675,
      start: 58331297,
      end: 58331313,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388977',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 7.514666,
      start: 58331463,
      end: 58331471,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388978',
      binding_matrix_id: 'ENSPFM0088',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 6.913445,
      start: 58331508,
      end: 58331519,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388979',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 2.889527,
      start: 58331508,
      end: 58331521,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388980',
      binding_matrix_id: 'ENSPFM0351',
      transcription_factors: ['IRF3'],
      score: 3.6865003,
      start: 58331519,
      end: 58331539,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388981',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.276132,
      start: 58331791,
      end: 58331798,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388982',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.276132,
      start: 58331839,
      end: 58331846,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388983',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.276132,
      start: 58331984,
      end: 58331991,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388984',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 9.5275,
      start: 58332606,
      end: 58332619,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388985',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.990545,
      start: 58332646,
      end: 58332659,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388986',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.0767198,
      start: 58332646,
      end: 58332659,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388987',
      binding_matrix_id: 'ENSPFM0351',
      transcription_factors: ['IRF3'],
      score: 2.1700318,
      start: 58332664,
      end: 58332684,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388988',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.06726,
      start: 58332733,
      end: 58332742,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388989',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.091399,
      start: 58332819,
      end: 58332826,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388990',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 9.196072,
      start: 58332926,
      end: 58332938,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388991',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58332929,
      end: 58332936,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388992',
      binding_matrix_id: 'ENSPFM0320',
      transcription_factors: ['PAX5'],
      score: 7.049774,
      start: 58333015,
      end: 58333031,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388993',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 8.195956,
      start: 58333178,
      end: 58333193,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388994',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 7.3113437,
      start: 58333230,
      end: 58333239,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388995',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 2.7627177,
      start: 58333265,
      end: 58333276,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000388996',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 10.030113,
      start: 58333304,
      end: 58333313,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388997',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 7.336277,
      start: 58333327,
      end: 58333336,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388998',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.4693685,
      start: 58333350,
      end: 58333363,
      strand: 'forward'
    },
    {
      id: 'ENSM00000388999',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.4693685,
      start: 58333350,
      end: 58333363,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389000',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 6.1421638,
      start: 58333412,
      end: 58333425,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389001',
      binding_matrix_id: 'ENSPFM0365',
      transcription_factors: ['MAX'],
      score: 3.2720118,
      start: 58335898,
      end: 58335914,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389002',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 6.1546655,
      start: 58336065,
      end: 58336078,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389003',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 8.02184,
      start: 58336067,
      end: 58336078,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389004',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -1.2690854,
      start: 58336446,
      end: 58336461,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389005',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.719802,
      start: 58336554,
      end: 58336567,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389006',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.857274,
      start: 58336554,
      end: 58336567,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389007',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 6.846703,
      start: 58337335,
      end: 58337344,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389008',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.3966885,
      start: 58337714,
      end: 58337723,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389009',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 6.1179547,
      start: 58337728,
      end: 58337741,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389010',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 1.7618425,
      start: 58337903,
      end: 58337914,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389011',
      binding_matrix_id: 'ENSPFM0614',
      transcription_factors: ['YY1'],
      score: 7.273584,
      start: 58338007,
      end: 58338017,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389012',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 8.032221,
      start: 58338082,
      end: 58338090,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389013',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 6.831663,
      start: 58338158,
      end: 58338171,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389014',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 5.4247484,
      start: 58338183,
      end: 58338196,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389015',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 12.330067,
      start: 58338229,
      end: 58338244,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389016',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 9.395665,
      start: 58338229,
      end: 58338244,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389017',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 5.1941986,
      start: 58338257,
      end: 58338272,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389018',
      binding_matrix_id: 'ENSPFM0614',
      transcription_factors: ['YY1'],
      score: 7.2635336,
      start: 58338335,
      end: 58338345,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389019',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.927083,
      start: 58338437,
      end: 58338449,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389020',
      binding_matrix_id: 'ENSPFM0351',
      transcription_factors: ['IRF3'],
      score: 3.0720332,
      start: 58338492,
      end: 58338512,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389021',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.07897,
      start: 58338600,
      end: 58338609,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389022',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.007371,
      start: 58338729,
      end: 58338741,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389023',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.125904,
      start: 58338731,
      end: 58338738,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389024',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 3.5894,
      start: 58338971,
      end: 58338984,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389025',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 11.908977,
      start: 58339010,
      end: 58339023,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389026',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 11.996784,
      start: 58339010,
      end: 58339023,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389027',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.7438786,
      start: 58339131,
      end: 58339145,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389028',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.9008617,
      start: 58339375,
      end: 58339388,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389029',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.9796133,
      start: 58339375,
      end: 58339388,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389030',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -2.5112722,
      start: 58339390,
      end: 58339405,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389031',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.1879425,
      start: 58339407,
      end: 58339416,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389032',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 8.881924,
      start: 58339407,
      end: 58339418,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389033',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 1.9200753,
      start: 58339521,
      end: 58339532,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389034',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 8.821202,
      start: 58339632,
      end: 58339641,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389035',
      binding_matrix_id: 'ENSPFM0614',
      transcription_factors: ['YY1'],
      score: 8.199835,
      start: 58339700,
      end: 58339710,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389036',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.949364,
      start: 58339777,
      end: 58339788,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389037',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -2.3496103,
      start: 58340314,
      end: 58340327,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389038',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 10.11527,
      start: 58341132,
      end: 58341144,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389039',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -2.1389434,
      start: 58341387,
      end: 58341402,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389040',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -1.9696977,
      start: 58341524,
      end: 58341539,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389041',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 7.980261,
      start: 58342361,
      end: 58342373,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389042',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 2.8449876,
      start: 58343123,
      end: 58343138,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389043',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 6.173374,
      start: 58343123,
      end: 58343138,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389044',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -4.496798,
      start: 58343511,
      end: 58343524,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389045',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 7.1884274,
      start: 58344287,
      end: 58344296,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389046',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 1.7384535,
      start: 58344399,
      end: 58344410,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389047',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 1.5649848,
      start: 58344546,
      end: 58344557,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389048',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.3431296,
      start: 58344562,
      end: 58344573,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389049',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.4423113,
      start: 58344598,
      end: 58344611,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389050',
      binding_matrix_id: 'ENSPFM0320',
      transcription_factors: ['PAX5'],
      score: 4.8888626,
      start: 58344674,
      end: 58344690,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389051',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -6.8987665,
      start: 58344995,
      end: 58345008,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389052',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.945373,
      start: 58345109,
      end: 58345120,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389053',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 2.6338947,
      start: 58345398,
      end: 58345409,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389054',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -0.07524035,
      start: 58351948,
      end: 58351970,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389055',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: 1.0073445,
      start: 58351948,
      end: 58351970,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389056',
      binding_matrix_id: 'ENSPFM0485',
      transcription_factors: ['RUNX3'],
      score: 9.573526,
      start: 58352091,
      end: 58352108,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389057',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.3549933,
      start: 58352189,
      end: 58352198,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389058',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 10.43557,
      start: 58352225,
      end: 58352234,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389059',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 6.9062023,
      start: 58352225,
      end: 58352236,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389060',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 3.480849,
      start: 58352240,
      end: 58352253,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389061',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 12.718747,
      start: 58352240,
      end: 58352254,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389062',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.3004737,
      start: 58352246,
      end: 58352255,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389063',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 5.983085,
      start: 58352251,
      end: 58352264,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389064',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 5.7050476,
      start: 58352425,
      end: 58352438,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389065',
      binding_matrix_id: 'ENSPFM0427',
      transcription_factors: ['NRF1'],
      score: 8.787825,
      start: 58352439,
      end: 58352450,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389066',
      binding_matrix_id: 'ENSPFM0427',
      transcription_factors: ['NRF1'],
      score: 9.124323,
      start: 58352439,
      end: 58352450,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389067',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 1.8634614,
      start: 58352444,
      end: 58352455,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389068',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.1514697,
      start: 58352693,
      end: 58352707,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389069',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 8.985033,
      start: 58353116,
      end: 58353127,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389070',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 8.458304,
      start: 58353175,
      end: 58353184,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389071',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 6.8033,
      start: 58353175,
      end: 58353186,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389072',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 8.960709,
      start: 58353407,
      end: 58353419,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389073',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.2453713,
      start: 58354757,
      end: 58354771,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389074',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 1.9200753,
      start: 58355323,
      end: 58355334,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389075',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 9.66105,
      start: 58358185,
      end: 58358200,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389076',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 7.335392,
      start: 58358191,
      end: 58358203,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389077',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.987185,
      start: 58358255,
      end: 58358262,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389078',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.001993,
      start: 58359714,
      end: 58359725,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389079',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 3.4861376,
      start: 58362562,
      end: 58362576,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389080',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 8.248695,
      start: 58362567,
      end: 58362576,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389081',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 10.239723,
      start: 58362679,
      end: 58362688,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389082',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 6.330844,
      start: 58364629,
      end: 58364642,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389083',
      binding_matrix_id: 'ENSPFM0287',
      transcription_factors: ['HNF4A'],
      score: 4.691209,
      start: 58364630,
      end: 58364645,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389084',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 4.722451,
      start: 58364801,
      end: 58364816,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389085',
      binding_matrix_id: 'ENSPFM0001',
      transcription_factors: ['IRF5', 'IRF4'],
      score: 5.1048484,
      start: 58367674,
      end: 58367688,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389086',
      binding_matrix_id: 'ENSPFM0352',
      transcription_factors: ['IRF5'],
      score: 8.755172,
      start: 58367678,
      end: 58367688,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389087',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 8.81078,
      start: 58369664,
      end: 58369677,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389088',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 8.571149,
      start: 58369664,
      end: 58369678,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389089',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 6.131357,
      start: 58369664,
      end: 58369679,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389090',
      binding_matrix_id: 'ENSPFM0287',
      transcription_factors: ['HNF4A'],
      score: 7.998926,
      start: 58369664,
      end: 58369679,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389091',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 6.6670175,
      start: 58369903,
      end: 58369917,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389092',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 8.770394,
      start: 58380427,
      end: 58380439,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389093',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 3.0235114,
      start: 58383072,
      end: 58383086,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389094',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 8.566069,
      start: 58383836,
      end: 58383851,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389095',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.532967,
      start: 58383841,
      end: 58383853,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389096',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58383844,
      end: 58383851,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389097',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.814371,
      start: 58383868,
      end: 58383875,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389098',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.7484636,
      start: 58383893,
      end: 58383905,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389099',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 3.310209,
      start: 58384102,
      end: 58384117,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389100',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 3.9589896,
      start: 58384103,
      end: 58384117,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389101',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 7.119086,
      start: 58384104,
      end: 58384117,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389102',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 8.570891,
      start: 58384355,
      end: 58384368,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389103',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 4.283684,
      start: 58384355,
      end: 58384369,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389104',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 8.271419,
      start: 58384362,
      end: 58384375,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389105',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 5.175978,
      start: 58384362,
      end: 58384376,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389106',
      binding_matrix_id: 'ENSPFM0287',
      transcription_factors: ['HNF4A'],
      score: 3.472419,
      start: 58384389,
      end: 58384404,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389107',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 6.561481,
      start: 58384435,
      end: 58384448,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389108',
      binding_matrix_id: 'ENSPFM0001',
      transcription_factors: ['IRF5', 'IRF4'],
      score: 1.0749183,
      start: 58384655,
      end: 58384669,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389109',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 4.837869,
      start: 58385066,
      end: 58385079,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389110',
      binding_matrix_id: 'ENSPFM0212',
      transcription_factors: ['GATA3'],
      score: 7.6537757,
      start: 58388005,
      end: 58388012,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389111',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 4.8775773,
      start: 58400769,
      end: 58400780,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389112',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -7.855204,
      start: 58402218,
      end: 58402231,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389113',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.352229,
      start: 58402863,
      end: 58402876,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389114',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.7364306,
      start: 58402863,
      end: 58402876,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389115',
      binding_matrix_id: 'ENSPFM0517',
      transcription_factors: ['TEAD4'],
      score: 8.277389,
      start: 58402894,
      end: 58402903,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389116',
      binding_matrix_id: 'ENSPFM0517',
      transcription_factors: ['TEAD4'],
      score: 7.7720633,
      start: 58402903,
      end: 58402912,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389117',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.707368,
      start: 58403616,
      end: 58403625,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389118',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.613797,
      start: 58405520,
      end: 58405531,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389119',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 5.0460954,
      start: 58405834,
      end: 58405850,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389120',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.340876,
      start: 58411278,
      end: 58411289,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389121',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 3.5359483,
      start: 58411381,
      end: 58411392,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389122',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -3.7625716,
      start: 58411553,
      end: 58411575,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389123',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -4.055676,
      start: 58411553,
      end: 58411575,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389124',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.019442,
      start: 58411574,
      end: 58411587,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389125',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.281113,
      start: 58411574,
      end: 58411587,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389126',
      binding_matrix_id: 'ENSPFM0186',
      transcription_factors: ['FOXA1'],
      score: 9.144875,
      start: 58413711,
      end: 58413721,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389127',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -2.741326,
      start: 58416069,
      end: 58416091,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389128',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -3.0233092,
      start: 58416069,
      end: 58416091,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389129',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.620899,
      start: 58416348,
      end: 58416360,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389130',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.0359573,
      start: 58416663,
      end: 58416679,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389131',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 6.1530237,
      start: 58416755,
      end: 58416766,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389132',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 8.208615,
      start: 58417548,
      end: 58417556,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389133',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 9.807999,
      start: 58417582,
      end: 58417595,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389134',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 9.981883,
      start: 58417582,
      end: 58417595,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389135',
      binding_matrix_id: 'ENSPFM0446',
      transcription_factors: ['POU2F2'],
      score: 8.606217,
      start: 58417819,
      end: 58417832,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389136',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 2.6672328,
      start: 58417852,
      end: 58417867,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389137',
      binding_matrix_id: 'ENSPFM0287',
      transcription_factors: ['HNF4A'],
      score: 4.639593,
      start: 58417852,
      end: 58417867,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389138',
      binding_matrix_id: 'ENSPFM0088',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 6.944392,
      start: 58417887,
      end: 58417898,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389139',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.088193,
      start: 58417918,
      end: 58417929,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389140',
      binding_matrix_id: 'ENSPFM0088',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 8.175315,
      start: 58417918,
      end: 58417929,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389141',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 9.123788,
      start: 58428339,
      end: 58428347,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389142',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 9.518423,
      start: 58428365,
      end: 58428373,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389143',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 8.166991,
      start: 58428434,
      end: 58428449,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389144',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.579825,
      start: 58428440,
      end: 58428452,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389145',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 58428442,
      end: 58428449,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389146',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 7.3782597,
      start: 58428442,
      end: 58428457,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389147',
      binding_matrix_id: 'ENSPFM0211',
      transcription_factors: ['GATA1'],
      score: 7.7022004,
      start: 58437133,
      end: 58437139,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389148',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 7.395779,
      start: 58447676,
      end: 58447692,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389149',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.847935,
      start: 58462033,
      end: 58462047,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389150',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.278395,
      start: 58463593,
      end: 58463604,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389151',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 10.263534,
      start: 58463597,
      end: 58463611,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389152',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 9.977505,
      start: 58463597,
      end: 58463611,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389153',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.8705273,
      start: 58470575,
      end: 58470584,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389154',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.580489,
      start: 58470575,
      end: 58470584,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389155',
      binding_matrix_id: 'ENSPFM0177',
      transcription_factors: ['ETV6'],
      score: 4.9279056,
      start: 58472368,
      end: 58472382,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389156',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 4.0230117,
      start: 58484758,
      end: 58484773,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389157',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 7.3753133,
      start: 58484760,
      end: 58484773,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000389158',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 9.974502,
      start: 58487649,
      end: 58487665,
      strand: 'forward'
    },
    {
      id: 'ENSM00000389159',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 9.20783,
      start: 58487994,
      end: 58488010,
      strand: 'forward'
    },
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
