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

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import {
  Slice,
  SliceWithLocationOnly
} from 'src/content/app/entity-viewer/types/slice';
import { Transcript } from '../../types/transcript';

export const getFeatureCoordinates = (feature: {
  slice: SliceWithLocationOnly;
}) => {
  const { start, end } = feature.slice.location;
  return { start, end };
};

export const getRegionName = (feature: { slice: Slice }) =>
  feature.slice.region.name;

export const getFeatureStrand = (feature: { slice: Slice }) =>
  feature.slice.region.strand.code;

// FIXME: remove this when we can get the length from the API
export const getFeatureLength = (feature: { slice: Slice }) => {
  const { start, end } = getFeatureCoordinates(feature);
  const strandCode = getFeatureStrand(feature);
  return strandCode === 'forward' ? end - start + 1 : start - end + 1;
};

export const getFirstAndLastCodingExonIndexes = (transcript: Transcript) => {
  const { exons, cds } = transcript;
  let firstCodingExonIndex = 0;
  let lastCodingExonIndex = exons.length - 1;

  if (cds) {
    firstCodingExonIndex = exons.findIndex((exon) => {
      const { start: exonStart, end: exonEnd } = getFeatureCoordinates(exon);
      return exonStart <= cds.start && exonEnd >= cds.start;
    });

    lastCodingExonIndex = exons.findIndex((exon) => {
      const { start: exonStart, end: exonEnd } = getFeatureCoordinates(exon);
      return exonStart <= cds.end && exonEnd >= cds.end;
    });
  }

  return {
    firstCodingExonIndex,
    lastCodingExonIndex
  };
};

export const getNumberOfCodingExons = (transcript: Transcript) => {
  const {
    firstCodingExonIndex,
    lastCodingExonIndex
  } = getFirstAndLastCodingExonIndexes(transcript);
  return getCommaSeparatedNumber(
    lastCodingExonIndex - firstCodingExonIndex + 1
  );
};
