import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

import { EnsObjectLocation } from 'src/ens-object/ensObjectTypes';

export const getFormattedLocation = (location: EnsObjectLocation) => {
  const start = getCommaSeparatedNumber(location.start);
  const end = getCommaSeparatedNumber(location.end);

  return `${location.chromosome}:${start}-${end}`;
};
