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

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppDispatch } from 'src/store';

import {
  getGenomicLocationFromString,
  type GenomicLocation
} from 'src/shared/helpers/genomicLocationHelpers';

import {
  useGenomeGroupsQuery,
  useGenomesInGroupQuery
} from 'src/content/app/structural-variants/state/api/structuralVariantsApiSlice';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import { setGenomesAndLocations } from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSlice';

import type { GenomeKaryotypeItem } from 'src/shared/state/genome/genomeTypes';

const useStructuralVariantsRouting = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const referenceGenomeIdParam = searchParams.get('ref-genome-id');
  const altGenomeIdParam = searchParams.get('alt-genome-id');
  const referenceLocationParam = searchParams.get('ref-location');
  const altLocationParam = searchParams.get('alt-location');

  const {
    isValidating,
    areUrlParamsValid,
    isReferenceGenomeIdValid,
    isAltGenomeIdValid,
    referenceGenomeId,
    altGenomeId,
    referenceGenomeLocation,
    altGenomeLocation,
    isReferenceGenomeLocationValid,
    isAltGenomeLocationValid,
    referenceGenome,
    altGenome,
    isMissingAltGenomeRegion
  } = useCheckedParams({
    referenceGenomeIdParam,
    referenceLocationParam,
    altGenomeIdParam,
    altLocationParam
  });

  const memoizedReferenceGenomeLocation = useMemo(
    () => referenceGenomeLocation,
    [isValidating]
  );
  const memoizedAltGenomeLocation = useMemo(
    () => altGenomeLocation,
    [isValidating]
  );

  useEffect(() => {
    if (isValidating) {
      return;
    }

    dispatch(
      setGenomesAndLocations({
        referenceGenome,
        alternativeGenome: altGenome,
        referenceGenomeLocation: memoizedReferenceGenomeLocation,
        alternativeGenomeLocation: memoizedAltGenomeLocation
      })
    );
  }, [
    referenceGenome,
    altGenome,
    memoizedReferenceGenomeLocation,
    memoizedAltGenomeLocation,
    isValidating
  ]);

  return {
    referenceGenomeIdParam,
    altGenomeIdParam,
    referenceLocationParam,
    altLocationParam,
    isValidating,
    areUrlParamsValid,
    isReferenceGenomeIdValid,
    isAltGenomeIdValid,
    referenceGenomeId,
    altGenomeId,
    referenceGenomeLocation: memoizedReferenceGenomeLocation,
    altGenomeLocation: memoizedAltGenomeLocation,
    isReferenceGenomeLocationValid,
    isAltGenomeLocationValid,
    isMissingAltGenomeRegion,
    referenceGenome,
    altGenome
  };
};

const useCheckedParams = ({
  referenceGenomeIdParam,
  altGenomeIdParam,
  referenceLocationParam,
  altLocationParam
}: {
  referenceGenomeIdParam: string | null;
  altGenomeIdParam: string | null;
  referenceLocationParam: string | null;
  altLocationParam: string | null;
}) => {
  const { isFetching: isFetchingGenomeGroups, data: genomeGroupsData } =
    useGenomeGroupsQuery();

  const referenceGroup = genomeGroupsData?.genome_groups.find(
    (group) => group.reference_genome.genome_id === referenceGenomeIdParam
  );
  const referenceGenome = referenceGroup?.reference_genome;
  const isReferenceGenomeIdValid = Boolean(genomeGroupsData && referenceGenome);

  const { isFetching: isFetchingGenomesInGroup, currentData: genomesInGroup } =
    useGenomesInGroupQuery(referenceGroup?.id ?? '', {
      skip: !referenceGroup || !isReferenceGenomeIdValid
    });
  const altGenome = genomesInGroup?.genomes.find(
    (genome) => genome.genome_id === altGenomeIdParam
  );
  const isAltGenomeIdValid = Boolean(genomesInGroup && altGenome);

  const {
    isFetching: isFetchingReferenceGenomeKaryotype,
    currentData: referenceGenomeKaryotype
  } = useGenomeKaryotypeQuery(referenceGenome?.genome_id ?? '', {
    skip: !referenceGenome
  });

  const {
    isFetching: isFetchingAltGenomeKaryotype,
    currentData: altGenomeKaryotype
  } = useGenomeKaryotypeQuery(altGenome?.genome_id ?? '', {
    skip: !altGenome
  });

  let referenceGenomeLocation: GenomicLocation | null = null;
  let altGenomeLocation: GenomicLocation | null = null;
  let isReferenceGenomeLocationValid = true;
  let isAltGenomeLocationValid = true;
  let isMissingAltGenomeRegion = false;

  if (referenceLocationParam && referenceGenomeKaryotype) {
    const refLocValidationResult = isLocationParameterValid({
      locationString: referenceLocationParam,
      karyotype: referenceGenomeKaryotype
    });
    if (refLocValidationResult.isValid) {
      referenceGenomeLocation = refLocValidationResult.location;
    } else {
      isReferenceGenomeLocationValid = false;
    }
  }
  if (altLocationParam && altGenomeKaryotype) {
    const altLocValidationResult = isLocationParameterValid({
      locationString: altLocationParam,
      karyotype: altGenomeKaryotype
    });
    if (altLocValidationResult.isValid) {
      altGenomeLocation = altLocValidationResult.location;
    } else {
      isAltGenomeLocationValid = false;
      isMissingAltGenomeRegion = altLocValidationResult.isMissingFromKaryotype;
    }
  }
  if (!altLocationParam && referenceGenomeLocation && altGenomeKaryotype) {
    // If there is no alt genome location parameter in the url,
    // make sure that alt genome has a region with the same name as reference genomic region
    const altGenomicRegion = altGenomeKaryotype.find(
      (item) => item.name === referenceGenomeLocation.regionName
    );
    if (!altGenomicRegion) {
      isAltGenomeLocationValid = false;
      isMissingAltGenomeRegion = true;
    }
  }

  const isValidating =
    isFetchingGenomeGroups ||
    isFetchingGenomesInGroup ||
    isFetchingReferenceGenomeKaryotype ||
    isFetchingAltGenomeKaryotype;

  const areUrlParamsValid =
    isReferenceGenomeIdValid &&
    isAltGenomeIdValid &&
    isReferenceGenomeLocationValid &&
    isAltGenomeLocationValid;

  return {
    isValidating,
    areUrlParamsValid,
    isReferenceGenomeIdValid,
    isAltGenomeIdValid,
    referenceGenomeId: referenceGenome?.genome_id ?? null,
    altGenomeId: altGenome?.genome_id ?? null,
    referenceGenomeLocation,
    altGenomeLocation,
    isReferenceGenomeLocationValid,
    isAltGenomeLocationValid,
    isMissingAltGenomeRegion, // a special and common kind of invalid alt genome location
    referenceGenome: referenceGenome ?? null,
    altGenome: altGenome ?? null
  };
};

const isLocationParameterValid = ({
  locationString,
  karyotype
}: {
  locationString: string;
  karyotype: GenomeKaryotypeItem[];
}) => {
  const notInKaryotypeErrorMessage = 'Region is not listed in karyotype';
  try {
    const parsedLocation = getGenomicLocationFromString(locationString);
    const regionFromKaryotype = karyotype.find(
      (region) => region.name === parsedLocation.regionName
    );
    if (!regionFromKaryotype) {
      throw Error(notInKaryotypeErrorMessage);
    }
    const isStartValid =
      parsedLocation.start > 0 &&
      parsedLocation.start < regionFromKaryotype.length;
    const isEndValid =
      parsedLocation.end > parsedLocation.start &&
      parsedLocation.end <= regionFromKaryotype.length;
    if (!isStartValid) {
      throw Error('The start coordinate is invalid');
    } else if (!isEndValid) {
      throw Error('The end coordinate is invalid');
    } else {
      return {
        isValid: true,
        location: parsedLocation
      } as const;
    }
  } catch (error: unknown) {
    const isMissingFromKaryotype =
      (error as Error).message === notInKaryotypeErrorMessage;
    return {
      isValid: false,
      isMissingFromKaryotype,
      location: null
    } as const;
  }
};

export default useStructuralVariantsRouting;
