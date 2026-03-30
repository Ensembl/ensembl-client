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

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppDispatch } from 'src/store';

import {
  validationStateObservable,
  validateUrlParameters,
  initialValidationState,
  type ValidationState
} from './useMagic';

import { setGenomesAndLocations } from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSlice';

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
    hasNoAlignments
  } = useCheckedParams({
    referenceGenomeIdParam,
    referenceLocationParam,
    altGenomeIdParam,
    altLocationParam
  });

  // Reference and alt genome locations returned from useCheckedParams are plain objects
  // created every time useCheckedParams runs. Memoize them to enable their use for props
  // or dependency arrays of useEffect etc.
  const memoizedReferenceGenomeLocation = useMemo(
    () => referenceGenomeLocation,
    [referenceLocationParam, isValidating]
  );
  const memoizedAltGenomeLocation = useMemo(
    () => altGenomeLocation,
    [altLocationParam, isValidating]
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
    dispatch,
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
    isMissingAltGenomeRegion: hasNoAlignments, // FIXME
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
  const [validationState, setValidationState] = useState<ValidationState>(initialValidationState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const subscription = validationStateObservable.subscribe(setValidationState);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!referenceGenomeIdParam || !altGenomeIdParam || !referenceLocationParam) {
      return;
    }
    validateUrlParameters({
      reduxDispatch: dispatch,
      referenceGenomeId: referenceGenomeIdParam,
      referenceLocationString: referenceLocationParam,
      altGenomeId: altGenomeIdParam,
      altLocationString: altLocationParam
    })
  }, [
    dispatch,
    referenceGenomeIdParam,
    altGenomeIdParam,
    referenceLocationParam,
    altLocationParam
  ]);


  return validationState;

  // return {
  //   isValidating,
  //   areUrlParamsValid,
  //   isReferenceGenomeIdValid,
  //   isAltGenomeIdValid,
  //   referenceGenomeId: referenceGenome?.genome_id ?? null,
  //   altGenomeId: altGenome?.genome_id ?? null,
  //   referenceGenomeLocation,
  //   altGenomeLocation,
  //   isReferenceGenomeLocationValid,
  //   isAltGenomeLocationValid,
  //   isMissingAltGenomeRegion, // a special and common kind of invalid alt genome location
  //   referenceGenome: referenceGenome ?? null,
  //   altGenome: altGenome ?? null
  // };
};

export default useStructuralVariantsRouting;
