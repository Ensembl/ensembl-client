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
import { useLocation } from 'react-router-dom';

import { useAppSelector } from 'src/store';

// Importing this function from the genome browser app section suggests that it should be moved to shared helpers
import {
  getGenomicLocationFromString,
  type GenomicLocation
} from 'src/shared/helpers/genomicLocationHelpers';

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
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);

  // TODO: If user does not have this genome selected, it should be added to selected species
  const {
    currentData: genomeSummary,
    isFetching: isFetchingGenomeSummaryInfo,
    error: genomeQueryError
  } = useGenomeSummaryByGenomeSlugQuery(genomeIdInUrl ?? '', {
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

  const locationInUrl = urlSearchParams.get('location');
  let location: GenomicLocation | null = null;

  if (locationInUrl) {
    try {
      location = getGenomicLocationFromString(locationInUrl);
    } catch {
      // Failed to parse genomic location string. Proceed as normal.
    }
  }

  const contextValue = {
    genomeIdInUrl,
    activeGenomeId,
    genomeId,
    genomeIdForUrl,
    assemblyAccessionId: assemblyAccessionId ?? null,
    assemblyName: assemblyName ?? null,
    location,
    locationForUrl: locationInUrl,
    isFetchingGenomeId: isFetchingGenomeSummaryInfo,
    isMissingGenomeId:
      !!genomeQueryError && isGenomeNotFoundError(genomeQueryError)
  };

  return (
    <ActivityViewerIdContext value={contextValue}>
      {children}
    </ActivityViewerIdContext>
  );
};

export default ActivityViewerIdContextProvider;
