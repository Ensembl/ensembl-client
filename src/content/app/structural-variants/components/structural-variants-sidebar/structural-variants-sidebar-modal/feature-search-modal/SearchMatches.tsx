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

import { useNavigate } from 'react-router';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

import useParsedUrlParamsStore from 'src/content/app/structural-variants/hooks/useParsedUrlParamsStore';

import TextButton from 'src/shared/components/text-button/TextButton';

import type { GeneSearchMatch } from 'src/shared/types/search-api/search-match';

import styles from './FeatureSearchModal.module.css';
import sharedStyles from 'src/shared/components/interstitial-search/InterstitialSearch.module.css';

/**
 * This component is, to a large extent, a copy of the search matches in InterstitialSearch.
 *
 * What makes it different though is that:
 * - Upon clicking on a search match, it does not show the tooltip ("jump menu")
 *   with view-in-app buttons, but instead immediately updates the alignment view
 * - Since not every gene available in the reference genome can also be viewed in the alternative genome
 *   (because alternative genomes don't always have a full set of assembled chromosomes),
 *   it separates gene search matches into the ones that can be clicked (meaning that alignments for them exist),
 *   and the ones that can't.
 */

const SearchMatches = ({
  matches,
  referenceGenomeId,
  altGenomeId
}: {
  referenceGenomeId: string;
  altGenomeId: string;
  matches: GeneSearchMatch[];
}) => {
  const { referenceRegionLength } = useParsedUrlParamsStore();
  const navigate = useNavigate();

  const onMatchSelect = (match: GeneSearchMatch) => {
    const referenceGenomeLocation = calculateViewportLocation({
      match,
      referenceRegionLength: referenceRegionLength as number
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
    <div className={searchMatchesContainerClasses}>
      {matches.map((match) => (
        <div key={match.stable_id}>
          <TextButton onClick={() => onMatchSelect(match)}>
            <GeneResult gene={match} />
          </TextButton>
        </div>
      ))}
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

/**
 * Let's say target gene should be positioned centrally,
 * and take up half the viewport.
 * (Genome browser uses a somewhat similar approach when focusing on genes,
 *  although the amount of space it gives to a focus gene
 *  is somewhat less than half a viewport)
 */
const calculateViewportLocation = ({
  match,
  referenceRegionLength
}: {
  match: GeneSearchMatch;
  referenceRegionLength: number;
}) => {
  const regionName = match.slice.region.name;

  const geneLength = match.slice.location.end - match.slice.location.start + 1;
  const desiredViewportBpLength = geneLength * 2;
  const quarterViewportLength = Math.ceil(desiredViewportBpLength / 4);
  const start = Math.max(1, match.slice.location.start - quarterViewportLength);
  const end = Math.min(
    referenceRegionLength,
    match.slice.location.end + quarterViewportLength
  );

  return {
    regionName,
    start,
    end
  };
};

export default SearchMatches;
