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
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import {
  setGenomesAndLocations,
  setLocations
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSlice';

import {
  getReferenceGenome,
  getReferenceGenomeLocation,
  getAlternativeGenomeLocation
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import type { GenomeKaryotypeItem } from 'src/shared/state/genome/genomeTypes';

const useStructuralVariantsRouting = () => {
  const [searchParams] = useSearchParams();
  const referenceGenomeFromRedux = useAppSelector(getReferenceGenome);
  const referenceGenomeLocationFromRedux = useAppSelector(
    getReferenceGenomeLocation
  );
  const altGenomeLocationFromRedux = useAppSelector(
    getAlternativeGenomeLocation
  );
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
  const altGenomeLocation = altLocationParam
    ? getLocationFromUrlParam(altLocationParam)
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
          alternativeGenomeLocation: altGenomeLocation
        })
      );
    } else if (
      hasLocationUpdated(
        referenceGenomeLocation,
        referenceGenomeLocationFromRedux
      ) ||
      hasLocationUpdated(altGenomeLocation, altGenomeLocationFromRedux)
    ) {
      dispatch(
        setLocations({
          reference: referenceGenomeLocation,
          alternative: altGenomeLocation
        })
      );
    }
  }, [
    referenceGenome,
    altGenome,
    referenceGenomeLocation,
    referenceGenomeFromRedux,
    altGenomeLocation,
    altGenomeLocationFromRedux
  ]);

  return {
    referenceGenomeIdParam,
    altGenomeIdParam,
    referenceLocationParam,
    altLocationParam
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const isReferenceGenomeIdInvalid = genomeGroupsData && !referenceGenome;

  const { isFetching: isFetchingGenomesInGroup, currentData: genomesInGroup } =
    useGenomesInGroupQuery(referenceGroup?.id ?? '', {
      skip: !referenceGroup || isReferenceGenomeIdInvalid
    });
  const altGenome = genomesInGroup?.genomes.find(
    (genome) => genome.genome_id === altGenomeIdParam
  );
  const isAltGenomeIdValid = genomesInGroup && altGenome;

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
    }
  }

  const isValidating =
    isFetchingGenomeGroups ||
    isFetchingGenomesInGroup ||
    isFetchingReferenceGenomeKaryotype ||
    isFetchingAltGenomeKaryotype;

  return {
    isValidating,
    isReferenceGenomeIdValid: !isReferenceGenomeIdInvalid,
    isAltGenomeIdValid,
    referenceGenomeId: referenceGenome?.genome_id ?? null,
    altGenomeId: altGenome?.genome_id ?? null,
    referenceGenomeLocation,
    altGenomeLocation,
    isReferenceGenomeLocationValid,
    isAltGenomeLocationValid
  };
};

const isLocationParameterValid = ({
  locationString,
  karyotype
}: {
  locationString: string;
  karyotype: GenomeKaryotypeItem[];
}) => {
  try {
    const parsedLocation = getGenomicLocationFromString(locationString);
    const regionFromKaryotype = karyotype.find(
      (region) => region.name === parsedLocation.regionName
    );
    if (!regionFromKaryotype) {
      throw Error('Region is not listed in karyotype');
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
      };
    }
  } catch {
    // TODO: maybe use different types of errors to show different types of error messages?
    return {
      isValid: false,
      location: null
    };
  }
};

const getLocationFromUrlParam = (locationString: string) => {
  try {
    return getGenomicLocationFromString(locationString);
  } catch {
    return null;
  }
};

const hasLocationUpdated = (
  loc1: GenomicLocation | null,
  loc2: GenomicLocation | null
) => {
  return loc1 && loc2 && areDifferentLocations(loc1, loc2);
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
