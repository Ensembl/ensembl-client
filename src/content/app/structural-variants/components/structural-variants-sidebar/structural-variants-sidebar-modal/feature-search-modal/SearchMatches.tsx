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
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import TextButton from 'src/shared/components/text-button/TextButton';

import type { GeneSearchMatch } from 'src/shared/types/search-api/search-match';
import type { GenomeKaryotypeItem } from 'src/shared/state/genome/genomeTypes';

import sharedStyles from 'src/shared/components/in-app-search/InAppSearch.module.css';
import styles from './FeatureSearchModal.module.css';

const SearchMatches = ({
  matches,
  referenceGenomeId,
  altGenomeId
}: {
  referenceGenomeId: string;
  altGenomeId: string;
  matches: GeneSearchMatch[];
}) => {
  const navigate = useNavigate();
  const { currentData: referenceGenomeKaryotype } =
    useGenomeKaryotypeQuery(referenceGenomeId);
  const { currentData: altGenomeKaryotype } =
    useGenomeKaryotypeQuery(altGenomeId);

  if (!referenceGenomeKaryotype || !altGenomeKaryotype) {
    return null;
  }

  const { navigableMatches, nonNavigableMatches } = partitionSearchMatches({
    matches,
    referenceGenomeKaryotype,
    altGenomeKaryotype
  });

  const onMatchSelect = (match: GeneSearchMatch) => {
    const referenceGenomeLocation = calculateViewportLocation({
      match,
      referenceGenomeKaryotype
    });

    const url = urlFor.structuralVariantsViewer({
      referenceGenomeId,
      altGenomeId,
      referenceGenomeLocation
    });

    navigate(url);
  };

  const searchMatchesContainerClasses = classNames(
    sharedStyles.searchMatches,
    styles.searchMatches
  );

  return (
    <div>
      <div className={searchMatchesContainerClasses}>
        {navigableMatches.map((match) => (
          <div key={match.stable_id}>
            <TextButton onClick={() => onMatchSelect(match)}>
              <GeneResult gene={match} />
            </TextButton>
          </div>
        ))}
      </div>

      {nonNavigableMatches.length > 0 && (
        <>
          <div className={styles.searchMatchesSectionHead}>
            Not available in the alignment with this alternative genome:
          </div>

          <div className={searchMatchesContainerClasses}>
            {nonNavigableMatches.map((match) => (
              <div key={match.stable_id}>
                <GeneResult gene={match} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const GeneResult = ({ gene }: { gene: GeneSearchMatch }) => {
  if (!gene.symbol) {
    return <span>{gene.stable_id}</span>;
  }

  return (
    <span className={styles.geneResult}>
      <span>{gene.symbol} </span>
      <span>{gene.stable_id}</span>
    </span>
  );
};

const partitionSearchMatches = ({
  matches,
  referenceGenomeKaryotype,
  altGenomeKaryotype
}: {
  matches: GeneSearchMatch[];
  referenceGenomeKaryotype: GenomeKaryotypeItem[];
  altGenomeKaryotype: GenomeKaryotypeItem[];
}) => {
  const navigableMatches: GeneSearchMatch[] = [];
  const nonNavigableMatches: GeneSearchMatch[] = [];

  for (const match of matches) {
    const isRefRegionAvailable = referenceGenomeKaryotype.some(
      (item) => item.name === match.slice.region.name
    );
    const isAltRegionAvailable = altGenomeKaryotype.some(
      (item) => item.name === match.slice.region.name
    );

    if (isRefRegionAvailable && isAltRegionAvailable) {
      navigableMatches.push(match);
    } else {
      nonNavigableMatches.push(match);
    }
  }

  return {
    navigableMatches,
    nonNavigableMatches
  };
};

/**
 * Let's say target gene should be positioned centrally,
 * and take up half the viewport.
 * (Genome browser uses a somewhat similar approach when focusing on genes,
 *  although the amount of space it gives to a focus gene
 *  is somewhat less than half a viewport)
 */
const calculateViewportLocation = ({
  match,
  referenceGenomeKaryotype
}: {
  match: GeneSearchMatch;
  referenceGenomeKaryotype: GenomeKaryotypeItem[];
}) => {
  const regionName = match.slice.region.name;
  const region = referenceGenomeKaryotype.find(
    (item) => item.name === regionName
  ) as GenomeKaryotypeItem;
  const regionLength = region.length;

  const geneLength = match.slice.location.end - match.slice.location.start + 1;
  const desiredViewportBpLength = geneLength * 2;
  const quarterViewportLength = Math.ceil(desiredViewportBpLength / 4);
  const start = Math.max(1, match.slice.location.start - quarterViewportLength);
  const end = Math.min(
    regionLength,
    match.slice.location.end + quarterViewportLength
  );

  return {
    regionName,
    start,
    end
  };
};

export default SearchMatches;
