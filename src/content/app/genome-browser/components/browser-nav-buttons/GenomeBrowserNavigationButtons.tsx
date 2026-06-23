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

import { useAppSelector } from 'src/store';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import { useGbRegionQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import {
  getBrowserActiveGenomeId,
  getActualChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import RegionNavigationButtons from 'src/shared/components/region-navigation-buttons/RegionNavigationButtons';

const GenomeBrowserNavigationButtons = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const browserLocation = useAppSelector(getActualChrLocation);

  const { changeBrowserLocation } = useGenomeBrowser();

  const [regionName] = browserLocation ?? [];

  const { currentData: regionData } = useGbRegionQuery(
    {
      genomeId: activeGenomeId ?? '',
      regionName: regionName ?? ''
    },
    {
      skip: !activeGenomeId || !regionName
    }
  );

  // Keep and modify an internal copy of the browser location.
  // This enables the component to respond to clicks without having to wait
  // for the genome browser to arrive to the location defined in a previous click.
  const [internalLocation, setInternalLocation] = useState(browserLocation);

  // Store the parameters that define when the internal copy of the browser location
  // needs updating.
  const [prevParams, setPrevParams] = useState({
    regionName,
    activeGenomeId
  });

  if (
    activeGenomeId !== prevParams.activeGenomeId ||
    (regionName && regionName !== prevParams.regionName)
  ) {
    setInternalLocation(browserLocation);
    setPrevParams({
      activeGenomeId,
      regionName
    });
  }

  const [, start, end] = internalLocation ?? [];

  if (!activeGenomeId || !regionName || !start || !end) {
    return null;
  }

  const onChange = (newLocation: { start: number; end: number }) => {
    const { start: newStart, end: newEnd } = newLocation;
    setInternalLocation([regionName, newStart, newEnd]);
    changeBrowserLocation({
      genomeId: activeGenomeId,
      chrLocation: [regionName, newStart, newEnd]
    });
  };

  return (
    <RegionNavigationButtons
      onChange={onChange}
      viewportStart={start}
      viewportEnd={end}
      regionLength={regionData?.region.length || Infinity}
    />
  );
};

export default GenomeBrowserNavigationButtons;
