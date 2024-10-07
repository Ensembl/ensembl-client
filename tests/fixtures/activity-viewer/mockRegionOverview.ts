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
  assembly: 'GRCh38',
  seqid: '4',
  locations: [
    {
      start: 84000000,
      end: 86594625
    }
  ],
  genes: [
    {
      symbol: 'NKX6-1',
      stable_id: 'ENSG00000163623.10',
      unversioned_stable_id: 'ENSG00000163623',
      biotype: 'protein_coding',
      start: 84491985,
      end: 84499292,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 84491985,
            end: 84493549
          },
          {
            start: 84495672,
            end: 84495844
          },
          {
            start: 84497559,
            end: 84499292
          }
        ],
        cds: [
          {
            start: 84493289,
            end: 84493549
          },
          {
            start: 84495672,
            end: 84495844
          },
          {
            start: 84497559,
            end: 84498228
          }
        ]
      },
      tss: [
        {
          position: 84496950
        },
        {
          position: 84499292
        }
      ],
      merged_exons: [
        {
          start: 84491985,
          end: 84493549
        },
        {
          start: 84495672,
          end: 84495844
        },
        {
          start: 84496493,
          end: 84496950
        },
        {
          start: 84497559,
          end: 84499292
        }
      ],
      cds_counts: [
        {
          start: 84493289,
          end: 84493549,
          count: 2
        },
        {
          start: 84495672,
          end: 84495692,
          count: 2
        },
        {
          start: 84495693,
          end: 84495844,
          count: 1
        },
        {
          start: 84497559,
          end: 84498228,
          count: 1
        }
      ]
    },
    {
      symbol: 'CDS1',
      stable_id: 'ENSG00000163624.6',
      unversioned_stable_id: 'ENSG00000163624',
      biotype: 'protein_coding',
      start: 84583127,
      end: 84651334,
      strand: 'forward',
      representative_transcript: {
        exons: [
          {
            start: 84583127,
            end: 84583518
          },
          {
            start: 84604243,
            end: 84604370
          },
          {
            start: 84609429,
            end: 84609525
          },
          {
            start: 84617564,
            end: 84617661
          },
          {
            start: 84619394,
            end: 84619533
          },
          {
            start: 84631819,
            end: 84631877
          },
          {
            start: 84633857,
            end: 84633939
          },
          {
            start: 84635264,
            end: 84635351
          },
          {
            start: 84638924,
            end: 84638992
          },
          {
            start: 84640838,
            end: 84640990
          },
          {
            start: 84643024,
            end: 84643143
          },
          {
            start: 84645222,
            end: 84645325
          },
          {
            start: 84648557,
            end: 84651334
          }
        ],
        cds: [
          {
            start: 84583402,
            end: 84583518
          },
          {
            start: 84604243,
            end: 84604370
          },
          {
            start: 84609429,
            end: 84609525
          },
          {
            start: 84617564,
            end: 84617661
          },
          {
            start: 84619394,
            end: 84619533
          },
          {
            start: 84631819,
            end: 84631877
          },
          {
            start: 84633857,
            end: 84633939
          },
          {
            start: 84635264,
            end: 84635351
          },
          {
            start: 84638924,
            end: 84638992
          },
          {
            start: 84640838,
            end: 84640990
          },
          {
            start: 84643024,
            end: 84643143
          },
          {
            start: 84645222,
            end: 84645325
          },
          {
            start: 84648557,
            end: 84648686
          }
        ]
      },
      tss: [
        {
          position: 84583127
        }
      ],
      merged_exons: [
        {
          start: 84638924,
          end: 84638992
        },
        {
          start: 84640838,
          end: 84640990
        },
        {
          start: 84643024,
          end: 84643143
        },
        {
          start: 84645222,
          end: 84645325
        },
        {
          start: 84648557,
          end: 84651334
        },
        {
          start: 84583127,
          end: 84583518
        },
        {
          start: 84604243,
          end: 84604370
        },
        {
          start: 84609429,
          end: 84609525
        },
        {
          start: 84617564,
          end: 84617661
        },
        {
          start: 84619394,
          end: 84619533
        },
        {
          start: 84631819,
          end: 84631877
        },
        {
          start: 84633857,
          end: 84633939
        },
        {
          start: 84635264,
          end: 84635351
        }
      ],
      cds_counts: [
        {
          start: 84583402,
          end: 84583518,
          count: 1
        },
        {
          start: 84604243,
          end: 84604370,
          count: 1
        },
        {
          start: 84609429,
          end: 84609525,
          count: 1
        },
        {
          start: 84617564,
          end: 84617661,
          count: 1
        },
        {
          start: 84619394,
          end: 84619533,
          count: 1
        },
        {
          start: 84631819,
          end: 84631877,
          count: 1
        },
        {
          start: 84633857,
          end: 84633939,
          count: 1
        },
        {
          start: 84635264,
          end: 84635351,
          count: 1
        },
        {
          start: 84638924,
          end: 84638992,
          count: 1
        },
        {
          start: 84640838,
          end: 84640990,
          count: 1
        },
        {
          start: 84643024,
          end: 84643143,
          count: 1
        },
        {
          start: 84645222,
          end: 84645325,
          count: 1
        },
        {
          start: 84648557,
          end: 84648686,
          count: 1
        }
      ]
    },
    {
      symbol: 'WDFY3',
      stable_id: 'ENSG00000163625.17',
      unversioned_stable_id: 'ENSG00000163625',
      biotype: 'protein_coding',
      start: 84668765,
      end: 84966690,
      strand: 'reverse',
      representative_transcript: {
        exons: [
          {
            start: 84669597,
            end: 84672991
          },
          {
            start: 84677199,
            end: 84677396
          },
          {
            start: 84678168,
            end: 84678279
          },
          {
            start: 84678919,
            end: 84679242
          },
          {
            start: 84682374,
            end: 84682470
          },
          {
            start: 84683943,
            end: 84684125
          },
          {
            start: 84688086,
            end: 84688265
          },
          {
            start: 84690506,
            end: 84690664
          },
          {
            start: 84691631,
            end: 84691785
          },
          {
            start: 84692885,
            end: 84693032
          },
          {
            start: 84695970,
            end: 84696182
          },
          {
            start: 84696732,
            end: 84696823
          },
          {
            start: 84702353,
            end: 84702506
          },
          {
            start: 84704338,
            end: 84704444
          },
          {
            start: 84705394,
            end: 84705511
          },
          {
            start: 84708909,
            end: 84709028
          },
          {
            start: 84709293,
            end: 84709347
          },
          {
            start: 84713159,
            end: 84713239
          },
          {
            start: 84715298,
            end: 84715383
          },
          {
            start: 84716896,
            end: 84717016
          },
          {
            start: 84718422,
            end: 84718570
          },
          {
            start: 84721409,
            end: 84721572
          },
          {
            start: 84724426,
            end: 84724594
          },
          {
            start: 84726861,
            end: 84726911
          },
          {
            start: 84733382,
            end: 84733609
          },
          {
            start: 84735043,
            end: 84735120
          },
          {
            start: 84736170,
            end: 84736327
          },
          {
            start: 84737184,
            end: 84737366
          },
          {
            start: 84739010,
            end: 84739119
          },
          {
            start: 84740187,
            end: 84740416
          },
          {
            start: 84741761,
            end: 84741921
          },
          {
            start: 84743700,
            end: 84743799
          },
          {
            start: 84751483,
            end: 84751716
          },
          {
            start: 84753697,
            end: 84753876
          },
          {
            start: 84755266,
            end: 84755400
          },
          {
            start: 84756926,
            end: 84757161
          },
          {
            start: 84765810,
            end: 84766027
          },
          {
            start: 84766252,
            end: 84766372
          },
          {
            start: 84772835,
            end: 84772929
          },
          {
            start: 84774820,
            end: 84774981
          },
          {
            start: 84775065,
            end: 84775138
          },
          {
            start: 84778503,
            end: 84778655
          },
          {
            start: 84780108,
            end: 84780298
          },
          {
            start: 84782963,
            end: 84783074
          },
          {
            start: 84785979,
            end: 84786139
          },
          {
            start: 84787482,
            end: 84787713
          },
          {
            start: 84789726,
            end: 84789907
          },
          {
            start: 84794519,
            end: 84794737
          },
          {
            start: 84794879,
            end: 84794979
          },
          {
            start: 84796521,
            end: 84796752
          },
          {
            start: 84797996,
            end: 84798108
          },
          {
            start: 84801650,
            end: 84801864
          },
          {
            start: 84803290,
            end: 84803467
          },
          {
            start: 84808334,
            end: 84808417
          },
          {
            start: 84809887,
            end: 84810344
          },
          {
            start: 84817392,
            end: 84817585
          },
          {
            start: 84820085,
            end: 84820186
          },
          {
            start: 84821084,
            end: 84821551
          },
          {
            start: 84826815,
            end: 84826981
          },
          {
            start: 84829004,
            end: 84829190
          },
          {
            start: 84831413,
            end: 84831605
          },
          {
            start: 84836929,
            end: 84837090
          },
          {
            start: 84841154,
            end: 84841263
          },
          {
            start: 84849902,
            end: 84850025
          },
          {
            start: 84860412,
            end: 84860622
          },
          {
            start: 84896911,
            end: 84897010
          },
          {
            start: 84932270,
            end: 84932363
          },
          {
            start: 84966209,
            end: 84966690
          }
        ],
        cds: [
          {
            start: 84672868,
            end: 84672991
          },
          {
            start: 84677199,
            end: 84677396
          },
          {
            start: 84678168,
            end: 84678279
          },
          {
            start: 84678919,
            end: 84679242
          },
          {
            start: 84682374,
            end: 84682470
          },
          {
            start: 84683943,
            end: 84684125
          },
          {
            start: 84688086,
            end: 84688265
          },
          {
            start: 84690506,
            end: 84690664
          },
          {
            start: 84691631,
            end: 84691785
          },
          {
            start: 84692885,
            end: 84693032
          },
          {
            start: 84695970,
            end: 84696182
          },
          {
            start: 84696732,
            end: 84696823
          },
          {
            start: 84702353,
            end: 84702506
          },
          {
            start: 84704338,
            end: 84704444
          },
          {
            start: 84705394,
            end: 84705511
          },
          {
            start: 84708909,
            end: 84709028
          },
          {
            start: 84709293,
            end: 84709347
          },
          {
            start: 84713159,
            end: 84713239
          },
          {
            start: 84715298,
            end: 84715383
          },
          {
            start: 84716896,
            end: 84717016
          },
          {
            start: 84718422,
            end: 84718570
          },
          {
            start: 84721409,
            end: 84721572
          },
          {
            start: 84724426,
            end: 84724594
          },
          {
            start: 84726861,
            end: 84726911
          },
          {
            start: 84733382,
            end: 84733609
          },
          {
            start: 84735043,
            end: 84735120
          },
          {
            start: 84736170,
            end: 84736327
          },
          {
            start: 84737184,
            end: 84737366
          },
          {
            start: 84739010,
            end: 84739119
          },
          {
            start: 84740187,
            end: 84740416
          },
          {
            start: 84741761,
            end: 84741921
          },
          {
            start: 84743700,
            end: 84743799
          },
          {
            start: 84751483,
            end: 84751716
          },
          {
            start: 84753697,
            end: 84753876
          },
          {
            start: 84755266,
            end: 84755400
          },
          {
            start: 84756926,
            end: 84757161
          },
          {
            start: 84765810,
            end: 84766027
          },
          {
            start: 84766252,
            end: 84766372
          },
          {
            start: 84772835,
            end: 84772929
          },
          {
            start: 84774820,
            end: 84774981
          },
          {
            start: 84775065,
            end: 84775138
          },
          {
            start: 84778503,
            end: 84778655
          },
          {
            start: 84780108,
            end: 84780298
          },
          {
            start: 84782963,
            end: 84783074
          },
          {
            start: 84785979,
            end: 84786139
          },
          {
            start: 84787482,
            end: 84787713
          },
          {
            start: 84789726,
            end: 84789907
          },
          {
            start: 84794519,
            end: 84794737
          },
          {
            start: 84794879,
            end: 84794979
          },
          {
            start: 84796521,
            end: 84796752
          },
          {
            start: 84797996,
            end: 84798108
          },
          {
            start: 84801650,
            end: 84801864
          },
          {
            start: 84803290,
            end: 84803467
          },
          {
            start: 84808334,
            end: 84808417
          },
          {
            start: 84809887,
            end: 84810344
          },
          {
            start: 84817392,
            end: 84817585
          },
          {
            start: 84820085,
            end: 84820186
          },
          {
            start: 84821084,
            end: 84821551
          },
          {
            start: 84826815,
            end: 84826981
          },
          {
            start: 84829004,
            end: 84829190
          },
          {
            start: 84831413,
            end: 84831605
          },
          {
            start: 84836929,
            end: 84837090
          },
          {
            start: 84841154,
            end: 84841263
          },
          {
            start: 84849902,
            end: 84850025
          },
          {
            start: 84860412,
            end: 84860591
          }
        ]
      },
      tss: [
        {
          position: 84966690
        }
      ],
      merged_exons: [
        {
          start: 84669597,
          end: 84672991
        },
        {
          start: 84677199,
          end: 84677396
        },
        {
          start: 84678168,
          end: 84678279
        },
        {
          start: 84678919,
          end: 84679242
        },
        {
          start: 84682374,
          end: 84682470
        },
        {
          start: 84683943,
          end: 84684125
        },
        {
          start: 84688086,
          end: 84688265
        },
        {
          start: 84690506,
          end: 84690664
        },
        {
          start: 84691631,
          end: 84691785
        },
        {
          start: 84692885,
          end: 84693032
        },
        {
          start: 84695970,
          end: 84696182
        },
        {
          start: 84696732,
          end: 84696823
        },
        {
          start: 84702353,
          end: 84702506
        },
        {
          start: 84704338,
          end: 84704444
        },
        {
          start: 84705394,
          end: 84705511
        },
        {
          start: 84708909,
          end: 84709028
        },
        {
          start: 84709293,
          end: 84709347
        },
        {
          start: 84713159,
          end: 84713239
        },
        {
          start: 84715298,
          end: 84715383
        },
        {
          start: 84716896,
          end: 84717016
        },
        {
          start: 84718422,
          end: 84718570
        },
        {
          start: 84721409,
          end: 84721572
        },
        {
          start: 84724426,
          end: 84724594
        },
        {
          start: 84726861,
          end: 84726911
        },
        {
          start: 84733382,
          end: 84733609
        },
        {
          start: 84735043,
          end: 84735120
        },
        {
          start: 84736170,
          end: 84736327
        },
        {
          start: 84737184,
          end: 84737366
        },
        {
          start: 84739010,
          end: 84739119
        },
        {
          start: 84740187,
          end: 84740416
        },
        {
          start: 84741761,
          end: 84741921
        },
        {
          start: 84743700,
          end: 84743799
        },
        {
          start: 84751483,
          end: 84751716
        },
        {
          start: 84753697,
          end: 84753876
        },
        {
          start: 84755266,
          end: 84755400
        },
        {
          start: 84756926,
          end: 84757161
        },
        {
          start: 84765810,
          end: 84766027
        },
        {
          start: 84766252,
          end: 84766372
        },
        {
          start: 84772835,
          end: 84772929
        },
        {
          start: 84774820,
          end: 84774981
        },
        {
          start: 84775065,
          end: 84775138
        },
        {
          start: 84778503,
          end: 84778655
        },
        {
          start: 84780108,
          end: 84780298
        },
        {
          start: 84782963,
          end: 84783074
        },
        {
          start: 84785979,
          end: 84786139
        },
        {
          start: 84787482,
          end: 84787713
        },
        {
          start: 84789726,
          end: 84789907
        },
        {
          start: 84794519,
          end: 84794737
        },
        {
          start: 84794879,
          end: 84794979
        },
        {
          start: 84796521,
          end: 84796752
        },
        {
          start: 84797996,
          end: 84798108
        },
        {
          start: 84801650,
          end: 84801864
        },
        {
          start: 84803290,
          end: 84803467
        },
        {
          start: 84808334,
          end: 84808417
        },
        {
          start: 84809887,
          end: 84810344
        },
        {
          start: 84817392,
          end: 84817585
        },
        {
          start: 84820085,
          end: 84820186
        },
        {
          start: 84821084,
          end: 84821551
        },
        {
          start: 84826815,
          end: 84826981
        },
        {
          start: 84829004,
          end: 84829190
        },
        {
          start: 84831413,
          end: 84831605
        },
        {
          start: 84836929,
          end: 84837090
        },
        {
          start: 84841154,
          end: 84841263
        },
        {
          start: 84849902,
          end: 84850025
        },
        {
          start: 84860412,
          end: 84860622
        },
        {
          start: 84896911,
          end: 84897010
        },
        {
          start: 84932270,
          end: 84932363
        },
        {
          start: 84966209,
          end: 84966690
        }
      ],
      cds_counts: [
        {
          start: 84672868,
          end: 84672991,
          count: 1
        },
        {
          start: 84677199,
          end: 84677396,
          count: 1
        },
        {
          start: 84678168,
          end: 84678279,
          count: 1
        },
        {
          start: 84678919,
          end: 84679242,
          count: 1
        },
        {
          start: 84682374,
          end: 84682470,
          count: 1
        },
        {
          start: 84683943,
          end: 84684125,
          count: 1
        },
        {
          start: 84688086,
          end: 84688265,
          count: 1
        },
        {
          start: 84690506,
          end: 84690664,
          count: 1
        },
        {
          start: 84691631,
          end: 84691785,
          count: 1
        },
        {
          start: 84692885,
          end: 84693032,
          count: 1
        },
        {
          start: 84695970,
          end: 84696182,
          count: 1
        },
        {
          start: 84696732,
          end: 84696823,
          count: 1
        },
        {
          start: 84702353,
          end: 84702506,
          count: 1
        },
        {
          start: 84704338,
          end: 84704444,
          count: 1
        },
        {
          start: 84705394,
          end: 84705511,
          count: 1
        },
        {
          start: 84708909,
          end: 84709028,
          count: 1
        },
        {
          start: 84709293,
          end: 84709347,
          count: 1
        },
        {
          start: 84713159,
          end: 84713239,
          count: 1
        },
        {
          start: 84715298,
          end: 84715383,
          count: 1
        },
        {
          start: 84716896,
          end: 84717016,
          count: 1
        },
        {
          start: 84718422,
          end: 84718570,
          count: 1
        },
        {
          start: 84721409,
          end: 84721572,
          count: 1
        },
        {
          start: 84724426,
          end: 84724594,
          count: 1
        },
        {
          start: 84726861,
          end: 84726911,
          count: 1
        },
        {
          start: 84733382,
          end: 84733609,
          count: 1
        },
        {
          start: 84735043,
          end: 84735120,
          count: 1
        },
        {
          start: 84736170,
          end: 84736327,
          count: 1
        },
        {
          start: 84737184,
          end: 84737366,
          count: 1
        },
        {
          start: 84739010,
          end: 84739119,
          count: 1
        },
        {
          start: 84740187,
          end: 84740416,
          count: 1
        },
        {
          start: 84741761,
          end: 84741921,
          count: 1
        },
        {
          start: 84743700,
          end: 84743799,
          count: 1
        },
        {
          start: 84751483,
          end: 84751716,
          count: 1
        },
        {
          start: 84753697,
          end: 84753876,
          count: 1
        },
        {
          start: 84755266,
          end: 84755400,
          count: 1
        },
        {
          start: 84756926,
          end: 84757161,
          count: 1
        },
        {
          start: 84765810,
          end: 84766027,
          count: 1
        },
        {
          start: 84766252,
          end: 84766372,
          count: 1
        },
        {
          start: 84772835,
          end: 84772929,
          count: 1
        },
        {
          start: 84774820,
          end: 84774981,
          count: 1
        },
        {
          start: 84775065,
          end: 84775138,
          count: 1
        },
        {
          start: 84778503,
          end: 84778655,
          count: 1
        },
        {
          start: 84780108,
          end: 84780298,
          count: 1
        },
        {
          start: 84782963,
          end: 84783074,
          count: 1
        },
        {
          start: 84785979,
          end: 84786139,
          count: 1
        },
        {
          start: 84787482,
          end: 84787713,
          count: 1
        },
        {
          start: 84789726,
          end: 84789907,
          count: 1
        },
        {
          start: 84794519,
          end: 84794737,
          count: 1
        },
        {
          start: 84794879,
          end: 84794979,
          count: 1
        },
        {
          start: 84796521,
          end: 84796752,
          count: 1
        },
        {
          start: 84797996,
          end: 84798108,
          count: 1
        },
        {
          start: 84801650,
          end: 84801864,
          count: 1
        },
        {
          start: 84803290,
          end: 84803467,
          count: 1
        },
        {
          start: 84808334,
          end: 84808417,
          count: 1
        },
        {
          start: 84809887,
          end: 84810344,
          count: 1
        },
        {
          start: 84817392,
          end: 84817585,
          count: 1
        },
        {
          start: 84820085,
          end: 84820186,
          count: 1
        },
        {
          start: 84821084,
          end: 84821551,
          count: 1
        },
        {
          start: 84826815,
          end: 84826981,
          count: 1
        },
        {
          start: 84829004,
          end: 84829190,
          count: 1
        },
        {
          start: 84831413,
          end: 84831605,
          count: 1
        },
        {
          start: 84836929,
          end: 84837090,
          count: 1
        },
        {
          start: 84841154,
          end: 84841263,
          count: 1
        },
        {
          start: 84849902,
          end: 84850025,
          count: 1
        },
        {
          start: 84860412,
          end: 84860591,
          count: 1
        }
      ]
    },
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
    }
  ],
  regulatory_features: [
    {
      id: 'ENSR4_5PQM6W',
      feature_type: 'CTCF_binding_site',
      start: 84028507,
      end: 84028528,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5PQM74',
      feature_type: 'CTCF_binding_site',
      start: 84028549,
      end: 84028570,
      strand: 'forward'
    },
    {
      id: 'ENSR4_938CQ4',
      feature_type: 'enhancer',
      start: 84050056,
      end: 84050424,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PR4RT',
      feature_type: 'CTCF_binding_site',
      start: 84102151,
      end: 84102172,
      strand: 'forward'
    },
    {
      id: 'ENSR4_BLNR6',
      feature_type: 'enhancer',
      start: 84126835,
      end: 84127421,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PRFBJ',
      feature_type: 'CTCF_binding_site',
      start: 84151764,
      end: 84151785,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_84GRSN',
      feature_type: 'open_chromatin_region',
      start: 84159831,
      end: 84160070,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PRHZC',
      feature_type: 'CTCF_binding_site',
      start: 84167271,
      end: 84167292,
      strand: 'forward'
    },
    {
      id: 'ENSR4_938F24',
      feature_type: 'open_chromatin_region',
      start: 84167656,
      end: 84167937,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PRJ3K',
      feature_type: 'CTCF_binding_site',
      start: 84167753,
      end: 84167774,
      strand: 'forward'
    },
    {
      id: 'ENSR4_5PRJ44',
      feature_type: 'CTCF_binding_site',
      start: 84167869,
      end: 84167890,
      strand: 'forward'
    },
    {
      id: 'ENSR4_BLPDB',
      feature_type: 'enhancer',
      start: 84238272,
      end: 84238914,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PRZ7W',
      feature_type: 'CTCF_binding_site',
      start: 84238671,
      end: 84238692,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_938FS9',
      feature_type: 'enhancer',
      start: 84244299,
      end: 84244606,
      strand: 'independent'
    },
    {
      id: 'ENSR4_76XQBD',
      feature_type: 'promoter',
      start: 84244607,
      end: 84244727,
      strand: 'independent',
      extended_start: 84244608,
      extended_end: 84244727,
      gene_name: 'LINC02994'
    },
    {
      id: 'ENSR4_5PS28F',
      feature_type: 'CTCF_binding_site',
      start: 84244616,
      end: 84244637,
      strand: 'forward'
    },
    {
      id: 'ENSR4_938FZK',
      feature_type: 'enhancer',
      start: 84259136,
      end: 84259515,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PS4QX',
      feature_type: 'CTCF_binding_site',
      start: 84259421,
      end: 84259442,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84GWSB',
      feature_type: 'promoter',
      start: 84299169,
      end: 84299399,
      strand: 'independent',
      extended_start: 84299170,
      extended_end: 84299399,
      gene_name: 'LINC02994'
    },
    {
      id: 'ENSR4_84GX8W',
      feature_type: 'open_chromatin_region',
      start: 84319209,
      end: 84319420,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938GNL',
      feature_type: 'enhancer',
      start: 84324936,
      end: 84325195,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84GZ94',
      feature_type: 'enhancer',
      start: 84366204,
      end: 84366436,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84GZJK',
      feature_type: 'enhancer',
      start: 84379112,
      end: 84379329,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938H9L',
      feature_type: 'promoter',
      start: 84380179,
      end: 84380601,
      strand: 'independent',
      extended_start: 84380180,
      extended_end: 84380601
    },
    {
      id: 'ENSR4_84H23S',
      feature_type: 'open_chromatin_region',
      start: 84403772,
      end: 84403922,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PT4ZN',
      feature_type: 'CTCF_binding_site',
      start: 84418125,
      end: 84418146,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5PTBQC',
      feature_type: 'CTCF_binding_site',
      start: 84451748,
      end: 84451769,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84H3HC',
      feature_type: 'open_chromatin_region',
      start: 84470319,
      end: 84470507,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PTFXP',
      feature_type: 'CTCF_binding_site',
      start: 84470400,
      end: 84470421,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5PTHKL',
      feature_type: 'CTCF_binding_site',
      start: 84479880,
      end: 84479901,
      strand: 'forward'
    },
    {
      id: 'ENSR4_5PTHLB',
      feature_type: 'CTCF_binding_site',
      start: 84480037,
      end: 84480058,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_BLQNG',
      feature_type: 'enhancer',
      start: 84481283,
      end: 84482140,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84H3QJ',
      feature_type: 'enhancer',
      start: 84482706,
      end: 84482959,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938JDC',
      feature_type: 'promoter',
      start: 84482960,
      end: 84483331,
      strand: 'independent',
      extended_start: 84482961,
      extended_end: 84483331
    },
    {
      id: 'ENSR4_5PTJ4Z',
      feature_type: 'CTCF_binding_site',
      start: 84482988,
      end: 84483009,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5PTJ5D',
      feature_type: 'CTCF_binding_site',
      start: 84483071,
      end: 84483092,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_938JJF',
      feature_type: 'promoter',
      start: 84496940,
      end: 84497440,
      strand: 'independent',
      extended_start: 84496941,
      extended_end: 84498440,
      gene_name: 'NKX6-1'
    },
    {
      id: 'ENSR4_BLQQX',
      feature_type: 'enhancer',
      start: 84498441,
      end: 84499281,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938JK3',
      feature_type: 'promoter',
      start: 84499282,
      end: 84499587,
      strand: 'independent',
      extended_start: 84499283,
      extended_end: 84499587,
      gene_name: 'NKX6-1,'
    },
    {
      id: 'ENSR4_938JK6',
      feature_type: 'enhancer',
      start: 84499588,
      end: 84500041,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938JKR',
      feature_type: 'enhancer',
      start: 84501764,
      end: 84502189,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938JL5',
      feature_type: 'enhancer',
      start: 84502887,
      end: 84503349,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938JLD',
      feature_type: 'enhancer',
      start: 84503731,
      end: 84504178,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PTMNT',
      feature_type: 'CTCF_binding_site',
      start: 84503915,
      end: 84503936,
      strand: 'forward'
    },
    {
      id: 'ENSR4_5PTMPD',
      feature_type: 'CTCF_binding_site',
      start: 84504029,
      end: 84504050,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84H4QG',
      feature_type: 'enhancer',
      start: 84529276,
      end: 84529455,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PTS3M',
      feature_type: 'CTCF_binding_site',
      start: 84529355,
      end: 84529376,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84H4R7',
      feature_type: 'enhancer',
      start: 84530587,
      end: 84530755,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938JW8',
      feature_type: 'enhancer',
      start: 84530921,
      end: 84531227,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938JWG',
      feature_type: 'enhancer',
      start: 84531697,
      end: 84532109,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84H5P8',
      feature_type: 'enhancer',
      start: 84573828,
      end: 84574039,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938KF3',
      feature_type: 'enhancer',
      start: 84578651,
      end: 84579008,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PW5JC',
      feature_type: 'CTCF_binding_site',
      start: 84578757,
      end: 84578778,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_84H5SB',
      feature_type: 'enhancer',
      start: 84579132,
      end: 84579301,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938KF9',
      feature_type: 'enhancer',
      start: 84579467,
      end: 84579734,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938KG7',
      feature_type: 'promoter',
      start: 84582637,
      end: 84583137,
      strand: 'independent',
      extended_start: 84582046,
      extended_end: 84583137,
      gene_name: 'CDS1'
    },
    {
      id: 'ENSR4_938KGD',
      feature_type: 'promoter',
      start: 84583218,
      end: 84583718,
      strand: 'independent',
      extended_start: 84583219,
      extended_end: 84584341
    },
    {
      id: 'ENSR4_5PW6F5',
      feature_type: 'CTCF_binding_site',
      start: 84583887,
      end: 84583908,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5PW6G7',
      feature_type: 'CTCF_binding_site',
      start: 84584124,
      end: 84584145,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_76ZB9P',
      feature_type: 'enhancer',
      start: 84593930,
      end: 84594054,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938KLB',
      feature_type: 'enhancer',
      start: 84596852,
      end: 84597209,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938KLH',
      feature_type: 'enhancer',
      start: 84597512,
      end: 84597798,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938KZH',
      feature_type: 'enhancer',
      start: 84632159,
      end: 84632438,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84H754',
      feature_type: 'enhancer',
      start: 84639244,
      end: 84639410,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938L5X',
      feature_type: 'enhancer',
      start: 84647356,
      end: 84647761,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PWL7R',
      feature_type: 'CTCF_binding_site',
      start: 84652725,
      end: 84652746,
      strand: 'forward'
    },
    {
      id: 'ENSR4_938LFG',
      feature_type: 'enhancer',
      start: 84673516,
      end: 84673809,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PWQRX',
      feature_type: 'CTCF_binding_site',
      start: 84679540,
      end: 84679561,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5PWQSH',
      feature_type: 'CTCF_binding_site',
      start: 84679656,
      end: 84679677,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84H82L',
      feature_type: 'enhancer',
      start: 84681615,
      end: 84681802,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938LHX',
      feature_type: 'enhancer',
      start: 84681927,
      end: 84682368,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84H8CX',
      feature_type: 'enhancer',
      start: 84697678,
      end: 84697917,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PX7T5',
      feature_type: 'CTCF_binding_site',
      start: 84749779,
      end: 84749800,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84H9HF',
      feature_type: 'enhancer',
      start: 84750364,
      end: 84750616,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PX7Z8',
      feature_type: 'CTCF_binding_site',
      start: 84750450,
      end: 84750471,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_938MNT',
      feature_type: 'enhancer',
      start: 84792386,
      end: 84792680,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84HBMC',
      feature_type: 'enhancer',
      start: 84803856,
      end: 84804057,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938MSB',
      feature_type: 'enhancer',
      start: 84804192,
      end: 84804522,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938MX8',
      feature_type: 'enhancer',
      start: 84814438,
      end: 84814716,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84HCNB',
      feature_type: 'enhancer',
      start: 84852150,
      end: 84852357,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PXW6L',
      feature_type: 'CTCF_binding_site',
      start: 84856589,
      end: 84856610,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_BLSQQ',
      feature_type: 'enhancer',
      start: 84870365,
      end: 84870974,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84HD7R',
      feature_type: 'enhancer',
      start: 84877168,
      end: 84877360,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938NLN',
      feature_type: 'enhancer',
      start: 84878130,
      end: 84878459,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84HDG2',
      feature_type: 'enhancer',
      start: 84887908,
      end: 84888119,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PZ6TD',
      feature_type: 'CTCF_binding_site',
      start: 84901465,
      end: 84901486,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_84HF2Z',
      feature_type: 'enhancer',
      start: 84915513,
      end: 84915709,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938P3Z',
      feature_type: 'enhancer',
      start: 84920626,
      end: 84921009,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84HF87',
      feature_type: 'enhancer',
      start: 84924541,
      end: 84924730,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938P95',
      feature_type: 'enhancer',
      start: 84938387,
      end: 84938792,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84HFN4',
      feature_type: 'enhancer',
      start: 84945050,
      end: 84945261,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84HFPT',
      feature_type: 'enhancer',
      start: 84948150,
      end: 84948399,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938PF4',
      feature_type: 'enhancer',
      start: 84951965,
      end: 84952461,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84HFWH',
      feature_type: 'enhancer',
      start: 84956142,
      end: 84956326,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84HFXM',
      feature_type: 'enhancer',
      start: 84958140,
      end: 84958356,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BLT9H',
      feature_type: 'promoter',
      start: 84965224,
      end: 84966236,
      strand: 'independent',
      extended_start: 84965225,
      extended_end: 84966236,
      gene_name: 'WDFY3-AS2'
    },
    {
      id: 'ENSR4_5PZKXK',
      feature_type: 'CTCF_binding_site',
      start: 84966090,
      end: 84966111,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5PZKZ5',
      feature_type: 'CTCF_binding_site',
      start: 84966212,
      end: 84966233,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_938PK7',
      feature_type: 'enhancer',
      start: 84966237,
      end: 84966679,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938PKC',
      feature_type: 'promoter',
      start: 84966680,
      end: 84967180,
      strand: 'independent',
      extended_start: 84966681,
      extended_end: 84967754,
      gene_name: 'WDFY3'
    },
    {
      id: 'ENSR4_5PZL3H',
      feature_type: 'CTCF_binding_site',
      start: 84966722,
      end: 84966743,
      strand: 'forward'
    },
    {
      id: 'ENSR4_5PZLS3',
      feature_type: 'CTCF_binding_site',
      start: 84971162,
      end: 84971183,
      strand: 'forward'
    },
    {
      id: 'ENSR4_938PLM',
      feature_type: 'enhancer',
      start: 84971331,
      end: 84971646,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5PZLTP',
      feature_type: 'CTCF_binding_site',
      start: 84971521,
      end: 84971542,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84HGJR',
      feature_type: 'enhancer',
      start: 84986072,
      end: 84986256,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938PTB',
      feature_type: 'enhancer',
      start: 84994276,
      end: 84994685,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938PZN',
      feature_type: 'enhancer',
      start: 85005925,
      end: 85006251,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938QCD',
      feature_type: 'enhancer',
      start: 85039556,
      end: 85039817,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938QDM',
      feature_type: 'enhancer',
      start: 85043882,
      end: 85044142,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938QSD',
      feature_type: 'open_chromatin_region',
      start: 85084423,
      end: 85084833,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q2C95',
      feature_type: 'CTCF_binding_site',
      start: 85084580,
      end: 85084601,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_938R9W',
      feature_type: 'enhancer',
      start: 85127642,
      end: 85128075,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938RHM',
      feature_type: 'enhancer',
      start: 85147468,
      end: 85147960,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q2Q46',
      feature_type: 'CTCF_binding_site',
      start: 85147658,
      end: 85147679,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5Q2Q4H',
      feature_type: 'CTCF_binding_site',
      start: 85147729,
      end: 85147750,
      strand: 'forward'
    },
    {
      id: 'ENSR4_938RJ8',
      feature_type: 'enhancer',
      start: 85149674,
      end: 85149957,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q2T84',
      feature_type: 'CTCF_binding_site',
      start: 85166004,
      end: 85166025,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_84HLF6',
      feature_type: 'open_chromatin_region',
      start: 85166371,
      end: 85166594,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938S2N',
      feature_type: 'enhancer',
      start: 85196067,
      end: 85196337,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938S6G',
      feature_type: 'enhancer',
      start: 85209151,
      end: 85209480,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938S6S',
      feature_type: 'enhancer',
      start: 85210418,
      end: 85210735,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q38X5',
      feature_type: 'CTCF_binding_site',
      start: 85228437,
      end: 85228458,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5Q3CLD',
      feature_type: 'CTCF_binding_site',
      start: 85244041,
      end: 85244062,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_5Q3SCL',
      feature_type: 'CTCF_binding_site',
      start: 85318397,
      end: 85318418,
      strand: 'forward'
    },
    {
      id: 'ENSR4_938TW5',
      feature_type: 'enhancer',
      start: 85370333,
      end: 85370837,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q46BF',
      feature_type: 'CTCF_binding_site',
      start: 85370624,
      end: 85370645,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84HR8K',
      feature_type: 'enhancer',
      start: 85391743,
      end: 85391976,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938W77',
      feature_type: 'enhancer',
      start: 85398310,
      end: 85398663,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938W8D',
      feature_type: 'enhancer',
      start: 85402407,
      end: 85402786,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938WDX',
      feature_type: 'open_chromatin_region',
      start: 85418149,
      end: 85418439,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q4GH3',
      feature_type: 'CTCF_binding_site',
      start: 85418284,
      end: 85418305,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_84HRWX',
      feature_type: 'enhancer',
      start: 85423479,
      end: 85423724,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938WJK',
      feature_type: 'open_chromatin_region',
      start: 85430716,
      end: 85430992,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q4L86',
      feature_type: 'CTCF_binding_site',
      start: 85440120,
      end: 85440141,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_BLXTG',
      feature_type: 'enhancer',
      start: 85448956,
      end: 85449553,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938WQR',
      feature_type: 'open_chromatin_region',
      start: 85452106,
      end: 85452591,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q4NQ7',
      feature_type: 'CTCF_binding_site',
      start: 85454819,
      end: 85454840,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_BLZ26',
      feature_type: 'promoter',
      start: 85474660,
      end: 85475248,
      strand: 'independent',
      extended_start: 85474386,
      extended_end: 85475248,
      gene_name: 'ARHGAP24'
    },
    {
      id: 'ENSR4_5Q4S7C',
      feature_type: 'CTCF_binding_site',
      start: 85474938,
      end: 85474959,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_938X2G',
      feature_type: 'enhancer',
      start: 85475249,
      end: 85475594,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938X2K',
      feature_type: 'promoter',
      start: 85475595,
      end: 85475998,
      strand: 'independent',
      extended_start: 85475596,
      extended_end: 85475998
    },
    {
      id: 'ENSR4_BLZ2F',
      feature_type: 'enhancer',
      start: 85476470,
      end: 85477102,
      strand: 'independent'
    },
    {
      id: 'ENSR4_CBH2B',
      feature_type: 'enhancer',
      start: 85477312,
      end: 85478917,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BLZ3T',
      feature_type: 'enhancer',
      start: 85486501,
      end: 85487070,
      strand: 'independent'
    },
    {
      id: 'ENSR4_938X6J',
      feature_type: 'enhancer',
      start: 85489250,
      end: 85489737,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5Q4WRJ',
      feature_type: 'CTCF_binding_site',
      start: 85490096,
      end: 85490117,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_938X77',
      feature_type: 'enhancer',
      start: 85491500,
      end: 85491956,
      strand: 'independent'
    },
    {
      id: 'ENSR4_CBH3M',
      feature_type: 'enhancer',
      start: 85495708,
      end: 85497396,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BLZ5K',
      feature_type: 'enhancer',
      start: 85497908,
      end: 85498836,
      strand: 'independent'
    },
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
      extended_end: 85778716,
      gene_name: 'ARHGAP24'
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
      extended_end: 85930283,
      gene_name: 'ARHGAP24'
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
      extended_end: 86358676,
      gene_name: 'MAPK10'
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
      extended_end: 86360187,
      gene_name: 'MAPK10,'
    },
    {
      id: 'ENSR4_9399HJ',
      feature_type: 'promoter',
      start: 86360212,
      end: 86360627,
      strand: 'independent',
      extended_start: 86360213,
      extended_end: 86360627,
      gene_name: 'MAPK10'
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
      extended_end: 86454143,
      gene_name: 'MAPK10'
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
    },
    {
      id: 'ENSR4_84JN2B',
      feature_type: 'enhancer',
      start: 86500701,
      end: 86500861,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JN5R',
      feature_type: 'enhancer',
      start: 86506689,
      end: 86506875,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM6JP',
      feature_type: 'enhancer',
      start: 86508402,
      end: 86508933,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JNGG',
      feature_type: 'enhancer',
      start: 86521614,
      end: 86521847,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5QCGSB',
      feature_type: 'CTCF_binding_site',
      start: 86522532,
      end: 86522553,
      strand: 'reverse'
    },
    {
      id: 'ENSR4_939CDF',
      feature_type: 'open_chromatin_region',
      start: 86536178,
      end: 86536457,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM6PW',
      feature_type: 'enhancer',
      start: 86543970,
      end: 86544908,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JP6L',
      feature_type: 'enhancer',
      start: 86554764,
      end: 86554954,
      strand: 'independent'
    },
    {
      id: 'ENSR4_BM6RP',
      feature_type: 'enhancer',
      start: 86556894,
      end: 86557446,
      strand: 'independent'
    },
    {
      id: 'ENSR4_84JP9Z',
      feature_type: 'enhancer',
      start: 86560546,
      end: 86560748,
      strand: 'independent'
    },
    {
      id: 'ENSR4_5QCQ5J',
      feature_type: 'CTCF_binding_site',
      start: 86565126,
      end: 86565147,
      strand: 'forward'
    },
    {
      id: 'ENSR4_84JPQN',
      feature_type: 'enhancer',
      start: 86582533,
      end: 86582732,
      strand: 'independent'
    },
    {
      id: 'ENSR4_939CWW',
      feature_type: 'enhancer',
      start: 86586122,
      end: 86586494,
      strand: 'independent'
    },
    {
      id: 'ENSR4_CBKZZ',
      feature_type: 'enhancer',
      start: 86592714,
      end: 86594051,
      strand: 'independent'
    },
    {
      id: 'ENSR4_939D27',
      feature_type: 'promoter',
      start: 86594052,
      end: 86594327,
      strand: 'independent',
      extended_start: 86594053,
      extended_end: 86594327,
      gene_name: 'MAPK10,PTPN13'
    },
    {
      id: 'ENSR4_939D29',
      feature_type: 'enhancer',
      start: 86594328,
      end: 86594614,
      strand: 'independent'
    }
  ],
  motif_features: [
    {
      id: 'ENSM00000693378',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.6297026,
      start: 84028509,
      end: 84028525,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693379',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.7534018,
      start: 84028551,
      end: 84028567,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693380',
      binding_matrix_id: 'ENSPFM0485',
      transcription_factors: ['RUNX3'],
      score: 6.2338614,
      start: 84031536,
      end: 84031553,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693381',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 9.167964,
      start: 84032453,
      end: 84032461,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693382',
      binding_matrix_id: 'ENSPFM0485',
      transcription_factors: ['RUNX3'],
      score: 5.0532,
      start: 84032571,
      end: 84032588,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693383',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 9.167964,
      start: 84050128,
      end: 84050136,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693384',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.055267,
      start: 84096514,
      end: 84096523,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693385',
      binding_matrix_id: 'ENSPFM0517',
      transcription_factors: ['TEAD4'],
      score: 8.58347,
      start: 84099793,
      end: 84099802,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693386',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 9.58214,
      start: 84102153,
      end: 84102169,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693387',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.172355,
      start: 84138303,
      end: 84138315,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693388',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.701418,
      start: 84138486,
      end: 84138499,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693389',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.75875,
      start: 84138486,
      end: 84138499,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693390',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -1.5462666,
      start: 84138748,
      end: 84138763,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693391',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 7.1740575,
      start: 84151766,
      end: 84151782,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693392',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.225098,
      start: 84167273,
      end: 84167289,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693393',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 8.998341,
      start: 84167755,
      end: 84167771,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693394',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.4040264,
      start: 84167871,
      end: 84167887,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693395',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 6.7328296,
      start: 84194498,
      end: 84194512,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693396',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 6.974716,
      start: 84194498,
      end: 84194512,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693397',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.608817,
      start: 84198753,
      end: 84198762,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693398',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.134357,
      start: 84199970,
      end: 84199981,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693399',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 9.177076,
      start: 84231859,
      end: 84231873,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693400',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 9.840523,
      start: 84231859,
      end: 84231873,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693401',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 5.845079,
      start: 84235695,
      end: 84235708,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693402',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 11.536121,
      start: 84237155,
      end: 84237170,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693403',
      binding_matrix_id: 'ENSPFM0508',
      transcription_factors: ['SRF'],
      score: 9.046782,
      start: 84237155,
      end: 84237170,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693404',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.289611,
      start: 84238490,
      end: 84238499,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693405',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.175113,
      start: 84238673,
      end: 84238689,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693406',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.613797,
      start: 84243239,
      end: 84243250,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693407',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.427461,
      start: 84243797,
      end: 84243808,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693408',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 10.64654,
      start: 84244618,
      end: 84244634,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693409',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.400374,
      start: 84254731,
      end: 84254740,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693410',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 9.164565,
      start: 84254731,
      end: 84254740,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693411',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.151044,
      start: 84258936,
      end: 84258947,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693412',
      binding_matrix_id: 'ENSPFM0422',
      transcription_factors: ['NR2F1'],
      score: 6.9538593,
      start: 84259208,
      end: 84259220,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693413',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.814371,
      start: 84259220,
      end: 84259227,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693414',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.289024,
      start: 84259309,
      end: 84259322,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693415',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.6403284,
      start: 84259309,
      end: 84259322,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693416',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -5.015458,
      start: 84259400,
      end: 84259413,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693417',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 10.347609,
      start: 84259423,
      end: 84259439,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693418',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 11.041203,
      start: 84278128,
      end: 84278137,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693419',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.624297,
      start: 84278128,
      end: 84278137,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693420',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 5.9539933,
      start: 84317723,
      end: 84317736,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693421',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 5.303145,
      start: 84324435,
      end: 84324445,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693422',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 8.224712,
      start: 84324489,
      end: 84324499,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693423',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.823171,
      start: 84341748,
      end: 84341759,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693424',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 6.8961487,
      start: 84341828,
      end: 84341842,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693425',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 6.987619,
      start: 84341828,
      end: 84341842,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693426',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 4.203717,
      start: 84341863,
      end: 84341877,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693427',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.0913625,
      start: 84341863,
      end: 84341877,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693428',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 0.68940634,
      start: 84418127,
      end: 84418143,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693429',
      binding_matrix_id: 'ENSPFM0365',
      transcription_factors: ['MAX'],
      score: 4.1574717,
      start: 84434015,
      end: 84434031,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693430',
      binding_matrix_id: 'ENSPFM0365',
      transcription_factors: ['MAX'],
      score: 5.582808,
      start: 84434015,
      end: 84434031,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693431',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -5.653418,
      start: 84443599,
      end: 84443612,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693432',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 8.919372,
      start: 84451750,
      end: 84451766,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693433',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 6.914462,
      start: 84470402,
      end: 84470418,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693434',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.5141046,
      start: 84479882,
      end: 84479898,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693435',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.544169,
      start: 84480039,
      end: 84480055,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693436',
      binding_matrix_id: 'ENSPFM0614',
      transcription_factors: ['YY1'],
      score: 8.122803,
      start: 84482930,
      end: 84482940,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693437',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 7.5510335,
      start: 84482990,
      end: 84483006,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693438',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 6.7646728,
      start: 84483073,
      end: 84483089,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693439',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 5.0542808,
      start: 84495503,
      end: 84495513,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693440',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 5.6489596,
      start: 84495581,
      end: 84495591,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693441',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 6.219566,
      start: 84499423,
      end: 84499433,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693442',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 10.526498,
      start: 84499582,
      end: 84499592,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693443',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 6.3092804,
      start: 84499597,
      end: 84499607,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693444',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 7.554611,
      start: 84499678,
      end: 84499688,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693445',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.6288044,
      start: 84503917,
      end: 84503933,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693446',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 11.323706,
      start: 84504031,
      end: 84504047,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693447',
      binding_matrix_id: 'ENSPFM0320',
      transcription_factors: ['PAX5'],
      score: 13.265945,
      start: 84509228,
      end: 84509244,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693448',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 5.9352603,
      start: 84529357,
      end: 84529373,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693449',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.8705273,
      start: 84550178,
      end: 84550187,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693450',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.580489,
      start: 84550178,
      end: 84550187,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693451',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 5.4922094,
      start: 84566048,
      end: 84566058,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693452',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 7.205291,
      start: 84569998,
      end: 84570012,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693453',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 8.56709,
      start: 84569998,
      end: 84570012,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693454',
      binding_matrix_id: 'ENSPFM0017',
      transcription_factors: ['BACH1'],
      score: 9.167964,
      start: 84570001,
      end: 84570009,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693455',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.974323,
      start: 84570005,
      end: 84570016,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693456',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 9.64134,
      start: 84578759,
      end: 84578775,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693457',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 8.70509,
      start: 84582715,
      end: 84582725,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693458',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 5.5886803,
      start: 84582757,
      end: 84582767,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693459',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 6.1304054,
      start: 84582798,
      end: 84582808,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693460',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 10.631646,
      start: 84582804,
      end: 84582814,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693461',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 8.70509,
      start: 84582846,
      end: 84582856,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693462',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 10.043862,
      start: 84582881,
      end: 84582891,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693463',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 11.515585,
      start: 84582975,
      end: 84582985,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693464',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 6.0048404,
      start: 84582984,
      end: 84582994,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693465',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 8.139279,
      start: 84583052,
      end: 84583062,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693466',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.8156579,
      start: 84583889,
      end: 84583905,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693467',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.5143135,
      start: 84584126,
      end: 84584142,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693468',
      binding_matrix_id: 'ENSPFM0287',
      transcription_factors: ['HNF4A'],
      score: 8.723943,
      start: 84585387,
      end: 84585402,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693469',
      binding_matrix_id: 'ENSPFM0289',
      transcription_factors: ['HNF4A'],
      score: 4.301904,
      start: 84585388,
      end: 84585402,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693470',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 5.55834,
      start: 84585420,
      end: 84585433,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693471',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 7.353602,
      start: 84585481,
      end: 84585494,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693472',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.001993,
      start: 84597711,
      end: 84597722,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693473',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.819458,
      start: 84632311,
      end: 84632320,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693474',
      binding_matrix_id: 'ENSPFM0614',
      transcription_factors: ['YY1'],
      score: 7.6624894,
      start: 84647421,
      end: 84647431,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693475',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 5.5306473,
      start: 84652727,
      end: 84652743,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693476',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.4180536,
      start: 84679542,
      end: 84679558,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693477',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.7534724,
      start: 84679658,
      end: 84679674,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693478',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.4195223,
      start: 84683656,
      end: 84683665,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693479',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.949064,
      start: 84691313,
      end: 84691324,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693480',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.705535,
      start: 84691387,
      end: 84691396,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693481',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 4.4020486,
      start: 84697018,
      end: 84697032,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693482',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 8.055894,
      start: 84697018,
      end: 84697032,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693483',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.0727005,
      start: 84697025,
      end: 84697036,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693484',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.945373,
      start: 84697062,
      end: 84697073,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693485',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.559993,
      start: 84697301,
      end: 84697312,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693486',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 10.511355,
      start: 84699131,
      end: 84699140,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693487',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.040221,
      start: 84699131,
      end: 84699140,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693488',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.0325522,
      start: 84710738,
      end: 84710752,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693489',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 7.9386306,
      start: 84710738,
      end: 84710752,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693490',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 0.95360804,
      start: 84749781,
      end: 84749797,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693491',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 10.476582,
      start: 84750452,
      end: 84750468,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693492',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 10.511355,
      start: 84751900,
      end: 84751909,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693493',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.040221,
      start: 84751900,
      end: 84751909,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693494',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 11.127413,
      start: 84777201,
      end: 84777215,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693495',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 11.597804,
      start: 84777201,
      end: 84777215,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693496',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 7.796091,
      start: 84826052,
      end: 84826063,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693497',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.251795,
      start: 84847158,
      end: 84847169,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693498',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.361687,
      start: 84847162,
      end: 84847176,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693499',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 6.0039353,
      start: 84847162,
      end: 84847176,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693500',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.6286438,
      start: 84856591,
      end: 84856607,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693501',
      binding_matrix_id: 'ENSPFM0212',
      transcription_factors: ['GATA3'],
      score: 7.6537757,
      start: 84870660,
      end: 84870667,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693502',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 5.6886334,
      start: 84870673,
      end: 84870683,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693503',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.540042,
      start: 84901467,
      end: 84901483,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693504',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.604263,
      start: 84920749,
      end: 84920758,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693505',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.235382,
      start: 84922068,
      end: 84922077,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693506',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.8705273,
      start: 84922179,
      end: 84922188,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693507',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.580489,
      start: 84922179,
      end: 84922188,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693508',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.100914,
      start: 84958273,
      end: 84958284,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693509',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.9993316,
      start: 84966092,
      end: 84966108,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693510',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 4.6125245,
      start: 84966214,
      end: 84966230,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693511',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 0.7982017,
      start: 84966724,
      end: 84966740,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693512',
      binding_matrix_id: 'ENSPFM0288',
      transcription_factors: ['HNF4A'],
      score: 8.557393,
      start: 84966895,
      end: 84966910,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693513',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 5.5280356,
      start: 84966897,
      end: 84966910,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693514',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.717267,
      start: 84967496,
      end: 84967510,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693515',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 7.5030437,
      start: 84967496,
      end: 84967510,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693516',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.237004,
      start: 84967503,
      end: 84967514,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693517',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 6.107953,
      start: 84971164,
      end: 84971180,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693518',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.5121913,
      start: 84971523,
      end: 84971539,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693519',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 7.9509397,
      start: 85044029,
      end: 85044042,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693520',
      binding_matrix_id: 'ENSPFM0088',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.4916325,
      start: 85044066,
      end: 85044077,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693521',
      binding_matrix_id: 'ENSPFM0186',
      transcription_factors: ['FOXA1'],
      score: 9.764781,
      start: 85050471,
      end: 85050481,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693522',
      binding_matrix_id: 'ENSPFM0186',
      transcription_factors: ['FOXA1'],
      score: 9.556562,
      start: 85050487,
      end: 85050497,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693523',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.8705273,
      start: 85050940,
      end: 85050949,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693524',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.580489,
      start: 85050940,
      end: 85050949,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693525',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: 1.726472,
      start: 85055699,
      end: 85055712,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693526',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: 4.1731195,
      start: 85055699,
      end: 85055712,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693527',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.790418,
      start: 85062025,
      end: 85062036,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693528',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.3578415,
      start: 85062173,
      end: 85062184,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693529',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.175748,
      start: 85079104,
      end: 85079115,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693530',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 9.898874,
      start: 85084582,
      end: 85084598,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693531',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -9.293941,
      start: 85112224,
      end: 85112237,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693532',
      binding_matrix_id: 'ENSPFM0516',
      transcription_factors: ['TCF3'],
      score: 6.8011026,
      start: 85127815,
      end: 85127824,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693533',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.0277996,
      start: 85144243,
      end: 85144257,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693534',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -3.0267005,
      start: 85147582,
      end: 85147597,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693535',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 10.43632,
      start: 85147660,
      end: 85147676,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693536',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 1.5495899,
      start: 85147731,
      end: 85147747,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693537',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 0.7249404,
      start: 85166006,
      end: 85166022,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693538',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.8705273,
      start: 85182817,
      end: 85182826,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693539',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.580489,
      start: 85182817,
      end: 85182826,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693540',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 6.8130813,
      start: 85196206,
      end: 85196220,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693541',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 8.597257,
      start: 85196206,
      end: 85196220,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693542',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 7.988838,
      start: 85210638,
      end: 85210649,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693543',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.660639,
      start: 85228439,
      end: 85228455,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693544',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 4.8316865,
      start: 85242548,
      end: 85242561,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693545',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 5.453984,
      start: 85244043,
      end: 85244059,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693546',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.2864513,
      start: 85248745,
      end: 85248754,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693547',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.050642,
      start: 85248745,
      end: 85248754,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693548',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.484631,
      start: 85250906,
      end: 85250917,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693549',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.129812,
      start: 85251055,
      end: 85251066,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693550',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.640742,
      start: 85260262,
      end: 85260273,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693551',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 5.787112,
      start: 85318399,
      end: 85318415,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693552',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.8162985,
      start: 85340228,
      end: 85340237,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693553',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.634718,
      start: 85340228,
      end: 85340237,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693554',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.6434264,
      start: 85370561,
      end: 85370574,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693555',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.7296014,
      start: 85370561,
      end: 85370574,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693556',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.5783744,
      start: 85370562,
      end: 85370575,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693557',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.9155297,
      start: 85370562,
      end: 85370575,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693558',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 6.6190577,
      start: 85370626,
      end: 85370642,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693559',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.8162985,
      start: 85377936,
      end: 85377945,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693560',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.634718,
      start: 85377936,
      end: 85377945,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693561',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.8162985,
      start: 85382187,
      end: 85382196,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693562',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 8.634718,
      start: 85382187,
      end: 85382196,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693563',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 13.822766,
      start: 85392519,
      end: 85392530,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693564',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 9.041424,
      start: 85392519,
      end: 85392530,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693565',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 10.833051,
      start: 85392537,
      end: 85392548,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693566',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 13.822766,
      start: 85392547,
      end: 85392558,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693567',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 9.041424,
      start: 85392547,
      end: 85392558,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693568',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 10.833051,
      start: 85392561,
      end: 85392572,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693569',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 13.822766,
      start: 85392571,
      end: 85392582,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693570',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 9.041424,
      start: 85392571,
      end: 85392582,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693571',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 13.822766,
      start: 85392589,
      end: 85392600,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693572',
      binding_matrix_id: 'ENSPFM0366',
      transcription_factors: ['MEF2A', 'MEF2B'],
      score: 9.041424,
      start: 85392589,
      end: 85392600,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693573',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 2.034775,
      start: 85397126,
      end: 85397137,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693574',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.056657,
      start: 85399670,
      end: 85399681,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693575',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.696189,
      start: 85400050,
      end: 85400061,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693576',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 7.737162,
      start: 85413339,
      end: 85413350,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693577',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 9.958604,
      start: 85418286,
      end: 85418302,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693578',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 3.4514585,
      start: 85440122,
      end: 85440138,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693579',
      binding_matrix_id: 'ENSPFM0024',
      transcription_factors: ['USF1', 'SREBF2'],
      score: 7.3778396,
      start: 85443656,
      end: 85443665,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693580',
      binding_matrix_id: 'ENSPFM0024',
      transcription_factors: ['USF1', 'SREBF2'],
      score: 7.467731,
      start: 85443656,
      end: 85443665,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693581',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 4.3546367,
      start: 85444357,
      end: 85444371,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693582',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 8.632499,
      start: 85449275,
      end: 85449287,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693583',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.619755,
      start: 85452776,
      end: 85452787,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693584',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.738329,
      start: 85454821,
      end: 85454837,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693585',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: 0.0068390137,
      start: 85474365,
      end: 85474387,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693586',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: 0.069406815,
      start: 85474365,
      end: 85474387,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693587',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 0.72792846,
      start: 85474940,
      end: 85474956,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693588',
      binding_matrix_id: 'ENSPFM0029',
      transcription_factors: ['CEBPB'],
      score: 7.733609,
      start: 85475170,
      end: 85475179,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693589',
      binding_matrix_id: 'ENSPFM0086',
      transcription_factors: ['EGR1'],
      score: 7.1004567,
      start: 85475302,
      end: 85475315,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693590',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 6.6685705,
      start: 85475424,
      end: 85475437,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693591',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 11.257411,
      start: 85477495,
      end: 85477508,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693592',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 11.290198,
      start: 85477495,
      end: 85477508,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693593',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.806574,
      start: 85477496,
      end: 85477509,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693594',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -2.9555833,
      start: 85482269,
      end: 85482291,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693595',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -3.2299461,
      start: 85482269,
      end: 85482291,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693596',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 2.1561875,
      start: 85490098,
      end: 85490114,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693597',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.1289186,
      start: 85491596,
      end: 85491609,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693598',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.2256575,
      start: 85491596,
      end: 85491609,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693599',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.0304947,
      start: 85491627,
      end: 85491640,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693600',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.075674,
      start: 85491627,
      end: 85491640,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693601',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 11.12283,
      start: 85495863,
      end: 85495874,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693602',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.715112,
      start: 85498578,
      end: 85498589,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693603',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.715112,
      start: 85498622,
      end: 85498633,
      strand: 'forward'
    },
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
    },
    {
      id: 'ENSM00000693809',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 9.23305,
      start: 86504638,
      end: 86504650,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693810',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 10.1240015,
      start: 86521521,
      end: 86521534,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693811',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 9.984537,
      start: 86521521,
      end: 86521534,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693812',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -2.76187,
      start: 86521727,
      end: 86521742,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693813',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 7.4800253,
      start: 86521844,
      end: 86521852,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693814',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 8.890599,
      start: 86522165,
      end: 86522177,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693815',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.886454,
      start: 86522259,
      end: 86522271,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693816',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 7.671152,
      start: 86522534,
      end: 86522550,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693817',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -2.4907546,
      start: 86522728,
      end: 86522743,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693818',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 10.591851,
      start: 86533050,
      end: 86533061,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693819',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -0.6442766,
      start: 86543123,
      end: 86543138,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693820',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -2.4242938,
      start: 86543123,
      end: 86543138,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693821',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.0738373,
      start: 86543273,
      end: 86543286,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693822',
      binding_matrix_id: 'ENSPFM0015',
      transcription_factors: ['FOS', 'ATF7', 'JUN'],
      score: 7.0844913,
      start: 86543273,
      end: 86543286,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693823',
      binding_matrix_id: 'ENSPFM0484',
      transcription_factors: ['RUNX3'],
      score: 5.807805,
      start: 86544322,
      end: 86544337,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693824',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 9.518423,
      start: 86544329,
      end: 86544337,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693825',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.666799,
      start: 86544363,
      end: 86544374,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693826',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 5.681646,
      start: 86544367,
      end: 86544381,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693827',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 7.45145,
      start: 86544367,
      end: 86544381,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693828',
      binding_matrix_id: 'ENSPFM0379',
      transcription_factors: ['PKNOX1'],
      score: -8.973731,
      start: 86544542,
      end: 86544555,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693829',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 1.3155707,
      start: 86544573,
      end: 86544584,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693830',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 7.922797,
      start: 86544803,
      end: 86544814,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693831',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 7.2595477,
      start: 86544807,
      end: 86544821,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693832',
      binding_matrix_id: 'ENSPFM0363',
      transcription_factors: ['MAFK'],
      score: 9.406079,
      start: 86544807,
      end: 86544821,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693833',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.482218,
      start: 86545699,
      end: 86545711,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693834',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 8.36498,
      start: 86556551,
      end: 86556562,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693835',
      binding_matrix_id: 'ENSPFM0364',
      transcription_factors: ['MAFK'],
      score: 9.249984,
      start: 86556686,
      end: 86556697,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693836',
      binding_matrix_id: 'ENSPFM0089',
      transcription_factors: ['ELF1', 'ETV6', 'GABPA'],
      score: 8.383566,
      start: 86557238,
      end: 86557247,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693837',
      binding_matrix_id: 'ENSPFM0088',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 7.105741,
      start: 86557238,
      end: 86557249,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693838',
      binding_matrix_id: 'ENSPFM0087',
      transcription_factors: ['ELF1', 'ELF4'],
      score: 9.805143,
      start: 86557238,
      end: 86557249,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693839',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 2.2147593,
      start: 86561952,
      end: 86561963,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693840',
      binding_matrix_id: 'ENSPFM0042',
      transcription_factors: ['CTCF'],
      score: 7.1168427,
      start: 86565128,
      end: 86565144,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693841',
      binding_matrix_id: 'ENSPFM0486',
      transcription_factors: ['RUNX3'],
      score: 7.58364,
      start: 86569711,
      end: 86569719,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693842',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: 10.957961,
      start: 86570112,
      end: 86570134,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693843',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: 10.980992,
      start: 86570112,
      end: 86570134,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693844',
      binding_matrix_id: 'ENSPFM0505',
      transcription_factors: ['SPI1'],
      score: 4.0405393,
      start: 86586446,
      end: 86586459,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693845',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -3.2243724,
      start: 86586484,
      end: 86586506,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693846',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -3.3599539,
      start: 86586484,
      end: 86586506,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693847',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 8.998948,
      start: 86586542,
      end: 86586554,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693848',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 2.124483,
      start: 86586644,
      end: 86586655,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693849',
      binding_matrix_id: 'ENSPFM0109',
      transcription_factors: ['TBX21'],
      score: 7.639519,
      start: 86590514,
      end: 86590526,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693850',
      binding_matrix_id: 'ENSPFM0510',
      transcription_factors: ['TBX21'],
      score: -5.3408527,
      start: 86591172,
      end: 86591194,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693851',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 4.368396,
      start: 86592420,
      end: 86592431,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693852',
      binding_matrix_id: 'ENSPFM0084',
      transcription_factors: ['E2F8'],
      score: 3.7079256,
      start: 86593119,
      end: 86593130,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693853',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 6.7513576,
      start: 86593660,
      end: 86593673,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693854',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 8.360201,
      start: 86593660,
      end: 86593673,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693855',
      binding_matrix_id: 'ENSPFM0515',
      transcription_factors: ['TBX21'],
      score: -1.9761552,
      start: 86593718,
      end: 86593733,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693856',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.373682,
      start: 86593931,
      end: 86593944,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693857',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 7.9648905,
      start: 86593931,
      end: 86593944,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693858',
      binding_matrix_id: 'ENSPFM0290',
      transcription_factors: ['HNF4A', 'NR2F1', 'RXRA'],
      score: 5.916802,
      start: 86593938,
      end: 86593951,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693859',
      binding_matrix_id: 'ENSPFM0473',
      transcription_factors: ['RFX5'],
      score: 15.365482,
      start: 86594111,
      end: 86594126,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693860',
      binding_matrix_id: 'ENSPFM0473',
      transcription_factors: ['RFX5'],
      score: 15.37776,
      start: 86594111,
      end: 86594126,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693861',
      binding_matrix_id: 'ENSPFM0473',
      transcription_factors: ['RFX5'],
      score: 4.6261096,
      start: 86594135,
      end: 86594150,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693862',
      binding_matrix_id: 'ENSPFM0473',
      transcription_factors: ['RFX5'],
      score: 4.864284,
      start: 86594135,
      end: 86594150,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693863',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 8.588862,
      start: 86594152,
      end: 86594165,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693864',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 8.604096,
      start: 86594152,
      end: 86594165,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693865',
      binding_matrix_id: 'ENSPFM0357',
      transcription_factors: ['SP1'],
      score: 7.9370704,
      start: 86594269,
      end: 86594279,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693866',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 4.9850125,
      start: 86594364,
      end: 86594377,
      strand: 'forward'
    },
    {
      id: 'ENSM00000693867',
      binding_matrix_id: 'ENSPFM0085',
      transcription_factors: ['EBF1'],
      score: 5.1911173,
      start: 86594364,
      end: 86594377,
      strand: 'reverse'
    },
    {
      id: 'ENSM00000693868',
      binding_matrix_id: 'ENSPFM0421',
      transcription_factors: ['NR2F1'],
      score: 8.276132,
      start: 86594534,
      end: 86594541,
      strand: 'forward'
    }
  ]
} as OverviewRegion;

export default regionOverview;
