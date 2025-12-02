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

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getChrLocationFromStr } from 'src/content/app/genome-browser/helpers/browserHelper';

import {
  useGenomeGroupsQuery,
  useGenomesInGroupQuery
} from 'src/content/app/structural-variants/state/api/structuralVariantsApiSlice';
import { setGenomesAndLocations } from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSlice';

import { getReferenceGenome } from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

const useStateFromUrl = () => {
  const [searchParams] = useSearchParams();
  const referenceGenome = useAppSelector(getReferenceGenome);

  const referenceGenomeId = searchParams.get('ref-genome-id');
  const altGenomeId = searchParams.get('alt-genome-id');
  const referenceLocationString = searchParams.get('ref-location');
  const altLocationString = searchParams.get('alt-location');

  useData({
    referenceGenomeFromState: referenceGenome,
    referenceGenomeId,
    altGenomeId,
    referenceLocationString,
    altLocationString
  });
};

const useData = ({
  referenceGenomeId,
  altGenomeId,
  referenceLocationString,
  referenceGenomeFromState
}: {
  referenceGenomeId: string | null;
  altGenomeId: string | null;
  referenceLocationString: string | null;
  altLocationString: string | null;
  referenceGenomeFromState: BriefGenomeSummary | null;
}) => {
  const shouldFetch =
    !referenceGenomeFromState && referenceGenomeId && altGenomeId;
  const dispatch = useAppDispatch();

  const { data: genomeGroupsData } = useGenomeGroupsQuery(undefined, {
    skip: !shouldFetch
  });

  const referenceGroup = genomeGroupsData?.genome_groups.find(
    (group) => group.reference_genome.genome_id === referenceGenomeId
  );
  const referenceGenome = referenceGroup?.reference_genome;
  const isReferenceGenomeIdInvalid = genomeGroupsData && !referenceGenome;

  const { currentData: genomesInGroup } = useGenomesInGroupQuery(
    referenceGroup?.id ?? '',
    {
      skip: !referenceGroup || isReferenceGenomeIdInvalid
    }
  );

  const altGenome = genomesInGroup?.genomes.find(
    (genome) => genome.genome_id === altGenomeId
  );
  // const isAltGenomeIdInvalid = genomesInGroup && !altGenome;

  const referenceGenomeLocation = referenceLocationString
    ? getLocationFromUrlParam(referenceLocationString)
    : null;

  useEffect(() => {
    if (
      !referenceGenomeFromState &&
      referenceGenome &&
      altGenome &&
      referenceGenomeLocation
    ) {
      dispatch(
        setGenomesAndLocations({
          referenceGenome,
          alternativeGenome: altGenome,
          referenceGenomeLocation,
          alternativeGenomeLocation: null
        })
      );
    }
  }, [
    referenceGenome,
    altGenome,
    referenceGenomeLocation,
    referenceGenomeFromState
  ]);
};

const getLocationFromUrlParam = (locationString: string) => {
  try {
    const [regionName, start, end] = getChrLocationFromStr(locationString);
    return { regionName, start, end };
  } catch {
    return null;
  }
};

export default useStateFromUrl;
