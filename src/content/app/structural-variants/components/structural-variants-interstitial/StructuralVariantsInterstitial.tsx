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

import { useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  getGenomicLocationFromString,
  type GenomicLocation
} from 'src/shared/helpers/genomicLocationHelpers';
import {
  doesSupportNavigationApi,
  getPreviousPageUrl
} from 'src/shared/helpers/navigationHelpers';

import { PrimaryButton } from 'src/shared/components/button/Button';
import TextButton from 'src/shared/components/text-button/TextButton';

import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

import styles from './StructuralVariantsInterstitial.module.css';

/**
 * The purpose of this component is communicate why the main content
 * cannot be displayed.
 *
 * The common use cases are:
 * - User has not made an initial selection of the pair of genomes
 *   and the location on the reference genome. In this case,
 *   we ask the user to make the selection.
 * - User has selected the genomes and the location;
 *   but the alternative genome does not have a top-level region
 *   with the same name as the reference genome (as we are currently assuming it should).
 *   This would happen for haplotypes that do not have a full set of assembled chromosomes.
 * - User has entered invalid location in the location text field
 * - The url has been somehow mangled
 */

type Props = {
  isValidating: boolean;
  referenceGenomeIdParam: string | null;
  altGenomeIdParam: string | null;
  referenceLocationParam: string | null;
  altLocationParam: string | null;
  isReferenceGenomeIdValid: boolean;
  isAltGenomeIdValid: boolean;
  isReferenceGenomeLocationValid: boolean;
  isAltGenomeLocationValid: boolean;
  isMissingAltGenomeRegion: boolean;
  referenceGenome: BriefGenomeSummary | null;
  altGenome: BriefGenomeSummary | null;
  referenceGenomeLocation: GenomicLocation | null;
};

const StructuralVariantsInterstitial = (props: Props) => {
  const {
    isValidating,
    referenceGenomeIdParam,
    altGenomeIdParam,
    referenceLocationParam,
    altLocationParam,
    isReferenceGenomeIdValid,
    isAltGenomeIdValid,
    isReferenceGenomeLocationValid,
    isAltGenomeLocationValid,
    isMissingAltGenomeRegion,
    referenceGenome,
    referenceGenomeLocation,
    altGenome
  } = props;

  if (isValidating) {
    return null;
  }

  // Check that all url params required for meaningful page content are present
  // If they are not, ask user to make a selection
  if (!referenceGenomeIdParam || !referenceLocationParam || !altGenomeIdParam) {
    return <StartMessage />;
  }

  if (!isReferenceGenomeIdValid) {
    return <InvalidGenomeId genomeId={referenceGenomeIdParam} />;
  }

  if (!isAltGenomeIdValid) {
    return <InvalidGenomeId genomeId={altGenomeIdParam} />;
  }

  // If genome id checks have passed, we should have fetched reference and alt genome ids to the client.
  // We can now use them to display messages below

  if (!isReferenceGenomeLocationValid) {
    return (
      <InvalidLocation
        locationString={referenceLocationParam}
        genome={referenceGenome as BriefGenomeSummary}
      />
    );
  }

  if (isMissingAltGenomeRegion) {
    let regionName: string | null = null;
    if (altLocationParam) {
      regionName = getGenomicLocationFromString(altLocationParam).regionName;
    } else if (referenceGenomeLocation) {
      regionName = referenceGenomeLocation.regionName;
    }

    return (
      <NoMatchingRegion
        regionName={regionName}
        genome={altGenome as BriefGenomeSummary}
      />
    );
  }

  if (altLocationParam && !isAltGenomeLocationValid) {
    return (
      <InvalidLocation
        locationString={altLocationParam}
        genome={altGenome as BriefGenomeSummary}
      />
    );
  }

  // If we reached this point, something is wrong, but we don't know what.
  // Ask user to make a selection properly.
  return <div>Weird</div>;
};

const StartMessage = () => {
  return <div className={styles.container}>Please make a selection</div>;
};

const InvalidGenomeId = (props: { genomeId: string }) => {
  return (
    <div className={styles.container}>
      <span>Could not find genome with id {props.genomeId}</span>
      <span>
        Please select the genomes and the location using the controls above
      </span>
    </div>
  );
};

/**
 * This is likely to be the most common error, given how easy it is right now
 * to ask for a location in the reference genome that does not exist in the
 * alternative genome, because the corresponding top-level region has not
 * been assembled at chromosome level
 */
const NoMatchingRegion = (props: {
  genome: BriefGenomeSummary;
  regionName: string | null;
}) => {
  const { genome, regionName } = props;
  const speciesName = createGenomeLabel(genome);

  const displayRegionName = regionName
    ? `chromosome ${regionName}`
    : 'this region';

  return (
    <div className={styles.container}>
      <span>The selected genomes do not have corresponding regions</span>
      <span>
        Data for {displayRegionName} is not available for {speciesName}
      </span>
      <BackButton />
      <StartAgainButton />
    </div>
  );
};

const InvalidLocation = (props: {
  genome: BriefGenomeSummary;
  locationString: string;
}) => {
  const { genome, locationString } = props;
  const speciesName = createGenomeLabel(genome);

  return (
    <div className={styles.container}>
      <span>The selected genomes do not have corresponding regions</span>
      <span>
        Location {locationString} is not valid for {speciesName}
      </span>
      <BackButton />
      <StartAgainButton />
    </div>
  );
};

const BackButton = () => {
  const navigate = useNavigate();

  if (!doesSupportNavigationApi()) {
    return null;
  }

  const onClick = () => {
    navigate(-1);
  };

  const previousPageUrl = getPreviousPageUrl();
  if (
    previousPageUrl &&
    previousPageUrl.includes(urlFor.structuralVariantsViewer())
  ) {
    return <PrimaryButton onClick={onClick}>Back</PrimaryButton>;
  } else {
    return null;
  }
};

const StartAgainButton = () => {
  const navigate = useNavigate();

  const onClick = () => {
    const url = urlFor.structuralVariantsViewer();
    navigate(url, { replace: true });
  };

  return <TextButton onClick={onClick}>Start again</TextButton>;
};

const createGenomeLabel = (genome: BriefGenomeSummary) => {
  const speciesName = genome.common_name ?? genome.scientific_name;
  const assemblyName = genome.assembly.name;

  return `${speciesName} ${assemblyName}`;
};

export default StructuralVariantsInterstitial;
