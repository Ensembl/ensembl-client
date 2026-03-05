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

import { useState } from 'react';
import classNames from 'classnames';

import { useAppDispatch } from 'src/store';
import { changeHighlightedTrackId } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';

import analyticsTracking from 'src/services/analytics-service';

import PointerBox, {
  Position as PointerBoxPosition
} from 'src/shared/components/pointer-box/PointerBox';
import TextButton from '../text-button/TextButton';
import {
  ViewInApp,
  type AppName as AppNameForViewInApp
} from 'src/shared/components/view-in-app/ViewInApp';

import type { SearchResults } from 'src/shared/types/search-api/search-results';
import type { GeneSearchMatch as GeneSearchMatchType } from 'src/shared/types/search-api/search-match';
import type {
  FeatureSearchAppName,
  FeatureSearchMatchPosition
} from 'src/shared/helpers/featureSearchHelpers';

import styles from './SearchMatch.module.css';
import pointerBoxStyles from 'src/shared/components/pointer-box/PointerBox.module.css';

type GeneSearchMatchProps = {
  app: FeatureSearchAppName;
  mode: FeatureSearchMatchPosition;
  results?: SearchResults;
  genomeIdForUrl?: string; // TODO: remove this when backend starts including this tag in the response
  onMatchNavigation?: () => void; // currently, there are no requirements for data to be passed in this callback
};

const GeneSearchMatch = (props: GeneSearchMatchProps) => {
  const { results, app, mode, genomeIdForUrl, onMatchNavigation } = props;
  if (!results) {
    return;
  }

  const { matches } = results;

  return (
    <div className={styles.searchMatches}>
      {matches.map((match, index) => (
        <Match
          key={`${(match as GeneSearchMatchType).stable_id}_${index}`}
          match={match as GeneSearchMatchType}
          app={app}
          mode={mode}
          genomeIdForUrl={genomeIdForUrl}
          position={index + 1}
          onMatchNavigation={onMatchNavigation}
        />
      ))}
    </div>
  );
};

type MatchProps = {
  match: GeneSearchMatchType;
  app: FeatureSearchAppName;
  mode: FeatureSearchMatchPosition;
  position: number;
  genomeIdForUrl?: string;
  onMatchNavigation?: () => void; // currently, there are no requirements for data to be passed in this callback
};

const Match = (props: MatchProps) => {
  const { app, mode, position, match } = props;
  const { symbol, stable_id } = match as GeneSearchMatchType;
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const dispatch = useAppDispatch();
  const [anchorElement, setAnchorElement] = useState<HTMLSpanElement | null>(
    null
  );

  const onMatchClick = () => {
    setShouldShowTooltip(!shouldShowTooltip);

    if (app === 'entityViewer') {
      analyticsTracking.trackEvent({
        category: `${app}_${mode}_search`,
        action: 'select_link',
        label: `${symbol}: ${stable_id}`,
        value: position
      });
    }
  };

  const onAppClick = (selectedAppName?: AppNameForViewInApp) => {
    if (app === 'genomeBrowser') {
      dispatch(changeHighlightedTrackId(''));
    }

    if (app === 'entityViewer') {
      analyticsTracking.trackEvent({
        category: `${app}_${mode}_search`,
        action: 'select_app',
        label: selectedAppName
      });
    }

    setShouldShowTooltip(!shouldShowTooltip);
    props.onMatchNavigation?.();
  };

  const hideTooltip = () => setShouldShowTooltip(false);

  const symbolElement = symbol ? <span>{symbol}</span> : null;
  const stableIdElement = <span>{stable_id}</span>;

  const searchMatchAnchorClass = classNames(
    styles.searchMatchAnchor,
    styles[`searchMatchAnchor${mode}`]
  );

  return (
    <>
      <div className={styles.searchMatch} onClick={onMatchClick}>
        <TextButton className={styles.searchMatchButton}>
          {symbolElement}
          {stableIdElement}
        </TextButton>
        <span className={searchMatchAnchorClass} ref={setAnchorElement} />
      </div>
      {shouldShowTooltip && anchorElement && (
        <PointerBox
          anchor={anchorElement}
          position={
            props.mode === 'interstitial'
              ? PointerBoxPosition.RIGHT_BOTTOM
              : PointerBoxPosition.BOTTOM_RIGHT
          }
          autoAdjust={true}
          className={classNames(
            styles.tooltip,
            pointerBoxStyles.pointerBoxShadow
          )}
          onOutsideClick={hideTooltip}
          onClose={hideTooltip}
        >
          <MatchDetails {...props} onClick={onAppClick} />
        </PointerBox>
      )}
    </>
  );
};

const MatchDetails = (
  props: Pick<MatchProps, 'match' | 'genomeIdForUrl'> & {
    onClick: (appName?: AppNameForViewInApp) => void;
  }
) => {
  const { match, genomeIdForUrl } = props;
  const geneSearchMatch = match as GeneSearchMatchType;
  const { unversioned_stable_id, genome_id } = geneSearchMatch;

  const formattedLocation = getFormattedLocation({
    chromosome: geneSearchMatch.slice.region.name,
    start: geneSearchMatch.slice.location.start,
    end: geneSearchMatch.slice.location.end
  });

  const urlForGenomeBrowser = urlFor.browser({
    genomeId: genomeIdForUrl ?? genome_id,
    focus: buildFocusIdForUrl({ type: 'gene', objectId: unversioned_stable_id })
  });

  const urlForEntityViewer = urlFor.entityViewer({
    genomeId: genomeIdForUrl ?? genome_id,
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
        <span className={styles.withExtraSpaceRight}>Biotype </span>
        <span className={styles.strong}>{geneSearchMatch.biotype}</span>
      </div>

      <div>
        <span>{getStrandDisplayName(geneSearchMatch.slice.strand.code)}</span>
      </div>

      <div>{formattedLocation}</div>

      <div>
        <span className={classNames(styles.strong, styles.withExtraSpaceRight)}>
          {geneSearchMatch.transcript_count}{' '}
        </span>
        {pluralise('transcript', geneSearchMatch.transcript_count)}
      </div>

      <div>
        <ViewInApp theme="dark" links={links} onAnyAppClick={props.onClick} />
      </div>
    </div>
  );
};

export default GeneSearchMatch;
