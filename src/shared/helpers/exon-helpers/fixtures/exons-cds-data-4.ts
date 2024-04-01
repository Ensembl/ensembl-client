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

// Exons of transcript ENST00000665585.2.
// It is a protein-coding transcript with a bunch of exons that are outside the coding sequence
export const exons = [
  {
    index: 1,
    relative_location: {
      start: 1,
      end: 160
    }
  },
  {
    index: 2,
    relative_location: {
      start: 915,
      end: 1020
    }
  },
  {
    index: 3,
    relative_location: {
      start: 3570,
      end: 3818
    }
  },
  {
    index: 4,
    relative_location: {
      start: 9569,
      end: 9677
    }
  },
  {
    index: 5,
    relative_location: {
      start: 10594,
      end: 10643
    }
  },
  {
    index: 6,
    relative_location: {
      start: 10735,
      end: 10775
    }
  },
  {
    index: 7,
    relative_location: {
      start: 10992,
      end: 11106
    }
  },
  {
    index: 8,
    relative_location: {
      start: 13936,
      end: 13985
    }
  },
  {
    index: 9,
    relative_location: {
      start: 15412,
      end: 15523
    }
  },
  {
    index: 10,
    relative_location: {
      start: 16765,
      end: 17880
    }
  },
  {
    index: 11,
    relative_location: {
      start: 20758,
      end: 25689
    }
  },
  {
    index: 12,
    relative_location: {
      start: 29051,
      end: 29146
    }
  },
  {
    index: 13,
    relative_location: {
      start: 31320,
      end: 31389
    }
  },
  {
    index: 14,
    relative_location: {
      start: 39354,
      end: 39781
    }
  },
  {
    index: 15,
    relative_location: {
      start: 40921,
      end: 41102
    }
  },
  {
    index: 16,
    relative_location: {
      start: 42235,
      end: 42422
    }
  },
  {
    index: 17,
    relative_location: {
      start: 47016,
      end: 47186
    }
  },
  {
    index: 18,
    relative_location: {
      start: 47672,
      end: 48026
    }
  },
  {
    index: 19,
    relative_location: {
      start: 54895,
      end: 55050
    }
  },
  {
    index: 20,
    relative_location: {
      start: 55449,
      end: 55593
    }
  },
  {
    index: 21,
    relative_location: {
      start: 59455,
      end: 59703
    }
  },
  {
    index: 22,
    relative_location: {
      start: 59836,
      end: 59899
    }
  },
  {
    index: 23,
    relative_location: {
      start: 61163,
      end: 61284
    }
  },
  {
    index: 24,
    relative_location: {
      start: 63810,
      end: 64008
    }
  },
  {
    index: 25,
    relative_location: {
      start: 64243,
      end: 64406
    }
  },
  {
    index: 26,
    relative_location: {
      start: 64500,
      end: 64638
    }
  },
  {
    index: 27,
    relative_location: {
      start: 79182,
      end: 79426
    }
  },
  {
    index: 28,
    relative_location: {
      start: 81391,
      end: 81537
    }
  },
  {
    index: 29,
    relative_location: {
      start: 82655,
      end: 83411
    }
  }
];

// CDS of transcript ENST00000665585.2. Its nucleotide length is 8751
export const cds = {
  relative_start: 954,
  relative_end: 59573,
  nucleotide_length: 8751
};

// The expected result
export const exonsWithRelativeLocationInCDS = [
  {
    index: 1,
    relative_location: { start: 1, end: 160 },
    relative_location_in_cds: null
  },
  {
    index: 2,
    relative_location: { start: 915, end: 1020 },
    relative_location_in_cds: { start: 1, end: 67, length: 67 }
  },
  {
    index: 3,
    relative_location: { start: 3570, end: 3818 },
    relative_location_in_cds: { start: 68, end: 316, length: 249 }
  },
  {
    index: 4,
    relative_location: { start: 9569, end: 9677 },
    relative_location_in_cds: { start: 317, end: 425, length: 109 }
  },
  {
    index: 5,
    relative_location: { start: 10594, end: 10643 },
    relative_location_in_cds: { start: 426, end: 475, length: 50 }
  },
  {
    index: 6,
    relative_location: { start: 10735, end: 10775 },
    relative_location_in_cds: { start: 476, end: 516, length: 41 }
  },
  {
    index: 7,
    relative_location: { start: 10992, end: 11106 },
    relative_location_in_cds: { start: 517, end: 631, length: 115 }
  },
  {
    index: 8,
    relative_location: { start: 13936, end: 13985 },
    relative_location_in_cds: { start: 632, end: 681, length: 50 }
  },
  {
    index: 9,
    relative_location: { start: 15412, end: 15523 },
    relative_location_in_cds: { start: 682, end: 793, length: 112 }
  },
  {
    index: 10,
    relative_location: { start: 16765, end: 17880 },
    relative_location_in_cds: { start: 794, end: 1909, length: 1116 }
  },
  {
    index: 11,
    relative_location: { start: 20758, end: 25689 },
    relative_location_in_cds: { start: 1910, end: 6841, length: 4932 }
  },
  {
    index: 12,
    relative_location: { start: 29051, end: 29146 },
    relative_location_in_cds: { start: 6842, end: 6937, length: 96 }
  },
  {
    index: 13,
    relative_location: { start: 31320, end: 31389 },
    relative_location_in_cds: { start: 6938, end: 7007, length: 70 }
  },
  {
    index: 14,
    relative_location: { start: 39354, end: 39781 },
    relative_location_in_cds: { start: 7008, end: 7435, length: 428 }
  },
  {
    index: 15,
    relative_location: { start: 40921, end: 41102 },
    relative_location_in_cds: { start: 7436, end: 7617, length: 182 }
  },
  {
    index: 16,
    relative_location: { start: 42235, end: 42422 },
    relative_location_in_cds: { start: 7618, end: 7805, length: 188 }
  },
  {
    index: 17,
    relative_location: { start: 47016, end: 47186 },
    relative_location_in_cds: { start: 7806, end: 7976, length: 171 }
  },
  {
    index: 18,
    relative_location: { start: 47672, end: 48026 },
    relative_location_in_cds: { start: 7977, end: 8331, length: 355 }
  },
  {
    index: 19,
    relative_location: { start: 54895, end: 55050 },
    relative_location_in_cds: { start: 8332, end: 8487, length: 156 }
  },
  {
    index: 20,
    relative_location: { start: 55449, end: 55593 },
    relative_location_in_cds: { start: 8488, end: 8632, length: 145 }
  },
  {
    index: 21,
    relative_location: { start: 59455, end: 59703 },
    relative_location_in_cds: { start: 8633, end: 8751, length: 119 }
  },
  {
    index: 22,
    relative_location: { start: 59836, end: 59899 },
    relative_location_in_cds: null
  },
  {
    index: 23,
    relative_location: { start: 61163, end: 61284 },
    relative_location_in_cds: null
  },
  {
    index: 24,
    relative_location: { start: 63810, end: 64008 },
    relative_location_in_cds: null
  },
  {
    index: 25,
    relative_location: { start: 64243, end: 64406 },
    relative_location_in_cds: null
  },
  {
    index: 26,
    relative_location: { start: 64500, end: 64638 },
    relative_location_in_cds: null
  },
  {
    index: 27,
    relative_location: { start: 79182, end: 79426 },
    relative_location_in_cds: null
  },
  {
    index: 28,
    relative_location: { start: 81391, end: 81537 },
    relative_location_in_cds: null
  },
  {
    index: 29,
    relative_location: { start: 82655, end: 83411 },
    relative_location_in_cds: null
  }
];
