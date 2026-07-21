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
import { useSearchParams } from 'react-router';

import { useAppDispatch } from 'src/store';

import useParsedUrlParamsStore from './useParsedUrlParamsStore';
import {
  validateUrlParameters,
  resetParsedParameters
} from './parsedUrlParamsStore';

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

  useEffect(() => {
    if (isValidating) {
      return;
    }

    dispatch(
      setGenomesAndLocations({
        referenceGenome,
        alternativeGenome: altGenome,
        referenceGenomeLocation: referenceGenomeLocation,
        alternativeGenomeLocation: altGenomeLocation
      })
    );
  }, [
    dispatch,
    referenceGenome,
    altGenome,
    referenceGenomeLocation,
    altGenomeLocation,
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
    referenceGenomeLocation,
    altGenomeLocation,
    isReferenceGenomeLocationValid,
    isAltGenomeLocationValid,
    hasNoAlignments,
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
  const parsedUrlParams = useParsedUrlParamsStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      !referenceGenomeIdParam ||
      !altGenomeIdParam ||
      !referenceLocationParam
    ) {
      resetParsedParameters();
    } else {
      validateUrlParameters({
        reduxDispatch: dispatch,
        referenceGenomeId: referenceGenomeIdParam,
        referenceLocationString: referenceLocationParam,
        altGenomeId: altGenomeIdParam,
        altLocationString: altLocationParam
      });
    }
  }, [
    dispatch,
    referenceGenomeIdParam,
    altGenomeIdParam,
    referenceLocationParam,
    altLocationParam
  ]);

  return parsedUrlParams;
};

export default useStructuralVariantsRouting;
