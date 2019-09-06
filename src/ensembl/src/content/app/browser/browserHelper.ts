import {
  ChrLocation,
  RegionValidationResponse,
  RegionValidationRegionError
} from './browserState';
import { GenomeKaryotype, GenomeKaryotypeType } from 'src/genome/genomeTypes';
import { RegionErrors } from './browserConfig';
import { getNumberWithoutCommas } from 'src/shared/helpers/numberFormatter';

export function getChrLocationFromStr(chrLocationStr: string): ChrLocation {
  const [chrCode, chrRegion] = chrLocationStr.split(':');
  const [startBp, endBp] = chrRegion.split('-');

  return [
    chrCode,
    getNumberWithoutCommas(startBp),
    getNumberWithoutCommas(endBp)
  ] as ChrLocation;
}

export function getChrLocationStr(
  chrLocation: ChrLocation = ['', 0, 0]
): string {
  const [chrCode, startBp, endBp] = chrLocation;

  return `${chrCode}:${startBp}-${endBp}`;
}

export const getRegionFieldErrorMessages = (
  validationInfo: RegionValidationResponse | null,
  genomeKaryotypes: GenomeKaryotype[] | null
) => {
  // There is no validation to check if the response complains about region_code and genome_id not being valid.
  // As the chance of this happening through the frontend is almost zero unless there are some spelling errors :/
  // Also strings will be used for now to return error messages.
  // The API will return the error messages in the future and most of this code might be deletable.

  try {
    if (validationInfo) {
      // need to explicitly check for false as don't want this to pass on undefined
      if (validationInfo.is_parseable === false) {
        return RegionErrors.PARSE_ERROR;
      } else if (validationInfo.region && !validationInfo.region.is_valid) {
        return RegionErrors.INVALID_REGION;
      } else if (
        genomeKaryotypes &&
        ((validationInfo.start && !validationInfo.start.is_valid) ||
          (validationInfo.end && !validationInfo.end.is_valid))
      ) {
        const karyotypeInRegionField = genomeKaryotypes.filter(
          (karyotype) =>
            (validationInfo.region as RegionValidationRegionError).region_id.toUpperCase() ===
            karyotype.name
        )[0];

        return `${RegionErrors.INVALID_LOCATION} ${karyotypeInRegionField.length}`;
      }
    }

    return null;
  } catch {
    return RegionErrors.REQUEST_ERROR;
  }
};

export const getRegionEditorErrorMessages = (
  validationInfo: RegionValidationResponse | null,
  karyotypeOfRegionInput: GenomeKaryotype,
  locationStart: string,
  locationEnd: string
) => {
  // The API will return the error messages in the future and most of this code might be deletable.
  // However, the validation needs to be done through this function for the time being.

  // try {
  let locationStartError: string | null = null;
  let locationEndError: string | null = null;

  if (validationInfo) {
    if (validationInfo) {
      const locationStartNum = locationStart
        ? getNumberWithoutCommas(locationStart)
        : 0;
      const locationEndNum = locationEnd
        ? getNumberWithoutCommas(locationEnd)
        : 0;

      if (
        !locationStartNum ||
        locationStartNum < 1 ||
        locationStartNum > karyotypeOfRegionInput.length
      ) {
        locationStartError = RegionErrors.INVALID_LOCATION_START;
      } else if (
        !karyotypeOfRegionInput.is_circular &&
        locationStartNum > locationEndNum
      ) {
        locationStartError = RegionErrors.LOCATION_START_IS_BIGGER;
      } else if (
        !locationEndNum ||
        locationEndNum < 1 ||
        locationEndNum > karyotypeOfRegionInput.length
      ) {
        locationEndError = `${RegionErrors.INVALID_LOCATION_END} ${karyotypeOfRegionInput.length}`;
      }
    }

    return {
      locationStartError,
      locationEndError
    };
  }
  // } catch {
  //   return {
  //     request: RegionErrors.REQUEST_ERROR
  //   };
  // }
};
