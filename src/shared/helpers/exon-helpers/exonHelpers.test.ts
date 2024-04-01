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

import { addRelativeLocationInCDSToExons } from './exonHelpers';

import * as example1 from './fixtures/exons-cds-data-1';
import * as example2 from './fixtures/exons-cds-data-2';
import * as example3 from './fixtures/exons-cds-data-3';
import * as example4 from './fixtures/exons-cds-data-4';
import * as example5 from './fixtures/exons-cds-data-5';

describe('addRelativeLocationInCDSToExons', () => {
  test('transcript with a single exon and no UTRs ', () => {
    const result = addRelativeLocationInCDSToExons({
      exons: example1.exons,
      cds: example1.cds
    });

    expect(result).toEqual(example1.exonsWithRelativeLocationInCDS);
  });

  test('transcript with a single exon, and both UTRs ', () => {
    // in this case an exon is longer than a CDS
    const result = addRelativeLocationInCDSToExons({
      exons: example2.exons,
      cds: example2.cds
    });

    expect(result).toEqual(example2.exonsWithRelativeLocationInCDS);
  });

  test('transcript with two exons, and both UTRs', () => {
    const result = addRelativeLocationInCDSToExons({
      exons: example3.exons,
      cds: example3.cds
    });

    expect(result).toEqual(example3.exonsWithRelativeLocationInCDS);
  });

  test('transcript with multiple exons', () => {
    const result = addRelativeLocationInCDSToExons({
      exons: example4.exons,
      cds: example4.cds
    });

    const totalLength = result.reduce((acc, exon) => {
      if (!exon.relative_location_in_cds) {
        return acc;
      } else {
        return acc + exon.relative_location_in_cds.length;
      }
    }, 0);

    expect(totalLength).toBe(example4.cds.nucleotide_length);

    expect(result).toEqual(example4.exonsWithRelativeLocationInCDS);
  });

  test('transcript with two exons and no UTRs', () => {
    const result = addRelativeLocationInCDSToExons({
      exons: example5.exons,
      cds: example5.cds
    });

    expect(result).toEqual(example5.exonsWithRelativeLocationInCDS);
  });
});
