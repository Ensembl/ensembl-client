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

import type { Pick2 } from 'ts-multipick';
import type { SplicedExon } from 'src/shared/types/core-api/exon';
import type { FullCDS } from 'src/shared/types/core-api/cds';

type MinimumExonFields = Pick2<
  SplicedExon,
  'relative_location',
  'start' | 'end'
>;
type MinimumCDSFields = Pick<FullCDS, 'relative_start' | 'relative_end'>;

export type ExonWithRelativeLocationInCDS = {
  relative_location_in_cds: {
    start: number;
    end: number;
    length: number;
  } | null;
};

/**
 * WARNING: the function below assumes that all exons are from the same transcript.
 * It will not work properly in cases of trans-splicing.
 */
export const addRelativeLocationInCDSToExons = <
  E extends MinimumExonFields,
  C extends MinimumCDSFields
>(params: {
  exons: E[];
  cds: C;
}): Array<E & ExonWithRelativeLocationInCDS> => {
  const cds = params.cds;
  const exons = structuredClone(params.exons);

  let lastPositionInCDS = 0;

  for (const exon of exons) {
    if (doesExonIncludeCDS({ exon, cds })) {
      // the transcript consists of a single exon, and includes UTRs
      const relativeStart = 1;
      const overlappingLength = cds.relative_end - cds.relative_start + 1;
      const relativeEnd = relativeStart + overlappingLength - 1;

      (exon as E & ExonWithRelativeLocationInCDS).relative_location_in_cds = {
        start: relativeStart,
        end: relativeEnd,
        length: overlappingLength
      };
    } else if (!isWithinCDS({ exon, cds })) {
      (exon as E & ExonWithRelativeLocationInCDS).relative_location_in_cds =
        null;
    } else if (
      !isExonStartWithinCDS({ exon, cds }) &&
      isExonEndWithinCDS({ exon, cds })
    ) {
      // first exon in CDS
      const relativeStart = 1;
      const remainingExonLength =
        exon.relative_location.end - cds.relative_start + 1;
      const relativeEnd = relativeStart + remainingExonLength - 1;

      (exon as E & ExonWithRelativeLocationInCDS).relative_location_in_cds = {
        start: relativeStart,
        end: relativeEnd,
        length: remainingExonLength
      };

      lastPositionInCDS = relativeEnd;
    } else if (
      isExonStartWithinCDS({ exon, cds }) &&
      !isExonEndWithinCDS({ exon, cds })
    ) {
      // last exon in CDS
      const relativeStart = lastPositionInCDS + 1;
      const remainingExonLength =
        cds.relative_end - exon.relative_location.start + 1;
      const relativeEnd = relativeStart + remainingExonLength - 1;

      (exon as E & ExonWithRelativeLocationInCDS).relative_location_in_cds = {
        start: relativeStart,
        end: relativeEnd,
        length: remainingExonLength
      };
    } else {
      // exon fully within CDS
      const relativeStart = lastPositionInCDS + 1;
      const exonLength =
        exon.relative_location.end - exon.relative_location.start + 1;
      const relativeEnd = relativeStart + exonLength - 1;

      (exon as E & ExonWithRelativeLocationInCDS).relative_location_in_cds = {
        start: relativeStart,
        end: relativeEnd,
        length: exonLength
      };

      lastPositionInCDS = relativeEnd;
    }
  }

  return exons as Array<E & ExonWithRelativeLocationInCDS>;
};

const doesExonIncludeCDS = <
  E extends MinimumExonFields,
  C extends MinimumCDSFields
>(params: {
  exon: E;
  cds: C;
}) => {
  const { exon, cds } = params;

  return (
    cds.relative_start >= exon.relative_location.start &&
    cds.relative_end <= exon.relative_location.end
  );
};

const isWithinCDS = <
  E extends MinimumExonFields,
  C extends MinimumCDSFields
>(params: {
  exon: E;
  cds: C;
}) => {
  return isExonStartWithinCDS(params) || isExonEndWithinCDS(params);
};

const isExonStartWithinCDS = <
  E extends MinimumExonFields,
  C extends MinimumCDSFields
>(params: {
  exon: E;
  cds: C;
}) => {
  const { exon, cds } = params;

  return (
    exon.relative_location.start >= cds.relative_start &&
    exon.relative_location.start < cds.relative_end
  );
};

const isExonEndWithinCDS = <
  E extends MinimumExonFields,
  C extends MinimumCDSFields
>(params: {
  exon: E;
  cds: C;
}) => {
  const { exon, cds } = params;

  return (
    exon.relative_location.end > cds.relative_start &&
    exon.relative_location.end <= cds.relative_end
  );
};
