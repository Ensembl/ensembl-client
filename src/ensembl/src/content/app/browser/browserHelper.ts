import {
  ChrLocation,
  BrowserRegionValidationResponse,
  BrowserRegionValidationRegionError
} from './browserState';
import { GenomeKaryotype } from 'src/genome/genomeTypes';
import { BrowserRegionErrors } from './browserConfig';
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

export const getBrowserRegionFieldErrorMessages = (
  validationErrors: BrowserRegionValidationResponse | null,
  genomeKaryotypes: GenomeKaryotype[] | null
) => {
  // There is no validation to check if the response complains about region_code and genome_id not being valid.
  // As the chance of this happening through the frontend is almost zero unless there are some spelling errors :/
  // Also strings will be used for now to return error messages.
  // The API will return the error messages in the future and most of this code might be deletable.

  try {
    if (validationErrors) {
      // need to explicitly check for false as don't want this to pass on undefined
      if (validationErrors.is_parseable === false) {
        return BrowserRegionErrors.PARSE_ERROR;
      } else if (validationErrors.region && !validationErrors.region.is_valid) {
        return BrowserRegionErrors.INVALID_REGION;
      } else if (
        genomeKaryotypes &&
        ((validationErrors.start && !validationErrors.start.is_valid) ||
          (validationErrors.end && !validationErrors.end.is_valid))
      ) {
        const karyotypeInRegionField = genomeKaryotypes.filter(
          (karyotype) =>
            (validationErrors.region as BrowserRegionValidationRegionError).region_id.toUpperCase() ===
            karyotype.name
        )[0];

        return `${BrowserRegionErrors.INVALID_LOCATION} ${karyotypeInRegionField.length}`;
      }
    }

    return null;
  } catch {
    return BrowserRegionErrors.REQUEST_ERROR;
  }
};

export const getBrowserRegionEditorErrorMessages = (
  locationStart: string,
  locationEnd: string,
  karyotype: GenomeKaryotype
) => {
  const locationStartNum = locationStart
    ? getNumberWithoutCommas(locationStart)
    : 0;
  const locationEndNum = locationEnd ? getNumberWithoutCommas(locationEnd) : 0;

  let locationStartError: string | null = null;
  let locationEndError: string | null = null;

  if (
    !locationStartNum ||
    locationStartNum < 1 ||
    locationStartNum > karyotype.length
  ) {
    locationStartError = BrowserRegionErrors.INVALID_LOCATION_START;
  } else if (!karyotype.is_circular && locationStartNum > locationEndNum) {
    locationStartError = BrowserRegionErrors.LOCATION_START_IS_BIGGER;
  } else if (
    !locationEndNum ||
    locationEndNum < 1 ||
    locationEndNum > karyotype.length
  ) {
    locationEndError = `${BrowserRegionErrors.INVALID_LOCATION_END} ${karyotype.length}`;
  }

  return {
    locationStartError,
    locationEndError
  };
};
