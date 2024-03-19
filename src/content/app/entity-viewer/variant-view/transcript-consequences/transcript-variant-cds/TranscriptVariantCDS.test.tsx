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

import { adjustExonWidths } from './TranscriptVariantCDS';

describe('adjustExonWidths', () => {
  test('one exon too small', () => {
    const exons = [
      {
        index: 0,
        width: 100
      },
      {
        index: 1,
        width: 50
      },
      {
        index: 2,
        width: 1
      }
    ];
    const containerWidth = 151;

    const result = adjustExonWidths({
      exonBlocks: exons,
      containerWidth
    });

    expect(result).toEqual([
      {
        index: 0,
        width: 99 // <-- one pixel subtracted from the longest exon
      },
      {
        index: 1,
        width: 50
      },
      {
        index: 2,
        width: 2 // <-- one pixel added to the exon that was below the minimum threshold
      }
    ]);
  });

  test('two exons too small', () => {
    const exons = [
      {
        index: 0,
        width: 100
      },
      {
        index: 1,
        width: 1
      },
      {
        index: 2,
        width: 50
      },
      {
        index: 3,
        width: 1
      }
    ];
    const containerWidth = 151;

    const result = adjustExonWidths({
      exonBlocks: exons,
      containerWidth
    });

    expect(result).toEqual([
      {
        index: 0,
        width: 99 // <-- one pixel subtracted
      },
      {
        index: 1,
        width: 2 // <-- one pixel added
      },
      {
        index: 2,
        width: 49 // <-- one pixel subtracted
      },
      {
        index: 3,
        width: 2 // <-- one pixel added
      }
    ]);
  });

  test('wrapping around the list of exons', () => {
    const exons = [
      {
        index: 0,
        width: 100
      },
      {
        index: 1,
        width: 1 // <-- needs extra pixel
      },
      {
        index: 2,
        width: 2 // <-- cannot reduce its length further
      },
      {
        index: 3,
        width: 1 // <-- needs extra pixel
      }
    ];
    const containerWidth = 104;

    const result = adjustExonWidths({
      exonBlocks: exons,
      containerWidth
    });

    expect(result).toEqual([
      {
        index: 0,
        width: 98 // <-- two pixels subtracted
      },
      {
        index: 1,
        width: 2 // <-- one pixel added
      },
      {
        index: 2,
        width: 2 // <-- left unchanged
      },
      {
        index: 3,
        width: 2 // <-- one pixel added
      }
    ]);
  });

  test('too many exon blocks for available width', () => {
    const exons = [
      {
        index: 0,
        width: 3
      },
      {
        index: 1,
        width: 1
      },
      {
        index: 2,
        width: 2
      },
      {
        index: 3,
        width: 1
      }
    ];

    const containerWidth = 7;

    const result = adjustExonWidths({
      exonBlocks: exons,
      containerWidth
    });

    /**
     * Given a minimum exon block width of 2px, and the 1px empty space to the right of an exon block,
     * we can only fit two exon blocks into the 7px of available space
     */
    expect(result).toEqual([
      {
        index: 0,
        width: 2
      },
      {
        index: 1,
        width: 2
      }
    ]);
  });

  it('avoids an infinite loop', () => {
    /**
     * This test checks that if there are still exon blocks in need of additional width,
     * but there are no exon blocks to steal the pixels from, the function should just do its best,
     * and then fail gracefully.
     * Practically speaking, this will never happen. If there are more exon blocks in need of extra width
     * than the blocks that can donate from their own width, it means that there are more exon blocks
     * than can fit into the available space; and thus the function will return a smaller number of equally-sized
     * exon blocks (see the 'too many exon blocks for available width' above). However, the test below demonstrates
     * that the function has safeguard mechanisms to avoid an infinite loop within itself.
     */

    const exons = [
      {
        index: 0,
        width: 3 // <-- has only one pixel to donate
      },
      {
        index: 1,
        width: 1 // <-- needs extra pixel
      },
      {
        index: 2,
        width: 2 // <-- cannot reduce its length further
      },
      {
        index: 3,
        width: 1 // <-- needs extra pixel
      }
    ];

    // The container width below is a lie;
    // we would not have a container width that is greater than the sum of exon widths.
    // But we are using this lie here to exercise a certain code path in the function.
    const containerWidth = 20;

    const result = adjustExonWidths({
      exonBlocks: exons,
      containerWidth
    });

    expect(result).toEqual([
      {
        index: 0,
        width: 2 // <-- one pixel removed from the donor
      },
      {
        index: 1,
        width: 2 // <-- one pixel added
      },
      {
        index: 2,
        width: 2 // <-- left unchanged
      },
      {
        index: 3,
        width: 1 // <-- left unchanged, because no other exon has available pixels to give
      }
    ]);
  });
});
