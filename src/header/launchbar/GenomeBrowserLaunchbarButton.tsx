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

import { useLocation } from 'react-router';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  parseFocusObjectId,
  buildFocusIdForUrl
} from 'src/shared/helpers/focusObjectHelpers';
import { getChrLocationStr } from 'src/content/app/genome-browser/helpers/browserHelper';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveFocusObjectId,
  getChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import LaunchbarButton from './LaunchbarButton';
import { GenomeBrowserIcon } from 'src/shared/components/app-icon';

const GenomeBrowserLaunchbarButton = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const focusObjectId = useAppSelector(getBrowserActiveFocusObjectId);
  // const focusObject = useAppSelector(getBrowserActiveFocusObject);
  const chrLocation = useAppSelector(getChrLocation);
  const activeSpecies = useAppSelector((state) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );
  const location = useLocation();

  const parsedFocusObjectId = focusObjectId
    ? parseFocusObjectId(focusObjectId)
    : null;

  const genomeIdForUrl = activeSpecies?.genome_tag ?? activeGenomeId;
  const focusIdForUrl = parsedFocusObjectId
    ? buildFocusIdForUrl({
        type: parsedFocusObjectId.type,
        objectId: parsedFocusObjectId.objectId
      })
    : null;
  const chrLocationString = chrLocation ? getChrLocationStr(chrLocation) : null;

  const genomeBrowserUrl = urlFor.browser({
    genomeId: genomeIdForUrl ?? null,
    focus: focusIdForUrl,
    location: chrLocationString
  });

  return (
    <LaunchbarButton
      path={genomeBrowserUrl}
      description="Genome browser"
      icon={GenomeBrowserIcon}
      enabled={true}
      isActive={location.pathname.startsWith('/genome-browser')}
    />
  );
};

export default GenomeBrowserLaunchbarButton;
