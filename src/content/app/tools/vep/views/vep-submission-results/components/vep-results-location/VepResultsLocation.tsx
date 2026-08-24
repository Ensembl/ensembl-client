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

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';

type Props = {
  genomeId: string;
  location: {
    region_name: string;
    start: number;
  };
};

// When sending user to the genome browser,
// create a 50bp-wide viewport, with variant start coordinate in the middle.
const VIEWPORT_WIDTH = 50;
const OFFSET_FROM_CENTER = VIEWPORT_WIDTH / 2;

const VepResultsLocation = (props: Props) => {
  const { genomeId, location } = props;
  const startCoord = Math.max(location.start - OFFSET_FROM_CENTER, 1);
  const endCoord = startCoord + VIEWPORT_WIDTH;

  const locationId = `${location.region_name}:${startCoord}-${endCoord}`;
  const focusIdForUrl = buildFocusIdForUrl({
    type: 'location',
    objectId: locationId
  });

  const links = {
    genomeBrowser: {
      url: urlFor.browser({
        genomeId,
        focus: focusIdForUrl
      })
    }
  };

  const formattedStart = formatNumber(location.start);
  const formattedVariantLocation = `${location.region_name}:${formattedStart}`;

  return (
    <ViewInAppPopup links={links}>{formattedVariantLocation}</ViewInAppPopup>
  );
};

export default VepResultsLocation;
