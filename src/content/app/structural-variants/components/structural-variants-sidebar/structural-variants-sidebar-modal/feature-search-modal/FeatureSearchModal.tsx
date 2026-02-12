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

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  getReferenceGenome,
  getAlternativeGenome
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import { useLazySearchGenesQuery } from 'src/shared/state/api-slices/searchApiSlice';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import FeatureSearchForm from './FeatureSearchForm';
import TextButton from 'src/shared/components/text-button/TextButton';

import type { GeneSearchMatch } from 'src/shared/types/search-api/search-match';
import type { GenomeKaryotypeItem } from 'src/shared/state/genome/genomeTypes';

/**
 * QUESTIONS:
 * - Can FeatureSearchForm component be reused here?
 * - Is there anything else reusable from InAppSearch?
 */

const noop = () => true;

const FeatureSearchModal = () => {
  // const [ searchQuery, setSearchQuery ] = useState<string | null>(null);
  const [trigger, { currentData }] = useLazySearchGenesQuery();
  const referenceGenome = useAppSelector(getReferenceGenome);
  const altGenome = useAppSelector(getAlternativeGenome);

  const onSearchSubmit = (query: string) => {
    trigger({
      query,
      genome_ids: [referenceGenome!.genome_id],
      page: 1,
      per_page: 50
    });
    // setSearchQuery(query);
  };

  // const onClear = () => setSearchQuery(null);

  // const onSearchMatchNavigation = () => {
  //   dispatch(closeSidebarModal());
  // };

  return (
    <>
      <FeatureSearchForm onSearchSubmit={onSearchSubmit} onClear={noop} />
      {currentData && (
        <SearchMatches
          referenceGenomeId={referenceGenome!.genome_id}
          altGenomeId={altGenome!.genome_id}
          matches={currentData.matches as GeneSearchMatch[]}
        />
      )}
    </>
  );
};

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

  return (
    <div>
      {navigableMatches.map((match) => (
        <div key={match.stable_id}>
          <TextButton onClick={() => onMatchSelect(match)}>
            {match.symbol ?? match.stable_id}
          </TextButton>
        </div>
      ))}

      {nonNavigableMatches.length > 0 && (
        <>
          <div>Genes from unavailable chromosomes</div>

          {nonNavigableMatches.map((match) => (
            <div key={match.stable_id}>
              <span>{match.symbol ?? match.stable_id}</span>
            </div>
          ))}
        </>
      )}
    </div>
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
 *
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

  // Let's say target gene should occupy two quarters of the viewport
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

export default FeatureSearchModal;
