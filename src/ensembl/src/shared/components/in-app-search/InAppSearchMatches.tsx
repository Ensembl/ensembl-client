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

import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import upperFirst from 'lodash/upperFirst';

import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';
import * as urlFor from 'src/shared/helpers/urlHelper';

import PointerBox, {
  Position as PointerBoxPosition
} from 'src/shared/components/pointer-box/PointerBox';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import type {
  SearchResults,
  SearchMatch
} from 'src/shared/state/in-app-search/inAppSearchSlice';
import type { InAppSearchMode } from './InAppSearch';

import styles from './InAppSearch.scss';

type InAppSearchMatchesProps = SearchResults & {
  mode: InAppSearchMode;
};

const InAppSearchMatches = (props: InAppSearchMatchesProps) => {
  return (
    <div className={styles.searchMatches}>
      {props.matches.map((match) => (
        <InAppSearchMatch
          key={match.stable_id}
          match={match}
          mode={props.mode}
        />
      ))}
    </div>
  );
};

type InAppSearchMatchProps = {
  match: SearchMatch;
  mode: InAppSearchMode;
};

const InAppSearchMatch = (props: InAppSearchMatchProps) => {
  const { symbol, stable_id } = props.match;
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);

  const anchorRef = useRef<HTMLSpanElement>(null);

  const onClick = () => {
    setShouldShowTooltip(!shouldShowTooltip);
  };

  const hideTooltip = () => setShouldShowTooltip(false);

  const symbolElement = symbol ? <span>{symbol}</span> : null;
  const stableIdElement = <span>{stable_id}</span>;

  return (
    <>
      <div className={styles.searchMatch} onClick={onClick}>
        {symbolElement}
        {stableIdElement}
        <span
          className={getSearchMatchAnchorClasses(props.mode)}
          ref={anchorRef}
        />
      </div>
      {shouldShowTooltip && anchorRef.current && (
        <PointerBox
          anchor={anchorRef.current}
          position={
            props.mode === 'interstitial'
              ? PointerBoxPosition.RIGHT_BOTTOM
              : PointerBoxPosition.BOTTOM_RIGHT
          }
          classNames={{ box: styles.tooltip, pointer: styles.tooltipTip }}
          onOutsideClick={hideTooltip}
        >
          <MatchDetails {...props} />
        </PointerBox>
      )}
    </>
  );
};

const MatchDetails = (props: InAppSearchMatchProps) => {
  const { match } = props;
  const { genome_id: genomeId, unversioned_stable_id } = match;

  const formattedLocation = getFormattedLocation({
    chromosome: match.slice.region.name,
    start: match.slice.location.start,
    end: match.slice.location.end
  });

  const urlForGenomeBrowser = urlFor.browser({
    genomeId,
    focus: buildFocusIdForUrl({ type: 'gene', objectId: unversioned_stable_id })
  });

  const urlForEntityViewer = urlFor.entityViewer({
    genomeId,
    entityId: buildFocusIdForUrl({
      type: 'gene',
      objectId: unversioned_stable_id
    })
  });

  const links = {
    genomeBrowser: {
      url: urlForGenomeBrowser,
      replaceState: true // TODO: could be more complicated than that; depending on the app
    },
    entityViewer: {
      url: urlForEntityViewer,
      replaceState: false
    }
  };

  return (
    <div className={styles.tooltipContent}>
      <div>
        <span>{match.biotype}</span>
        <span>{getStrandDisplayName(match.slice.strand.code)}</span>
      </div>

      <div>{formattedLocation}</div>

      <div>
        <span className={styles.transcriptsCount}>
          {match.transcript_count}
        </span>
        {pluralise('transcript', match.transcript_count)}
      </div>

      <div>
        <ViewInApp links={links} />
      </div>
    </div>
  );
};

const getSearchMatchAnchorClasses = (mode: InAppSearchMode) => {
  return classNames(
    styles.searchMatchAnchor,
    styles[`searchMatchAnchor${upperFirst(mode)}`]
  );
};

export default InAppSearchMatches;
