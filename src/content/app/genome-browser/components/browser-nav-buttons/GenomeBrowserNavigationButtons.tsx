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

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { getGenomicLocationString } from 'src/shared/helpers/genomicLocationHelpers';

import { useAppSelector } from 'src/store';

import {
  getBrowserActiveGenomeId,
  getActualChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import RegionNavigationButtons from 'src/shared/components/region-navigation-buttons/RegionNavigationButtons';

/**
 * TODO:
 * - Fetch region to get access to its length
 * - Remove browser-nav-button component
 * - Remove modal components
 */

const GenomeBrowserNavigationButtons = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const browserLocation = useAppSelector(getActualChrLocation);
  const urlLocation = useLocation();
  const navigate = useNavigate();

  const [regionNameFromParams] = browserLocation ?? [];

  // Initialise component with an internal copy of the browser location.
  // This will enable the component to respond to clicks without having to wait
  // for the genome browser to arrive to the location defined in a previous click.
  const [internalLocation, setInternalLocation] = useState(browserLocation);

  // Store the parameters that define when the internal copy of the browser location
  // needs updating.
  const [prevParams, setPrevParams] = useState({
    regionName: regionNameFromParams,
    activeGenomeId
  });

  if (
    activeGenomeId !== prevParams.activeGenomeId ||
    (regionNameFromParams && regionNameFromParams !== prevParams.regionName)
  ) {
    setInternalLocation(browserLocation);
    setPrevParams({
      activeGenomeId,
      regionName: regionNameFromParams
    });
  }

  const [regionName, start, end] = internalLocation ?? [];

  if (!activeGenomeId || !regionName || !start || !end) {
    return null;
  }

  const onChange = (newLocation: { start: number; end: number }) => {
    const { start: newStart, end: newEnd } = newLocation;
    const newLocationParam = getGenomicLocationString({
      regionName,
      start: newStart,
      end: newEnd
    });

    const { pathname, search } = urlLocation;
    const newSearchParams = new URLSearchParams(search);
    newSearchParams.set('location', newLocationParam);
    const searchString = decodeURIComponent(newSearchParams.toString());
    const url = `${pathname}?${searchString}`;

    setInternalLocation([regionName, newStart, newEnd]);
    navigate(url);
  };

  return (
    <RegionNavigationButtons
      onChange={onChange}
      viewportStart={start}
      viewportEnd={end}
      regionLength={Infinity}
    />
  );
};

export default GenomeBrowserNavigationButtons;
