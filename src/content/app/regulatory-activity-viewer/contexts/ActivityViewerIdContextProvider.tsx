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

import type { ReactNode } from 'react';

import { useAppSelector } from 'src/store';
import {
  useGenomeSummaryByGenomeSlugQuery,
  isGenomeNotFoundError
} from 'src/shared/state/genome/genomeApiSlice';
import { useUrlParams } from 'src/shared/hooks/useUrlParams';

import { getActiveGenomeId } from 'src/content/app/regulatory-activity-viewer/state/general/generalSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { ActivityViewerIdContext } from './ActivityViewerIdContext';

/**
 * NOTE: The regulation team insists that their api endpoints
 * should be based on assemblies rather than on genomes.
 * The reason being that regulatory data is produced for assemblies
 * rather than genomes; and thus it will be the same across different
 * genomes associated with the same assembly.
 *
 * Question to consider: should assembly information be retrieved
 * from the species selector slice or from the genomes slice?
 * In principle, it seems that getting it from the genomes slice will be
 * more appropriate; but for the time being, it is retrieved from the species selector slice.
 */

const ActivityViewerIdContextProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  const species = useAppSelector((state) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );
  const params = useUrlParams<'genomeId'>(['/activity-viewer/:genomeId']);
  const { genomeId: genomeIdInUrl } = params;

  // TODO: If user does not have this genome selected, it should be added to selected species
  const { currentData: genomeSummary, error: genomeQueryError } =
    useGenomeSummaryByGenomeSlugQuery(genomeIdInUrl ?? '', {
      skip: !genomeIdInUrl
    });

  const assemblyAccessionId = species?.assembly.accession_id;
  const assemblyName = species?.assembly.name.split('.')[0]; // FIXME: assemblyName is used temporarily for some of the endpoints, until they switch to assembly accession id

  const genomeId = genomeSummary?.genome_id;
  const genomeIdForUrl =
    genomeIdInUrl ??
    genomeSummary?.genome_tag ??
    genomeSummary?.genome_id ??
    species?.genome_tag ??
    species?.genome_id;

  // TODO: in the future, read location from the url
  const location =
    assemblyName?.toLowerCase() === 'grcm39'
      ? mockMouseLocation
      : mockHumanLocation;
  const locationForUrl = formatLocationForUrl(location);

  const contextValue = {
    genomeIdInUrl,
    activeGenomeId,
    genomeId,
    genomeIdForUrl,
    assemblyAccessionId: assemblyAccessionId ?? null,
    assemblyName: assemblyName ?? null,
    // Below is a test location. Later on, we will read it from the url or from an input element
    location: location,
    locationForUrl,
    isMissingGenomeId:
      !!genomeQueryError && isGenomeNotFoundError(genomeQueryError)
  };

  return (
    <ActivityViewerIdContext value={contextValue}>
      {children}
    </ActivityViewerIdContext>
  );
};

const mockHumanLocation = {
  regionName: '17',
  start: 58190566,
  end: 58290566 // <-- 100kB slice
  // end: 59190566 // <-- 1MB slice; switch to it when backend apis get faster
};

const mockMouseLocation = {
  regionName: '5',
  start: 28645230,
  end: 29636061
};

// TODO: extract this into a helper
const formatLocationForUrl = ({
  regionName,
  start,
  end
}: {
  regionName: string;
  start: number;
  end: number;
}) => {
  return `${regionName}:${start}-${end}`;
};

export default ActivityViewerIdContextProvider;
