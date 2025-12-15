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

import {
  getGenomicLocationFromString,
  type GenomicLocation
} from 'src/shared/helpers/genomicLocationHelpers';

import {
  useGenomeGroupsQuery,
  useGenomesInGroupQuery
} from 'src/content/app/structural-variants/state/api/structuralVariantsApiSlice';
import {
  setGenomesAndLocations,
  setReferenceGenomeLocation
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSlice';

import {
  getReferenceGenome,
  getReferenceLocation
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

const useStructuralVariantsRouting = () => {
  const [searchParams] = useSearchParams();
  const referenceGenomeFromRedux = useAppSelector(getReferenceGenome);
  const referenceGenomeLocationFromRedux = useAppSelector(getReferenceLocation);
  const dispatch = useAppDispatch();

  const referenceGenomeIdParam = searchParams.get('ref-genome-id');
  const altGenomeIdParam = searchParams.get('alt-genome-id');
  const referenceLocationParam = searchParams.get('ref-location');
  const altLocationParam = searchParams.get('alt-location');

  const shouldFetch =
    !referenceGenomeFromRedux && referenceGenomeIdParam && altGenomeIdParam;

  const { data: genomeGroupsData } = useGenomeGroupsQuery(undefined, {
    skip: !shouldFetch
  });

  const referenceGroup = genomeGroupsData?.genome_groups.find(
    (group) => group.reference_genome.genome_id === referenceGenomeIdParam
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
    (genome) => genome.genome_id === altGenomeIdParam
  );

  const referenceGenomeLocation = referenceLocationParam
    ? getLocationFromUrlParam(referenceLocationParam)
    : null;

  useEffect(() => {
    if (
      !referenceGenomeFromRedux &&
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
    } else if (
      referenceGenomeLocation &&
      referenceGenomeLocationFromRedux &&
      areDifferentLocations(
        referenceGenomeLocation,
        referenceGenomeLocationFromRedux
      )
    ) {
      dispatch(setReferenceGenomeLocation(referenceGenomeLocation));
    }
  }, [
    referenceGenome,
    altGenome,
    referenceGenomeLocation,
    referenceGenomeFromRedux
  ]);

  return {
    referenceGenomeIdParam,
    altGenomeIdParam,
    referenceLocationParam,
    altLocationParam
  };
};

const getLocationFromUrlParam = (locationString: string) => {
  try {
    return getGenomicLocationFromString(locationString);
  } catch {
    return null;
  }
};

const areDifferentLocations = (
  loc1: GenomicLocation,
  loc2: GenomicLocation
) => {
  return (
    loc1.regionName !== loc2.regionName ||
    loc1.start !== loc2.start ||
    loc1.end !== loc2.end
  );
};

export default useStructuralVariantsRouting;
