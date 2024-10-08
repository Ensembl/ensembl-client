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

const regionOverview = {
  region_name: '4',
  coordinate_system: 'chromosome',
  locations: [
    {
      start: 85500000,
      end: 86500000
    }
  ],
  selected_gene_index: 3,
  genes: [
    {
      symbol: 'ARHGAP24',
      stable_id: 'ENSG00000138639.18',
      unversioned_stable_id: 'ENSG00000138639',
      biotype: 'protein_coding',
      start: 85475150,
      end: 86002668,
      strand: 'forward',
      representative_transcript: {
        exons: [
          {
            start: 85475150,
            end: 85475559
          },
          {
            start: 85570522,
            end: 85570721
          },
          {
            start: 85721885,
            end: 85721972
          },
          {
            start: 85923648,
            end: 85923770
          },
          {
            start: 85942066,
            end: 85942273
          },
          {
            start: 85972036,
            end: 85972168
          },
          {
            start: 85974888,
            end: 85974961
          },
          {
            start: 85977570,
            end: 85977691
          },
          {
            start: 85994583,
            end: 85995657
          },
          {
            start: 86000479,
            end: 86002666
          }
        ],
        cds: [
          {
            start: 85570542,
            end: 85570721
          },
          {
            start: 85721885,
            end: 85721972
          },
          {
            start: 85923648,
            end: 85923770
          },
          {
            start: 85942066,
            end: 85942273
          },
          {
            start: 85972036,
            end: 85972168
          },
          {
            start: 85974888,
            end: 85974961
          },
          {
            start: 85977570,
            end: 85977691
          },
          {
            start: 85994583,
            end: 85995657
          },
          {
            start: 86000479,
            end: 86000722
          }
        ]
      },
      tss: [
        {
          position: 85475150
        },
        {
          position: 85475238
        },
        {
          position: 85778706
        },
        {
          position: 85930273
        }
      ],
      merged_exons: [
        {
          start: 85475150,
          end: 85475559
        },
        {
          start: 85570522,
          end: 85570721
        },
        {
          start: 85721885,
          end: 85721972
        },
        {
          start: 85778706,
          end: 85778965
        },
        {
          start: 85923648,
          end: 85923770
        },
        {
          start: 85930273,
          end: 85931042
        },
        {
          start: 85942066,
          end: 85942273
        },
        {
          start: 85972036,
          end: 85972367
        },
        {
          start: 85974888,
          end: 85974961
        },
        {
          start: 85977570,
          end: 85977691
        },
        {
          start: 85994583,
          end: 85995657
        },
        {
          start: 86000479,
          end: 86002668
        }
      ],
      cds_counts: [
        {
          start: 85570542,
          end: 85570721,
          count: 2
        },
        {
          start: 85721885,
          end: 85721972,
          count: 2
        },
        {
          start: 85923648,
          end: 85923664,
          count: 2
        },
        {
          start: 85923665,
          end: 85923770,
          count: 3
        },
        {
          start: 85930931,
          end: 85931042,
          count: 1
        },
        {
          start: 85942066,
          end: 85942273,
          count: 4
        },
        {
          start: 85972036,
          end: 85972168,
          count: 4
        },
        {
          start: 85972169,
          end: 85972177,
          count: 1
        },
        {
          start: 85974888,
          end: 85974961,
          count: 3
        },
        {
          start: 85977570,
          end: 85977691,
          count: 3
        },
        {
          start: 85994583,
          end: 85995657,
          count: 3
        },
        {
          start: 86000479,
          end: 86000722,
          count: 3
        }
      ]
    },
    {
      stable_id: 'ENSG00000305750.1',
      unversioned_stable_id: 'ENSG00000305750',
      biotype: 'lncRNA',
      start: 85573891,
      end: 85576346,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 85573891,
            end: 85573986
          },
          {
            start: 85576103,
            end: 85576346
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 85576346
        }
      ],
      merged_exons: [
        {
          start: 85573891,
          end: 85573986
        },
        {
          start: 85576103,
          end: 85576346
        }
      ],
      cds_counts: []
    },
    {
      stable_id: 'ENSG00000308103.1',
      unversioned_stable_id: 'ENSG00000308103',
      biotype: 'lncRNA',
      start: 85871356,
      end: 85873548,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 85871356,
            end: 85871472
          },
          {
            start: 85873306,
            end: 85873548
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 85873548
        }
      ],
      merged_exons: [
        {
          start: 85871356,
          end: 85871472
        },
        {
          start: 85873306,
          end: 85873548
        }
      ],
      cds_counts: []
    },
    {
      symbol: 'MAPK10',
      stable_id: 'ENSG00000109339.24',
      unversioned_stable_id: 'ENSG00000109339',
      biotype: 'protein_coding',
      start: 85990007,
      end: 86594625,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 86010405,
            end: 86017370
          },
          {
            start: 86029197,
            end: 86029274
          },
          {
            start: 86031368,
            end: 86031431
          },
          {
            start: 86064266,
            end: 86064390
          },
          {
            start: 86067773,
            end: 86067955
          },
          {
            start: 86098524,
            end: 86098595
          },
          {
            start: 86101052,
            end: 86101217
          },
          {
            start: 86101894,
            end: 86102032
          },
          {
            start: 86103186,
            end: 86103244
          },
          {
            start: 86107223,
            end: 86107352
          },
          {
            start: 86159298,
            end: 86159467
          },
          {
            start: 86194336,
            end: 86194407
          },
          {
            start: 86354530,
            end: 86354644
          },
          {
            start: 86359658,
            end: 86360053
          }
        ],
        cds: [
          {
            start: 86017228,
            end: 86017370
          },
          {
            start: 86029197,
            end: 86029274
          },
          {
            start: 86031368,
            end: 86031431
          },
          {
            start: 86064266,
            end: 86064390
          },
          {
            start: 86067773,
            end: 86067955
          },
          {
            start: 86098524,
            end: 86098595
          },
          {
            start: 86101052,
            end: 86101217
          },
          {
            start: 86101894,
            end: 86102032
          },
          {
            start: 86103186,
            end: 86103244
          },
          {
            start: 86107223,
            end: 86107352
          },
          {
            start: 86159298,
            end: 86159467
          },
          {
            start: 86194336,
            end: 86194401
          }
        ]
      },
      tss: [
        {
          position: 86194407
        },
        {
          position: 86326557
        },
        {
          position: 86340450
        },
        {
          position: 86354582
        },
        {
          position: 86354644
        },
        {
          position: 86357722
        },
        {
          position: 86357732
        },
        {
          position: 86357791
        },
        {
          position: 86357889
        },
        {
          position: 86357895
        },
        {
          position: 86358128
        },
        {
          position: 86358509
        },
        {
          position: 86358512
        },
        {
          position: 86358527
        },
        {
          position: 86358566
        },
        {
          position: 86358586
        },
        {
          position: 86358874
        },
        {
          position: 86359731
        },
        {
          position: 86359842
        },
        {
          position: 86360010
        },
        {
          position: 86360027
        },
        {
          position: 86360028
        },
        {
          position: 86360039
        },
        {
          position: 86360048
        },
        {
          position: 86360050
        },
        {
          position: 86360051
        },
        {
          position: 86360053
        },
        {
          position: 86360055
        },
        {
          position: 86360058
        },
        {
          position: 86360059
        },
        {
          position: 86360060
        },
        {
          position: 86360062
        },
        {
          position: 86360072
        },
        {
          position: 86360076
        },
        {
          position: 86360083
        },
        {
          position: 86360089
        },
        {
          position: 86360092
        },
        {
          position: 86360222
        },
        {
          position: 86384229
        },
        {
          position: 86453075
        },
        {
          position: 86453103
        },
        {
          position: 86453130
        },
        {
          position: 86453174
        },
        {
          position: 86453185
        },
        {
          position: 86453192
        },
        {
          position: 86453197
        },
        {
          position: 86453203
        },
        {
          position: 86453219
        },
        {
          position: 86453225
        },
        {
          position: 86453325
        },
        {
          position: 86453370
        },
        {
          position: 86453374
        },
        {
          position: 86453387
        },
        {
          position: 86453436
        },
        {
          position: 86594062
        },
        {
          position: 86594074
        },
        {
          position: 86594088
        },
        {
          position: 86594110
        },
        {
          position: 86594131
        },
        {
          position: 86594625
        }
      ],
      merged_exons: [
        {
          start: 85990007,
          end: 85992163
        },
        {
          start: 85999848,
          end: 86001477
        },
        {
          start: 86010395,
          end: 86017375
        },
        {
          start: 86023931,
          end: 86025572
        },
        {
          start: 86026436,
          end: 86029287
        },
        {
          start: 86031368,
          end: 86031431
        },
        {
          start: 86044540,
          end: 86044755
        },
        {
          start: 86064266,
          end: 86064390
        },
        {
          start: 86067773,
          end: 86067955
        },
        {
          start: 86089206,
          end: 86089277
        },
        {
          start: 86095331,
          end: 86095716
        },
        {
          start: 86098421,
          end: 86098448
        },
        {
          start: 86098524,
          end: 86098595
        },
        {
          start: 86101052,
          end: 86101217
        },
        {
          start: 86101894,
          end: 86102032
        },
        {
          start: 86103186,
          end: 86103244
        },
        {
          start: 86107223,
          end: 86107352
        },
        {
          start: 86159091,
          end: 86159467
        },
        {
          start: 86194309,
          end: 86194407
        },
        {
          start: 86277050,
          end: 86277223
        },
        {
          start: 86321844,
          end: 86322029
        },
        {
          start: 86325902,
          end: 86326557
        },
        {
          start: 86335076,
          end: 86335156
        },
        {
          start: 86340339,
          end: 86340450
        },
        {
          start: 86352165,
          end: 86352224
        },
        {
          start: 86354530,
          end: 86354644
        },
        {
          start: 86356462,
          end: 86356519
        },
        {
          start: 86356666,
          end: 86357052
        },
        {
          start: 86357638,
          end: 86357895
        },
        {
          start: 86358081,
          end: 86358874
        },
        {
          start: 86359658,
          end: 86360222
        },
        {
          start: 86370714,
          end: 86370867
        },
        {
          start: 86384100,
          end: 86384229
        },
        {
          start: 86399747,
          end: 86399806
        },
        {
          start: 86429678,
          end: 86429805
        },
        {
          start: 86453030,
          end: 86453436
        },
        {
          start: 86593733,
          end: 86594625
        }
      ],
      cds_counts: [
        {
          start: 85992133,
          end: 85992163,
          count: 2
        },
        {
          start: 86001213,
          end: 86001477,
          count: 1
        },
        {
          start: 86011325,
          end: 86011331,
          count: 1
        },
        {
          start: 86017186,
          end: 86017227,
          count: 1
        },
        {
          start: 86017228,
          end: 86017231,
          count: 42
        },
        {
          start: 86017232,
          end: 86017358,
          count: 46
        },
        {
          start: 86017359,
          end: 86017370,
          count: 76
        },
        {
          start: 86017371,
          end: 86017375,
          count: 30
        },
        {
          start: 86025469,
          end: 86025572,
          count: 1
        },
        {
          start: 86029180,
          end: 86029196,
          count: 2
        },
        {
          start: 86029197,
          end: 86029231,
          count: 79
        },
        {
          start: 86029232,
          end: 86029274,
          count: 84
        },
        {
          start: 86029275,
          end: 86029287,
          count: 5
        },
        {
          start: 86031368,
          end: 86031431,
          count: 84
        },
        {
          start: 86044735,
          end: 86044755,
          count: 1
        },
        {
          start: 86064266,
          end: 86064390,
          count: 84
        },
        {
          start: 86067773,
          end: 86067955,
          count: 84
        },
        {
          start: 86089206,
          end: 86089277,
          count: 9
        },
        {
          start: 86098441,
          end: 86098448,
          count: 1
        },
        {
          start: 86098524,
          end: 86098595,
          count: 73
        },
        {
          start: 86101052,
          end: 86101217,
          count: 85
        },
        {
          start: 86101894,
          end: 86102032,
          count: 85
        },
        {
          start: 86103186,
          end: 86103244,
          count: 85
        },
        {
          start: 86107223,
          end: 86107246,
          count: 86
        },
        {
          start: 86107247,
          end: 86107352,
          count: 82
        },
        {
          start: 86159294,
          end: 86159297,
          count: 1
        },
        {
          start: 86159298,
          end: 86159419,
          count: 82
        },
        {
          start: 86159420,
          end: 86159467,
          count: 43
        },
        {
          start: 86194336,
          end: 86194401,
          count: 43
        },
        {
          start: 86194402,
          end: 86194407,
          count: 2
        },
        {
          start: 86354530,
          end: 86354588,
          count: 1
        },
        {
          start: 86359658,
          end: 86359660,
          count: 2
        }
      ]
    },
    {
      symbol: 'MAPK10-AS1',
      stable_id: 'ENSG00000250062.6',
      unversioned_stable_id: 'ENSG00000250062',
      biotype: 'lncRNA',
      start: 86117912,
      end: 86219926,
      strand: 'forward',
      representative_transcript: {
        exons: [
          {
            start: 86119714,
            end: 86119883
          },
          {
            start: 86119984,
            end: 86120601
          },
          {
            start: 86127592,
            end: 86127700
          },
          {
            start: 86219775,
            end: 86219926
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 86119714
        }
      ],
      merged_exons: [
        {
          start: 86119714,
          end: 86119883
        },
        {
          start: 86119984,
          end: 86120601
        },
        {
          start: 86127592,
          end: 86127700
        },
        {
          start: 86219775,
          end: 86219926
        }
      ],
      cds_counts: []
    },
    {
      stable_id: 'ENSG00000298686.1',
      unversioned_stable_id: 'ENSG00000298686',
      biotype: 'lncRNA',
      start: 86360177,
      end: 86361202,
      strand: 'forward',
      representative_transcript: {
        exons: [
          {
            start: 86360177,
            end: 86360449
          },
          {
            start: 86361078,
            end: 86361202
          }
        ],
        cds: []
      },
      tss: [
        {
          position: 86360177
        }
      ],
      merged_exons: [
        {
          start: 86360177,
          end: 86360449
        },
        {
          start: 86361078,
          end: 86361202
        }
      ],
      cds_counts: []
    }
  ],
  regulatory_features: [
    {
      id: 'ENSR4_84HTKJ',
      feature_type: 'enhancer',
      start: 85500537,
      end: 85500754,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q56GZ',
      feature_type: 'CTCF_binding_site',
      start: 85529074,
      end: 85529095,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_84HWHM',
      feature_type: 'enhancer',
      start: 85543895,
      end: 85544135,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938XTL',
      feature_type: 'enhancer',
      start: 85555173,
      end: 85555590,
      strand: 'independent'
    },
    {
      id: 'ENSR4_772SKT',
      feature_type: 'enhancer',
      start: 85557411,
      end: 85557534,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938XZQ',
      feature_type: 'enhancer',
      start: 85566146,
      end: 85566445,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938Z94',
      feature_type: 'enhancer',
      start: 85591409,
      end: 85591759,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938ZDP',
      feature_type: 'enhancer',
      start: 85604012,
      end: 85604276,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938ZFR',
      feature_type: 'enhancer',
      start: 85607683,
      end: 85608024,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84HXX8',
      feature_type: 'enhancer',
      start: 85610609,
      end: 85610855,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938ZZM',
      feature_type: 'enhancer',
      start: 85658992,
      end: 85659349,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q5ZRN',
      feature_type: 'CTCF_binding_site',
      start: 85659260,
      end: 85659281,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_938ZZT',
      feature_type: 'enhancer',
      start: 85659722,
      end: 85660189,
      strand: 'independent'
    },
    {
      id: 'ENSR4_939226',
      feature_type: 'enhancer',
      start: 85660830,
      end: 85661235,
      strand: 'independent'
    },
    {
      id: 'ENSR4_93925F',
      feature_type: 'enhancer',
      start: 85672144,
      end: 85672455,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J2CT',
      feature_type: 'enhancer',
      start: 85677328,
      end: 85677582,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM253',
      feature_type: 'enhancer',
      start: 85681068,
      end: 85681840,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q66G2',
      feature_type: 'CTCF_binding_site',
      start: 85686326,
      end: 85686347,
      strand: 'forward'
    },
    {
      id: 'ENSR4_5Q67S2',
      feature_type: 'CTCF_binding_site',
      start: 85694318,
      end: 85694339,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_BM282',
      feature_type: 'enhancer',
      start: 85701702,
      end: 85702384,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J2WR',
      feature_type: 'enhancer',
      start: 85703175,
      end: 85703345,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9392HP',
      feature_type: 'enhancer',
      start: 85707689,
      end: 85708040,
      strand: 'independent'
    },
    {
      id: 'ENSR4_6D465P',
      feature_type: 'CTCF_binding_site',
      start: 85708671,
      end: 85708703,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9392L5',
      feature_type: 'enhancer',
      start: 85716064,
      end: 85716336,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9392LJ',
      feature_type: 'enhancer',
      start: 85717345,
      end: 85717751,
      strand: 'independent'
    },
    {
      id: 'ENSR4_7734GM',
      feature_type: 'enhancer',
      start: 85717946,
      end: 85718072,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J3B2',
      feature_type: 'enhancer',
      start: 85720808,
      end: 85721037,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9392N5',
      feature_type: 'enhancer',
      start: 85722872,
      end: 85723219,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J3DC',
      feature_type: 'enhancer',
      start: 85724850,
      end: 85725020,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM2CG',
      feature_type: 'enhancer',
      start: 85725326,
      end: 85726252,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J3GJ',
      feature_type: 'enhancer',
      start: 85728603,
      end: 85728825,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9392RG',
      feature_type: 'enhancer',
      start: 85734453,
      end: 85734858,
      strand: 'independent'
    },
    {
      id: 'ENSR4_6D48PM',
      feature_type: 'CTCF_binding_site',
      start: 85738865,
      end: 85738904,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q6HGM',
      feature_type: 'CTCF_binding_site',
      start: 85738955,
      end: 85738976,
      strand: 'forward'
    },
    {
      id: 'ENSR4_9392T7',
      feature_type: 'enhancer',
      start: 85740430,
      end: 85740829,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9392TM',
      feature_type: 'enhancer',
      start: 85741986,
      end: 85742287,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM2G2',
      feature_type: 'enhancer',
      start: 85743041,
      end: 85743827,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J3S2',
      feature_type: 'enhancer',
      start: 85745022,
      end: 85745273,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9392XD',
      feature_type: 'enhancer',
      start: 85747870,
      end: 85748350,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q6K2S',
      feature_type: 'CTCF_binding_site',
      start: 85748064,
      end: 85748085,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84J3W7',
      feature_type: 'enhancer',
      start: 85748797,
      end: 85748961,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J43Z',
      feature_type: 'open_chromatin_region',
      start: 85757043,
      end: 85757255,
      strand: 'independent'
    },
    {
      id: 'ENSR4_6D4BB2',
      feature_type: 'CTCF_binding_site',
      start: 85757173,
      end: 85757205,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_BM2JH',
      feature_type: 'enhancer',
      start: 85760349,
      end: 85760879,
      strand: 'independent'
    },
    {
      id: 'ENSR4_CBHQT',
      feature_type: 'enhancer',
      start: 85761848,
      end: 85762883,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J4H3',
      feature_type: 'enhancer',
      start: 85776210,
      end: 85776400,
      strand: 'independent'
    },
    {
      id: 'ENSR4_93938N',
      feature_type: 'enhancer',
      start: 85776610,
      end: 85776954,
      strand: 'independent'
    },
    {
      id: 'ENSR4_939396',
      feature_type: 'promoter',
      start: 85778277,
      end: 85778716,
      strand: 'independent',
      extended_start: 85778278,
      extended_end: 85778716
    },
    {
      id: 'ENSR4_BM2M6',
      feature_type: 'enhancer',
      start: 85778717,
      end: 85779578,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q6QDK',
      feature_type: 'CTCF_binding_site',
      start: 85779329,
      end: 85779350,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_93939S',
      feature_type: 'enhancer',
      start: 85780566,
      end: 85781066,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9393BN',
      feature_type: 'enhancer',
      start: 85783469,
      end: 85783954,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM2NC',
      feature_type: 'enhancer',
      start: 85786949,
      end: 85787538,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM2NT',
      feature_type: 'enhancer',
      start: 85790547,
      end: 85791136,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9393F9',
      feature_type: 'enhancer',
      start: 85792585,
      end: 85792904,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM2P9',
      feature_type: 'enhancer',
      start: 85793315,
      end: 85793872,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM2PQ',
      feature_type: 'enhancer',
      start: 85796522,
      end: 85797235,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q6TFS',
      feature_type: 'CTCF_binding_site',
      start: 85797094,
      end: 85797115,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84J4XX',
      feature_type: 'enhancer',
      start: 85798433,
      end: 85798684,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM2RB',
      feature_type: 'enhancer',
      start: 85807405,
      end: 85808098,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J599',
      feature_type: 'enhancer',
      start: 85812882,
      end: 85813042,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9393Q7',
      feature_type: 'enhancer',
      start: 85823310,
      end: 85823807,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9393QF',
      feature_type: 'enhancer',
      start: 85824193,
      end: 85824498,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM2W2',
      feature_type: 'enhancer',
      start: 85826015,
      end: 85826786,
      strand: 'independent'
    },
    {
      id: 'ENSR4_CBHXL',
      feature_type: 'enhancer',
      start: 85827264,
      end: 85828850,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM2WH',
      feature_type: 'enhancer',
      start: 85829374,
      end: 85829999,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9393W8',
      feature_type: 'enhancer',
      start: 85837331,
      end: 85837613,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9393X3',
      feature_type: 'enhancer',
      start: 85840143,
      end: 85840449,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9393XQ',
      feature_type: 'enhancer',
      start: 85842523,
      end: 85842971,
      strand: 'independent'
    },
    {
      id: 'ENSR4_93945S',
      feature_type: 'enhancer',
      start: 85860091,
      end: 85860557,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J6BF',
      feature_type: 'enhancer',
      start: 85861495,
      end: 85861642,
      strand: 'independent'
    },
    {
      id: 'ENSR4_93947W',
      feature_type: 'enhancer',
      start: 85867308,
      end: 85867620,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J6GX',
      feature_type: 'enhancer',
      start: 85869317,
      end: 85869450,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9394KR',
      feature_type: 'enhancer',
      start: 85901552,
      end: 85901817,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9394W2',
      feature_type: 'promoter',
      start: 85929783,
      end: 85930283,
      strand: 'independent',
      extended_start: 85928784,
      extended_end: 85930283
    },
    {
      id: 'ENSR4_9394W5',
      feature_type: 'enhancer',
      start: 85930284,
      end: 85930563,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM3GF',
      feature_type: 'enhancer',
      start: 85932511,
      end: 85933462,
      strand: 'independent'
    },
    {
      id: 'ENSR4_93955K',
      feature_type: 'enhancer',
      start: 85952536,
      end: 85952891,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM3KF',
      feature_type: 'enhancer',
      start: 85953431,
      end: 85954056,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J8C5',
      feature_type: 'enhancer',
      start: 85956018,
      end: 85956247,
      strand: 'independent'
    },
    {
      id: 'ENSR4_93959K',
      feature_type: 'enhancer',
      start: 85966385,
      end: 85966784,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J8L4',
      feature_type: 'enhancer',
      start: 85968008,
      end: 85968258,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9395BB',
      feature_type: 'enhancer',
      start: 85968913,
      end: 85969314,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q7XXG',
      feature_type: 'CTCF_binding_site',
      start: 85969169,
      end: 85969190,
      strand: 'forward'
    },
    {
      id: 'ENSR4_9395BG',
      feature_type: 'enhancer',
      start: 85969475,
      end: 85969751,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM3TQ',
      feature_type: 'enhancer',
      start: 86011036,
      end: 86011653,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84J9KJ',
      feature_type: 'enhancer',
      start: 86013762,
      end: 86013911,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9395RJ',
      feature_type: 'enhancer',
      start: 86014644,
      end: 86014959,
      strand: 'independent'
    },
    {
      id: 'ENSR4_CBJHG',
      feature_type: 'enhancer',
      start: 86032470,
      end: 86033816,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JB3B',
      feature_type: 'enhancer',
      start: 86035847,
      end: 86036008,
      strand: 'independent'
    },
    {
      id: 'ENSR4_93962X',
      feature_type: 'enhancer',
      start: 86036739,
      end: 86037120,
      strand: 'independent'
    },
    {
      id: 'ENSR4_939652',
      feature_type: 'enhancer',
      start: 86043899,
      end: 86044403,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q8FRQ',
      feature_type: 'CTCF_binding_site',
      start: 86044184,
      end: 86044205,
      strand: 'forward'
    },
    {
      id: 'ENSR4_93966B',
      feature_type: 'enhancer',
      start: 86048470,
      end: 86048758,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JBGZ',
      feature_type: 'enhancer',
      start: 86055992,
      end: 86056193,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9396G8',
      feature_type: 'open_chromatin_region',
      start: 86075806,
      end: 86076065,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9396M5',
      feature_type: 'enhancer',
      start: 86092738,
      end: 86093060,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM4G7',
      feature_type: 'enhancer',
      start: 86117583,
      end: 86118520,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JF6P',
      feature_type: 'enhancer',
      start: 86181675,
      end: 86181891,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM4ZS',
      feature_type: 'enhancer',
      start: 86218715,
      end: 86219442,
      strand: 'independent'
    },
    {
      id: 'ENSR4_939822',
      feature_type: 'enhancer',
      start: 86220149,
      end: 86220485,
      strand: 'independent'
    },
    {
      id: 'ENSR4_93982Z',
      feature_type: 'open_chromatin_region',
      start: 86223449,
      end: 86223852,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q9KKG',
      feature_type: 'CTCF_binding_site',
      start: 86223617,
      end: 86223638,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5Q9KKW',
      feature_type: 'CTCF_binding_site',
      start: 86223714,
      end: 86223735,
      strand: 'forward'
    },
    {
      id: 'ENSR4_5Q9KLT',
      feature_type: 'CTCF_binding_site',
      start: 86223920,
      end: 86223941,
      strand: 'forward'
    },
    {
      id: 'ENSR4_BM53Z',
      feature_type: 'enhancer',
      start: 86233635,
      end: 86234149,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9398BM',
      feature_type: 'enhancer',
      start: 86250021,
      end: 86250324,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9398TQ',
      feature_type: 'open_chromatin_region',
      start: 86302262,
      end: 86302625,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9398X4',
      feature_type: 'enhancer',
      start: 86306777,
      end: 86307215,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JHTK',
      feature_type: 'enhancer',
      start: 86307576,
      end: 86307732,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM5M6',
      feature_type: 'enhancer',
      start: 86338692,
      end: 86339392,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JJZ2',
      feature_type: 'promoter',
      start: 86358499,
      end: 86358676,
      strand: 'independent',
      extended_start: 86358500,
      extended_end: 86358676
    },
    {
      id: 'ENSR4_9399H9',
      feature_type: 'enhancer',
      start: 86359239,
      end: 86359720,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9399HF',
      feature_type: 'promoter',
      start: 86359721,
      end: 86360187,
      strand: 'independent',
      extended_start: 86359722,
      extended_end: 86360187
    },
    {
      id: 'ENSR4_9399HJ',
      feature_type: 'promoter',
      start: 86360212,
      end: 86360627,
      strand: 'independent',
      extended_start: 86360213,
      extended_end: 86360627
    },
    {
      id: 'ENSR4_9399KN',
      feature_type: 'enhancer',
      start: 86367643,
      end: 86367939,
      strand: 'independent'
    },
    {
      id: 'ENSR4_9399PC',
      feature_type: 'enhancer',
      start: 86380285,
      end: 86380617,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JKT7',
      feature_type: 'enhancer',
      start: 86400260,
      end: 86400464,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5QBPNC',
      feature_type: 'CTCF_binding_site',
      start: 86405036,
      end: 86405057,
      strand: 'forward'
    },
    {
      id: 'ENSR4_5QBSHD',
      feature_type: 'CTCF_binding_site',
      start: 86421460,
      end: 86421481,
      strand: 'forward'
    },
    {
      id: 'ENSR4_BM672',
      feature_type: 'enhancer',
      start: 86441144,
      end: 86441858,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5QBXZK',
      feature_type: 'CTCF_binding_site',
      start: 86441800,
      end: 86441821,
      strand: 'forward'
    },
    {
      id: 'ENSR4_BM68H',
      feature_type: 'enhancer',
      start: 86451570,
      end: 86452137,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM68P',
      feature_type: 'promoter',
      start: 86453065,
      end: 86453926,
      strand: 'independent',
      extended_start: 86453066,
      extended_end: 86454143
    },
    {
      id: 'ENSR4_BM6F2',
      feature_type: 'enhancer',
      start: 86482709,
      end: 86483359,
      strand: 'independent'
    },
    {
      id: 'ENSR4_939BSF',
      feature_type: 'enhancer',
      start: 86484301,
      end: 86484570,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JMT7',
      feature_type: 'enhancer',
      start: 86493554,
      end: 86493787,
      strand: 'independent'
    },
    {
      id: 'ENSR4_CBKQ2',
      feature_type: 'enhancer',
      start: 86496162,
      end: 86497596,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5QCBBR',
      feature_type: 'CTCF_binding_site',
      start: 86496283,
      end: 86496304,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_CBKQ5',
      feature_type: 'enhancer',
      start: 86497984,
      end: 86499019,
      strand: 'independent'
    }
  ],
  motif_features: [
    {
      id: 'ENSM00000693604',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 7.2228475,
      start: 85509984,
      end: 85509997,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693605',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.147955,
      start: 85512901,
      end: 85512913,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693606',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -0.16425836,
      start: 85512903,
      end: 85512925,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693607',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: 0.33479726,
      start: 85512903,
      end: 85512925,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693608',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.185825,
      start: 85529076,
      end: 85529092,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693609',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.144897,
      start: 85553402,
      end: 85553413,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693610',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 8.856789,
      start: 85556297,
      end: 85556310,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693611',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 8.878773,
      start: 85556297,
      end: 85556310,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693612',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.311293,
      start: 85557116,
      end: 85557129,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693613',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 6.299693,
      start: 85557393,
      end: 85557406,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693614',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.448791,
      start: 85557479,
      end: 85557492,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693615',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.49316,
      start: 85557479,
      end: 85557492,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693616',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 7.0375843,
      start: 85557545,
      end: 85557554,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693617',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -0.6504253,
      start: 85566332,
      end: 85566347,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693618',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.031683,
      start: 85566699,
      end: 85566711,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693619',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.814371,
      start: 85566702,
      end: 85566709,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693620',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.507971,
      start: 85569988,
      end: 85570000,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693621',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.507971,
      start: 85570055,
      end: 85570067,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693622',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.9572883,
      start: 85604094,
      end: 85604107,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693623',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.9669127,
      start: 85604094,
      end: 85604107,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693624',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -2.6587415,
      start: 85607447,
      end: 85607469,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693625',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -3.1860468,
      start: 85607447,
      end: 85607469,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693626',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 7.329145,
      start: 85607729,
      end: 85607738,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693627',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 7.329145,
      start: 85607776,
      end: 85607785,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693628',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 8.031087,
      start: 85607945,
      end: 85607954,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693629',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.2029461,
      start: 85659262,
      end: 85659278,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693630',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 8.1778755,
      start: 85660528,
      end: 85660540,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693631',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 10.332325,
      start: 85660866,
      end: 85660877,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693632',
      binding_matrix_id: 'ENSPFM0484',
      transcription_factors: ['RUNX3'],
      score: 6.812902,
      start: 85661170,
      end: 85661185,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693633',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 1.492268,
      start: 85681487,
      end: 85681500,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693634',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 6.2606225,
      start: 85682570,
      end: 85682584,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693635',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 6.9634895,
      start: 85682570,
      end: 85682584,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693636',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.0610137,
      start: 85686328,
      end: 85686344,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693637',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.6882353,
      start: 85694320,
      end: 85694336,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693638',
      binding_matrix_id: 'ENSPFM0485',
      transcription_factors: ['RUNX3'],
      score: 8.451272,
      start: 85700581,
      end: 85700598,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693639',
      binding_matrix_id: 'ENSPFM0484',
      transcription_factors: ['RUNX3'],
      score: 7.9870415,
      start: 85700623,
      end: 85700638,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693640',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 7.4800253,
      start: 85700630,
      end: 85700638,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693641',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: 1.5188426,
      start: 85701914,
      end: 85701929,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693642',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.892058,
      start: 85701919,
      end: 85701931,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693643',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 11.047547,
      start: 85702219,
      end: 85702232,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693644',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.1494017,
      start: 85703514,
      end: 85703527,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693645',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.5240965,
      start: 85703514,
      end: 85703527,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693646',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.0007412,
      start: 85708673,
      end: 85708689,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693647',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 5.9052696,
      start: 85708684,
      end: 85708700,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693648',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 14.164709,
      start: 85726079,
      end: 85726092,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693649',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -0.4713011,
      start: 85727577,
      end: 85727590,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693650',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -2.577242,
      start: 85727577,
      end: 85727590,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693651',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.235382,
      start: 85728557,
      end: 85728566,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693652',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.4748734,
      start: 85738867,
      end: 85738883,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693653',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.2845516,
      start: 85738885,
      end: 85738901,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693654',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.2040613,
      start: 85738957,
      end: 85738973,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693655',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.1632595,
      start: 85740723,
      end: 85740736,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693656',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.66867,
      start: 85740723,
      end: 85740736,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693657',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 10.97717,
      start: 85743496,
      end: 85743510,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693658',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 9.543662,
      start: 85743496,
      end: 85743510,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693659',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 5.089907,
      start: 85748066,
      end: 85748082,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693660',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.819458,
      start: 85748235,
      end: 85748244,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693661',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 11.242437,
      start: 85749785,
      end: 85749800,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693662',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 9.589325,
      start: 85749790,
      end: 85749802,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693663',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 85749793,
      end: 85749800,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693664',
      binding_matrix_id: 'ENSPFM0320',
      transcription_factors: ['PAX5'],
      score: 10.002954,
      start: 85749993,
      end: 85750009,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693665',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.4486969,
      start: 85757175,
      end: 85757191,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693666',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.4684556,
      start: 85757186,
      end: 85757202,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693667',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 6.9248667,
      start: 85766747,
      end: 85766759,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693668',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.9493694,
      start: 85772104,
      end: 85772113,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693669',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.2637105,
      start: 85772122,
      end: 85772131,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693670',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 4.3479652,
      start: 85776819,
      end: 85776834,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693671',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 6.377403,
      start: 85776819,
      end: 85776834,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693672',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -5.326577,
      start: 85778312,
      end: 85778334,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693673',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -5.389591,
      start: 85778312,
      end: 85778334,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693674',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 3.3159072,
      start: 85778522,
      end: 85778535,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693675',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 6.3615694,
      start: 85778880,
      end: 85778893,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693676',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 10.842924,
      start: 85779029,
      end: 85779041,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693677',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 7.9530916,
      start: 85779032,
      end: 85779039,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693678',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.7253447,
      start: 85779331,
      end: 85779347,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693679',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.975021,
      start: 85780950,
      end: 85780963,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693680',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.0239267,
      start: 85780950,
      end: 85780963,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693681',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.117064,
      start: 85781764,
      end: 85781776,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693682',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 11.694381,
      start: 85783666,
      end: 85783679,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693683',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 11.78914,
      start: 85783666,
      end: 85783679,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693684',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -7.47843,
      start: 85783774,
      end: 85783787,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693685',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 3.1863296,
      start: 85784061,
      end: 85784076,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693686',
      binding_matrix_id: 'ENSPFM0287',
      transcription_factors: ['HNF4A'],
      score: 6.369966,
      start: 85784061,
      end: 85784076,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693687',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 9.761289,
      start: 85784062,
      end: 85784076,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693688',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 9.232707,
      start: 85784063,
      end: 85784076,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693689',
      binding_matrix_id: 'ENSPFM0287',
      transcription_factors: ['HNF4A'],
      score: 4.7815137,
      start: 85784068,
      end: 85784083,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693690',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 2.849339,
      start: 85784069,
      end: 85784083,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693691',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 10.1439,
      start: 85795015,
      end: 85795029,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693692',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 10.604715,
      start: 85795015,
      end: 85795029,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693693',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 9.422527,
      start: 85797096,
      end: 85797112,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693694',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.608817,
      start: 85798587,
      end: 85798596,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693695',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 8.846722,
      start: 85812874,
      end: 85812886,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693696',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.091399,
      start: 85812900,
      end: 85812907,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693697',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 10.595556,
      start: 85818885,
      end: 85818898,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693698',
      binding_matrix_id: 'ENSPFM0024',
      transcription_factors: ['USF1', 'SREBF2'],
      score: 8.515886,
      start: 85826354,
      end: 85826363,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693699',
      binding_matrix_id: 'ENSPFM0024',
      transcription_factors: ['USF1', 'SREBF2'],
      score: 8.523637,
      start: 85826354,
      end: 85826363,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693700',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.482137,
      start: 85827738,
      end: 85827749,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693701',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.974462,
      start: 85829080,
      end: 85829091,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693702',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 7.2657886,
      start: 85840583,
      end: 85840597,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693703',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 9.644655,
      start: 85840583,
      end: 85840597,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693704',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.216397,
      start: 85854238,
      end: 85854249,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693705',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -1.766727,
      start: 85861501,
      end: 85861514,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693706',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 5.7514205,
      start: 85928680,
      end: 85928695,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693707',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 9.589325,
      start: 85928685,
      end: 85928697,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693708',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 85928688,
      end: 85928695,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693709',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: 0.18648317,
      start: 85929223,
      end: 85929238,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693710',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 7.217084,
      start: 85929546,
      end: 85929556,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693711',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 5.7639027,
      start: 85929837,
      end: 85929847,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693712',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 5.6777444,
      start: 85929886,
      end: 85929896,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693713',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 5.5019245,
      start: 85933481,
      end: 85933495,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693714',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 9.518734,
      start: 85933482,
      end: 85933495,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693715',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 9.438883,
      start: 85938403,
      end: 85938417,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693716',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 8.968441,
      start: 85953251,
      end: 85953263,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693717',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 5.250104,
      start: 85953266,
      end: 85953279,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693718',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.740314,
      start: 85965725,
      end: 85965736,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693719',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 11.116847,
      start: 85969171,
      end: 85969187,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693720',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.2864513,
      start: 85972642,
      end: 85972651,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693721',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.050642,
      start: 85972642,
      end: 85972651,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693722',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -2.564686,
      start: 85979317,
      end: 85979332,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693723',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -9.097071,
      start: 86000230,
      end: 86000243,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693724',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.381023,
      start: 86009705,
      end: 86009716,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693725',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.251145,
      start: 86014824,
      end: 86014837,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693726',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.660436,
      start: 86014824,
      end: 86014837,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693727',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.9734674,
      start: 86014852,
      end: 86014865,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693728',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.049406,
      start: 86014852,
      end: 86014865,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693729',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: 0.23765099,
      start: 86015447,
      end: 86015462,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693730',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -2.7693994,
      start: 86015447,
      end: 86015462,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693731',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 5.7943397,
      start: 86035935,
      end: 86035948,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693732',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 5.8154655,
      start: 86035935,
      end: 86035948,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693733',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.229849,
      start: 86036998,
      end: 86037012,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693734',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.389767,
      start: 86037013,
      end: 86037024,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693735',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 8.67444,
      start: 86044186,
      end: 86044202,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693736',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.748893,
      start: 86048499,
      end: 86048510,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693737',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.224961,
      start: 86093252,
      end: 86093261,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693738',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.27919,
      start: 86093252,
      end: 86093261,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693739',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.520929,
      start: 86130346,
      end: 86130357,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693740',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.415025,
      start: 86185737,
      end: 86185748,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693741',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.07897,
      start: 86219265,
      end: 86219274,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693742',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.3712757,
      start: 86223619,
      end: 86223635,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693743',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.2485647,
      start: 86223716,
      end: 86223732,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693744',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.685749,
      start: 86223734,
      end: 86223745,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693745',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 7.5822244,
      start: 86223736,
      end: 86223745,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693746',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.283984,
      start: 86223922,
      end: 86223938,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693747',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 8.009365,
      start: 86261647,
      end: 86261658,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693748',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.7779164,
      start: 86289909,
      end: 86289922,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693749',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.1401978,
      start: 86289909,
      end: 86289922,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693750',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: 0.2339271,
      start: 86294946,
      end: 86294961,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693751',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -4.891304,
      start: 86302549,
      end: 86302571,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693752',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -5.2530823,
      start: 86302549,
      end: 86302571,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693753',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.386055,
      start: 86315772,
      end: 86315783,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693754',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.561244,
      start: 86323246,
      end: 86323257,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693755',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 2.5315752,
      start: 86331232,
      end: 86331243,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693756',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.4946446,
      start: 86360122,
      end: 86360135,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693757',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.5339723,
      start: 86360122,
      end: 86360135,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693758',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 8.549077,
      start: 86360172,
      end: 86360185,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693759',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 3.875789,
      start: 86360212,
      end: 86360223,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693760',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 1.9116417,
      start: 86360401,
      end: 86360414,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693761',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.809037,
      start: 86360968,
      end: 86360977,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693762',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.809037,
      start: 86360968,
      end: 86360977,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693763',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.038142,
      start: 86361038,
      end: 86361049,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693764',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.768232,
      start: 86361145,
      end: 86361159,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693765',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 7.364864,
      start: 86361145,
      end: 86361159,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693766',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.343946,
      start: 86361152,
      end: 86361163,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693767',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.5782833,
      start: 86362701,
      end: 86362715,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693768',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.974462,
      start: 86362708,
      end: 86362719,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693769',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.055267,
      start: 86364621,
      end: 86364630,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693770',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.624536,
      start: 86366452,
      end: 86366463,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693771',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 4.6981835,
      start: 86366456,
      end: 86366470,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693772',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 6.133251,
      start: 86366456,
      end: 86366470,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693773',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 5.84181,
      start: 86367095,
      end: 86367108,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693774',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 6.166102,
      start: 86367095,
      end: 86367108,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693775',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 5.0061407,
      start: 86367145,
      end: 86367158,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693776',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.686057,
      start: 86367238,
      end: 86367249,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693777',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 4.890321,
      start: 86380295,
      end: 86380310,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693778',
      binding_matrix_id: 'ENSPFM0287',
      transcription_factors: ['HNF4A'],
      score: 7.4551563,
      start: 86380295,
      end: 86380310,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693779',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -4.7465568,
      start: 86390644,
      end: 86390657,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693780',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 9.589325,
      start: 86403297,
      end: 86403309,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693781',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.103318,
      start: 86403299,
      end: 86403306,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693782',
      binding_matrix_id: 'ENSPFM0423',
      transcription_factors: ['NR2F1'],
      score: 11.242437,
      start: 86403299,
      end: 86403314,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693783',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 5.576282,
      start: 86405038,
      end: 86405054,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693784',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.819458,
      start: 86415427,
      end: 86415436,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693785',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.6551719,
      start: 86421462,
      end: 86421478,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693786',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.026765,
      start: 86428506,
      end: 86428517,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693787',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 7.038672,
      start: 86428510,
      end: 86428524,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693788',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 9.220118,
      start: 86428510,
      end: 86428524,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693789',
      binding_matrix_id: 'ENSPFM0484',
      transcription_factors: ['RUNX3'],
      score: 9.109161,
      start: 86441463,
      end: 86441478,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693790',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 7.4368663,
      start: 86441802,
      end: 86441818,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693791',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.4252825,
      start: 86456230,
      end: 86456242,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693792',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -5.1819386,
      start: 86464248,
      end: 86464270,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693793',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.642711,
      start: 86464413,
      end: 86464425,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693794',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -1.1571553,
      start: 86480742,
      end: 86480755,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693795',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: 3.3521805,
      start: 86480742,
      end: 86480755,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693796',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 5.478246,
      start: 86481243,
      end: 86481254,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693797',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -7.7729487,
      start: 86482985,
      end: 86482998,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693798',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 8.252665,
      start: 86484431,
      end: 86484439,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693799',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -9.355187,
      start: 86484677,
      end: 86484690,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693800',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.400374,
      start: 86487920,
      end: 86487929,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693801',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 9.164565,
      start: 86487920,
      end: 86487929,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693802',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 8.203885,
      start: 86496285,
      end: 86496301,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693803',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 8.337005,
      start: 86496852,
      end: 86496866,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693804',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 9.012726,
      start: 86496852,
      end: 86496866,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693805',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 3.2018774,
      start: 86497232,
      end: 86497245,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693806',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.5070662,
      start: 86497293,
      end: 86497305,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693807',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 8.148225,
      start: 86498729,
      end: 86498743,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693808',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 9.214201,
      start: 86498729,
      end: 86498743,
      strand: 'forward'
    }
  ]
} as OverviewRegion;

export default regionOverview;
