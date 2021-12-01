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

/*

This file exists due to two reasons:
1) Designer wants chromosome idiograms to contain visual representation of centromere
2) But we only have centromere locations for human

That's why we agreed to hard-code centromere locations for human on the front end.

*/

type CentromereLocations = {
  [name: string]: {
    start: number;
    end: number;
  };
};

export const humanCentromeres: CentromereLocations = {
  1: {
    start: 122026460,
    end: 125184587
  },
  2: {
    start: 92188146,
    end: 94090557
  },
  3: {
    start: 90772459,
    end: 93655574
  },
  4: {
    start: 49708101,
    end: 51743951
  },
  5: {
    start: 46485901,
    end: 50059807
  },
  6: {
    start: 58553889,
    end: 59829934
  },
  7: {
    start: 58169654,
    end: 60828234
  },
  8: {
    start: 44033745,
    end: 45877265
  },
  9: {
    start: 43236168,
    end: 45518558
  },
  10: {
    start: 39686683,
    end: 41593521
  },
  11: {
    start: 51078349,
    end: 54425074
  },
  12: {
    start: 34769408,
    end: 37185252
  },
  13: {
    start: 16000001,
    end: 18051248
  },
  14: {
    start: 16000001,
    end: 18173523
  },
  15: {
    start: 17000001,
    end: 19725254
  },
  16: {
    start: 36311159,
    end: 38280682
  },
  17: {
    start: 22813680,
    end: 26885980
  },
  18: {
    start: 15460900,
    end: 20861206
  },
  19: {
    start: 24498981,
    end: 27190874
  },
  20: {
    start: 26436233,
    end: 30038348
  },
  21: {
    start: 10864561,
    end: 12915808
  },
  22: {
    start: 12954789,
    end: 15054318
  },
  X: {
    start: 58605580,
    end: 62412542
  },
  Y: {
    start: 10316945,
    end: 10544039
  }
};
