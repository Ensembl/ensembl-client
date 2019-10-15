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
  validationInfo: RegionValidationResponse | null
) => {
  // There is no validation to check if the response complains about region_code and genome_id not being valid.
  // As the chance of this happening through the frontend is almost zero unless there are some spelling errors :/
  try {
    if (validationInfo) {
      if (validationInfo.is_parseable === false) {
        return RegionErrors.PARSE_ERROR;
      } else if (validationInfo.region && !validationInfo.region.is_valid) {
        return validationInfo.region.error_message;
      } else if (validationInfo.start && !validationInfo.start.is_valid) {
        return validationInfo.start.error_message;
      } else if (validationInfo.end && !validationInfo.end.is_valid) {
        return validationInfo.end.error_message;
      }
    }

    return null;
  } catch {
    return RegionErrors.REQUEST_ERROR;
  }
};

export const getRegionEditorErrorMessages = (
  validationInfo: RegionValidationResponse | null
) => {
  let locationStartError: string | null = null;
  let locationEndError: string | null = null;

  if (validationInfo) {
    if (validationInfo.start && !validationInfo.start.is_valid) {
      locationStartError = validationInfo.start.error_message;
    } else if (validationInfo.end && !validationInfo.end.is_valid) {
      locationEndError = validationInfo.end.error_message;
    }

    return {
      locationStartError,
      locationEndError
    };
  }
};
